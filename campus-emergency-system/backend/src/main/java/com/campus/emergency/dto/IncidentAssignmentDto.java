package com.campus.emergency.dto;

import com.campus.emergency.entity.IncidentAssignment;
import java.time.LocalDateTime;

public class IncidentAssignmentDto {
    private Long id;
    private UserDto responder;
    private UserDto assignedBy;
    private LocalDateTime assignedAt;
    private LocalDateTime acknowledgedAt;
    private String notes;

    public IncidentAssignmentDto() {}

    public IncidentAssignmentDto(IncidentAssignment assignment) {
        if (assignment != null) {
            this.id = assignment.getId();
            this.responder = new UserDto(assignment.getResponder());
            this.assignedBy = new UserDto(assignment.getAssignedBy());
            this.assignedAt = assignment.getAssignedAt();
            this.acknowledgedAt = assignment.getAcknowledgedAt();
            this.notes = assignment.getNotes();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getResponder() { return responder; }
    public void setResponder(UserDto responder) { this.responder = responder; }

    public UserDto getAssignedBy() { return assignedBy; }
    public void setAssignedBy(UserDto assignedBy) { this.assignedBy = assignedBy; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
