import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBus, FaTicketAlt, FaUser, FaSignOutAlt, FaHome, FaCalendarAlt, FaRoute } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    // Don't show navbar on login/register pages
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to={user?.role === 'ADMIN' ? '/admin' : '/user'} className="nav-brand">
                    <FaBus className="nav-brand-icon" />
                    Bus Ticket Reservation
                </Link>
                
                {user && (
                    <div className="nav-links">
                        {user.role === 'ADMIN' ? (
                            <>
                                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                                    <FaHome className="nav-link-icon" />
                                    Dashboard
                                </Link>
                                <Link to="/admin/buses" className={`nav-link ${location.pathname.includes('/admin/buses') ? 'active' : ''}`}>
                                    <FaBus className="nav-link-icon" />
                                    Buses
                                </Link>
                                <Link to="/admin/routes" className={`nav-link ${location.pathname.includes('/admin/routes') ? 'active' : ''}`}>
                                    <FaRoute className="nav-link-icon" />
                                    Routes
                                </Link>
                                <Link to="/admin/schedules" className={`nav-link ${location.pathname.includes('/admin/schedules') ? 'active' : ''}`}>
                                    <FaCalendarAlt className="nav-link-icon" />
                                    Schedules
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/user" className={`nav-link ${location.pathname === '/user' ? 'active' : ''}`}>
                                    <FaHome className="nav-link-icon" />
                                    Dashboard
                                </Link>
                                <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
                                    <FaBus className="nav-link-icon" />
                                    Search Buses
                                </Link>
                                <Link to="/bookings" className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}>
                                    <FaTicketAlt className="nav-link-icon" />
                                    My Bookings
                                </Link>
                            </>
                        )}
                        
                        <span className="nav-user-info">
                            Welcome, {user.name || user.email} ({user.role})
                        </span>
                        <button onClick={handleLogout} className="nav-logout-btn">
                            <FaSignOutAlt className="nav-logout-icon" />
                            Logout
                        </button>
                    </div>
                )}
                
                {!user && (
                    <div className="nav-links">
                        <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                            Login
                        </Link>
                        <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;