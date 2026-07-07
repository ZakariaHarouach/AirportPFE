import { useState,useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const email = useRef();
    const password = useRef(); 
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email.current.value, password.current.value);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
            console.error("the error is " + err);
        }
    };

    return (
        <div className="col-md-6 mx-auto">
            <h2>Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required ref={email}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required ref={password} />
                </Form.Group>
                <Button variant="primary" type="submit">Login</Button>
            </Form>
        </div>
    );
}