package com.campus.emergency.entity;

import com.campus.emergency.enums.IncidentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_status_history")
public class IncidentStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emergency_id", nullable = false)
    private EmergencyReport emergency;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 30)
    private IncidentStatus previousStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private IncidentStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public IncidentStatusHistory() {}

    public IncidentStatusHistory(EmergencyReport emergency, User updatedBy, IncidentStatus previousStatus, IncidentStatus newStatus, String remarks) {
        this.emergency = emergency;
        this.updatedBy = updatedBy;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EmergencyReport getEmergency() { return emergency; }
    public void setEmergency(EmergencyReport emergency) { this.emergency = emergency; }

    public User getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(User updatedBy) { this.updatedBy = updatedBy; }

    public IncidentStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(IncidentStatus previousStatus) { this.previousStatus = previousStatus; }

    public IncidentStatus getNewStatus() { return newStatus; }
    public void setNewStatus(IncidentStatus newStatus) { this.newStatus = newStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
