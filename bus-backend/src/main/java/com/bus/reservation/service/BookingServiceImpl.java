package com.bus.reservation.service;

import com.bus.reservation.dto.BookingDTO;
import com.bus.reservation.entity.*;
import com.bus.reservation.repository.BookingRepository;
import com.bus.reservation.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;



    @Override
    @Transactional
    public Booking bookSeats(Long scheduleId, User user, List<String> seatNumbers) {
        // Find the schedule
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
        
        // Check if enough seats are available
        if (schedule.getAvailableSeats() < seatNumbers.size()) {
            throw new RuntimeException("Not enough seats available. Available: " + 
                                     schedule.getAvailableSeats() + ", Requested: " + seatNumbers.size());
        }

        // Check if any of the requested seats are already booked
        List<Booking> existingBookings = bookingRepository.findByScheduleIdAndStatusConfirmed(scheduleId);
        for (String seatNumber : seatNumbers) {
            for (Booking booking : existingBookings) {
                if (booking.getSeatNumbers().contains(seatNumber)) {
                    throw new RuntimeException("Seat " + seatNumber + " is already booked");
                }
            }
        }

        // Calculate total price
        Double totalPrice = schedule.getBus().getPrice() * seatNumbers.size();

        // Create the booking
        Booking booking = new Booking(user, schedule, seatNumbers, totalPrice);
        Booking savedBooking = bookingRepository.save(booking);

        // Update available seats
        schedule.setAvailableSeats(schedule.getAvailableSeats() - seatNumbers.size());
        scheduleRepository.save(schedule);

        return savedBooking;
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        // Check if the user is the owner of the booking or is an admin
        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Update available seats
        Schedule schedule = booking.getSchedule();
        schedule.setAvailableSeats(schedule.getAvailableSeats() + booking.getSeatNumbers().size());
        scheduleRepository.save(schedule);
    }

    @Override
    public List<BookingDTO> getBookingsByUser(User user) {
        List<Booking> bookings = bookingRepository.findByUser(user);
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return convertToDTO(booking);
    }

    @Override
    public List<String> getBookedSeatsForSchedule(Long scheduleId) {
        List<Booking> confirmedBookings = bookingRepository.findByScheduleIdAndStatusConfirmed(scheduleId);
        return confirmedBookings.stream()
            .flatMap(booking -> booking.getSeatNumbers().stream())
            .distinct()
            .collect(Collectors.toList());
    }

    @Override
    public boolean hasBookingsForSchedule(Long scheduleId) {
        return bookingRepository.existsByScheduleId(scheduleId);
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());
        dto.setScheduleId(booking.getSchedule().getId());
        dto.setBusNumber(booking.getSchedule().getBus().getBusNumber());
        dto.setSource(booking.getSchedule().getRoute().getSource());
        dto.setDestination(booking.getSchedule().getRoute().getDestination());
        dto.setSeatNumbers(booking.getSeatNumbers());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus().toString());
        dto.setBookingTime(booking.getBookingTime());
        return dto;
    }
}