package com.bus.reservation.dto;

public class BusDTO {
    private Long id;
    private String busNumber;
    private Integer totalSeats;
    private Double price;

    // Default constructor
    public BusDTO() {}

    // Constructor with parameters
    public BusDTO(Long id, String busNumber, Integer totalSeats, Double price) {
        this.id = id;
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