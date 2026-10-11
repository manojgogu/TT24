package com.campus.emergency.repository;

import com.campus.emergency.entity.EmergencyReport;
import com.campus.emergency.entity.IncidentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentStatusHistoryRepository extends JpaRepository<IncidentStatusHistory, Long> {
    List<IncidentStatusHistory> findByEmergencyOrderByTimestampAsc(EmergencyReport emergency);
}
