package com.campus.emergency.repository;

import com.campus.emergency.entity.EmergencyReport;
import com.campus.emergency.entity.User;
import com.campus.emergency.enums.IncidentStatus;
import com.campus.emergency.enums.Severity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyReportRepository extends JpaRepository<EmergencyReport, Long> {

    Optional<EmergencyReport> findByIncidentNumber(String incidentNumber);

    List<EmergencyReport> findByReportedByOrderByCreatedAtDesc(User reportedBy);

    @Query("SELECT r FROM EmergencyReport r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:severity IS NULL OR r.severity = :severity) AND " +
           "(:categoryId IS NULL OR r.category.id = :categoryId) AND " +
           "(:locationId IS NULL OR r.location.id = :locationId) AND " +
           "(:startDate IS NULL OR r.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR r.createdAt <= :endDate) " +
           "ORDER BY r.createdAt DESC")
    List<EmergencyReport> findFiltered(
            @Param("status") IncidentStatus status,
            @Param("severity") Severity severity,
            @Param("categoryId") Long categoryId,
            @Param("locationId") Long locationId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT r FROM EmergencyReport r JOIN r.assignments a WHERE a.responder = :responder ORDER BY r.createdAt DESC")
    List<EmergencyReport> findByAssignedResponder(@Param("responder") User responder);

    @Query("SELECT r FROM EmergencyReport r JOIN r.assignments a WHERE a.responder = :responder AND r.status NOT IN ('RESOLVED', 'CANCELLED') ORDER BY r.createdAt DESC")
    List<EmergencyReport> findActiveByAssignedResponder(@Param("responder") User responder);

    long countByStatus(IncidentStatus status);

    long countBySeverity(Severity severity);

    @Query("SELECT r.category.name, COUNT(r) FROM EmergencyReport r GROUP BY r.category.name")
    List<Object[]> countByCategoryGroup();

    @Query("SELECT r.status, COUNT(r) FROM EmergencyReport r GROUP BY r.status")
    List<Object[]> countByStatusGroup();

    @Query("SELECT r.severity, COUNT(r) FROM EmergencyReport r GROUP BY r.severity")
    List<Object[]> countBySeverityGroup();

    @Query("SELECT r.location.buildingName, COUNT(r) FROM EmergencyReport r GROUP BY r.location.buildingName")
    List<Object[]> countByLocationGroup();

    @Query("SELECT FUNCTION('DATE_FORMAT', r.createdAt, '%Y-%m'), COUNT(r) FROM EmergencyReport r GROUP BY FUNCTION('DATE_FORMAT', r.createdAt, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', r.createdAt, '%Y-%m') ASC")
    List<Object[]> countByMonthGroup();

    @Query("SELECT r FROM EmergencyReport r WHERE r.status = 'REPORTED' ORDER BY r.createdAt DESC")
    List<EmergencyReport> findNewIncidents();
}
