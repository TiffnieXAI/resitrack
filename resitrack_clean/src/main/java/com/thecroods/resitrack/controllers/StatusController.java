
@RestController
package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.dtos.StatusHistoryResponse;
import com.thecroods.resitrack.dtos.StatusToggleRequest;
import com.thecroods.resitrack.models.StatusHistory;
import com.thecroods.resitrack.services.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @Autowired
    private StatusService statusService;

    /**
     * Endpoint to toggle the status of a household.
     * Accepts a JSON body with householdId and newStatus.
     *
     * JSON body:
     * {
     *   "householdId": 1,
     *   "newStatus": "SAFE"
     * }
     *
     * @param request JSON request body mapped to StatusToggleRequest
     * @return StatusHistory object representing the change
     */
    @PostMapping("/toggle")
    public StatusHistoryResponse toggleStatus(@Valid @RequestBody StatusToggleRequest request) {
        return statusService.toggleStatus(
                request.getHouseholdId(),
                request.getNewStatus() // enum Status
        );
    }
}
