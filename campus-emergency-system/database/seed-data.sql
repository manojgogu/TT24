-- ============================================================
-- CAMPUS EMERGENCY REPORTING AND RESPONSE MANAGEMENT SYSTEM
-- Seed Data Script
-- Database: campus_emergency_db
-- ============================================================

USE campus_emergency_db;

-- 1. SEED EMERGENCY CATEGORIES
INSERT INTO emergency_categories (id, name, description, icon, default_severity, active) VALUES
(1, 'Medical Emergency', 'Sudden illness, fainting, cardiac events, physical trauma, allergic reactions', 'HeartPulse', 'CRITICAL', true),
(2, 'Fire Accident', 'Active fire, smoke detection, burning smell, chemical fire, gas leak', 'Flame', 'CRITICAL', true),
(3, 'Harassment', 'Verbal abuse, intimidation, stalking, gender harassment, cyber harassment on campus', 'ShieldAlert', 'HIGH', true),
(4, 'Physical Violence', 'Assault, brawl, active fights, weapon possession, physical threats', 'AlertOctagon', 'CRITICAL', true),
(5, 'Theft', 'Stolen lab equipment, laptops, personal belongings, vehicle theft, break-in', 'Lock', 'MEDIUM', true),
(6, 'Suspicious Activity', 'Unidentified intruders, unattended luggage, trespassing in restricted zones', 'Eye', 'MEDIUM', true),
(7, 'Electrical Hazard', 'Sparking wires, power transformer failure, exposed live cables, short circuits', 'Zap', 'HIGH', true),
(8, 'Infrastructure Damage', 'Elevator failure, ceiling collapse, water pipe rupture, structural cracks', 'Building', 'HIGH', true),
(9, 'Other Emergencies', 'Weather-related risks, chemical spills, animal intrusion, other unlisted events', 'HelpCircle', 'MEDIUM', true)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED CAMPUS LOCATIONS
INSERT INTO campus_locations (id, building_name, location_description, latitude, longitude, zone, active) VALUES
(1, 'Main Academic Block (Block A)', 'Primary lecture halls, central atrium, Dean offices', 12.9715987, 77.5945627, 'Academic Zone', true),
(2, 'Engineering & Technology Wing (Block B)', 'Computer science labs, robotics workshop, electronics lab', 12.9721000, 77.5952000, 'Academic Zone', true),
(3, 'Science & Research Complex (Block C)', 'Chemistry labs, bio-research center, physics observatory', 12.9728000, 77.5948000, 'Research Zone', true),
(4, 'Central Library & Digital Commons', 'Ground floor reference, 2nd floor silent study, 3rd floor archives', 12.9712000, 77.5939000, 'Academic Zone', true),
(5, 'Campus Health & Wellness Center', 'Emergency medical triage, pharmacy, ambulance bay', 12.9708000, 77.5958000, 'Medical Zone', true),
(6, 'Boys Hostel Block 1 & 2', 'Student residence, dining mess, common recreation hall', 12.9735000, 77.5965000, 'Residential Zone', true),
(7, 'Girls Hostel Block A & B', 'Student residence, 24/7 security booth, visitor lounge', 12.9739000, 77.5959000, 'Residential Zone', true),
(8, 'Student Activity Center (SAC)', 'Cafeteria, student union hall, indoor auditorium', 12.9705000, 77.5941000, 'Student Life Zone', true),
(9, 'Campus Security Command & Gate 1', 'Main security dispatch office, vehicle checkpoint, CCTV room', 12.9698000, 77.5935000, 'Security Zone', true),
(10, 'Sports Complex & Athletic Stadium', 'Olympic swimming pool, gymnasium, open football arena', 12.9742000, 77.5932000, 'Athletics Zone', true)
ON DUPLICATE KEY UPDATE building_name=VALUES(building_name);

