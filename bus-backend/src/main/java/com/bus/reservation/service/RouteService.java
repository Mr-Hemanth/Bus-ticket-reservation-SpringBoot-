package com.bus.reservation.service;

import com.bus.reservation.dto.RouteDTO;
import com.bus.reservation.entity.Route;

import java.util.List;

public interface RouteService {
    Route createRoute(Route route);
    Route updateRoute(Long id, Route route);
    void deleteRoute(Long id);
    Route findById(Long id);
    List<RouteDTO> findAll();
    Route findBySourceAndDestination(String source, String destination);
}