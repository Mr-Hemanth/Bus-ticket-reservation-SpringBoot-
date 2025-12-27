import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import './SeatSelection.css';

const SeatSelection = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchScheduleDetails = useCallback(async () => {
        try {
            // Get the schedule details directly by ID
            const response = await customerAPI.getScheduleById(scheduleId);
            setSchedule(response.data);

            // Then, get the booked seats for this schedule
            const bookedSeatsResponse = await customerAPI.getBookedSeatsForSchedule(scheduleId);
            setBookedSeats(bookedSeatsResponse.data);
            
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch schedule details');
            setLoading(false);
        }
    }, [scheduleId, setSchedule, setBookedSeats, setLoading, setError]);
    
    useEffect(() => {
        fetchScheduleDetails();
    }, [scheduleId, fetchScheduleDetails]);

    // Generate seat layout (e.g., A1, A2, ..., E10)
    const generateSeats = () => {
        if (!schedule) return [];
        
        const seats = [];
        // Use total seats from the bus to show all possible seats
        const totalSeats = schedule.totalSeats;
        
        // Calculate rows and columns based on total seats
        const cols = 4; // Standard bus has 4 seats per row (2 on each side)
        const rows = Math.ceil(totalSeats / cols);
        
        for (let i = 0; i < rows; i++) {
            const rowLetter = String.fromCharCode(65 + i); // A, B, C, ...
            for (let j = 1; j <= cols; j++) {
                const seatNumber = `${rowLetter}${j}`;
                // Don't exceed total seats
                if (seats.length >= totalSeats) break;
                
                seats.push({
                    number: seatNumber,
                    isBooked: bookedSeats.includes(seatNumber),
                    isAvailable: !bookedSeats.includes(seatNumber),
                    isSelected: selectedSeats.includes(seatNumber)
                });
            }
            if (seats.length >= totalSeats) break;
        }
        
        return seats;
    };

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return; // Cannot select booked seats
        
        if (selectedSeats.includes(seatNumber)) {
            // Remove from selection
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            // Add to selection
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const handleBookSeats = async () => {
        if (selectedSeats.length === 0) {
            setError('Please select at least one seat');
            return;
        }

        try {
            const bookingData = {
                scheduleId: parseInt(scheduleId),
                seatNumbers: selectedSeats
            };
            
            const response = await customerAPI.bookSeats(bookingData);
            navigate(`/booking-confirmation/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book seats');
        }
    };

    if (loading) return <div className="loading">Loading seat selection...</div>;

    const seats = generateSeats();

    return (
        <div className="seat-selection">
            <div className="page-header">
                <h1>Seat Selection</h1>
                <div className="page-actions">
                    <Link to="/search" className="back-btn">Back to Search</Link>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {schedule && (
                <div className="schedule-info">
                    <h2>{schedule.busNumber}</h2>
                    <p><strong>Route:</strong> {schedule.source} to {schedule.destination}</p>
                    <p><strong>Date:</strong> {new Date(schedule.travelDate).toLocaleDateString()}</p>
                    <p><strong>Departure:</strong> {schedule.departureTime}</p>
                    <p><strong>Price per seat:</strong> ${schedule.price}</p>
                    <p><strong>Total Seats:</strong> {schedule.totalSeats || 'N/A'}</p>
                </div>
            )}
            
            <div className="seat-layout">
                <div className="driver-area">DRIVER</div>
                
                <div className="seats-grid">
                    {seats.map((seat, index) => (
                        <div
                            key={seat.number}
                            className={`seat ${
                                seat.isBooked ? 'booked' : 
                                seat.isSelected ? 'selected' : 
                                'available'
                            }`}
                            onClick={() => handleSeatClick(seat.number)}
                        >
                            {seat.number}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="booking-summary">
                <h3>Selected Seats: {selectedSeats.join(', ') || 'None'}</h3>
                <p>Total Price: ${schedule ? (schedule.price * selectedSeats.length).toFixed(2) : '0.00'}</p>
                <button 
                    onClick={handleBookSeats} 
                    disabled={selectedSeats.length === 0}
                    className="book-btn"
                >
                    Book Selected Seats
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;