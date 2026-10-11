package com.campus.emergency.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResolutionRequest {

    @NotBlank(message = "Resolution summary is required")
    @Size(min = 10, max = 2000, message = "Resolution summary must provide sufficient details (at least 10 characters)")
    private String resolutionSummary;

    public ResolutionRequest() {}

    public ResolutionRequest(String resolutionSummary) {
        this.resolutionSummary = resolutionSummary;
    }

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
}
