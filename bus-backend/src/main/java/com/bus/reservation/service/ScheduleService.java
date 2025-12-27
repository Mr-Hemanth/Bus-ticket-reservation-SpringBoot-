package com.bus.reservation.service;

import com.bus.reservation.dto.ScheduleDTO;
import com.bus.reservation.entity.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    Schedule createSchedule(Schedule schedule);
    Schedule updateSchedule(Long id, Schedule schedule);
    void deleteSchedule(Long id);
    Schedule findById(Long id);
    ScheduleDTO findByIdAsDTO(Long id);
    List<ScheduleDTO> findByRouteAndDate(String source, String destination, LocalDate travelDate);
    List<ScheduleDTO> findAll();
    boolean hasSchedulesForBus(Long busId);
    boolean hasSchedulesForRoute(Long routeId);
}