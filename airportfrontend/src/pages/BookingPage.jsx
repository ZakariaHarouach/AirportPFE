import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
    const { flightId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [passengers, setPassengers] = useState([{ first_name: '', last_name: '' }]);
    const [boardingId, setBoardingId] = useState('');
    const [landingId, setLandingId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        API.get(`/flights/available/${flightId}`)
            .then(res => {
                setFlight(res.data);
                // Default boarding = start airport, landing = end airport
                setBoardingId(res.data.start_airport_id?.toString() || '');
                setLandingId(res.data.end_airport_id?.toString() || '');
            })
            .catch(() => setError('Flight not found or unavailable'));
    }, [flightId]);

    // Build an ordered list of airports: start → stopovers → end
    const routeAirports = [];
    if (flight) {
        routeAirports.push({
            id: flight.start_airport_id,
            name: `${flight.start_airport?.city} - ${flight.start_airport?.name}`,
            order: 0,
        });
        if (flight.stopovers?.length > 0) {
            // stopovers should already be sorted from API (we didn't explicitly sort)
            // But we can sort by date_time just in case
            const sortedStopovers = [...flight.stopovers].sort(
                (a, b) => new Date(a.date_time) - new Date(b.date_time)
            );
            sortedStopovers.forEach((s, idx) => {
                routeAirports.push({
                    id: s.airport_id,
                    name: `${s.airport?.city} - ${s.airport?.name}`,
                    order: idx + 1,
                });
            });
        }
        routeAirports.push({
            id: flight.end_airport_id,
            name: `${flight.end_airport?.city} - ${flight.end_airport?.name}`,
            order: routeAirports.length,
        });
    }

    // Filter available landing airports: only those after the selected boarding
    const boardingOrder = routeAirports.find(a => a.id.toString() === boardingId)?.order;
    const availableLandingAirports = routeAirports.filter(a => a.order > (boardingOrder ?? -1));

    const addPassenger = () => {
        setPassengers([...passengers, { first_name: '', last_name: '' }]);
    };

    const removePassenger = (index) => {
        setPassengers(passengers.filter((_, i) => i !== index));
    };

    const updatePassenger = (index, field, value) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in.');
            return;
        }
        try {
            await API.post('/reservations', {
                flight_id: flightId,
                tickets: passengers,
                boarding_airport_id: boardingId,
                landing_airport_id: landingId,
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!flight) return <p>Loading...</p>;

    return (
        <Card>
            <Card.Header>
                <h3>Book Flight: {flight.start_airport?.city} → {flight.end_airport?.city}</h3>
            </Card.Header>
            <Card.Body>
                <p>
                    Departure: {new Date(flight.start_date_time).toLocaleString()}<br />
                    Arrival: {new Date(flight.end_date_time).toLocaleString()}
                </p>

                <h5>Select Your Boarding & Landing</h5>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Board from</Form.Label>
                            <Form.Select
                                value={boardingId}
                                onChange={e => {
                                    setBoardingId(e.target.value);
                                    // Reset landing if it's no longer valid
                                    const newBoardingOrder = routeAirports.find(
                                        a => a.id.toString() === e.target.value
                                    )?.order;
                                    if (landingId) {
                                        const landingOrder = routeAirports.find(
                                            a => a.id.toString() === landingId
                                        )?.order;
                                        if (landingOrder === undefined || landingOrder <= newBoardingOrder) {
                                            setLandingId('');
                                        }
                                    }
                                }}
                            >
                                {routeAirports.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} ({a.order === 0 ? 'start' : a.order === routeAirports.length - 1 ? 'end' : `stop ${a.order}`})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Land at</Form.Label>
                            <Form.Select
                                value={landingId}
                                onChange={e => setLandingId(e.target.value)}
                                disabled={!boardingId}
                            >
                                <option value="">Select landing</option>
                                {availableLandingAirports.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} ({a.order === routeAirports.length - 1 ? 'end' : `stop ${a.order}`})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <h5>Passengers</h5>
                {passengers.map((p, i) => (
                    <Row key={i} className="mb-2">
                        <Col>
                            <Form.Control
                                placeholder="First name"
                                value={p.first_name}
                                onChange={e => updatePassenger(i, 'first_name', e.target.value)}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                placeholder="Last name"
                                value={p.last_name}
                                onChange={e => updatePassenger(i, 'last_name', e.target.value)}
                                required
                            />
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="outline-danger"
                                onClick={() => removePassenger(i)}
                                disabled={passengers.length === 1}
                            >
                                ×
                            </Button>
                        </Col>
                    </Row>
                ))}
                <Button variant="outline-secondary" onClick={addPassenger} className="mb-3">
                    + Add Passenger
                </Button>
                <br />
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Confirm Booking
                </Button>
            </Card.Body>
        </Card>
    );
}