-- 3. SEED INITIAL USERS
-- Passwords will be synchronized/rehashed by DataInitializer on Spring Boot startup
-- BCrypt for:
-- admin@campus.edu -> Admin@123
-- officer.john@campus.edu -> Officer@123
-- officer.sarah@campus.edu -> Officer@123
-- student.alex@campus.edu -> Student@123
-- faculty.drsharma@campus.edu -> Faculty@123
INSERT INTO users (id, full_name, email, password, phone, role, department, active) VALUES
(1, 'Chief Security Administrator', 'admin@campus.edu', '$2a$10$G0Kx2P20dvhU4tE9i6y2nOTL6/86J8t8yq4mD2y5g2P7pG7r6K2uK', '+1-555-0100', 'ADMIN', 'Campus Safety & Administration', true),
(2, 'Officer John Miller', 'officer.john@campus.edu', '$2a$10$G0Kx2P20dvhU4tE9i6y2nOTL6/86J8t8yq4mD2y5g2P7pG7r6K2uK', '+1-555-0101', 'SECURITY', 'Rapid Response Unit 1', true),
(3, 'Officer Sarah Connor', 'officer.sarah@campus.edu', '$2a$10$G0Kx2P20dvhU4tE9i6y2nOTL6/86J8t8yq4mD2y5g2P7pG7r6K2uK', '+1-555-0102', 'SECURITY', 'Medical & Fire Response Unit', true),
(4, 'Alex Rivera', 'student.alex@campus.edu', '$2a$10$G0Kx2P20dvhU4tE9i6y2nOTL6/86J8t8yq4mD2y5g2P7pG7r6K2uK', '+1-555-0103', 'STUDENT', 'Computer Science & Engineering', true),
(5, 'Dr. Rajesh Sharma', 'faculty.drsharma@campus.edu', '$2a$10$G0Kx2P20dvhU4tE9i6y2nOTL6/86J8t8yq4mD2y5g2P7pG7r6K2uK', '+1-555-0104', 'FACULTY', 'Department of Physics', true)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 4. SEED SAMPLE EMERGENCY REPORTS
INSERT INTO emergency_reports (id, incident_number, title, description, category_id, location_id, specific_location, reported_by, severity, status, is_sos, resolution_summary, created_at, resolved_at) VALUES
(1, 'INC-2026-0001', 'Severe smoke detected from Chemistry Lab 3', 'Dense smoke billowing from solvent storage cabinet, chemical alarm sounding, students evacuated.', 2, 3, 'Floor 2, Lab 302', 5, 'CRITICAL', 'RESOLVED', false, 'Fire suppressed with dry chemical extinguisher. Room ventilated and sealed for safety assessment. No casualties reported.', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 46 HOUR)),
(2, 'INC-2026-0002', 'Student collapsed during basketball practice', 'Student experienced heat exhaustion and lost consciousness on the indoor court. First aid administered.', 1, 10, 'Indoor Court 1', 4, 'CRITICAL', 'RESOLVED', true, 'Campus medical team arrived in 4 minutes. Patient stabilized and transferred to Campus Health Center for IV hydration.', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(3, 'INC-2026-0003', 'Exposed live wiring sparking near elevator entrance', 'Electrical conduits damaged by water seepage; visible sparks every few minutes. Cordone needed urgently.', 7, 2, 'Ground Floor, North Elevator', 4, 'IN_PROGRESS', false, NULL, DATE_SUB(NOW(), INTERVAL 4 HOUR), NULL),
(4, 'INC-2026-0004', 'Unattended backpack in central library reading hall', 'Black backpack left unattended for over 3 hours near cubicle 14, ticking device or phone suspected.', 6, 4, '2nd Floor, Silent Commons', 5, 'MEDIUM', 'ASSIGNED', false, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL),
(5, 'INC-2026-0005', 'SOS Alert: Suspicious individual stalking outside hostel', 'Individual without student ID roaming around the perimeter fence and attempting to enter rear staircase.', 3, 7, 'Rear Gate, Girls Hostel Block A', 4, 'HIGH', 'REPORTED', true, NULL, DATE_SUB(NOW(), INTERVAL 25 MINUTE), NULL)
ON DUPLICATE KEY UPDATE incident_number=VALUES(incident_number);

-- 5. SEED ASSIGNMENTS
INSERT INTO incident_assignments (id, emergency_id, responder_id, assigned_by, assigned_at, acknowledged_at, notes) VALUES
(1, 1, 3, 1, DATE_SUB(NOW(), INTERVAL 47 HOUR), DATE_SUB(NOW(), INTERVAL 47 HOUR), 'Dispatched HAZMAT response and fire marshal.'),
(2, 2, 3, 1, DATE_SUB(NOW(), INTERVAL 23 HOUR), DATE_SUB(NOW(), INTERVAL 23 HOUR), 'Paramedic dispatched with defibrillator kit.'),
(3, 3, 2, 1, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 'Safety zone established. Electrician team on-site isolating circuit breaker.'),
(4, 4, 2, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, 'Investigating bag contents and reviewing CCTV logs.')
ON DUPLICATE KEY UPDATE emergency_id=VALUES(emergency_id);

-- 6. SEED STATUS HISTORY
INSERT INTO incident_status_history (emergency_id, updated_by, previous_status, new_status, remarks, timestamp) VALUES
(1, 5, NULL, 'REPORTED', 'Emergency reported by faculty member.', DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(1, 1, 'REPORTED', 'ASSIGNED', 'Assigned to Officer Sarah Connor.', DATE_SUB(NOW(), INTERVAL 47 HOUR)),
(1, 3, 'ASSIGNED', 'ACKNOWLEDGED', 'Officer acknowledged assignment and en route.', DATE_SUB(NOW(), INTERVAL 47 HOUR)),
(1, 3, 'ACKNOWLEDGED', 'IN_PROGRESS', 'Arrived at scene. Fire suppression initiated.', DATE_SUB(NOW(), INTERVAL 47 HOUR)),
(1, 3, 'IN_PROGRESS', 'RESOLVED', 'Fire extinguished. Area secured.', DATE_SUB(NOW(), INTERVAL 46 HOUR)),

(2, 4, NULL, 'REPORTED', 'SOS Alert triggered by student Alex Rivera.', DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(2, 1, 'REPORTED', 'ASSIGNED', 'Assigned to Medical Response Officer Sarah Connor.', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(2, 3, 'ASSIGNED', 'ACKNOWLEDGED', 'Officer acknowledged and responding.', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(2, 3, 'ACKNOWLEDGED', 'IN_PROGRESS', 'Arrived at gymnasium. Patient attended.', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(2, 3, 'IN_PROGRESS', 'RESOLVED', 'Student stabilized and recovering.', DATE_SUB(NOW(), INTERVAL 22 HOUR)),

(3, 4, NULL, 'REPORTED', 'Electrical hazard reported.', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(3, 1, 'REPORTED', 'ASSIGNED', 'Assigned to Officer John Miller.', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, 2, 'ASSIGNED', 'ACKNOWLEDGED', 'Assignment acknowledged.', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, 2, 'ACKNOWLEDGED', 'IN_PROGRESS', 'Circuit isolation underway with campus engineering.', DATE_SUB(NOW(), INTERVAL 2 HOUR)),

(4, 5, NULL, 'REPORTED', 'Suspicious item reported.', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4, 1, 'REPORTED', 'ASSIGNED', 'Assigned to Officer John Miller.', DATE_SUB(NOW(), INTERVAL 1 HOUR)),

(5, 4, NULL, 'REPORTED', 'SOS Panic alert reported by student.', DATE_SUB(NOW(), INTERVAL 25 MINUTE));

-- 7. SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, emergency_id, message, type, read_status, created_at) VALUES
(1, 4, 2, 'Your emergency report INC-2026-0002 has been assigned to Officer Sarah Connor.', 'ASSIGNMENT', true, DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(2, 4, 2, 'Officer Sarah Connor is now actively responding to INC-2026-0002.', 'STATUS_UPDATE', true, DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(3, 4, 2, 'Emergency INC-2026-0002 has been marked RESOLVED. Resolution: Campus medical team arrived in 4 minutes.', 'RESOLUTION', true, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(4, 2, 3, 'New Emergency Assigned: INC-2026-0003 (Exposed live wiring sparking near elevator entrance) at Engineering & Technology Wing.', 'NEW_ASSIGNMENT', true, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(5, 2, 4, 'New Emergency Assigned: INC-2026-0004 (Unattended backpack in central library reading hall) at Central Library.', 'NEW_ASSIGNMENT', false, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(6, 4, 5, 'Your SOS Emergency Report INC-2026-0005 has been registered. Campus security dispatch has been notified.', 'REPORT_CREATED', false, DATE_SUB(NOW(), INTERVAL 25 MINUTE));
