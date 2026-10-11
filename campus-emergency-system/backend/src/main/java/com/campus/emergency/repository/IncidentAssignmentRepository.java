package com.campus.emergency.repository;

import com.campus.emergency.entity.EmergencyReport;
import com.campus.emergency.entity.IncidentAssignment;
import com.campus.emergency.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentAssignmentRepository extends JpaRepository<IncidentAssignment, Long> {
    List<IncidentAssignment> findByEmergency(EmergencyReport emergency);
    Optional<IncidentAssignment> findFirstByEmergencyOrderByAssignedAtDesc(EmergencyReport emergency);
    List<IncidentAssignment> findByResponderOrderByAssignedAtDesc(User responder);
    long countByResponder(User responder);
}
