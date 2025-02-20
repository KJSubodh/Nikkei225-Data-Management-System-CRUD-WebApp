CREATE DATABASE IF NOT EXISTS stock;
USE stock;

CREATE TABLE IF NOT EXISTS Nikkei225FuturePrice (
    `CalculationID` INT AUTO_INCREMENT PRIMARY KEY,
    `CalculationDate` DATETIME,
    `IndexSpot` DECIMAL(20, 10),
    `FundingRate` DECIMAL(10, 5),  -- e.g., 0.04 for 4%
    `RepoRate` DECIMAL(10, 5),      -- e.g., 0.02 for 2% (optional)
    `TimeToExpiration` DECIMAL(10, 5), -- Time in years (e.g., 0.25 for 3 months)
    `Dividend` DECIMAL(20, 10),      -- (optional)
    `FuturePrice` DECIMAL(20, 10),
    `UpdateSource` VARCHAR(50),      -- e.g., "manual calculation", "API"
    `UpdateTime` DATETIME,
    INDEX (`CalculationDate`),         -- For faster queries on date
    INDEX (`IndexSpot`)              -- For faster queries on IndexSpot
);

CREATE TABLE IF NOT EXISTS Nikki225Divisor (
    `Index` VARCHAR(20),
    `FromDt` VARCHAR(8),
    `ToDt` VARCHAR(8),
    `Divisor` DECIMAL(20, 10),
    `UpdateSource` VARCHAR(50),
    `UpdateTime` DATETIME,
    PRIMARY KEY (`Index`, `FromDt`, `ToDt`)
);

CREATE TABLE IF NOT EXISTS Nikki225Dividend (
    `Dt` VARCHAR(8),
    `Index` VARCHAR(20),
    `DivDt` VARCHAR(8),
    `Dividend` DECIMAL(20, 10),
    `UpdateSource` VARCHAR(50),
    `UpdateTime` DATETIME,
    PRIMARY KEY (`Dt`, `Index`, `DivDt`)
);

CREATE TABLE IF NOT EXISTS Nikki225RepoRate (
    `Dt` VARCHAR(8),
    `Index` VARCHAR(20),
    `Term` VARCHAR(8),
    `Bid` DECIMAL(20, 10),
    `Offer` DECIMAL(20, 10),
    `UpdateSource` VARCHAR(50),
    `UpdateTime` DATETIME,
    PRIMARY KEY (`Dt`, `Index`, `Term`)
);

CREATE TABLE IF NOT EXISTS Nikki225FundingRate (
    `Dt` VARCHAR(8),
    `Index` VARCHAR(20),
    `Term` VARCHAR(8),
    `Bid` DECIMAL(20, 10),
    `Offer` DECIMAL(20, 10),
    `UpdateSource` VARCHAR(50),
    `UpdateTime` DATETIME,
    PRIMARY KEY (`Dt`, `Index`, `Term`)
);

SELECT * from Nikki225Divisor;
SELECT * from Nikki225Dividend;
SELECT * from Nikki225FundingRate;
SELECT * from nikki225reporate;
SELECT * from Nikkei225FuturePrice;