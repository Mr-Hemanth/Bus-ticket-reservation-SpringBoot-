import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBus, FaTicketAlt, FaLock, FaUserCheck, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        // Automatically redirect logged-in users to their dashboard
        if (!loading && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/user', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    const handleGetStarted = () => {
        if (user) {
            // If user is already logged in, redirect to appropriate dashboard
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } else {
            // If not logged in, go to login
            navigate('/login');
        }
    };

    return (
        <div className="landing-page">
            <div className="landing-content">
                <header className="landing-header">
                    <h1>Bus Ticket Reservation System</h1>
                    <p>Book your bus tickets quickly and securely</p>
                </header>
                
                <div className="landing-features">
                    <div className="feature-card">
                        <FaBus className="feature-icon" />
                        <h3>Easy Booking</h3>
                        <p>Search and book bus tickets with just a few clicks</p>
                    </div>
                    <div className="feature-card">
                        <FaTicketAlt className="feature-icon" />
                        <h3>Real-time Availability</h3>
                        <p>Check seat availability in real-time</p>
                    </div>
                    <div className="feature-card">
                        <FaLock className="feature-icon" />
                        <h3>Secure Payment</h3>
                        <p>Safe and secure payment options</p>
                    </div>
                </div>
                
                <div className="landing-actions">
                    <button className="get-started-btn" onClick={handleGetStarted}>
                        <FaUserCheck className="btn-icon" />
                        Get Started
                    </button>
                    
                    {!user && (
                        <div className="auth-options">
                            <button 
                                className="auth-btn login-btn" 
                                onClick={() => navigate('/login')}
                            >
                                <FaSignInAlt className="btn-icon" />
                                Login
                            </button>
                            <button 
                                className="auth-btn register-btn" 
                                onClick={() => navigate('/register')}
                            >
                                <FaUserPlus className="btn-icon" />
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;