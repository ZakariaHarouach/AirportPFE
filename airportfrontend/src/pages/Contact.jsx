import { Container, Card, ListGroup } from 'react-bootstrap';

export default function Contact() {
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Contact Us</h2>
            <Card>
                <Card.Body>
                    <p>Have questions or need support? Reach out to us through one of the following channels:</p>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>Email:</strong> support@flightbooker.com
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Phone:</strong> +212 6 00 00 00 00
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Address:</strong> 123 Aviation Street, Casablanca, Morocco
                        </ListGroup.Item>
                    </ListGroup>
                    <p className="mt-3 text-muted">We usually respond within 24 hours.</p>
                </Card.Body>
            </Card>
        </Container>
    );
}