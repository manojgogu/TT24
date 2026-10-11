package com.campus.emergency.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentRequest {

    @NotNull(message = "Responder ID is required")
    private Long responderId;

    private String notes;

    public AssignmentRequest() {}

    public AssignmentRequest(Long responderId, String notes) {
        this.responderId = responderId;
        this.notes = notes;
    }

    public Long getResponderId() { return responderId; }
    public void setResponderId(Long responderId) { this.responderId = responderId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
