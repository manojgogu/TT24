package com.campus.emergency.enums;

import java.util.Set;

public enum IncidentStatus {
    REPORTED,
    ASSIGNED,
    ACKNOWLEDGED,
    IN_PROGRESS,
    RESOLVED,
    CANCELLED;

    public boolean canTransitionTo(IncidentStatus next) {
        if (this == next) return true;
        switch (this) {
            case REPORTED:
                return next == ASSIGNED || next == CANCELLED;
            case ASSIGNED:
                return next == ACKNOWLEDGED || next == IN_PROGRESS || next == CANCELLED;
            case ACKNOWLEDGED:
                return next == IN_PROGRESS || next == CANCELLED;
            case IN_PROGRESS:
                return next == RESOLVED || next == CANCELLED;
            case RESOLVED:
            case CANCELLED:
                return false; // Terminal states
            default:
                return false;
        }
    }
}
