import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
import './SearchBuses.css';

const SearchBuses = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        travelDate: ''
    });
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await customerAPI.searchSchedules(
                formData.source,
                formData.destination,
                formData.travelDate
            );
            setSchedules(response.data);
        } catch (err) {
            setError('Failed to search buses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookSeats = (scheduleId) => {
        navigate(`/seats/${scheduleId}`);
    };

    return (
        <div className="search-buses">
            <div className="page-header">
                <h1>Search Buses</h1>
                <div className="page-actions">
                    <Link to={user?.role === 'ADMIN' ? '/admin' : '/user'} className="back-btn">Back to Dashboard</Link>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="search-form">
                <div className="form-group">
                    <label htmlFor="source">Source:</label>
                    <input
                        type="text"
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="destination">Destination:</label>
                    <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="travelDate">Travel Date:</label>
                    <input
                        type="date"
                        id="travelDate"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading} className="search-btn">
                    {loading ? 'Searching...' : 'Search Buses'}
                </button>
            </form>
            
            {schedules.length > 0 && (
                <div className="results-section">
                    <h2>Available Buses</h2>
                    <div className="schedules-list">
                        {schedules.map(schedule => (
                            <div key={schedule.id} className="schedule-card">
                                <div className="schedule-info">
                                    <h3>{schedule.busNumber}</h3>
                                    <p><strong>Route:</strong> {schedule.source} to {schedule.destination}</p>
                                    <p><strong>Date:</strong> {new Date(schedule.travelDate).toLocaleDateString()}</p>
                                    <p><strong>Departure:</strong> {schedule.departureTime}</p>
                                    <p><strong>Arrival:</strong> {schedule.arrivalTime}</p>
                                    <p><strong>Available Seats:</strong> {schedule.availableSeats}</p>
                                    <p><strong>Price:</strong> ${schedule.price}</p>
                                </div>
                                <div className="schedule-actions">
                                    <button 
                                        onClick={() => handleBookSeats(schedule.id)}
                                        disabled={schedule.availableSeats === 0}
                                        className="book-btn"
                                    >
                                        {schedule.availableSeats === 0 ? 'Sold Out' : 'Book Seats'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBuses;