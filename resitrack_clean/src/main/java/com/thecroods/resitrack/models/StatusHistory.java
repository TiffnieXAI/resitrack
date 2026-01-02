package com.thecroods.resitrack.models;

import com.thecroods.resitrack.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;


@Document (collection = "status_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusHistory {
    @Id
    private String id;

    @NotBlank(message = "Household ID is required")
    private String householdId;

    @NotNull(message = "Status.java is required")
    private Status oldStatus;

    @NotNull(message = "Status.java is required")
    private Status newStatus;

    @NotBlank(message = "Changed by is required")
    private String changedBy;

    @CreatedDate
    private Instant createdAt; // auto set ng current time

    // Optional constructor that sets createdAt manually
    public StatusHistory(String householdId, Status oldStatus, Status newStatus, String changedBy) {
        this.householdId = householdId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.createdAt = Instant.now(); // safe fallback if auditing not enabled
    }

}
