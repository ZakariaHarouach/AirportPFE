import { Tab, Tabs } from 'react-bootstrap';
import ManageAirports from './admin/ManageAirports';
import ManageFlights from './admin/ManageFlights';
import CreateAdmin from './admin/CreateAdmin';   // ← add this

export default function AdminDashboard() {
    return (
        <div>
            <h2>Admin Panel</h2>
            <Tabs defaultActiveKey="airports" className="mb-3">
                <Tab eventKey="airports" title="Airports">
                    <ManageAirports />
                </Tab>
                <Tab eventKey="flights" title="Flights">
                    <ManageFlights />
                </Tab>
                <Tab eventKey="createAdmin" title="Create Admin">
                    <CreateAdmin />
                </Tab>
            </Tabs>
        </div>
    );
}