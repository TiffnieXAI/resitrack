package com.thecroods.resitrack.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusToggleRequest {
    private Long householdId; // ID of the household whose status will be toggled
    private String newStatus; // New status to set (e.g., "safe", "not_safe")
    private String changedBy; // Who made the change
}
