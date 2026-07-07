import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-body-tertiary mt-5 py-4 border-top">
            <Container className="text-center">
                <p className="text-muted mb-0">
                    &copy; {new Date().getFullYear()} FlightBooker — All rights reserved.
                </p>
                <p className='text-muted mb-0'>powered by</p>
                    <p className='text-muted mb-0'>fatimezehra lmjaghjagh  && Zakaria Harouach</p>
                    <p className='text-muted mb-0'></p>
            </Container>
        </footer>
    );
}