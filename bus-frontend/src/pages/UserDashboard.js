import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="user-dashboard">
            <header className="dashboard-header">
                <h1>User Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.name || user?.email}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>
            
            <main className="dashboard-main">
                <div className="dashboard-grid">
                    <Link to="/search" className="dashboard-card">
                        <h3>Search Buses</h3>
                        <p>Find and book bus tickets</p>
                    </Link>
                    
                    <Link to="/bookings" className="dashboard-card">
                        <h3>My Bookings</h3>
                        <p>View and manage your bookings</p>
                    </Link>
                    
                    <div className="dashboard-card" style={{opacity: 0.7, cursor: 'not-allowed'}}>
                        <h3>Profile Settings</h3>
                        <p>Update your personal information</p>
                    </div>
                    
                    <div className="dashboard-card" style={{opacity: 0.7, cursor: 'not-allowed'}}>
                        <h3>Payment Methods</h3>
                        <p>Manage your payment options</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;