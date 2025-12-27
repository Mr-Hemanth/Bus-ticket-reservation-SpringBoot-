import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // If user is authenticated, redirect based on role
                if (user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } else {
                // If not authenticated, go to login
                navigate('/login');
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="home-loading">
            <p>Loading...</p>
        </div>
    );
};

export default Home;