package com.bus.reservation.controller;

import com.bus.reservation.dto.BookingDTO;
import com.bus.reservation.entity.Booking;
import com.bus.reservation.entity.Role;
import com.bus.reservation.entity.User;
import com.bus.reservation.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/customer/bookings")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> bookSeats(@RequestBody BookingRequest request, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Booking booking = bookingService.bookSeats(request.getScheduleId(), user, request.getSeatNumbers());
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/customer/bookings/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            bookingService.cancelBooking(id, user);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/customer/bookings")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<BookingDTO>> getBookingsByUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<BookingDTO> bookings = bookingService.getBookingsByUser(user);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/customer/bookings/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> getBookingByIdForCustomer(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            BookingDTO booking = bookingService.getBookingById(id);
            
            // Check if the user owns this booking or is an admin
            if (!booking.getUserId().equals(user.getId()) && !user.getRole().equals(com.bus.reservation.entity.Role.ADMIN)) {
                return ResponseEntity.status(403).body(new ErrorResponse("You are not authorized to view this booking"));
            }
            
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/admin/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/schedules/{scheduleId}/booked-seats")
    public ResponseEntity<List<String>> getBookedSeatsForSchedule(@PathVariable Long scheduleId) {
        List<String> bookedSeats = bookingService.getBookedSeatsForSchedule(scheduleId);
        return ResponseEntity.ok(bookedSeats);
    }

    public static class BookingRequest {
        private Long scheduleId;
        private List<String> seatNumbers;

        public Long getScheduleId() { return scheduleId; }
        public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }

        public List<String> getSeatNumbers() { return seatNumbers; }
        public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}