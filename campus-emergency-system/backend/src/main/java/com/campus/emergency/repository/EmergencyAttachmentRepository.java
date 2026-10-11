package com.campus.emergency.repository;

import com.campus.emergency.entity.EmergencyAttachment;
import com.campus.emergency.entity.EmergencyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyAttachmentRepository extends JpaRepository<EmergencyAttachment, Long> {
    List<EmergencyAttachment> findByEmergency(EmergencyReport emergency);
}
