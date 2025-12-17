package com.thecroods.resitrack.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document (collection = "status_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusHistory {
    @Id
    private String id;

    @NotBlank (message = "Houshold ID is required")
    private String householdId;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank (message = "Changed by is required")
    private String changedBy;

    private LocalDateTime timestamp = LocalDateTime.now(); // auto set ng current time

    // Constructor for fast creation of logs
    public StatusHistory(String householdId, String status, String changedBy) {
        this.householdId = householdId;
        this.status = status;
        this.changedBy = changedBy;
        this.timestamp = LocalDateTime.now();
    }
}
