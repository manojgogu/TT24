package com.campus.emergency.controller;

import com.campus.emergency.dto.ApiResponse;
import com.campus.emergency.dto.LocationDto;
import com.campus.emergency.service.ReferenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final ReferenceService referenceService;

    public LocationController(ReferenceService referenceService) {
        this.referenceService = referenceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationDto>>> getActiveLocations() {
        return ResponseEntity.ok(ApiResponse.success(referenceService.getActiveLocations()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LocationDto>>> getAllLocations() {
        return ResponseEntity.ok(ApiResponse.success(referenceService.getAllLocations()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LocationDto>> createLocation(@RequestBody LocationDto dto) {
        LocationDto created = referenceService.createLocation(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Location created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LocationDto>> updateLocation(@PathVariable Long id, @RequestBody LocationDto dto) {
        LocationDto updated = referenceService.updateLocation(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Location updated successfully", updated));
    }
}
