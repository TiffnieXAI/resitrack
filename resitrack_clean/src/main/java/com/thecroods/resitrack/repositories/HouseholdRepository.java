package com.thecroods.resitrack.repositories;

import com.thecroods.resitrack.models.Household;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.thecroods.resitrack.enums.Status;

// Map data from database to list for CRUD
public interface HouseholdRepository extends MongoRepository<Household, Long> {
    long countByStatus(Status status);
}

