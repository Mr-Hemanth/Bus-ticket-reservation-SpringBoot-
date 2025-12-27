package com.bus.reservation.service;

import com.bus.reservation.dto.BusDTO;
import com.bus.reservation.entity.Bus;

import java.util.List;

public interface BusService {
    Bus createBus(Bus bus);
    Bus updateBus(Long id, Bus bus);
    void deleteBus(Long id);
    Bus findById(Long id);
    List<BusDTO> findAll();
}