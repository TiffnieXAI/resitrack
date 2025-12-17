package com.thecroods.resitrack.repositories;

import com.thecroods.resitrack.models.Incident;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IncidentRepository extends MongoRepository<Incident, Long> {
}
