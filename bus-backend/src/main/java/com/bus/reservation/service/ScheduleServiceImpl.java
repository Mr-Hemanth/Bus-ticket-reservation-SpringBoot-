package com.bus.reservation.service;

import com.bus.reservation.dto.ScheduleDTO;
import com.bus.reservation.entity.Bus;
import com.bus.reservation.entity.Route;
import com.bus.reservation.entity.Schedule;
import com.bus.reservation.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private com.bus.reservation.repository.BusRepository busRepository;

    @Autowired
    private RouteService routeService;
    
    @Autowired
    private com.bus.reservation.repository.BookingRepository bookingRepository;

    @Override
    public Schedule createSchedule(Schedule schedule) {
        // Validate bus and route exist and fetch complete bus object
        Bus bus = busRepository.findById(schedule.getBus().getId())
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + schedule.getBus().getId()));
        routeService.findById(schedule.getRoute().getId());
        
        // Set available seats to total seats when creating schedule
        schedule.setAvailableSeats(bus.getTotalSeats());
        // Set the complete bus object to ensure all details are available
        schedule.setBus(bus);
        
        return scheduleRepository.save(schedule);
    }

    @Override
    public Schedule updateSchedule(Long id, Schedule schedule) {
        Schedule existingSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        
        existingSchedule.setBus(schedule.getBus());
        existingSchedule.setRoute(schedule.getRoute());
        existingSchedule.setTravelDate(schedule.getTravelDate());
        existingSchedule.setDepartureTime(schedule.getDepartureTime());
        existingSchedule.setArrivalTime(schedule.getArrivalTime());
        
        return scheduleRepository.save(existingSchedule);
    }

    @Override
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        
        // Check if schedule has any bookings
        if (bookingRepository.existsByScheduleId(id)) {
            throw new RuntimeException("Cannot delete schedule with ID " + id + ". Schedule has associated bookings.");
        }
        
        scheduleRepository.deleteById(id);
    }

    @Override
    public Schedule findById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
    }
    
    @Override
    public ScheduleDTO findByIdAsDTO(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setBusId(schedule.getBus().getId());
        dto.setBusNumber(schedule.getBus().getBusNumber());
        dto.setRouteId(schedule.getRoute().getId());
        dto.setSource(schedule.getRoute().getSource());
        dto.setDestination(schedule.getRoute().getDestination());
        dto.setTravelDate(schedule.getTravelDate());
        dto.setDepartureTime(schedule.getDepartureTime());
        dto.setArrivalTime(schedule.getArrivalTime());
        dto.setAvailableSeats(schedule.getAvailableSeats());
        dto.setTotalSeats(schedule.getBus().getTotalSeats());
        dto.setPrice(schedule.getBus().getPrice());
        
        return dto;
    }

    @Override
    public List<ScheduleDTO> findByRouteAndDate(String source, String destination, LocalDate travelDate) {
        List<Schedule> schedules = scheduleRepository.findByRouteAndDate(source, destination, travelDate);
        
        return schedules.stream().map(schedule -> {
            ScheduleDTO dto = new ScheduleDTO();
            dto.setId(schedule.getId());
            dto.setBusId(schedule.getBus().getId());
            dto.setBusNumber(schedule.getBus().getBusNumber());
            dto.setRouteId(schedule.getRoute().getId());
            dto.setSource(schedule.getRoute().getSource());
            dto.setDestination(schedule.getRoute().getDestination());
            dto.setTravelDate(schedule.getTravelDate());
            dto.setDepartureTime(schedule.getDepartureTime());
            dto.setArrivalTime(schedule.getArrivalTime());
            dto.setAvailableSeats(schedule.getAvailableSeats());
            dto.setTotalSeats(schedule.getBus().getTotalSeats());
            dto.setPrice(schedule.getBus().getPrice());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> findAll() {
        return scheduleRepository.findAll().stream().map(schedule -> {
            ScheduleDTO dto = new ScheduleDTO();
            dto.setId(schedule.getId());
            dto.setBusId(schedule.getBus().getId());
            dto.setBusNumber(schedule.getBus().getBusNumber());
            dto.setRouteId(schedule.getRoute().getId());
            dto.setSource(schedule.getRoute().getSource());
            dto.setDestination(schedule.getRoute().getDestination());
            dto.setTravelDate(schedule.getTravelDate());
            dto.setDepartureTime(schedule.getDepartureTime());
            dto.setArrivalTime(schedule.getArrivalTime());
            dto.setAvailableSeats(schedule.getAvailableSeats());
            dto.setTotalSeats(schedule.getBus().getTotalSeats());
            dto.setPrice(schedule.getBus().getPrice());
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public boolean hasSchedulesForBus(Long busId) {
        return scheduleRepository.existsByBusId(busId);
    }
    
    @Override
    public boolean hasSchedulesForRoute(Long routeId) {
        return scheduleRepository.existsByRouteId(routeId);
    }
}