package com.campus.emergency.entity;

import com.campus.emergency.enums.Severity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_categories")
public class EmergencyCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String icon = "AlertTriangle";

    @Enumerated(EnumType.STRING)
    @Column(name = "default_severity", length = 20)
    private Severity defaultSeverity = Severity.MEDIUM;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public EmergencyCategory() {}

    public EmergencyCategory(String name, String description, String icon, Severity defaultSeverity) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.defaultSeverity = defaultSeverity;
        this.active = true;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Severity getDefaultSeverity() { return defaultSeverity; }
    public void setDefaultSeverity(Severity defaultSeverity) { this.defaultSeverity = defaultSeverity; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
