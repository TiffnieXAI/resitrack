package com.thecroods.resitrack.repositories;

import com.thecroods.resitrack.models.Household;
import org.springframework.data.mongodb.repository.MongoRepository;

// Map data from database to list for CRUD
public interface HouseholdRepository extends MongoRepository<Household, Long> {
}