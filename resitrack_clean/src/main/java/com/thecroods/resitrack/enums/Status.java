package com.thecroods.resitrack.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.thecroods.resitrack.exceptions.InvalidStatusException;

public enum Status {
    UNVERIFIED,
    SAFE,
    NOT_SAFE;

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static Status from(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        String normalized = value
                .trim()
                .toUpperCase()
                .replaceAll("[\\s-]+", "_");

        try {
            return Status.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new InvalidStatusException("Invalid status. Allowed values: UNVERIFIED, SAFE, NOT_SAFE");
        }
    }
}
