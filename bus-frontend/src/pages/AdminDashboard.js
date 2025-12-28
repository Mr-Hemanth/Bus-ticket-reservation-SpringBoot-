import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBus, FaRoute, FaCalendarAlt, FaTicketAlt, FaUser, FaChartBar } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.email}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>
            
            <main className="dashboard-main">
                <div className="dashboard-grid">
                    <Link to="/admin/buses" className="dashboard-card">
                        <FaBus className="dashboard-card-icon" />
                        <h3>Manage Buses</h3>
                        <p>Add, update, or delete bus information</p>
                    </Link>
                    
                    <Link to="/admin/routes" className="dashboard-card">
                        <FaRoute className="dashboard-card-icon" />
                        <h3>Manage Routes</h3>
                        <p>Define bus routes and destinations</p>
                    </Link>
                    
                    <Link to="/admin/schedules" className="dashboard-card">
                        <FaCalendarAlt className="dashboard-card-icon" />
                        <h3>Manage Schedules</h3>
                        <p>Create and manage bus schedules</p>
                    </Link>
                    
                    <Link to="/admin/bookings" className="dashboard-card">
                        <FaTicketAlt className="dashboard-card-icon" />
                        <h3>View All Bookings</h3>
                        <p>View and manage all bookings</p>
                    </Link>
                    
                    <div className="dashboard-card" style={{opacity: 0.7, cursor: 'not-allowed'}}>
                        <FaUser className="dashboard-card-icon" />
                        <h3>Manage Users</h3>
                        <p>View and manage user accounts</p>
                    </div>
                    
                    <div className="dashboard-card" style={{opacity: 0.7, cursor: 'not-allowed'}}>
                        <FaChartBar className="dashboard-card-icon" />
                        <h3>Reports</h3>
                        <p>Generate business reports</p>
                    </div>
                    
                    <Link to="/search" className="dashboard-card">
                        <FaBus className="dashboard-card-icon" />
                        <h3>Search Buses</h3>
                        <p>Search for buses as a customer</p>
                    </Link>
                    
                    <Link to="/bookings" className="dashboard-card">
                        <FaTicketAlt className="dashboard-card-icon" />
                        <h3>Booking History</h3>
                        <p>View booking history</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;