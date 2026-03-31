-- AutoHub Database Schema
-- MySQL Database for Vehicle Service Centre Management System

CREATE DATABASE IF NOT EXISTS autohub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autohub;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will store hashed passwords
    role ENUM('admin', 'customer', 'mechanic') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    vin VARCHAR(17) UNIQUE,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Mechanics table
CREATE TABLE IF NOT EXISTS mechanics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    phone VARCHAR(20),
    status ENUM('available', 'busy') DEFAULT 'available'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Services table (types of services offered)
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    estimated_duration INT, -- in minutes
    price DECIMAL(10,2)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    vehicle_id INT,
    service_id INT,
    mechanic_id INT,
    booking_date DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'card', 'online') DEFAULT 'cash',
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample data
INSERT IGNORE INTO users (username, password, role) VALUES
('admin', '$2y$10$hashedpassword', 'admin'), -- Use password_hash() in PHP
('customer', '$2y$10$hashedpassword', 'customer'),
('mechanic', '$2y$10$hashedpassword', 'mechanic');

INSERT IGNORE INTO services (name, description, estimated_duration, price) VALUES
('Oil Change', 'Complete oil change service', 30, 50.00),
('Tire Rotation', 'Rotate tires for even wear', 20, 25.00),
('Brake Inspection', 'Inspect and maintain brakes', 45, 75.00);