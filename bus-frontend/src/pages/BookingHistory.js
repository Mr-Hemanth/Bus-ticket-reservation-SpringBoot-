import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
import { FaTicketAlt, FaBus, FaRoute, FaChair, FaRupeeSign, FaClock, FaArrowLeft, FaTimes } from 'react-icons/fa';
import './BookingHistory.css';

const BookingHistory = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await customerAPI.getMyBookings();
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch booking history');
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await customerAPI.cancelBooking(bookingId);
                fetchBookings(); // Refresh the list
            } catch (err) {
                setError('Failed to cancel booking');
            }
        }
    };

    if (loading) return <div className="loading">Loading booking history...</div>;

    return (
        <div className="booking-history">
            <div className="page-header">
                <h1><FaTicketAlt className="page-icon" /> Booking History</h1>
                <div className="page-actions">
                    <Link to={user?.role === 'ADMIN' ? '/admin' : '/user'} className="back-btn">
                        <FaArrowLeft className="btn-icon" />
                        Back to Dashboard
                    </Link>
                    <Link to="/search" className="back-btn">
                        <FaBus className="btn-icon" />
                        Search Buses
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

export default BookingHistory;