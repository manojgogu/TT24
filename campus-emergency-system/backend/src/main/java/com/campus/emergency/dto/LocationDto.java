package com.campus.emergency.dto;

import com.campus.emergency.entity.CampusLocation;
import java.math.BigDecimal;

public class LocationDto {
    private Long id;
    private String buildingName;
    private String locationDescription;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String zone;
    private boolean active;

    public LocationDto() {}

    public LocationDto(CampusLocation location) {
        if (location != null) {
            this.id = location.getId();
            this.buildingName = location.getBuildingName();
            this.locationDescription = location.getLocationDescription();
            this.latitude = location.getLatitude();
            this.longitude = location.getLongitude();
            this.zone = location.getZone();
            this.active = location.isActive();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getLocationDescription() { return locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
