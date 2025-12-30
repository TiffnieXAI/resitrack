package com.thecroods.resitrack.services;

import com.thecroods.resitrack.enums.Status;
import com.thecroods.resitrack.models.MetricSnapshot;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final HouseholdRepository householdRepository;

    public MetricSnapshot getDashboardMetrics() {

        long safeCount = householdRepository.countByStatus(Status.SAFE);
        long notSafeCount = householdRepository.countByStatus(Status.NOT_SAFE);
        long unverifiedCount = householdRepository.countByStatus(Status.UNVERIFIED);

        long totalHouseholds = safeCount + notSafeCount + unverifiedCount;

        return new MetricSnapshot(
                totalHouseholds,
                safeCount,
                notSafeCount,
                unverifiedCount
        );
    }
}
