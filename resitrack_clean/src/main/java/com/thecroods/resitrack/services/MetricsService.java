package com.thecroods.resitrack.services;

import com.thecroods.resitrack.enums.Status;
import com.thecroods.resitrack.models.MetricSnapshot;
import com.thecroods.resitrack.models.StatusHistory;
import com.thecroods.resitrack.repositories.StatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MetricsService {

    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    /**
     * Calc dashboard metrics
     * No. of safe, not_safe, unverified households
     */
    public MetricSnapshot getDashboardMetrics() {

        // 1: get all status history records
        List<StatusHistory> allStatus = statusHistoryRepository.findAll();

        // 2: Get latest StatusHistory per household
        Map<String, StatusHistory> latestStatusMap = allStatus.stream()
                .collect(Collectors.toMap(
                        StatusHistory::getHouseholdId,
                        sh -> sh,
                        (existing, replacement) ->
                                existing.getCreatedAt().isAfter(replacement.getCreatedAt()) ? existing : replacement
                ));

        // 3: count households by latest status
        long totalHouseholds = latestStatusMap.size();
        long safeCount = latestStatusMap.values().stream()
                .filter(sh -> sh.getNewStatus() == Status.SAFE)
                .count();
        long notSafeCount = latestStatusMap.values().stream()
                .filter(sh -> sh.getNewStatus() == Status.NOT_SAFE)
                .count();
        long unverifiedCount = latestStatusMap.values().stream()
                .filter(sh -> sh.getNewStatus() == Status.UNVERIFIED)
                .count();

        return new MetricSnapshot(totalHouseholds, safeCount, notSafeCount, unverifiedCount);
    }
}
