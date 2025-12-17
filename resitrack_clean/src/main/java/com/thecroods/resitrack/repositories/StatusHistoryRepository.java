package com.thecroods.resitrack.repositories;

import com.thecroods.resitrack.models.StatusHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatusHistoryRepository extends MongoRepository<StatusHistory, String> {

    // get all status history logs of a household
    List<StatusHistory> findByHouseholdId(String householdId);
}
