import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register({ name, email, password });
            const { token, role } = response.data;
            
            // Auto-login the user after successful registration
            if (token) {
                // Create user object
                const userData = {
                    email,
                    role
                };
                
                // Login the user automatically
                login(userData, token);
                
                // Show success message and redirect to search page
                setSuccess('Registration successful! Redirecting...');
                setError(''); // Clear any previous errors
                
                // Redirect to user dashboard after a short delay
                setTimeout(() => {
                    navigate('/user');
                }, 1500);
            } else {
                // Fallback to login if no token returned
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <div className="register-header">
                    <FaUserPlus className="register-icon" />
                    <h2>Bus Ticket Reservation - Register</h2>
                </div>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name"><FaUser className="input-icon" /> Full Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"><FaEnvelope className="input-icon" /> Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><FaLock className="input-icon" /> Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="register-btn">
                        {loading ? <FaSpinner className="btn-spinner" /> : <FaUserPlus className="btn-icon" />}
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </div>
            </div>
        </div>
    );
};

export default Register;