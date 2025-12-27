package com.bus.reservation.repository;

import com.bus.reservation.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("SELECT s FROM Schedule s WHERE s.route.source = :source AND s.route.destination = :destination AND s.travelDate = :travelDate")
    List<Schedule> findByRouteAndDate(@Param("source") String source, 
                                     @Param("destination") String destination, 
                                     @Param("travelDate") LocalDate travelDate);
    boolean existsByBusId(Long busId);
    boolean existsByRouteId(Long routeId);
}