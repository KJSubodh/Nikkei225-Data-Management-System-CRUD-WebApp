# Nikkei225 Data Management System CRUD WebApp 

## Overview: 

This project is a full-stack web application designed for managing data related to the **Nikkei 225 index**. 

It allows users to perform complete **CRUD** (Create, Read, Update, Delete) **Operations** on key datasets such as: 

**divisor**, **dividend**, **reporate**, and **funding rate**. 

## Login
A secure login/registration system is provided using OAuth 2.0 with Google Accounts.

In addition, the web application features a **Custom Right-Click** context menu that lets you:

## Custom Feature
1) Add a new row anywhere in a table (even between two existing rows, e.g., inserting a row between rows 1 and 2).

2) Update an existing row, and

3) Delete a row.

4) Save the table changes.




## Installation

Download the project and install all the dependencies


## Install Dependencies:

npm install express mysql2 mysql passport passport-google-oauth20 express-session dotenv

## Environment Variables

Create a .env file in the root directory and add your configuration:

PORT=3000

DB_HOST=localhost

DB_USER=your_db_user

DB_PASSWORD=your_db_password

DB_NAME=your_db_name

SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback



## Features

- Login/Registration:
   **OAuth 2.0** based authentication using Google Accounts.
- Data Management:
   Upload and manage Nikkei225 index-related data (divisor,    dividend, repo rate, funding rate).
   
- Data is stored in **MySQL** database tables.
- Advanced Table Operations:
   Right-click functionality to add a new row at any position, update an existing row, or delete a row.
- Session management with express-session and environment variables managed with dotenv.

- Authentication powered by Passport and passport-google-oauth20.


## Run Locally

Clone the project

```bash
  git clone https://github.com/KJSubodh/Nikkei225-Data-Management-System-CRUD-WebApp
```

Go to the project directory

```bash
  cd Nikkei225
```

Install dependencies

```bash
  npm install express mysql2 mysql passport passport-google-oauth20 express-session dotenv
```

Start the server

```bash
  node server.js
```


## Authors

- [@KJSubodh](https://github.com/KJSubodh)


## Tech Stack

**Frontend:** HTML CSS, Javascript and Flatpickr for date picking

**Backend:** Node.JS and ExpressJS

**Database:** MySQL

**Additionally:** Passport & passport-google-oauth20 for authentication. express-session for session management and
dotenv for environment variables


## Acknowledgements

 - [Nikkei Stock](https://indexes.nikkei.co.jp/nkave/archives/faq/faq_nikkei_stock_average_en.pdf)

