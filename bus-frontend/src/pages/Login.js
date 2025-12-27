import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login({ email, password });
            const { token, role } = response.data;
            
            // Create user object
            const userData = {
                email,
                role
            };
            
            login(userData, token);
            
            // Redirect based on user role
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-header">
                    <FaUser className="login-icon" />
                    <h2>Bus Ticket Reservation - Login</h2>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email"><FaUser className="input-icon" /> Email:</label>
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
                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? <FaSpinner className="btn-spinner" /> : <FaSignInAlt className="btn-icon" />}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </div>
            </div>
        </div>
    );
};

export default Login;