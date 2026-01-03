package com.thecroods.resitrack.repositories;

import com.thecroods.resitrack.models.Incident;
import org.springframework.data.mongodb.repository.MongoRepository;

// Map data from database to list for CRUD same as household
public interface IncidentRepository extends MongoRepository<Incident, Long> {
}
