import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer';   // ← make sure you already have the Footer component

export default function Layout() {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();

    return (
        <>
            <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand as={Link} to="/">✈️ FlightBooker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Search Flights</Nav.Link>
                            {user && !user.is_admin && (
                                <Nav.Link as={Link} to="/dashboard">My Reservations</Nav.Link>
                            )}
                            {user?.is_admin && (
                                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
                            )}
                            {/* Static pages */}
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        </Nav>
                        <Nav>
                            <Button variant="outline-secondary" size="sm" onClick={toggleTheme} className="me-2">
                                {darkMode ? '☀️ Light' : '🌙 Dark'}
                            </Button>
                            {user ? (
                                <>
                                    <Navbar.Text className="me-2">
                                        {user.first_name} {user.last_name}
                                    </Navbar.Text>
                                    <Button variant="outline-danger" size="sm" onClick={logout}>Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-4">
                <Outlet />
            </Container>
            <Footer />
        </>
    );
}