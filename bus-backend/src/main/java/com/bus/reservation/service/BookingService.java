package com.bus.reservation.service;

import com.bus.reservation.dto.BookingDTO;
import com.bus.reservation.entity.Booking;
import com.bus.reservation.entity.User;

import java.util.List;

public interface BookingService {
    Booking bookSeats(Long scheduleId, User user, List<String> seatNumbers);
    void cancelBooking(Long bookingId, User user);
    List<BookingDTO> getBookingsByUser(User user);
    List<BookingDTO> getAllBookings();
    BookingDTO getBookingById(Long id);
    List<String> getBookedSeatsForSchedule(Long scheduleId);
    boolean hasBookingsForSchedule(Long scheduleId);
}