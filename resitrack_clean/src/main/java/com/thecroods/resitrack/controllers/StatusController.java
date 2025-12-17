package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.dtos.StatusToggleRequest; // DTO for request body
import com.thecroods.resitrack.models.StatusHistory;
import com.thecroods.resitrack.services.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController // Marks this class as a REST API controller
@RequestMapping("/api/status") // Base URL for all endpoints in this controller
public class StatusController {

    @Autowired // Automatically inject the StatusService bean
    private StatusService statusService;

    /**
     * Endpoint to toggle the status of a household
     * Accepts a JSON body with householdId, newStatus, and changedBy
     *
     * Example JSON body:
     * {
     *   "householdId": 1,
     *   "newStatus": "safe",
     *   "changedBy": "admin"
     * }
     *
     * @param request JSON request body mapped to StatusToggleRequest
     * @return StatusHistory object representing the change
     */
    @PostMapping("/toggle")
    public StatusHistory toggleStatus(@Valid @RequestBody StatusToggleRequest request) {
        // Extract fields from the request
        Long householdId = request.getHouseholdId();   // ID of the household
        String newStatus = request.getNewStatus();     // New status value
        String changedBy = request.getChangedBy();     // Who performed the change

        // Call the service to perform the toggle and record it in status history
        StatusHistory updatedStatus = statusService.toggleStatus(householdId, newStatus, changedBy);

        // Return the updated status history object as JSON
        return updatedStatus;
    }
}
