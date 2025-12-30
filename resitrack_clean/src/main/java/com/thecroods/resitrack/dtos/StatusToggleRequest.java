// Pass DTO, Fields exposed to API
package com.thecroods.resitrack.dtos;

import com.thecroods.resitrack.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusToggleRequest {
    @NotNull(message = "householdId is required")
    private Long householdId; // ID of the household whose status will be toggled

    @NotNull(message = "newStatus is required")
    private Status newStatus; // New status to set (e.g., "safe", "not_safe")
}
