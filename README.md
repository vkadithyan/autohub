# AutoHub - Vehicle Service Centre Management System

A web-based application for managing vehicle service center operations, completely rebuilt using a modern React & Node.js architecture.

## Project Structure

- **frontend/**: A Vite-driven React application housing the user interface. Features an elegant glassmorphism dark-mode aesthetic with smooth animations.
- **backend/**: An Express.js REST API providing secure JWT authentication and routing over a MySQL Database connection pool.
- **database/**: Contains the database schema (`schema.sql`) for seeding the required MySQL tables.

## Quick Start Guide

### Prerequisites
- Node.js installed
- A running MySQL Database Server

### 1. Database Setup
Ensure you have an empty MySQL database named `autohub` and execute the `database/schema.sql` file to seed the schema and default accounts.

### 2. Start the Backend API
```powershell
cd backend
npm install
npm run dev
```
The server will boot up and connect using the credentials supplied in `backend/.env`.

### 3. Start the Frontend UI
Open a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```
Click the local link (usually `http://localhost:5173`) to launch! 

## Technologies Used

- **Frontend**: React 19, Vite, React Router DOM, Axios, Lucide Icons, Pure CSS
- **Backend**: Node.js, Express.js, MySQL2, JSON Web Tokens (JWT), Bcrypt.js
- **Database**: MySQL 