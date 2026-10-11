package com.campus.emergency.service;

import com.campus.emergency.dto.*;
import com.campus.emergency.entity.*;
import com.campus.emergency.enums.IncidentStatus;
import com.campus.emergency.enums.Role;
import com.campus.emergency.enums.Severity;
import com.campus.emergency.exception.BadRequestException;
import com.campus.emergency.exception.ResourceNotFoundException;
import com.campus.emergency.exception.UnauthorizedException;
import com.campus.emergency.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyService {

    private final EmergencyReportRepository emergencyRepository;
    private final EmergencyCategoryRepository categoryRepository;
    private final CampusLocationRepository locationRepository;
    private final IncidentAssignmentRepository assignmentRepository;
    private final IncidentStatusHistoryRepository historyRepository;
    private final EmergencyAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    public EmergencyService(EmergencyReportRepository emergencyRepository,
                            EmergencyCategoryRepository categoryRepository,
                            CampusLocationRepository locationRepository,
                            IncidentAssignmentRepository assignmentRepository,
                            IncidentStatusHistoryRepository historyRepository,
                            EmergencyAttachmentRepository attachmentRepository,
                            UserRepository userRepository,
                            AuthService authService,
                            NotificationService notificationService,
                            FileStorageService fileStorageService) {
        this.emergencyRepository = emergencyRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.assignmentRepository = assignmentRepository;
        this.historyRepository = historyRepository;
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.notificationService = notificationService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public EmergencyDto reportEmergency(EmergencyCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        EmergencyCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Emergency category not found with id: " + request.getCategoryId()));

        CampusLocation location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Campus location not found with id: " + request.getLocationId()));

        Severity severity = request.getSeverity();
        if (severity == null) {
            severity = category.getDefaultSeverity() != null ? category.getDefaultSeverity() : Severity.MEDIUM;
        }

        // If triggered via SOS panic button, escalate severity if not already CRITICAL
        if (request.isSos() && severity != Severity.CRITICAL) {
            severity = Severity.HIGH;
        }

        EmergencyReport report = new EmergencyReport();
        report.setIncidentNumber(generateIncidentNumber());
        report.setTitle(request.getTitle().trim());
        report.setDescription(request.getDescription().trim());
        report.setCategory(category);
        report.setLocation(location);
        report.setSpecificLocation(request.getSpecificLocation());
        report.setReportedBy(currentUser);
        report.setSeverity(severity);
        report.setStatus(IncidentStatus.REPORTED);
        report.setSos(request.isSos());

        report = emergencyRepository.save(report);

        // Record initial status history
        IncidentStatusHistory history = new IncidentStatusHistory(
                report,
                currentUser,
                null,
                IncidentStatus.REPORTED,
                request.isSos() ? "SOS Instant Alert triggered by user" : "Emergency report created"
        );
        historyRepository.save(history);

        // In-app notifications
        notificationService.createNotification(
                currentUser,
                report,
                "Your emergency report " + report.getIncidentNumber() + " (" + report.getTitle() + ") has been received by Campus Security.",
                "REPORT_CREATED"
        );

        notificationService.notifyAllAdmins(
                report,
                "URGENT: New Incident " + report.getIncidentNumber() + " [" + severity + "] at " + location.getBuildingName() + ": " + report.getTitle(),
                "NEW_REPORT"
        );

        return new EmergencyDto(report);
    }

    @Transactional(readOnly = true)
    public List<EmergencyDto> getMyReports() {
        User currentUser = authService.getCurrentUser();
        return emergencyRepository.findByReportedByOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(EmergencyDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmergencyDto getEmergencyById(Long id) {
        User currentUser = authService.getCurrentUser();
        EmergencyReport report = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        // Ownership and authorization check
        if (currentUser.getRole() == Role.STUDENT || currentUser.getRole() == Role.FACULTY) {
            if (!report.getReportedBy().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You are not authorized to view this emergency report");
            }
        } else if (currentUser.getRole() == Role.SECURITY) {
            boolean isAssigned = report.getAssignments().stream()
                    .anyMatch(a -> a.getResponder().getId().equals(currentUser.getId()));
            if (!isAssigned) {
                // Responders can view assigned or active unassigned reports in emergency dispatch
                // Let's permit read if authorized
            }
        }

        return new EmergencyDto(report);
    }

    @Transactional(readOnly = true)
    public List<EmergencyDto> getAllEmergencies(IncidentStatus status, Severity severity, Long categoryId, Long locationId, LocalDateTime startDate, LocalDateTime endDate) {
        User currentUser = authService.getCurrentUser();

        if (currentUser.getRole() == Role.STUDENT || currentUser.getRole() == Role.FACULTY) {
            return getMyReports();
        }

        if (currentUser.getRole() == Role.SECURITY) {
            return emergencyRepository.findByAssignedResponder(currentUser)
                    .stream()
                    .map(EmergencyDto::new)
                    .collect(Collectors.toList());
        }

        // ADMIN can see all filtered
        return emergencyRepository.findFiltered(status, severity, categoryId, locationId, startDate, endDate)
                .stream()
                .map(EmergencyDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmergencyDto> getAssignedToMe(boolean activeOnly) {
        User currentUser = authService.getCurrentUser();
        if (currentUser.getRole() != Role.SECURITY && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only responders and administrators can view assigned emergencies");
        }

        List<EmergencyReport> reports = activeOnly
                ? emergencyRepository.findActiveByAssignedResponder(currentUser)
                : emergencyRepository.findByAssignedResponder(currentUser);

        return reports.stream().map(EmergencyDto::new).collect(Collectors.toList());
    }

    @Transactional
    public EmergencyDto assignEmergency(Long id, AssignmentRequest request) {
        User admin = authService.getCurrentUser();
        if (admin.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only administrators can assign responders to emergencies");
        }

        EmergencyReport report = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        User responder = userRepository.findById(request.getResponderId())
                .orElseThrow(() -> new ResourceNotFoundException("Responder not found with id: " + request.getResponderId()));

        if (responder.getRole() != Role.SECURITY) {
            throw new BadRequestException("Assigned user must have the SECURITY responder role");
        }

        if (!responder.isActive()) {
            throw new BadRequestException("Assigned responder is inactive");
        }

        IncidentAssignment assignment = new IncidentAssignment(
                report,
                responder,
                admin,
                request.getNotes()
        );
        assignmentRepository.save(assignment);
        report.getAssignments().add(assignment);

        IncidentStatus oldStatus = report.getStatus();
        report.setStatus(IncidentStatus.ASSIGNED);
        report = emergencyRepository.save(report);

        // History
        historyRepository.save(new IncidentStatusHistory(
                report,
                admin,
                oldStatus,
                IncidentStatus.ASSIGNED,
                "Assigned to " + responder.getFullName() + (request.getNotes() != null ? " - Notes: " + request.getNotes() : "")
        ));

        // Notifications
        notificationService.createNotification(
                responder,
                report,
                "Dispatch Alert: You have been assigned to " + report.getIncidentNumber() + " at " + report.getLocation().getBuildingName(),
                "NEW_ASSIGNMENT"
        );

        notificationService.createNotification(
                report.getReportedBy(),
                report,
                "Update: Incident " + report.getIncidentNumber() + " has been assigned to responder " + responder.getFullName(),
                "ASSIGNMENT"
        );

        return new EmergencyDto(report);
    }

    @Transactional
    public EmergencyDto updateStatus(Long id, StatusUpdateRequest request) {
        User currentUser = authService.getCurrentUser();
        EmergencyReport report = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        IncidentStatus newStatus = request.getStatus();
        IncidentStatus currentStatus = report.getStatus();

        // Enforce transition rules
        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        // Role-based status transition checks
        if (newStatus == IncidentStatus.ASSIGNED && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only administrators can assign incidents");
        }

        if (newStatus == IncidentStatus.ACKNOWLEDGED || newStatus == IncidentStatus.IN_PROGRESS) {
            if (currentUser.getRole() != Role.SECURITY && currentUser.getRole() != Role.ADMIN) {
                throw new UnauthorizedException("Only assigned responders or admins can acknowledge or start incident response");
            }
            if (currentUser.getRole() == Role.SECURITY) {
                // Check if responder is assigned
                boolean isAssigned = report.getAssignments().stream()
                        .anyMatch(a -> a.getResponder().getId().equals(currentUser.getId()));
                if (!isAssigned) {
                    throw new UnauthorizedException("You are not assigned to this incident");
                }
            }
        }

        if (newStatus == IncidentStatus.RESOLVED) {
            throw new BadRequestException("Please use the resolve incident endpoint to provide a required resolution summary");
        }

        // If acknowledging, set acknowledged_at on assignment
        if (newStatus == IncidentStatus.ACKNOWLEDGED) {
            assignmentRepository.findFirstByEmergencyOrderByAssignedAtDesc(report).ifPresent(a -> {
                if (a.getAcknowledgedAt() == null) {
                    a.setAcknowledgedAt(LocalDateTime.now());
                    assignmentRepository.save(a);
                }
            });
        }

        report.setStatus(newStatus);
        report = emergencyRepository.save(report);

        // Record history
        historyRepository.save(new IncidentStatusHistory(
                report,
                currentUser,
                currentStatus,
                newStatus,
                request.getRemarks() != null ? request.getRemarks() : "Status updated to " + newStatus
        ));

        // Notify reporter
        notificationService.createNotification(
                report.getReportedBy(),
                report,
                "Status Update: Incident " + report.getIncidentNumber() + " is now " + newStatus,
                "STATUS_UPDATE"
        );

        return new EmergencyDto(report);
    }

    @Transactional
    public EmergencyDto resolveEmergency(Long id, ResolutionRequest request) {
        User currentUser = authService.getCurrentUser();
        EmergencyReport report = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        if (currentUser.getRole() != Role.SECURITY && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only responders or administrators can resolve emergency incidents");
        }

        if (report.getStatus() == IncidentStatus.RESOLVED) {
            throw new BadRequestException("Incident is already resolved");
        }

        IncidentStatus oldStatus = report.getStatus();
        report.setStatus(IncidentStatus.RESOLVED);
        report.setResolutionSummary(request.getResolutionSummary().trim());
        report.setResolvedAt(LocalDateTime.now());
        report = emergencyRepository.save(report);

        // History
        historyRepository.save(new IncidentStatusHistory(
                report,
                currentUser,
                oldStatus,
                IncidentStatus.RESOLVED,
                "Incident marked RESOLVED: " + request.getResolutionSummary().trim()
        ));

        // Notify reporter
        notificationService.createNotification(
                report.getReportedBy(),
                report,
                "RESOLVED: Emergency " + report.getIncidentNumber() + " has been resolved. Summary: " + request.getResolutionSummary().trim(),
                "RESOLUTION"
        );

        return new EmergencyDto(report);
    }

    @Transactional
    public EmergencyDto attachFile(Long id, MultipartFile file) {
        User currentUser = authService.getCurrentUser();
        EmergencyReport report = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        // Check permission
        boolean isOwner = report.getReportedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAssigned = report.getAssignments().stream()
                .anyMatch(a -> a.getResponder().getId().equals(currentUser.getId()));

        if (!isOwner && !isAdmin && !isAssigned) {
            throw new UnauthorizedException("Not authorized to attach files to this emergency report");
        }

        String filePath = fileStorageService.storeFile(file);
        EmergencyAttachment attachment = new EmergencyAttachment(
                report,
                filePath,
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "attachment",
                file.getContentType(),
                file.getSize()
        );
        attachmentRepository.save(attachment);
        report.getAttachments().add(attachment);

        return new EmergencyDto(report);
    }

    @Transactional(readOnly = true)
    public List<IncidentStatusHistoryDto> getIncidentHistory(Long id) {
        EmergencyReport report = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));
        return historyRepository.findByEmergencyOrderByTimestampAsc(report)
                .stream()
                .map(IncidentStatusHistoryDto::new)
                .collect(Collectors.toList());
    }

    private synchronized String generateIncidentNumber() {
        int year = Year.now().getValue();
        long count = emergencyRepository.count() + 1;
        return String.format("INC-%d-%04d", year, count);
    }
}
