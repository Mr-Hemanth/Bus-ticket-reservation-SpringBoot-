package com.bus.reservation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String busNumber;

    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private Double price;

    public Bus() {}

    public Bus(String busNumber, Integer totalSeats, Double price) {
        this.busNumber = busNumber;
        this.totalSeats = totalSeats;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}