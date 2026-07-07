import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Alert } from 'react-bootstrap';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function FlightDetails() {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        API.get(`/flights/available/${id}`)
            .then(res => setFlight(res.data))
            .catch(() => setError('Flight not found or unavailable'));
    }, [id]);

    if (error) return <Alert variant="warning">{error}</Alert>;
    if (!flight) return <p>Loading...</p>;

    return (
        <Card>
            <Card.Header>
                <h3>{flight.start_airport?.city} → {flight.end_airport?.city}</h3>
            </Card.Header>
            <Card.Body>
                <p><strong>Departure:</strong> {new Date(flight.start_date_time).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {new Date(flight.end_date_time).toLocaleString()}</p>
                <p><strong>Available Seats:</strong> {flight.max_travelers} (total capacity)</p>

                <h5>Stopovers</h5>
                {flight.stopovers?.length > 0 ? (
                    <ListGroup>
                        {flight.stopovers.map(s => (
                            <ListGroup.Item key={s.id}>
                                {s.airport?.city} – {new Date(s.date_time).toLocaleString()}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : <p>Direct flight</p>}

                {user ? (
                    <Button variant="success" onClick={() => navigate(`/book/${flight.id}`)} className="mt-3">Book Now</Button>
                ) : (
                    <Alert variant="info">Please <a href="/login">login</a> to book this flight.</Alert>
                )}
            </Card.Body>
        </Card>
    );
}