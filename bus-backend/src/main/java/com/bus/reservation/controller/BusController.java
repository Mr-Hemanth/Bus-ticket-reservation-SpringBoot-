package com.bus.reservation.controller;

import com.bus.reservation.dto.BusDTO;
import com.bus.reservation.entity.Bus;
import com.bus.reservation.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class BusController {

    @Autowired
    private BusService busService;

    @PostMapping("/buses")
    public ResponseEntity<?> createBus(@RequestBody Bus bus) {
        try {
            Bus createdBus = busService.createBus(bus);
            return ResponseEntity.ok(createdBus);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<?> updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        try {
            Bus updatedBus = busService.updateBus(id, bus);
            return ResponseEntity.ok(updatedBus);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {
        try {
            busService.deleteBus(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/buses")
    public ResponseEntity<List<BusDTO>> getAllBuses() {
        List<BusDTO> buses = busService.findAll();
        return ResponseEntity.ok(buses);
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<?> getBusById(@PathVariable Long id) {
        try {
            Bus bus = busService.findById(id);
            return ResponseEntity.ok(bus);
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