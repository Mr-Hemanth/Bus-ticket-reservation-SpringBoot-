package com.bus.reservation.dto;

public class RouteDTO {
    private Long id;
    private String source;
    private String destination;

    // Default constructor
    public RouteDTO() {}

    // Constructor with parameters
    public RouteDTO(Long id, String source, String destination) {
        this.id = id;
        this.source = source;
        this.destination = destination;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
}