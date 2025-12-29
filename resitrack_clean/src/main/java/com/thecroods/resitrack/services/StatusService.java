package com.thecroods.resitrack.services;

import com.thecroods.resitrack.dtos.StatusHistoryResponse;
import com.thecroods.resitrack.enums.Status;
import com.thecroods.resitrack.exceptions.*;
import com.thecroods.resitrack.models.Household;
import com.thecroods.resitrack.models.StatusHistory;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import com.thecroods.resitrack.repositories.StatusHistoryRepository;
import com.thecroods.resitrack.services.DashboardWebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatusService {

    private final HouseholdRepository householdRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final DashboardWebSocketService dashboardWebSocketService;

    @Transactional
    public StatusHistoryResponse toggleStatus(Long householdId, Status newStatus) {

        // 1️⃣ Validate input
        if (householdId == null || newStatus == null) {
            throw new BadRequestException("Household ID and new status must not be null");
        }

        // 2️⃣ Fetch household safely
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        Status oldStatus = household.getStatus();
        if (oldStatus.equals(newStatus)) {
            throw new StatusAlreadySetException("Household is already in this status");
        }

        // 3️⃣ Update household status
        household.setStatus(newStatus);
        householdRepository.save(household);

        // 4️⃣ Get authenticated user safely
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String changedBy = (auth != null && auth.isAuthenticated() && auth.getName() != null)
                ? auth.getName()
                : "SYSTEM";

        // 5️⃣ Create and save status history
        StatusHistory history = new StatusHistory(
                householdId.toString(),
                oldStatus,
                newStatus,
                changedBy
        );
        history.setCreatedAt(Instant.now()); // ensures timestamp even if auditing is disabled
        StatusHistory savedHistory = statusHistoryRepository.save(history);


        // Push dashboard update (WebSocket)
        dashboardWebSocketService.pushDashboardUpdate();

        // 6️⃣ Logging
        log.info("Household {} status changed from {} to {} by {}", householdId, oldStatus, newStatus, changedBy);

        // 7️⃣ Return immutable response DTO
        return new StatusHistoryResponse(
                Long.parseLong(savedHistory.getHouseholdId()),
                savedHistory.getOldStatus(),
                savedHistory.getNewStatus(),
                savedHistory.getChangedBy(),
                savedHistory.getCreatedAt()
        );
    }
}
