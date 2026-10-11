package com.campus.emergency.dto;

import com.campus.emergency.enums.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "New status is required")
    private IncidentStatus status;

    private String remarks;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(IncidentStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
