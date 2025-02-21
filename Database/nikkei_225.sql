CREATE DATABASE IF NOT EXISTS nikkei_225;
USE nikkei_225;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Nikki225Divisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `Index` VARCHAR(50) NOT NULL,  
    FromDt DATE NOT NULL,
    ToDt DATE NOT NULL,
    Divisor DECIMAL(15, 8) NOT NULL,
    UpdateSource VARCHAR(50) NOT NULL,
    UpdateTime DATETIME NOT NULL
);


CREATE TABLE IF NOT EXISTS Nikki225Dividend (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Dt DATE NOT NULL,
    `Index` VARCHAR(50) NOT NULL,  
    DivDt DATE NOT NULL,
    Dividend DECIMAL(15, 6) NOT NULL,
    UpdateSource VARCHAR(50) NOT NULL,
    UpdateTime DATETIME NOT NULL
);


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


CREATE TABLE IF NOT EXISTS FuturePrice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ParametersUse TEXT,
    CalculationDetails TEXT
);

SHOW TABLES;

SELECT * FROM Nikki225Divisor;
SELECT * FROM Nikki225Dividend;
SELECT * FROM Nikki225RepoRate;
SELECT * FROM Nikki225FundingRate;
SELECT * FROM FuturePrice;