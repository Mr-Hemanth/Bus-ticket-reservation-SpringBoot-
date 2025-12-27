import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookingDetails = useCallback(async () => {
        try {
            // In a real app, we would fetch the booking details by ID
            // For now, I'll use the API to get the booking details
            const response = await customerAPI.getBookingById(bookingId);
            setBooking(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch booking details');
            setLoading(false);
        }
    }, [bookingId, setBooking, setLoading, setError]);
    
    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId, fetchBookingDetails]);

    const handleGoToBookings = () => {
        navigate('/bookings');
    };

    if (loading) return <div className="loading">Loading booking confirmation...</div>;

    return (
        <div className="booking-confirmation">
            <div className="page-header">
                <h1>Booking Confirmation</h1>
                <div className="page-actions">
                    <Link to="/bookings" className="back-btn">My Bookings</Link>
                    <Link to="/search" className="back-btn">Search More</Link>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {booking && (
                <div className="confirmation-card">
                    <div className="confirmation-header">
                        <h2>Booking Confirmed!</h2>
                        <p className="confirmation-id">Booking ID: {booking.id}</p>
                    </div>
                    
                    <div className="booking-details">
                        <h3>Booking Details</h3>
                        <div className="detail-row">
                            <span className="label">Bus Number:</span>
                            <span className="value">{booking.busNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Route:</span>
                            <span className="value">{booking.source} to {booking.destination}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Seats:</span>
                            <span className="value">{booking.seatNumbers.join(', ')}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Total Price:</span>
                            <span className="value">${booking.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Status:</span>
                            <span className={`status ${booking.status.toLowerCase()}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Booking Time:</span>
                            <span className="value">{new Date(booking.bookingTime).toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div className="confirmation-actions">
                        <button onClick={handleGoToBookings} className="view-bookings-btn">
                            View All Bookings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingConfirmation;