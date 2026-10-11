package com.campus.emergency.dto;

import com.campus.emergency.entity.Notification;
import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private Long emergencyId;
    private String emergencyIncidentNumber;
    private String message;
    private String type;
    private boolean readStatus;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public NotificationDto(Notification n) {
        if (n != null) {
            this.id = n.getId();
            if (n.getEmergency() != null) {
                this.emergencyId = n.getEmergency().getId();
                this.emergencyIncidentNumber = n.getEmergency().getIncidentNumber();
            }
            this.message = n.getMessage();
            this.type = n.getType();
            this.readStatus = n.isReadStatus();
            this.createdAt = n.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmergencyId() { return emergencyId; }
    public void setEmergencyId(Long emergencyId) { this.emergencyId = emergencyId; }

    public String getEmergencyIncidentNumber() { return emergencyIncidentNumber; }
    public void setEmergencyIncidentNumber(String emergencyIncidentNumber) { this.emergencyIncidentNumber = emergencyIncidentNumber; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isReadStatus() { return readStatus; }
    public void setReadStatus(boolean readStatus) { this.readStatus = readStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
