package com.bus.reservation.controller;

import com.bus.reservation.dto.RouteDTO;
import com.bus.reservation.entity.Route;
import com.bus.reservation.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/routes")
    public ResponseEntity<?> createRoute(@RequestBody Route route) {
        try {
            Route createdRoute = routeService.createRoute(route);
            return ResponseEntity.ok(createdRoute);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<?> updateRoute(@PathVariable Long id, @RequestBody Route route) {
        try {
            Route updatedRoute = routeService.updateRoute(id, route);
            return ResponseEntity.ok(updatedRoute);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteRoute(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/routes")
    public ResponseEntity<List<RouteDTO>> getAllRoutes() {
        List<RouteDTO> routes = routeService.findAll();
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/routes/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable Long id) {
        try {
            Route route = routeService.findById(id);
            return ResponseEntity.ok(route);
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