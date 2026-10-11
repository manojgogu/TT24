package com.campus.emergency.dto;

import com.campus.emergency.entity.EmergencyAttachment;
import com.campus.emergency.entity.EmergencyReport;
import com.campus.emergency.entity.IncidentAssignment;
import com.campus.emergency.enums.IncidentStatus;
import com.campus.emergency.enums.Severity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EmergencyDto {
    private Long id;
    private String incidentNumber;
    private String title;
    private String description;
    private CategoryDto category;
    private LocationDto location;
    private String specificLocation;
    private UserDto reportedBy;
    private Severity severity;
    private IncidentStatus status;
    private boolean isSos;
    private String resolutionSummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private UserDto assignedResponder;
    private List<AttachmentDto> attachments = new ArrayList<>();
    private List<IncidentAssignmentDto> assignments = new ArrayList<>();

    public EmergencyDto() {}

    public EmergencyDto(EmergencyReport report) {
        if (report != null) {
            this.id = report.getId();
            this.incidentNumber = report.getIncidentNumber();
            this.title = report.getTitle();
            this.description = report.getDescription();
            this.category = new CategoryDto(report.getCategory());
            this.location = new LocationDto(report.getLocation());
            this.specificLocation = report.getSpecificLocation();
            this.reportedBy = new UserDto(report.getReportedBy());
            this.severity = report.getSeverity();
            this.status = report.getStatus();
            this.isSos = report.isSos();
            this.resolutionSummary = report.getResolutionSummary();
            this.createdAt = report.getCreatedAt();
            this.updatedAt = report.getUpdatedAt();
            this.resolvedAt = report.getResolvedAt();

            if (report.getAssignments() != null && !report.getAssignments().isEmpty()) {
                this.assignments = report.getAssignments().stream()
                        .map(IncidentAssignmentDto::new)
                        .collect(Collectors.toList());
                // Latest responder
                IncidentAssignment latest = report.getAssignments().get(report.getAssignments().size() - 1);
                if (latest != null && latest.getResponder() != null) {
                    this.assignedResponder = new UserDto(latest.getResponder());
                }
            }

            if (report.getAttachments() != null && !report.getAttachments().isEmpty()) {
                this.attachments = report.getAttachments().stream()
                        .map(AttachmentDto::new)
                        .collect(Collectors.toList());
            }
        }
    }

    public static class AttachmentDto {
        private Long id;
        private String fileName;
        private String filePath;
        private String fileType;
        private Long fileSize;
        private LocalDateTime uploadedAt;

        public AttachmentDto() {}
        public AttachmentDto(EmergencyAttachment a) {
            if (a != null) {
                this.id = a.getId();
                this.fileName = a.getFileName();
                this.filePath = a.getFilePath();
                this.fileType = a.getFileType();
                this.fileSize = a.getFileSize();
                this.uploadedAt = a.getUploadedAt();
            }
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        public LocalDateTime getUploadedAt() { return uploadedAt; }
        public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIncidentNumber() { return incidentNumber; }
    public void setIncidentNumber(String incidentNumber) { this.incidentNumber = incidentNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CategoryDto getCategory() { return category; }
    public void setCategory(CategoryDto category) { this.category = category; }

    public LocationDto getLocation() { return location; }
    public void setLocation(LocationDto location) { this.location = location; }

    public String getSpecificLocation() { return specificLocation; }
    public void setSpecificLocation(String specificLocation) { this.specificLocation = specificLocation; }

    public UserDto getReportedBy() { return reportedBy; }
    public void setReportedBy(UserDto reportedBy) { this.reportedBy = reportedBy; }

    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }

    public boolean isSos() { return isSos; }
    public void setSos(boolean sos) { isSos = sos; }

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public UserDto getAssignedResponder() { return assignedResponder; }
    public void setAssignedResponder(UserDto assignedResponder) { this.assignedResponder = assignedResponder; }

    public List<AttachmentDto> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentDto> attachments) { this.attachments = attachments; }

    public List<IncidentAssignmentDto> getAssignments() { return assignments; }
    public void setAssignments(List<IncidentAssignmentDto> assignments) { this.assignments = assignments; }
}
