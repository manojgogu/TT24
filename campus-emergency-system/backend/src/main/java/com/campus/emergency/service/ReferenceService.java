package com.campus.emergency.service;

import com.campus.emergency.dto.CategoryDto;
import com.campus.emergency.dto.LocationDto;
import com.campus.emergency.entity.CampusLocation;
import com.campus.emergency.entity.EmergencyCategory;
import com.campus.emergency.exception.BadRequestException;
import com.campus.emergency.exception.ResourceNotFoundException;
import com.campus.emergency.repository.CampusLocationRepository;
import com.campus.emergency.repository.EmergencyCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReferenceService {

    private final EmergencyCategoryRepository categoryRepository;
    private final CampusLocationRepository locationRepository;

    public ReferenceService(EmergencyCategoryRepository categoryRepository,
                            CampusLocationRepository locationRepository) {
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(CategoryDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }
        EmergencyCategory category = new EmergencyCategory(
                dto.getName(),
                dto.getDescription(),
                dto.getIcon() != null ? dto.getIcon() : "AlertTriangle",
                dto.getDefaultSeverity()
        );
        category = categoryRepository.save(category);
        return new CategoryDto(category);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        EmergencyCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getIcon() != null) category.setIcon(dto.getIcon());
        if (dto.getDefaultSeverity() != null) category.setDefaultSeverity(dto.getDefaultSeverity());
        category.setActive(dto.isActive());
        category = categoryRepository.save(category);
        return new CategoryDto(category);
    }

    @Transactional(readOnly = true)
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll()
                .stream()
                .map(LocationDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LocationDto> getActiveLocations() {
        return locationRepository.findByActiveTrue()
                .stream()
                .map(LocationDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public LocationDto createLocation(LocationDto dto) {
        if (locationRepository.existsByBuildingName(dto.getBuildingName())) {
            throw new BadRequestException("Campus location '" + dto.getBuildingName() + "' already exists");
        }
        CampusLocation location = new CampusLocation(
                dto.getBuildingName(),
                dto.getLocationDescription(),
                dto.getLatitude(),
                dto.getLongitude(),
                dto.getZone() != null ? dto.getZone() : "Main Campus"
        );
        location = locationRepository.save(location);
        return new LocationDto(location);
    }

    @Transactional
    public LocationDto updateLocation(Long id, LocationDto dto) {
        CampusLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        location.setBuildingName(dto.getBuildingName());
        location.setLocationDescription(dto.getLocationDescription());
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());
        if (dto.getZone() != null) location.setZone(dto.getZone());
        location.setActive(dto.isActive());
        location = locationRepository.save(location);
        return new LocationDto(location);
    }
}
