package com.thecroods.resitrack.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Status {
    UNVERIFIED,
    SAFE,
    NOT_SAFE;

    @JsonCreator
    public static Status from(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        String normalized = value
                .trim()
                .toUpperCase()
                .replaceAll("[\\s-]+", "_"); // "not safe", "not-safe" → NOT_SAFE

        try {
            return Status.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Invalid status. Allowed values: UNVERIFIED, SAFE, NOT_SAFE"
            );
        }
    }
}
