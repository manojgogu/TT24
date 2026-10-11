package com.campus.emergency.dto;

import com.campus.emergency.entity.IncidentStatusHistory;
import com.campus.emergency.enums.IncidentStatus;
import java.time.LocalDateTime;

public class IncidentStatusHistoryDto {
    private Long id;
    private UserDto updatedBy;
    private IncidentStatus previousStatus;
    private IncidentStatus newStatus;
    private String remarks;
    private LocalDateTime timestamp;

    public IncidentStatusHistoryDto() {}

    public IncidentStatusHistoryDto(IncidentStatusHistory history) {
        if (history != null) {
            this.id = history.getId();
            this.updatedBy = new UserDto(history.getUpdatedBy());
            this.previousStatus = history.getPreviousStatus();
            this.newStatus = history.getNewStatus();
            this.remarks = history.getRemarks();
            this.timestamp = history.getTimestamp();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UserDto updatedBy) { this.updatedBy = updatedBy; }

    public IncidentStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(IncidentStatus previousStatus) { this.previousStatus = previousStatus; }

    public IncidentStatus getNewStatus() { return newStatus; }
    public void setNewStatus(IncidentStatus newStatus) { this.newStatus = newStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
