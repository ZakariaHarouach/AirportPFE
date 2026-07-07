import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Container className="text-center mt-5">
            <h1 className="display-1">404</h1>
            <p className="lead">Oops! The page you're looking for doesn't exist.</p>
            <Button as={Link} to="/" variant="primary">
                Go Home
            </Button>
        </Container>
    );
}