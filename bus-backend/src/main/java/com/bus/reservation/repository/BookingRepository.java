package com.bus.reservation.repository;

import com.bus.reservation.entity.Booking;
import com.bus.reservation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    
    @Query("SELECT b FROM Booking b JOIN b.schedule s WHERE s.id = :scheduleId AND b.status = 'CONFIRMED'")
    List<Booking> findByScheduleIdAndStatusConfirmed(@Param("scheduleId") Long scheduleId);
    
    boolean existsByScheduleId(Long scheduleId);
}