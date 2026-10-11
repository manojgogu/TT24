package com.campus.emergency.repository;

import com.campus.emergency.entity.EmergencyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyCategoryRepository extends JpaRepository<EmergencyCategory, Long> {
    Optional<EmergencyCategory> findByName(String name);
    List<EmergencyCategory> findByActiveTrue();
    boolean existsByName(String name);
}
