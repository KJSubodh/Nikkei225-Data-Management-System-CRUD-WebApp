-- Create the database
CREATE DATABASE IF NOT EXISTS stock225;
USE stock225;

-- Main Table
CREATE TABLE IF NOT EXISTS Main (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(255),
    Date DATE,
    Divisor DECIMAL(15, 8),
    Dividend DECIMAL(15, 6),
    RepoRate DECIMAL(10, 6),
    FundingRate DECIMAL(10, 6),
    FYR VARCHAR(50),
    DateFormat VARCHAR(50)
);

-- Users Table (For OAuth Login)
-- Add google_id column to users table
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE NOT NULL AFTER id;

-- Check if column was added
DESC users;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users; -- Check if users are stored correctly

SELECT * FROM Main;

-- Divisor Table
CREATE TABLE IF NOT EXISTS Nikki225Divisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `Index` VARCHAR(50) NOT NULL,
    FromDt DATE NOT NULL,
    ToDt DATE NOT NULL,
    Divisor DECIMAL(15, 8) NOT NULL,
    UpdateSource VARCHAR(50) NOT NULL,
    UpdateTime DATETIME NOT NULL
);

-- Dividend Table
CREATE TABLE IF NOT EXISTS Nikki225Dividend (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Dt DATE NOT NULL,
    `Index` VARCHAR(50) NOT NULL,
    DivDt DATE NOT NULL,
    Dividend DECIMAL(15, 6) NOT NULL,
    UpdateSource VARCHAR(50) NOT NULL,
    UpdateTime DATETIME NOT NULL
);

-- Repo Rate Table
CREATE TABLE IF NOT EXISTS Nikki225RepoRate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Dt DATE NOT NULL,
    `Index` VARCHAR(50) NOT NULL,
    Term DATE NOT NULL,
    Bid DECIMAL(10, 6) NOT NULL,
    Offer DECIMAL(10, 6) NOT NULL,
    UpdateSource VARCHAR(50) NOT NULL,
    UpdateTime DATETIME NOT NULL
);

-- Funding Rate Table
CREATE TABLE IF NOT EXISTS Nikki225FundingRate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Dt DATE NOT NULL,
    `Index` VARCHAR(50) NOT NULL,
    Term DATE NOT NULL,
    Bid DECIMAL(10, 6) NOT NULL,
    Offer DECIMAL(10, 6) NOT NULL,
    UpdateSource VARCHAR(50) NOT NULL,
    UpdateTime DATETIME NOT NULL
);

-- Future Price Table
CREATE TABLE IF NOT EXISTS FuturePrice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ParametersUse TEXT,
    CalculationDetails TEXT
);

SHOW TABLES;