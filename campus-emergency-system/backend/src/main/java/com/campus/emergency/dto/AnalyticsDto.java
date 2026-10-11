package com.campus.emergency.dto;

import java.util.ArrayList;
import java.util.List;

public class AnalyticsDto {

    private List<LabelCount> byCategory = new ArrayList<>();
    private List<LabelCount> byStatus = new ArrayList<>();
    private List<LabelCount> bySeverity = new ArrayList<>();
    private List<LabelCount> byLocation = new ArrayList<>();
    private List<LabelCount> monthlyTrends = new ArrayList<>();

    public AnalyticsDto() {}

    public static class LabelCount {
        private String label;
        private long count;

        public LabelCount() {}
        public LabelCount(String label, long count) {
            this.label = label;
            this.count = count;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public List<LabelCount> getByCategory() { return byCategory; }
    public void setByCategory(List<LabelCount> byCategory) { this.byCategory = byCategory; }

    public List<LabelCount> getByStatus() { return byStatus; }
    public void setByStatus(List<LabelCount> byStatus) { this.byStatus = byStatus; }

    public List<LabelCount> getBySeverity() { return bySeverity; }
    public void setBySeverity(List<LabelCount> bySeverity) { this.bySeverity = bySeverity; }

    public List<LabelCount> getByLocation() { return byLocation; }
    public void setByLocation(List<LabelCount> byLocation) { this.byLocation = byLocation; }

    public List<LabelCount> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<LabelCount> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
}
