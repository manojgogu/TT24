package com.campus.emergency.controller;

import com.campus.emergency.dto.*;
import com.campus.emergency.enums.IncidentStatus;
import com.campus.emergency.enums.Severity;
import com.campus.emergency.service.EmergencyService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmergencyDto>> reportEmergency(@Valid @RequestBody EmergencyCreateRequest request) {
        EmergencyDto created = emergencyService.reportEmergency(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Emergency report logged successfully with incident number " + created.getIncidentNumber(), created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getAllEmergencies(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<EmergencyDto> list = emergencyService.getAllEmergencies(status, severity, categoryId, locationId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getMyReports() {
        List<EmergencyDto> list = emergencyService.getMyReports();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<EmergencyDto>>> getAssignedToMe(
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<EmergencyDto> list = emergencyService.getAssignedToMe(activeOnly);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmergencyDto>> getEmergencyById(@PathVariable Long id) {
        EmergencyDto report = emergencyService.getEmergencyById(id);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<EmergencyDto>> assignEmergency(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request) {
        EmergencyDto updated = emergencyService.assignEmergency(id, request);
        return ResponseEntity.ok(ApiResponse.success("Responder assigned successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EmergencyDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        EmergencyDto updated = emergencyService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Incident status updated to " + updated.getStatus(), updated));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<EmergencyDto>> resolveEmergency(
            @PathVariable Long id,
            @Valid @RequestBody ResolutionRequest request) {
        EmergencyDto resolved = emergencyService.resolveEmergency(id, request);
        return ResponseEntity.ok(ApiResponse.success("Incident successfully resolved", resolved));
    }

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EmergencyDto>> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        EmergencyDto updated = emergencyService.attachFile(id, file);
        return ResponseEntity.ok(ApiResponse.success("Attachment uploaded successfully", updated));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<IncidentStatusHistoryDto>>> getIncidentHistory(@PathVariable Long id) {
        List<IncidentStatusHistoryDto> history = emergencyService.getIncidentHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
