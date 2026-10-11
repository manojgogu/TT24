package com.campus.emergency.dto;

import com.campus.emergency.enums.Severity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EmergencyCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Location is required")
    private Long locationId;

    private String specificLocation;

    private Severity severity = Severity.MEDIUM;

    private boolean isSos = false;

    public EmergencyCreateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getSpecificLocation() { return specificLocation; }
    public void setSpecificLocation(String specificLocation) { this.specificLocation = specificLocation; }

    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }

    public boolean isSos() { return isSos; }
    public void setSos(boolean sos) { isSos = sos; }
}
