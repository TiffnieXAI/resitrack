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
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.springframework.data.mongodb.core.query.Criteria.where;


@Service
@RequiredArgsConstructor
@Slf4j
public class StatusService {

    private final MongoOperations mongoOperations;
    private final StatusHistoryRepository statusHistoryRepository;
    private final DashboardWebSocketService dashboardWebSocketService;

    @Transactional
    public StatusHistoryResponse toggleStatus(Long householdId, Status newStatus) {

        if (householdId == null || newStatus == null) {
            throw new BadRequestException("Household ID and new status must not be null");
        }

        Query query = new Query(where("_id").is(householdId));
        Update update = new Update().set("status", newStatus);

        // returnOld = get the status before the update
        Household oldHousehold = mongoOperations.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(false),
                Household.class
        );

        if (oldHousehold == null) {
            throw new ResourceNotFoundException("Household not found");
        }

        Status oldStatus = oldHousehold.getStatus();
        if (oldStatus.equals(newStatus)) {
            throw new StatusAlreadySetException("Household is already in this status");
        }

        // 2️⃣ Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String changedBy = (auth != null && auth.isAuthenticated() && auth.getName() != null)
                ? auth.getName()
                : "SYSTEM";

        // 3️⃣ Save status history
        StatusHistory history = new StatusHistory(
                householdId.toString(),
                oldStatus,
                newStatus,
                changedBy
        );
        history.setCreatedAt(Instant.now());
        StatusHistory savedHistory = statusHistoryRepository.save(history);

        // 4️⃣ Push dashboard update
        dashboardWebSocketService.pushDashboardUpdate();

        log.info("Household {} status changed from {} to {} by {}", householdId, oldStatus, newStatus, changedBy);

        // 5️⃣ Return response DTO
        return new StatusHistoryResponse(
                householdId,
                oldStatus,
                newStatus,
                changedBy,
                savedHistory.getCreatedAt()
        );
    }
}
