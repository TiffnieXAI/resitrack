// Response DTO, Fields exposed to API
package com.thecroods.resitrack.dtos;

import com.thecroods.resitrack.enums.Status;
import lombok.Getter;

import java.time.Instant;

@Getter
public class StatusHistoryResponse {
    private final Long householdId;
    private final Status oldStatus;
    private final Status newStatus;
    private final String changedBy;
    private final Instant changedAt;

    public StatusHistoryResponse(Long householdId, Status oldStatus, Status newStatus, String changedBy, Instant changedAt) {
        if (householdId == null || oldStatus == null || newStatus == null || changedBy == null || changedAt == null) {
            throw new IllegalArgumentException("All fields are required");
        }
        this.householdId = householdId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }
}
