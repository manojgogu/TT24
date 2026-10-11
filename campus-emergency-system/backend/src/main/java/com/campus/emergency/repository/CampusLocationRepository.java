package com.campus.emergency.repository;

import com.campus.emergency.entity.CampusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampusLocationRepository extends JpaRepository<CampusLocation, Long> {
    Optional<CampusLocation> findByBuildingName(String buildingName);
    List<CampusLocation> findByActiveTrue();
    boolean existsByBuildingName(String buildingName);
}
