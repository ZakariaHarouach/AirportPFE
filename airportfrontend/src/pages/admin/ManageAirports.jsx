import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import API from '../../api/axios';

export default function ManageAirports() {
    const [airports, setAirports] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', city: '' });
    const [error, setError] = useState('');

    const fetchAirports = () => {
        API.get('/airports')
            .then(res => setAirports(res.data))
            .catch(() => setError('Failed to load airports'));
    };

    useEffect(() => { fetchAirports(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', city: '' });
        setShow(true);
    };

    const openEdit = (airport) => {
        setEditing(airport.id);
        setForm({ name: airport.name, city: airport.city });
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await API.put(`/airports/${editing}`, form);
            } else {
                await API.post('/airports', form);
            }
            setShow(false);
            fetchAirports();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this airport?')) {
            try {
                await API.delete(`/airports/${id}`);
                fetchAirports();
            } catch {
                alert('Deletion failed');
            }
        }
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="success" onClick={openCreate} className="mb-3">Add Airport</Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {airports.map(a => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.name}</td>
                            <td>{a.city}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => openEdit(a)}>Edit</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Airport' : 'Add Airport'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                value={form.city}
                                onChange={e => setForm({ ...form, city: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editing ? 'Update' : 'Create'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}