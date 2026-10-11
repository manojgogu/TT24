# Campus Emergency Reporting and Response Management System

> **A Full-Stack, Enterprise-Grade Campus Safety & Incident Command Platform**  
> B.Tech Computer Science Academic Project

---

## 📌 Repository Overview

This repository contains the complete source code, database architecture, and deployment scripts for the **Campus Emergency Reporting and Response Management System**:

- **[`campus-emergency-system/backend/`](./campus-emergency-system/backend/)**: Spring Boot 3.3.4 (Java 17+) backend with Spring Security 6, JWT Bearer authentication, and MySQL 8 relational schema with auto-seeding.
- **[`campus-emergency-system/frontend/`](./campus-emergency-system/frontend/)**: Modern React 18 + Vite frontend with Tailwind CSS, Lucide React icons, and Recharts analytics dashboards.
- **[`campus-emergency-system/database/`](./campus-emergency-system/database/)**: Full relational schema (`schema.sql`) and initial seed data (`seed-data.sql`).

For full architectural diagrams, REST API documentation, evaluation test accounts, and Viva Q&A guide, please see the [Complete System Documentation](./campus-emergency-system/README.md).

---

## ⚡ Quick Start

### 1. Database Setup
Ensure MySQL is running on port 3306 (user `root`, password `root`). The database `campus_emergency_db` is auto-initialized on backend launch.

### 2. Backend Startup
```bash
cd campus-emergency-system/backend
mvn spring-boot:run
```
*(Runs on `http://localhost:8080`)*

### 3. Frontend Startup
```bash
cd campus-emergency-system/frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🔑 Demo Evaluation Accounts
The application includes one-click evaluator login buttons on the login screen:
- **Admin**: `admin@campus.edu` / `Admin@123`
- **Security Officer**: `officer.alex@campus.edu` / `Alex@123`
- **Student**: `rahul.sharma@campus.edu` / `Student@123`
- **Faculty**: `prof.johnson@campus.edu` / `Faculty@123`
