package com.bus.reservation.service;

import com.bus.reservation.dto.RouteDTO;
import com.bus.reservation.entity.Route;
import com.bus.reservation.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private com.bus.reservation.repository.ScheduleRepository scheduleRepository;

    @Override
    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    @Override
    public Route updateRoute(Long id, Route route) {
        Route existingRoute = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
        
        existingRoute.setSource(route.getSource());
        existingRoute.setDestination(route.getDestination());
        
        return routeRepository.save(existingRoute);
    }

    @Override
    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
        
        // Check if route has any schedules
        if (scheduleRepository.existsByRouteId(id)) {
            throw new RuntimeException("Cannot delete route with ID " + id + ". Route has associated schedules.");
        }
        
        routeRepository.deleteById(id);
    }

    @Override
    public Route findById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
    }

    @Override
    public List<RouteDTO> findAll() {
        return routeRepository.findAll().stream()
                .map(route -> new RouteDTO(route.getId(), route.getSource(), route.getDestination()))
                .collect(Collectors.toList());
    }

    @Override
    public Route findBySourceAndDestination(String source, String destination) {
        // Find existing route or create a new one
        List<Route> routes = routeRepository.findAll();
        for (Route route : routes) {
            if (route.getSource().equals(source) && route.getDestination().equals(destination)) {
                return route;
            }
        }
        return null;
    }
}