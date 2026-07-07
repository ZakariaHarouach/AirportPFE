import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import API from '../../api/axios';

export default function ManageFlights() {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        start_date_time: '', end_date_time: '', max_travelers: '',
        start_airport_id: '', end_airport_id: '', is_closed: false
    });
    const [stopoverForms, setStopoverForms] = useState({});
    const [error, setError] = useState('');

    const fetchFlights = () => {
        API.get('/flights')
            .then(res => setFlights(res.data))
            .catch(() => setError('Failed to load flights'));
    };

    const fetchAirports = () => {
        API.get('/airports')
            .then(res => setAirports(res.data))
            .catch(() => { });
    };

    useEffect(() => { fetchFlights(); fetchAirports(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({
            start_date_time: '', end_date_time: '', max_travelers: '',
            start_airport_id: '', end_airport_id: '', is_closed: false
        });
        setShow(true);
    };

    const openEdit = (flight) => {
        setEditing(flight.id);
        setForm({
            start_date_time: flight.start_date_time.replace(' ', 'T'),
            end_date_time: flight.end_date_time.replace(' ', 'T'),
            max_travelers: flight.max_travelers,
            start_airport_id: flight.start_airport_id,
            end_airport_id: flight.end_airport_id,
            is_closed: flight.is_closed
        });
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        try {
            if (editing) {
                await API.put(`/flights/${editing}`, payload);
            } else {
                await API.post('/flights', payload);
            }
            setShow(false);
            fetchFlights();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this flight? All related reservations and stopovers will be removed.')) {
            await API.delete(`/flights/${id}`);
            fetchFlights();
        }
    };

    const addStopover = async (flightId) => {
        const form = stopoverForms[flightId] || { airport_id: '', date_time: '' };
        try {
            await API.post(`/flights/${flightId}/stopovers`, form);
            setStopoverForms(prev => ({ ...prev, [flightId]: { airport_id: '', date_time: '' } }));
            fetchFlights();
        } catch (err) {
            alert('Failed to add stopover');
        }
    };

    const updateStopoverForm = (flightId, field, value) => {
        setStopoverForms(prev => ({
            ...prev,
            [flightId]: { ...(prev[flightId] || { airport_id: '', date_time: '' }), [field]: value }
        }));
    };

    const removeStopover = async (flightId, stopoverId) => {
        if (window.confirm('Delete stopover?')) {
            await API.delete(`/flights/${flightId}/stopovers/${stopoverId}`);
            fetchFlights();
        }
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="success" onClick={openCreate} className="mb-3">Add Flight</Button>

            {flights.map(flight => {
                const sForm = stopoverForms[flight.id] || { airport_id: '', date_time: '' };
                return (
                    <div key={flight.id} className="mb-4 border p-3 rounded">
                        <Row>
                            <Col md={9}>
                                <h5>{flight.start_airport?.city} → {flight.end_airport?.city}</h5>
                                <p>
                                    {new Date(flight.start_date_time).toLocaleString()} — {new Date(flight.end_date_time).toLocaleString()}<br />
                                    Max: {flight.max_travelers} | Status: {flight.is_closed ? 'CLOSED' : 'OPEN'}
                                </p>
                                <Button variant="warning" size="sm" onClick={() => openEdit(flight)}>Edit</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(flight.id)}>Delete</Button>
                            </Col>
                            <Col md={3}>
                                <strong>Stopovers</strong>
                                <ListGroup variant="flush">
                                    {flight.stopovers?.map(s => (
                                        <ListGroup.Item key={s.id} className="d-flex justify-content-between align-items-center">
                                            <span>{s.airport?.city} ({new Date(s.date_time).toLocaleString()})</span>
                                            <Button variant="outline-danger" size="sm" onClick={() => removeStopover(flight.id, s.id)}>×</Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Row className="mt-2">
                                    <Col>
                                        <Form.Select
                                            size="sm"
                                            value={sForm.airport_id}
                                            onChange={e => updateStopoverForm(flight.id, 'airport_id', e.target.value)}
                                        >
                                            <option value="">Airport</option>
                                            {airports.map(a => (
                                                <option key={a.id} value={a.id}>{a.city} - {a.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            size="sm"
                                            type="datetime-local"
                                            value={sForm.date_time}
                                            onChange={e => updateStopoverForm(flight.id, 'date_time', e.target.value)}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button size="sm" variant="outline-primary" onClick={() => addStopover(flight.id)}>+</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                );
            })}

            {/* Flight Modal */}
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Flight' : 'Add Flight'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date/Time</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={form.start_date_time}
                                        onChange={e => setForm({ ...form, start_date_time: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date/Time</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={form.end_date_time}
                                        onChange={e => setForm({ ...form, end_date_time: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Airport</Form.Label>
                                    <Form.Select
                                        value={form.start_airport_id}
                                        onChange={e => setForm({ ...form, start_airport_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select</option>
                                        {airports.map(a => (
                                            <option key={a.id} value={a.id}>{a.city} - {a.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Airport</Form.Label>
                                    <Form.Select
                                        value={form.end_airport_id}
                                        onChange={e => setForm({ ...form, end_airport_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select</option>
                                        {airports.map(a => (
                                            <option key={a.id} value={a.id}>{a.city} - {a.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Max Travelers</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.max_travelers}
                                onChange={e => setForm({ ...form, max_travelers: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Check
                            type="switch"
                            id="is-closed-switch"
                            label="Flight Closed"
                            checked={form.is_closed}
                            onChange={e => setForm({ ...form, is_closed: e.target.checked })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editing ? 'Update' : 'Create'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}