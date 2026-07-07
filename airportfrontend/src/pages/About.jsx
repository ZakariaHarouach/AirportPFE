import { Container, Card } from 'react-bootstrap';

export default function About() {
    return (
        <Container className="mt-4">
            <h2 className="mb-4">About FlightBooker</h2>
            <Card>
                <Card.Body>
                    <p>
                        FlightBooker is a modern flight reservation platform designed to
                        simplify the booking process for travelers and streamline flight
                        management for administrators.
                    </p>
                    <p>
                        Whether you're looking for direct flights or routes with multiple
                        stopovers, our system lets you search available flights, select
                        boarding and landing airports, and book tickets for yourself or others.
                    </p>
                    <p>
                        Built with React.js on the frontend and Laravel on the backend,
                        FlightBooker provides a fast, secure, and reliable experience.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}