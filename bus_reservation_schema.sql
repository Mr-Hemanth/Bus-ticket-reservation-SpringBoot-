-- Bus Ticket Reservation System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS bus_reservation;
USE bus_reservation;

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL
);

-- Create buses table
CREATE TABLE buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(255) NOT NULL UNIQUE,
    total_seats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create routes table
CREATE TABLE routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL
);

-- Create schedules table
CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    travel_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    available_seats INT NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Create bookings table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    schedule_id BIGINT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('CONFIRMED', 'CANCELLED') NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

-- Create booking_seats table for storing seat numbers
CREATE TABLE booking_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Insert sample data

-- Sample users
INSERT INTO users (name, email, password, role) VALUES 
('Bus Admin', 'busadmin@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN'),
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER'),
('Jane Smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER');

-- Sample buses
INSERT INTO buses (bus_number, total_seats, price) VALUES 
('BUS001', 40, 25.00),
('BUS002', 35, 30.00),
('BUS003', 50, 20.00);

-- Sample routes
INSERT INTO routes (source, destination) VALUES 
('New York', 'Boston'),
('New York', 'Washington'),
('Boston', 'Philadelphia'),
('Washington', 'Philadelphia');

-- Sample schedules
INSERT INTO schedules (bus_id, route_id, travel_date, departure_time, arrival_time, available_seats) VALUES 
(1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 40),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:00:00', 40),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '15:00:00', 35),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', '15:00:00', 35),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '14:00:00', 50);

-- Sample bookings
INSERT INTO bookings (user_id, schedule_id, total_price, status, booking_time) VALUES 
(2, 1, 50.00, 'CONFIRMED', NOW()),
(3, 1, 25.00, 'CONFIRMED', NOW());

-- Sample booking seats
INSERT INTO booking_seats (booking_id, seat_number) VALUES 
(1, 'A1'),
(1, 'A2'),
(2, 'B1');