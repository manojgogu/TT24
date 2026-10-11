package com.campus.emergency.config;

import com.campus.emergency.entity.*;
import com.campus.emergency.enums.IncidentStatus;
import com.campus.emergency.enums.Role;
import com.campus.emergency.enums.Severity;
import com.campus.emergency.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EmergencyCategoryRepository categoryRepository;
    private final CampusLocationRepository locationRepository;
    private final EmergencyReportRepository emergencyRepository;
    private final IncidentAssignmentRepository assignmentRepository;
    private final IncidentStatusHistoryRepository historyRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           EmergencyCategoryRepository categoryRepository,
                           CampusLocationRepository locationRepository,
                           EmergencyReportRepository emergencyRepository,
                           IncidentAssignmentRepository assignmentRepository,
                           IncidentStatusHistoryRepository historyRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.emergencyRepository = emergencyRepository;
        this.assignmentRepository = assignmentRepository;
        this.historyRepository = historyRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Checking and seeding default database records if necessary...");
        seedCategories();
        seedLocations();
        seedUsers();
        seedSampleEmergencies();
        logger.info("Database initialization check complete!");
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new EmergencyCategory("Medical Emergency", "Sudden illness, fainting, cardiac events, trauma", "HeartPulse", Severity.CRITICAL));
            categoryRepository.save(new EmergencyCategory("Fire Accident", "Active fire, smoke detection, burning smell, gas leak", "Flame", Severity.CRITICAL));
            categoryRepository.save(new EmergencyCategory("Harassment", "Verbal abuse, intimidation, stalking, gender harassment", "ShieldAlert", Severity.HIGH));
            categoryRepository.save(new EmergencyCategory("Physical Violence", "Assault, brawl, active fights, weapon possession", "AlertOctagon", Severity.CRITICAL));
            categoryRepository.save(new EmergencyCategory("Theft", "Stolen lab equipment, laptops, personal belongings", "Lock", Severity.MEDIUM));
            categoryRepository.save(new EmergencyCategory("Suspicious Activity", "Unidentified intruders, unattended luggage, trespassing", "Eye", Severity.MEDIUM));
            categoryRepository.save(new EmergencyCategory("Electrical Hazard", "Sparking wires, power transformer failure, exposed live cables", "Zap", Severity.HIGH));
            categoryRepository.save(new EmergencyCategory("Infrastructure Damage", "Elevator failure, ceiling collapse, water pipe rupture", "Building", Severity.HIGH));
            categoryRepository.save(new EmergencyCategory("Other Emergencies", "Weather hazards, chemical spills, animal intrusion", "HelpCircle", Severity.MEDIUM));
            logger.info("Seeded 9 default emergency categories");
        }
    }

    private void seedLocations() {
        if (locationRepository.count() == 0) {
            locationRepository.save(new CampusLocation("Main Academic Block (Block A)", "Primary lecture halls, central atrium, Dean offices", new BigDecimal("12.9715987"), new BigDecimal("77.5945627"), "Academic Zone"));
            locationRepository.save(new CampusLocation("Engineering & Technology Wing (Block B)", "Computer science labs, robotics workshop, electronics lab", new BigDecimal("12.9721000"), new BigDecimal("77.5952000"), "Academic Zone"));
            locationRepository.save(new CampusLocation("Science & Research Complex (Block C)", "Chemistry labs, bio-research center, physics observatory", new BigDecimal("12.9728000"), new BigDecimal("77.5948000"), "Research Zone"));
            locationRepository.save(new CampusLocation("Central Library & Digital Commons", "Ground floor reference, 2nd floor silent study, 3rd floor archives", new BigDecimal("12.9712000"), new BigDecimal("77.5939000"), "Academic Zone"));
            locationRepository.save(new CampusLocation("Campus Health & Wellness Center", "Emergency medical triage, pharmacy, ambulance bay", new BigDecimal("12.9708000"), new BigDecimal("77.5958000"), "Medical Zone"));
            locationRepository.save(new CampusLocation("Boys Hostel Block 1 & 2", "Student residence, dining mess, common recreation hall", new BigDecimal("12.9735000"), new BigDecimal("77.5965000"), "Residential Zone"));
            locationRepository.save(new CampusLocation("Girls Hostel Block A & B", "Student residence, 24/7 security booth, visitor lounge", new BigDecimal("12.9739000"), new BigDecimal("77.5959000"), "Residential Zone"));
            locationRepository.save(new CampusLocation("Student Activity Center (SAC)", "Cafeteria, student union hall, indoor auditorium", new BigDecimal("12.9705000"), new BigDecimal("77.5941000"), "Student Life Zone"));
            locationRepository.save(new CampusLocation("Campus Security Command & Gate 1", "Main security dispatch office, vehicle checkpoint, CCTV room", new BigDecimal("12.9698000"), new BigDecimal("77.5935000"), "Security Zone"));
            locationRepository.save(new CampusLocation("Sports Complex & Athletic Stadium", "Olympic swimming pool, gymnasium, open football arena", new BigDecimal("12.9742000"), new BigDecimal("77.5932000"), "Athletics Zone"));
            logger.info("Seeded 10 default campus locations");
        }
    }

    private void seedUsers() {
        createOrUpdateUser("Chief Security Administrator", "admin@campus.edu", "Admin@123", "+1-555-0100", Role.ADMIN, "Campus Safety & Administration");
        createOrUpdateUser("Officer John Miller", "officer.john@campus.edu", "Officer@123", "+1-555-0101", Role.SECURITY, "Rapid Response Unit 1");
        createOrUpdateUser("Officer Sarah Connor", "officer.sarah@campus.edu", "Officer@123", "+1-555-0102", Role.SECURITY, "Medical & Fire Response Unit");
        createOrUpdateUser("Alex Rivera", "student.alex@campus.edu", "Student@123", "+1-555-0103", Role.STUDENT, "Computer Science & Engineering");
        createOrUpdateUser("Dr. Rajesh Sharma", "faculty.drsharma@campus.edu", "Faculty@123", "+1-555-0104", Role.FACULTY, "Department of Physics");
    }

    private void createOrUpdateUser(String name, String email, String plainPassword, String phone, Role role, String department) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User(name, email, passwordEncoder.encode(plainPassword), phone, role, department);
            userRepository.save(user);
            logger.info("Created default user: {} ({})", email, role);
        } else {
            // Ensure password matches the encoded standard password
            user.setPassword(passwordEncoder.encode(plainPassword));
            user.setActive(true);
            userRepository.save(user);
        }
    }

    private void seedSampleEmergencies() {
        if (emergencyRepository.count() == 0) {
            User student = userRepository.findByEmail("student.alex@campus.edu").orElse(null);
            User faculty = userRepository.findByEmail("faculty.drsharma@campus.edu").orElse(null);
            User admin = userRepository.findByEmail("admin@campus.edu").orElse(null);
            User officerSarah = userRepository.findByEmail("officer.sarah@campus.edu").orElse(null);
            User officerJohn = userRepository.findByEmail("officer.john@campus.edu").orElse(null);

            EmergencyCategory fireCat = categoryRepository.findByName("Fire Accident").orElse(null);
            EmergencyCategory medCat = categoryRepository.findByName("Medical Emergency").orElse(null);
            EmergencyCategory elecCat = categoryRepository.findByName("Electrical Hazard").orElse(null);
            EmergencyCategory suspCat = categoryRepository.findByName("Suspicious Activity").orElse(null);
            EmergencyCategory harassCat = categoryRepository.findByName("Harassment").orElse(null);

            CampusLocation scienceLoc = locationRepository.findByBuildingName("Science & Research Complex (Block C)").orElse(null);
            CampusLocation sportsLoc = locationRepository.findByBuildingName("Sports Complex & Athletic Stadium").orElse(null);
            CampusLocation engLoc = locationRepository.findByBuildingName("Engineering & Technology Wing (Block B)").orElse(null);
            CampusLocation libLoc = locationRepository.findByBuildingName("Central Library & Digital Commons").orElse(null);
            CampusLocation hostelLoc = locationRepository.findByBuildingName("Girls Hostel Block A & B").orElse(null);

            if (student != null && fireCat != null && scienceLoc != null && admin != null && officerSarah != null) {
                // Report 1: Resolved Fire
                EmergencyReport r1 = new EmergencyReport();
                r1.setIncidentNumber("INC-2026-0001");
                r1.setTitle("Severe smoke detected from Chemistry Lab 3");
                r1.setDescription("Dense smoke billowing from solvent storage cabinet, chemical alarm sounding, students evacuated.");
                r1.setCategory(fireCat);
                r1.setLocation(scienceLoc);
                r1.setSpecificLocation("Floor 2, Lab 302");
                r1.setReportedBy(faculty != null ? faculty : student);
                r1.setSeverity(Severity.CRITICAL);
                r1.setStatus(IncidentStatus.RESOLVED);
                r1.setResolutionSummary("Fire suppressed with dry chemical extinguisher. Room ventilated and sealed for safety assessment. No casualties reported.");
                r1.setResolvedAt(LocalDateTime.now().minusHours(2));
                r1 = emergencyRepository.save(r1);

                IncidentAssignment a1 = new IncidentAssignment(r1, officerSarah, admin, "Dispatched HAZMAT response and fire marshal.");
                a1.setAcknowledgedAt(LocalDateTime.now().minusHours(4));
                assignmentRepository.save(a1);

                // Report 2: Resolved Medical
                EmergencyReport r2 = new EmergencyReport();
                r2.setIncidentNumber("INC-2026-0002");
                r2.setTitle("Student collapsed during basketball practice");
                r2.setDescription("Student experienced heat exhaustion and lost consciousness on the indoor court. First aid administered.");
                r2.setCategory(medCat);
                r2.setLocation(sportsLoc != null ? sportsLoc : scienceLoc);
                r2.setSpecificLocation("Indoor Court 1");
                r2.setReportedBy(student);
                r2.setSeverity(Severity.CRITICAL);
                r2.setStatus(IncidentStatus.RESOLVED);
                r2.setSos(true);
                r2.setResolutionSummary("Campus medical team arrived in 4 minutes. Patient stabilized and transferred to Campus Health Center for IV hydration.");
                r2.setResolvedAt(LocalDateTime.now().minusHours(1));
                r2 = emergencyRepository.save(r2);

                IncidentAssignment a2 = new IncidentAssignment(r2, officerSarah, admin, "Paramedic dispatched with defibrillator kit.");
                a2.setAcknowledgedAt(LocalDateTime.now().minusHours(2));
                assignmentRepository.save(a2);

                // Report 3: In Progress Electrical
                EmergencyReport r3 = new EmergencyReport();
                r3.setIncidentNumber("INC-2026-0003");
                r3.setTitle("Exposed live wiring sparking near elevator entrance");
                r3.setDescription("Electrical conduits damaged by water seepage; visible sparks every few minutes. Cordone needed urgently.");
                r3.setCategory(elecCat != null ? elecCat : fireCat);
                r3.setLocation(engLoc != null ? engLoc : scienceLoc);
                r3.setSpecificLocation("Ground Floor, North Elevator");
                r3.setReportedBy(student);
                r3.setSeverity(Severity.HIGH);
                r3.setStatus(IncidentStatus.IN_PROGRESS);
                r3 = emergencyRepository.save(r3);

                if (officerJohn != null) {
                    IncidentAssignment a3 = new IncidentAssignment(r3, officerJohn, admin, "Safety zone established. Electrician team on-site isolating circuit breaker.");
                    a3.setAcknowledgedAt(LocalDateTime.now().minusMinutes(40));
                    assignmentRepository.save(a3);
                }

                // Report 4: Assigned Suspicious Activity
                EmergencyReport r4 = new EmergencyReport();
                r4.setIncidentNumber("INC-2026-0004");
                r4.setTitle("Unattended backpack in central library reading hall");
                r4.setDescription("Black backpack left unattended for over 3 hours near cubicle 14, ticking device or phone suspected.");
                r4.setCategory(suspCat != null ? suspCat : fireCat);
                r4.setLocation(libLoc != null ? libLoc : scienceLoc);
                r4.setSpecificLocation("2nd Floor, Silent Commons");
                r4.setReportedBy(faculty != null ? faculty : student);
                r4.setSeverity(Severity.MEDIUM);
                r4.setStatus(IncidentStatus.ASSIGNED);
                r4 = emergencyRepository.save(r4);

                if (officerJohn != null) {
                    IncidentAssignment a4 = new IncidentAssignment(r4, officerJohn, admin, "Investigating bag contents and reviewing CCTV logs.");
                    assignmentRepository.save(a4);
                }

                // Report 5: Reported SOS Harassment
                EmergencyReport r5 = new EmergencyReport();
                r5.setIncidentNumber("INC-2026-0005");
                r5.setTitle("SOS Alert: Suspicious individual stalking outside hostel");
                r5.setDescription("Individual without student ID roaming around the perimeter fence and attempting to enter rear staircase.");
                r5.setCategory(harassCat != null ? harassCat : fireCat);
                r5.setLocation(hostelLoc != null ? hostelLoc : scienceLoc);
                r5.setSpecificLocation("Rear Gate, Girls Hostel Block A");
                r5.setReportedBy(student);
                r5.setSeverity(Severity.HIGH);
                r5.setStatus(IncidentStatus.REPORTED);
                r5.setSos(true);
                r5 = emergencyRepository.save(r5);

                logger.info("Seeded 5 sample emergency reports with multiple statuses");
            }
        }
    }
}
