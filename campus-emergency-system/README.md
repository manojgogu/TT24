# Campus Emergency Reporting and Response Management System

> **A Full-Stack, Enterprise-Grade Campus Safety & Incident Command Platform**  
> Developed as a B.Tech Computer Science Capstone Project

---

## 📌 Executive Summary

The **Campus Emergency Reporting and Response Management System** is a centralized, real-time safety operations platform built to minimize campus incident response times and save lives. Designed specifically for university ecosystems, it bridges the gap between campus residents (students and faculty), security dispatch teams, and campus administrative authorities.

Key capabilities include:
- **Instant SOS Trigger**: 2-click emergency reporting modal capturing GPS coordinates, building location, category, and photo attachments.
- **Strict Incident Lifecycle State Machine**: Finite state transitions (`REPORTED` ➔ `ASSIGNED` ➔ `ACKNOWLEDGED` ➔ `IN_PROGRESS` ➔ `RESOLVED`) with immutable audit trails.
- **Real-Time Security Command Desk**: Real-time SLA metrics, responder assignment, and in-field resolution summaries.
- **Executive Analytics & Compliance**: Dynamic Recharts telemetry for incident density by building and category, with one-click university CSV audit exports.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                            │
│  React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST / Bearer JWT
┌──────────────────────────────▼──────────────────────────────┐
│                    APPLICATION TIER                         │
│            Spring Boot 3.3.4 (Java 17/21/25)                │
│  ┌───────────────────────────┬───────────────────────────┐  │
│  │ Spring Security (Stateless│ Custom Services Layer     │  │
│  │ JWT Auth + RBAC Filter)   │ (Emergency, Admin, Auth)  │  │
│  └───────────────────────────┴───────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Spring Data JPA + Hibernate ORM                       │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ TCP / JDBC (Port 3306)
┌──────────────────────────────▼──────────────────────────────┐
│                      DATA TIER                              │
│         MySQL 8.0 Enterprise Relational Database            │
│  `users`, `emergency_reports`, `incident_assignments`,      │
│  `incident_status_history`, `notifications`, `locations`    │
└─────────────────────────────────────────────────────────────┘
```

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17+ (Java 25 LTS compatible)
- **Security**: Spring Security 6 with stateless JWT Bearer token authentication (JJWT 0.12.6)
- **Data Access**: Spring Data JPA & Hibernate ORM
- **Database Driver**: MySQL Connector/J 8.3.0
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Testing**: JUnit 5, Mockito, Spring Security Test

### Frontend
- **Framework**: React 18 with Vite build tooling
- **Styling**: Tailwind CSS with custom slate/blue/emergency palettes
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Responsive Bar, Pie, and Area Charts)
- **HTTP Client**: Axios with interceptors for token attachment and 401 handling

---

## 🗄️ Database Schema & Entities

The system employs a normalized MySQL 8 schema with explicit foreign keys, indexing on query keys (`incident_number`, `status`, `reporter_id`, `assigned_to_id`), and automated audit history:

1. **`users`**: Credentials, BCrypt password hashes, role (`STUDENT`, `FACULTY`, `SECURITY`, `ADMIN`), department, and active status.
2. **`emergency_categories`**: Medical, Fire, Physical Security, Harassment, Lab Hazmat, Weather, etc., with default urgency ratings.
3. **`campus_locations`**: Campus buildings, sectors, zones, and landmarks.
4. **`emergency_reports`**: Master incident logs with unique human-readable identifier (e.g. `INC-20261011-9481`), severity, status, and GPS coordinates.
5. **`incident_assignments`**: Dispatched security responder relationships and dispatcher instructions.
6. **`incident_status_history`**: Immutable chronological audit logs tracking every state change, actor, and comment.
7. **`notifications`**: Targeted user alerts for status updates and officer dispatch.
8. **`emergency_attachments`**: Securely uploaded photo and evidence files.

---

## 🔐 Role-Based Access Control (RBAC) & Demo Credentials

The platform features built-in 1-click demo logins on the Login screen for rapid evaluation:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `Admin@123` | Full system command, officer dispatch, analytics telemetry, user activation, master data, CSV export |
| **Security Responder** | `officer.alex@campus.edu` | `Alex@123` | Active emergency queue, 1-click Acknowledge, Start Response, submit Resolution Summary |
| **Security Responder** | `officer.sarah@campus.edu` | `Sarah@123` | Secondary response officer |
| **Student** | `rahul.sharma@campus.edu` | `Student@123` | Emergency SOS trigger, photo upload report form, My Reports status tracking, timeline inspection |
| **Faculty** | `prof.johnson@campus.edu` | `Faculty@123` | Departmental emergency reporting and notification tracking |

---

## 🚀 Step-by-Step Setup & Execution

### Prerequisites
- Java JDK 17 or higher
- Apache Maven 3.8+
- Node.js 18+ and npm
- MySQL Server 8.0+ running on port 3306

### 1. Database Setup
MySQL database `campus_emergency_db` is automatically created by the Spring Boot backend on boot if not present.  
To manually inspect or execute raw SQL schemas:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p campus_emergency_db < database/seed-data.sql
```

