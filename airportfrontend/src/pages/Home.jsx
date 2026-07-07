import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function Home() {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [filters, setFilters] = useState({ from: '', to: '', date: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        API.get('/public/airports')
            .then(res => setAirports(res.data))
            .catch(() => setError('Could not load airports'));

        API.get('/flights/available')
            .then(res => setFlights(res.data))
            .catch(() => setError('Could not load flights'));
    }, []);

    const searchFlights = (e) => {
        e.preventDefault();
        const params = {};
        if (filters.from) params.from_airport_id = filters.from;
        if (filters.to) params.to_airport_id = filters.to;
        if (filters.date) params.date = filters.date;

        API.get('/flights/available', { params })
            .then(res => setFlights(res.data))
            .catch(() => setError('Search failed'));
    };

    return (
        <>
            <h2>Search Available Flights</h2>
            <Form onSubmit={searchFlights} className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>From</Form.Label>
                            <Form.Select value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })}>
                                <option value="">Any departure</option>
                                {airports.map(a => (
                                    <option key={a.id} value={a.id}>{a.city} - {a.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>To</Form.Label>
                            <Form.Select value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })}>
                                <option value="">Any destination</option>
                                {airports.map(a => (
                                    <option key={a.id} value={a.id}>{a.city} - {a.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-2">Search</Button>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                {flights.map(flight => (
                    <Col md={4} key={flight.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{flight.start_airport?.city} → {flight.end_airport?.city}</Card.Title>
                                <Card.Text>
                                    Departure: {new Date(flight.start_date_time).toLocaleString()}<br />
                                    Arrival: {new Date(flight.end_date_time).toLocaleString()}<br />
                                    Stops: {flight.stopovers?.length || 0}
                                    {flight.stopovers?.length > 0 && ` (${flight.stopovers.map(s => s.airport?.city).join(', ')})`}
                                </Card.Text>
                                <Link to={`/flights/${flight.id}`} className="btn btn-sm btn-outline-primary">Details</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}