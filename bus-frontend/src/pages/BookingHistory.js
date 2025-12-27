import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
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
                <h1>Booking History</h1>
                <div className="page-actions">
                    <Link to={user?.role === 'ADMIN' ? '/admin' : '/user'} className="back-btn">Back to Dashboard</Link>
                    <Link to="/search" className="back-btn">Search Buses</Link>
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
                                <h3>Booking #{booking.id}</h3>
                                <p><strong>Bus:</strong> {booking.busNumber}</p>
                                <p><strong>Route:</strong> {booking.source} to {booking.destination}</p>
                                <p><strong>Seats:</strong> {booking.seatNumbers.join(', ')}</p>
                                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                                <p><strong>Status:</strong> 
                                    <span className={`status ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </p>
                                <p><strong>Booking Time:</strong> {new Date(booking.bookingTime).toLocaleString()}</p>
                            </div>
                            <div className="booking-actions">
                                {booking.status === 'CONFIRMED' && (
                                    <button 
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="cancel-btn"
                                    >
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