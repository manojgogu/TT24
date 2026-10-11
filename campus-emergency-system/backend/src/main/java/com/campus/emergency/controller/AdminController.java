package com.campus.emergency.controller;

import com.campus.emergency.dto.*;
import com.campus.emergency.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAnalytics() {
        AnalyticsDto analytics = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/responders")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllResponders() {
        List<UserDto> responders = adminService.getAllResponders();
        return ResponseEntity.ok(ApiResponse.success(responders));
    }

    @PostMapping("/responders")
    public ResponseEntity<ApiResponse<UserDto>> createResponder(@Valid @RequestBody ResponderCreateRequest request) {
        UserDto responder = adminService.createResponder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Responder account created successfully", responder));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        UserDto updated = adminService.updateUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @GetMapping(value = "/reports/export", produces = "text/csv")
    public ResponseEntity<String> exportReportsCsv() {
        String csvData = adminService.generateCsvReport();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"campus_emergency_reports.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
