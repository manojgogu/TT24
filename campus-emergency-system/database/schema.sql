-- ============================================================
-- CAMPUS EMERGENCY REPORTING AND RESPONSE MANAGEMENT SYSTEM
-- Database Schema Definition (MySQL 8+)
-- Database: campus_emergency_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS campus_emergency_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE campus_emergency_db;

-- Drop tables in reverse order of foreign keys for clean recreation
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS incident_status_history;
DROP TABLE IF EXISTS emergency_attachments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS incident_assignments;
DROP TABLE IF EXISTS emergency_reports;
DROP TABLE IF EXISTS campus_locations;
DROP TABLE IF EXISTS emergency_categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL COMMENT 'STUDENT, FACULTY, SECURITY, ADMIN',
    department VARCHAR(100),
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. EMERGENCY CATEGORIES TABLE
CREATE TABLE emergency_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'AlertTriangle',
    default_severity VARCHAR(20) DEFAULT 'MEDIUM' COMMENT 'LOW, MEDIUM, HIGH, CRITICAL',
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CAMPUS LOCATIONS TABLE
CREATE TABLE campus_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL UNIQUE,
    location_description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    zone VARCHAR(50) DEFAULT 'Main Campus',
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_building_name (building_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EMERGENCY REPORTS TABLE
CREATE TABLE emergency_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    incident_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    specific_location VARCHAR(255) COMMENT 'E.g., 2nd Floor, Room 204 or East Wing corridor',
    reported_by BIGINT NOT NULL,
    severity VARCHAR(20) NOT NULL COMMENT 'LOW, MEDIUM, HIGH, CRITICAL',
    status VARCHAR(30) NOT NULL DEFAULT 'REPORTED' COMMENT 'REPORTED, ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, CANCELLED',
    is_sos BOOLEAN DEFAULT FALSE NOT NULL,
    resolution_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_report_category FOREIGN KEY (category_id) REFERENCES emergency_categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_report_location FOREIGN KEY (location_id) REFERENCES campus_locations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_report_user FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_report_status (status),
    INDEX idx_report_severity (severity),
    INDEX idx_report_created_at (created_at),
    INDEX idx_report_incident_number (incident_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. INCIDENT ASSIGNMENTS TABLE
CREATE TABLE incident_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emergency_id BIGINT NOT NULL,
    responder_id BIGINT NOT NULL,
    assigned_by BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    notes TEXT,
    CONSTRAINT fk_assignment_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_reports(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_responder FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assignment_emergency (emergency_id),
    INDEX idx_assignment_responder (responder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. EMERGENCY ATTACHMENTS TABLE
CREATE TABLE emergency_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emergency_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_reports(id) ON DELETE CASCADE,
    INDEX idx_attachment_emergency (emergency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    emergency_id BIGINT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'STATUS_UPDATE',
    read_status BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_reports(id) ON DELETE SET NULL,
    INDEX idx_notification_user_read (user_id, read_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. INCIDENT STATUS HISTORY TABLE
CREATE TABLE incident_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emergency_id BIGINT NOT NULL,
    updated_by BIGINT NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    remarks TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_reports(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_history_emergency (emergency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
