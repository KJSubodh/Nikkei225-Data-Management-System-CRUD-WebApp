CREATE DATABASE IF NOT EXISTS stock225;
USE stock225;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Trader', 'Admin', 'Viewer') DEFAULT 'Viewer',
    IsActive BOOLEAN DEFAULT TRUE,
    UpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Nikki225Main (
    Stock_Index VARCHAR(50),          -- Stock Index
    Stock_IndexName VARCHAR(100),      -- Stock Index Name
    Currency VARCHAR(50),             -- Currency
    Exchange VARCHAR(50),             -- Exchange
    Description TEXT,                 -- Description
    Dt DATE PRIMARY KEY,              -- Date
    Divisor DECIMAL(20,10),
    Dividend DECIMAL(20,10),
    RepoRate DECIMAL(20,10),
    FundingRate DECIMAL(20,10),
    UpdateSource VARCHAR(100),        -- Update source
    UpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE Nikki225Main DROP PRIMARY KEY;

ALTER TABLE nikki225dividend DROP FOREIGN KEY nikki225dividend_ibfk_1;

DROP TABLE Nikki225Main;


TABLE Nikki225Main;
SELECT * FROM nikki225main;


-- Table: Divisor
CREATE TABLE IF NOT EXISTS Nikki225Divisor (
    `Index` VARCHAR(20),
    FromDt DATE,
    ToDt DATE,
    Divisor DECIMAL(20,10),
    UpdateSource ENUM('manual', 'auto') DEFAULT 'manual',
    UpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserID INT,
    PRIMARY KEY (`Index`, FromDt, ToDt),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    -- NO FK TO MAIN
);

-- Table: Dividend
CREATE TABLE IF NOT EXISTS Nikki225Dividend (
    Dt DATE,
    `Index` VARCHAR(20),
    DivDt DATE,
    Dividend DECIMAL(20,10),
    UpdateSource ENUM('manual', 'auto') DEFAULT 'manual',
    UpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserID INT,
    PRIMARY KEY (Dt, `Index`, DivDt),
    FOREIGN KEY (Dt) REFERENCES Nikki225Main(Dt),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Table: RepoRate
CREATE TABLE IF NOT EXISTS Nikki225RepoRate (
    Dt DATE,
    `Index` VARCHAR(20),
    Term DATE,
    Bid DECIMAL(20,10),
    Offer DECIMAL(20,10),
    UpdateSource ENUM('manual', 'auto') DEFAULT 'manual',
    UpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserID INT,
    PRIMARY KEY (Dt, `Index`, Term),
    FOREIGN KEY (Dt) REFERENCES Nikki225Main(Dt),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Table: FundingRate
CREATE TABLE IF NOT EXISTS Nikki225FundingRate (
    Dt DATE,
    `Index` VARCHAR(20),
    Term DATE,
    Bid DECIMAL(20,10),
    Offer DECIMAL(20,10),
    UpdateSource ENUM('manual', 'auto') DEFAULT 'manual',
    UpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserID INT,
    PRIMARY KEY (Dt, `Index`, Term),
    FOREIGN KEY (Dt) REFERENCES Nikki225Main(Dt),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Table: FuturePrice
CREATE TABLE IF NOT EXISTS Nikki225FuturePrice (
    Dt DATE,
    `Index` VARCHAR(20),
    Term DATE,
    SpotPrice DECIMAL(20,10),
    FundingRate DECIMAL(20,10),
    RepoRate DECIMAL(20,10),
    Dividend DECIMAL(20,10),
    TimeFactor DECIMAL(20,10) GENERATED ALWAYS AS (
        DATEDIFF(Term, Dt)/365.0
    ) STORED,
    FuturePrice DECIMAL(20,10) GENERATED ALWAYS AS (
        SpotPrice * (1 + (FundingRate - RepoRate) * TimeFactor) - Dividend
    ) STORED,
    PRIMARY KEY (Dt, `Index`, Term),
    FOREIGN KEY (Dt) REFERENCES Nikki225Main(Dt)
);

SELECT * from Nikki225futureprice;
SHOW COLUMNS FROM Nikki225FuturePrice;
ALTER TABLE Nikki225FuturePrice ADD COLUMN CalculationDate DATE;




-- Indexes for performance on frequently filtered columns
-- DROP INDEX idx_dt ON Nikki225Dividend;
-- DROP INDEX idx_term ON Nikki225RepoRate;


SHOW TABLES;

