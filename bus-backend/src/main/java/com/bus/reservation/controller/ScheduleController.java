package com.bus.reservation.controller;

import com.bus.reservation.dto.ScheduleDTO;
import com.bus.reservation.entity.Schedule;
import com.bus.reservation.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/admin/schedules")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSchedule(@RequestBody Schedule schedule) {
        try {
            Schedule createdSchedule = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(createdSchedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/admin/schedules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        try {
            Schedule updatedSchedule = scheduleService.updateSchedule(id, schedule);
            return ResponseEntity.ok(updatedSchedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/schedules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            scheduleService.deleteSchedule(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/admin/schedules")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ScheduleDTO>> getAllSchedules() {
        List<ScheduleDTO> schedules = scheduleService.findAll();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/admin/schedules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        try {
            Schedule schedule = scheduleService.findById(id);
            return ResponseEntity.ok(schedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/schedules/search")
    public ResponseEntity<List<ScheduleDTO>> searchSchedules(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam LocalDate travelDate) {
        List<ScheduleDTO> schedules = scheduleService.findByRouteAndDate(source, destination, travelDate);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/schedules/{id}")
    public ResponseEntity<?> getScheduleByIdForCustomer(@PathVariable Long id) {
        try {
            ScheduleDTO schedule = scheduleService.findByIdAsDTO(id);
            return ResponseEntity.ok(schedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
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