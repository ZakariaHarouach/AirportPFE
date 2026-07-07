import { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Alert, Badge } from 'react-bootstrap';
import API from '../api/axios';

export default function ClientDashboard() {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        API.get('/reservations')
            .then(res => setReservations(res.data))
            .catch((err) => setError('Failed to load reservations' + err));
    }, []);

    const cancelReservation = async (id) => {
        if (window.confirm('Cancel this reservation? All tickets will be deleted.')) {
            try {
                await API.delete(`/reservations/${id}`);
                setReservations(reservations.filter(r => r.id !== id));
            } catch {
                alert('Cancellation failed');
            }
        }
    };

    return (
        <>
            <h2>My Reservations</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <ListGroup>
                {reservations.map(r => (
                    <ListGroup.Item key={r.id} className="mb-3">
                        <h5>
                            {r.start_airport?.city} ({r.start_airport?.name}) → {r.end_airport?.city} ({r.end_airport?.name})
                        </h5>
                        <p>Booked on: {r.reservation_date}</p>
                        <Badge bg="primary">{r.tickets?.length} passenger(s)</Badge>
                        <ul>
                            {r.tickets?.map(t => (
                                <li key={t.id}>{t.first_name} {t.last_name}</li>
                            ))}
                        </ul>
                        <Button variant="danger" size="sm" onClick={() => cancelReservation(r.id)}>Cancel Reservation</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}