package com.thecroods.resitrack.services;

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

        // 2: group by householdId and get latest status
        Map<String, String> latestStatusMap = allStatus.stream()
                .collect(Collectors.toMap(
                        StatusHistory::getHouseholdId,   // key = householdId
                        StatusHistory::getStatus,        // value = status
                        (existing, replacement) -> replacement
                ));

        // 3: count households by status
        long totalHouseholds = latestStatusMap.size();
        long safeCount = latestStatusMap.values().stream()
                .filter(s -> s.equalsIgnoreCase("safe"))
                .count();

        long notSafeCount = latestStatusMap.values().stream()
                .filter(s -> s.equalsIgnoreCase("not_safe"))
                .count();

        long unverifiedCount = latestStatusMap.values().stream()
                .filter(s -> s.equalsIgnoreCase("unverified"))
                .count();

        // 4: MetricSnapshot object to return
        return new MetricSnapshot(totalHouseholds, safeCount, notSafeCount, unverifiedCount);
    }
}
