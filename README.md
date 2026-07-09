# Task Tracker

A full-stack task management application with JWT authentication,
role-based access control (USER / ADMIN), and real-time task updates
using WebSockets (STOMP + SockJS).

## Tech Stack

**Backend** - Java 17 - Spring Boot 3.5 - Spring Security - Spring Data
JPA - PostgreSQL - JWT (jjwt) - Spring WebSocket (STOMP)

**Frontend** - React 19 - Vite - React Router - Material UI - Axios -
STOMP + SockJS

---

# Repository Structure

```text
task-tracker/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── postman/
├── .github/workflows/ci.yaml
└── README.md
```

# Prerequisites

- Java 17+
- Node.js 20+
- npm 10+
- PostgreSQL 14+
- Docker (only for backend integration tests)

The backend uses the Maven Wrapper, so Maven does not need to be
installed.

# Quick Start

## 1. Clone the repository

```bash
git clone <repository-url>
cd task-tracker
```

## 2. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE tasktracker;"
```

## 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` if required.

Example:

```env
DB_NAME=tasktracker
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 4. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

Default values:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=http://localhost:8080/ws
```

# Running the Backend

macOS/Linux

```bash
cd backend
chmod +x mvnw
./mvnw spring-boot:run
```

Windows

```powershell
cd backend
mvnw.cmd spring-boot:run
```

Backend URL:

    http://localhost:8080

A default administrator account is automatically created on first
startup.

Username Password

---

admin admin123

# Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

    http://localhost:5173

# Environment Variables

## Backend

Variable Description

---

DB_NAME PostgreSQL database
DB_USERNAME Database username
DB_PASSWORD Database password
JWT_SECRET JWT signing secret
JWT_EXPIRATION_MS JWT lifetime
CORS_ALLOWED_ORIGINS Allowed frontend origins

## Frontend

Variable Description

---

VITE_API_BASE_URL REST API URL
VITE_WS_BASE_URL SockJS endpoint

# API

Method Endpoint

---

POST /api/auth/register
POST /api/auth/login
POST /api/tasks
GET /api/tasks
GET /api/tasks/{id}
PUT /api/tasks/{id}
DELETE /api/tasks/{id}

WebSocket endpoint:

    http://localhost:8080/ws

Subscribe:

    /topic/tasks

# Postman

Import:

    postman/Task-Tracker.postman_collection.json

# Running Tests

Backend

```bash
cd backend
./mvnw clean verify
```

# CI

GitHub Actions automatically:

- Builds backend
- Runs backend tests
- Runs Spotless
- Installs frontend dependencies
- Runs ESLint
- Builds the React application

JWT secrets are provided through GitHub Actions Secrets. Local
development uses `.env`.

# Future Improvements

- Flyway database migrations
- Refresh tokens
- Additional controller tests
- Frontend unit tests
- Multiple Spring profiles
