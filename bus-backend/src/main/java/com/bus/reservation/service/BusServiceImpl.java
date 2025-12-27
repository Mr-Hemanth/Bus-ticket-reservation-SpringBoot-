package com.bus.reservation.service;

import com.bus.reservation.dto.BusDTO;
import com.bus.reservation.entity.Bus;
import com.bus.reservation.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusServiceImpl implements BusService {

    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private ScheduleService scheduleService;

    @Override
    public Bus createBus(Bus bus) {
        if (busRepository.existsByBusNumber(bus.getBusNumber())) {
            throw new RuntimeException("Bus already exists with number: " + bus.getBusNumber());
        }
        return busRepository.save(bus);
    }

    @Override
    public Bus updateBus(Long id, Bus bus) {
        Bus existingBus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));
        
        existingBus.setBusNumber(bus.getBusNumber());
        existingBus.setTotalSeats(bus.getTotalSeats());
        existingBus.setPrice(bus.getPrice());
        
        return busRepository.save(existingBus);
    }

    @Override
    public void deleteBus(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));
        
        // Check if bus has any schedules
        if (scheduleService.hasSchedulesForBus(id)) {
            throw new RuntimeException("Cannot delete bus with ID " + id + ". Bus has associated schedules. Please delete all schedules for this bus first.");
        }
        
        busRepository.deleteById(id);
    }

    @Override
    public Bus findById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));
    }

    @Override
    public List<BusDTO> findAll() {
        return busRepository.findAll().stream()
                .map(bus -> new BusDTO(bus.getId(), bus.getBusNumber(), bus.getTotalSeats(), bus.getPrice()))
                .collect(Collectors.toList());
    }
}