package com.campus.emergency.dto;

import com.campus.emergency.entity.EmergencyCategory;
import com.campus.emergency.enums.Severity;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private Severity defaultSeverity;
    private boolean active;

    public CategoryDto() {}

    public CategoryDto(EmergencyCategory category) {
        if (category != null) {
            this.id = category.getId();
            this.name = category.getName();
            this.description = category.getDescription();
            this.icon = category.getIcon();
            this.defaultSeverity = category.getDefaultSeverity();
            this.active = category.isActive();
        }
    }

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
}
