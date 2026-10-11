package com.campus.emergency.dto;

public class DashboardStatsDto {
    private long totalIncidents;
    private long newIncidents;
    private long assignedIncidents;
    private long inProgressIncidents;
    private long resolvedIncidents;
    private long criticalIncidents;
    private double avgAcknowledgementTimeMinutes;
    private double avgResolutionTimeHours;
    private long activeResponders;
    private long totalUsers;

    public DashboardStatsDto() {}

    public long getTotalIncidents() { return totalIncidents; }
    public void setTotalIncidents(long totalIncidents) { this.totalIncidents = totalIncidents; }

    public long getNewIncidents() { return newIncidents; }
    public void setNewIncidents(long newIncidents) { this.newIncidents = newIncidents; }

    public long getAssignedIncidents() { return assignedIncidents; }
    public void setAssignedIncidents(long assignedIncidents) { this.assignedIncidents = assignedIncidents; }

    public long getInProgressIncidents() { return inProgressIncidents; }
    public void setInProgressIncidents(long inProgressIncidents) { this.inProgressIncidents = inProgressIncidents; }

    public long getResolvedIncidents() { return resolvedIncidents; }
    public void setResolvedIncidents(long resolvedIncidents) { this.resolvedIncidents = resolvedIncidents; }

    public long getCriticalIncidents() { return criticalIncidents; }
    public void setCriticalIncidents(long criticalIncidents) { this.criticalIncidents = criticalIncidents; }

    public double getAvgAcknowledgementTimeMinutes() { return avgAcknowledgementTimeMinutes; }
    public void setAvgAcknowledgementTimeMinutes(double avgAcknowledgementTimeMinutes) { this.avgAcknowledgementTimeMinutes = avgAcknowledgementTimeMinutes; }

    public double getAvgResolutionTimeHours() { return avgResolutionTimeHours; }
    public void setAvgResolutionTimeHours(double avgResolutionTimeHours) { this.avgResolutionTimeHours = avgResolutionTimeHours; }

    public long getActiveResponders() { return activeResponders; }
    public void setActiveResponders(long activeResponders) { this.activeResponders = activeResponders; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
}
