package com.thecroods.resitrack.services;

import com.thecroods.resitrack.models.Household;
import com.thecroods.resitrack.models.StatusHistory;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import com.thecroods.resitrack.repositories.StatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatusService {
    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    /*
    * TOGGLE HOUSEHOLD STATUS
    * 1 - Update Household Stat
    * 2 - Update log change in StatusHistory
    * */

    @Transactional
    public StatusHistory toggleStatus(Long householdId, String newStatus, String changedBy) {
        // 1: Fetch Household
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("household not found"));

        // 2: Update the current status
        household.setStatus(newStatus);
        householdRepository.save(household); // save the updated household

        // 3: Create stat history log
        StatusHistory history = new StatusHistory(householdId.toString(), newStatus, changedBy);

        // 4: Save to collection
        return statusHistoryRepository.save(history);

    }
}
