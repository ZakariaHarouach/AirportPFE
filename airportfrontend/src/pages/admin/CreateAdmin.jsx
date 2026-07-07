import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import API from '../../api/axios';

export default function CreateAdmin() {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match');
            return;
        }
        try {
            await API.post('/auth/admin-register', form);
            setMessage('Admin created successfully');
            setError('');
            setForm({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Creation failed');
            setMessage('');
        }
    };

    return (
        <Card>
            <Card.Body>
                <h4>Create New Admin Account</h4>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            name="password_confirmation"
                            type="password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Create Admin
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}