### 2. Backend Execution
Navigate to the `backend/` directory:
```bash
cd backend
mvn spring-boot:run
```
The backend initializes database tables, seeds default categories, campus locations, and test users, and serves REST endpoints on **`http://localhost:8080`**.

### 3. Frontend Execution
In a separate terminal, navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
The React development server launches on **`http://localhost:5173`**.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a student or faculty account.
- `POST /api/auth/login` — Authenticate and receive JWT bearer token.
- `GET /api/auth/me` — Retrieve currently authenticated user profile.

### Emergencies (`/api/emergencies`)
- `POST /api/emergencies` — Submit structured emergency report with optional photo attachment.
- `GET /api/emergencies/my-reports` — Retrieve reports filed by the authenticated user.
- `GET /api/emergencies/assigned-to-me` — Retrieve reports assigned to the calling security responder.
- `GET /api/emergencies/{id}` — Fetch detailed incident information including audit timeline.
- `PUT /api/emergencies/{id}/status` — Transition incident status (`ACKNOWLEDGED`, `IN_PROGRESS`).
- `PUT /api/emergencies/{id}/resolve` — Submit incident resolution summary.
- `PUT /api/emergencies/{id}/assign` — Administrative dispatch to responder.

### Admin & Telemetry (`/api/admin`)
- `GET /api/admin/metrics` — Aggregate incident metrics, SLA response time, and category breakdowns.
- `GET /api/admin/users` — Campus user directory.
- `PUT /api/admin/users/{id}/status` — Activate/deactivate user account.
- `GET /api/admin/responders` — Security personnel roster.
- `POST /api/admin/responders` — Register new security officer.
- `GET /api/admin/export/csv` — Stream CSV incident records.

---

## 🎓 Academic Viva Examination Guide

### Q1: How does the system prevent unauthorized access to sensitive emergency reports?
**Answer**: Security is enforced at both network and method levels:
1. Stateless JWT bearer tokens signed with HMAC-SHA256 (`jjwt 0.12.6`).
2. Spring Security `SecurityFilterChain` validates claims on every incoming request.
3. Method-level security (`@PreAuthorize("hasRole('ADMIN')")` and `@PreAuthorize("hasAnyRole('SECURITY', 'ADMIN')")`) prevents horizontal privilege escalation. Students can only access incidents where `reporter_id == currentUser.id`.

### Q2: How does the incident lifecycle guarantee data integrity?
**Answer**: The system uses a strict State Machine pattern via `IncidentStatus.canTransitionTo()`:
- `REPORTED` ➔ `ASSIGNED` ➔ `ACKNOWLEDGED` ➔ `IN_PROGRESS` ➔ `RESOLVED`.
- Invalid transitions (e.g. attempting to resolve an unacknowledged incident) throw an `IllegalStateException` intercepted by `GlobalExceptionHandler`.
- Every transition automatically records an entry in `IncidentStatusHistory` capturing the timestamp, prior status, new status, actor ID, and operational comments.

### Q3: Why is MySQL chosen over NoSQL for this safety application?
**Answer**: Emergency incident workflows require strict ACID guarantees:
- Atomic status updates and dispatcher assignments prevent race conditions (e.g. two dispatchers assigning conflicting responders).
- Foreign key constraints ensure relational integrity between responders, reporters, locations, and audit histories.

---

## 📄 License
This project is developed for academic educational demonstration and university safety management research.
