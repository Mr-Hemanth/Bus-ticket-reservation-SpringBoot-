import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { FaTicketAlt, FaBus, FaRoute, FaChair, FaRupeeSign, FaClock, FaUser, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import './AdminBookings.css';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        try {
            const response = await adminAPI.getAllBookings();
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch bookings');
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await adminAPI.cancelBooking(bookingId);
                fetchAllBookings(); // Refresh the list
            } catch (err) {
                setError('Failed to cancel booking');
            }
        }
    };

    if (loading) return <div className="loading">Loading bookings...</div>;

    return (
        <div className="admin-bookings">
            <div className="page-header">
                <h1><FaTicketAlt className="page-icon" /> All Bookings</h1>
                <div className="page-actions">
                    <Link to="/admin" className="back-btn">
                        <FaArrowLeft className="btn-icon" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-info">
                                <h3><FaTicketAlt className="card-icon" /> Booking #{booking.id}</h3>
                                <p><FaUser className="card-icon" /><strong>User:</strong> {booking.userName}</p>
                                <p><FaBus className="card-icon" /><strong>Bus:</strong> {booking.busNumber}</p>
                                <p><FaRoute className="card-icon" /><strong>Route:</strong> {booking.source} to {booking.destination}</p>
                                <p><FaChair className="card-icon" /><strong>Seats:</strong> {booking.seatNumbers.join(', ')}</p>
                                <p><FaRupeeSign className="card-icon" /><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                                <p><FaClock className="card-icon" /><strong>Status:</strong> 
                                    <span className={`status ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </p>
                                <p><FaClock className="card-icon" /><strong>Booking Time:</strong> {new Date(booking.bookingTime).toLocaleString()}</p>
                            </div>
                            <div className="booking-actions">
                                {booking.status === 'CONFIRMED' && (
                                    <button 
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="cancel-btn"
                                    >
                                        <FaTimes className="btn-icon" />
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBookings;