package com.jobhub.model;

import com.jobhub.exception.ValidationException;

public enum ApplicationStatus {
    APPLIED("Applied"),
    REVIEWED("Reviewed"),
    INTERVIEW("Interview"),
    REJECTED("Rejected"),
    ACCEPTED("Accepted");

    private final String label;

    ApplicationStatus(String label) { this.label = label; }

    public String getLabel() { return label; }

    public static ApplicationStatus fromLabel(String text) throws ValidationException {
        for (ApplicationStatus s : values()) {
            if (s.label.equalsIgnoreCase(text == null ? "" : text.trim())) return s;
        }
        throw new ValidationException("Unknown application status.");
    }
}
