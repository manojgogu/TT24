package com.campus.emergency;

import com.campus.emergency.enums.IncidentStatus;
import com.campus.emergency.enums.Role;
import com.campus.emergency.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class CampusEmergencyApplicationTests {

    @Test
    @DisplayName("Verify incident status state machine valid transitions")
    void testIncidentStatusStateTransitions() {
        // REPORTED transitions
        assertTrue(IncidentStatus.REPORTED.canTransitionTo(IncidentStatus.ASSIGNED));
        assertTrue(IncidentStatus.REPORTED.canTransitionTo(IncidentStatus.CANCELLED));
        assertFalse(IncidentStatus.REPORTED.canTransitionTo(IncidentStatus.RESOLVED));

        // ASSIGNED transitions
        assertTrue(IncidentStatus.ASSIGNED.canTransitionTo(IncidentStatus.ACKNOWLEDGED));
        assertTrue(IncidentStatus.ASSIGNED.canTransitionTo(IncidentStatus.IN_PROGRESS));
        assertFalse(IncidentStatus.ASSIGNED.canTransitionTo(IncidentStatus.REPORTED));

        // ACKNOWLEDGED transitions
        assertTrue(IncidentStatus.ACKNOWLEDGED.canTransitionTo(IncidentStatus.IN_PROGRESS));
        assertFalse(IncidentStatus.ACKNOWLEDGED.canTransitionTo(IncidentStatus.RESOLVED));

        // IN_PROGRESS transitions
        assertTrue(IncidentStatus.IN_PROGRESS.canTransitionTo(IncidentStatus.RESOLVED));
        assertFalse(IncidentStatus.IN_PROGRESS.canTransitionTo(IncidentStatus.REPORTED));

        // RESOLVED is terminal
        assertFalse(IncidentStatus.RESOLVED.canTransitionTo(IncidentStatus.REPORTED));
        assertFalse(IncidentStatus.RESOLVED.canTransitionTo(IncidentStatus.IN_PROGRESS));
        assertFalse(IncidentStatus.RESOLVED.canTransitionTo(IncidentStatus.ASSIGNED));

        // CANCELLED is terminal
        assertFalse(IncidentStatus.CANCELLED.canTransitionTo(IncidentStatus.REPORTED));
    }

    @Test
    @DisplayName("Verify BCrypt password encoding correctness")
    void testPasswordEncoder() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Admin@123";
        String encoded = encoder.encode(rawPassword);

        assertNotNull(encoded);
        assertTrue(encoder.matches(rawPassword, encoded));
        assertFalse(encoder.matches("WrongPassword", encoded));
    }

    @Test
    @DisplayName("Verify JWT token generation and claims parsing")
    void testJwtTokenProvider() {
        String secret = "CampusEmergencySecureJwtSecretKeyMustBeAtLeast256BitsLongForHS256Algorithm";
        long expiry = 3600000; // 1 hour
        JwtTokenProvider tokenProvider = new JwtTokenProvider(secret, expiry);

        String token = tokenProvider.generateTokenFromUser(1L, "student.alex@campus.edu", "Alex Rivera", Role.STUDENT.name());
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));

        String email = tokenProvider.getEmailFromToken(token);
        assertEquals("student.alex@campus.edu", email);

        assertFalse(tokenProvider.validateToken("invalid.token.here"));
    }
}
