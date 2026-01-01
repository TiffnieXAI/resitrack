package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.exceptions.ResourceNotFoundException;
import com.thecroods.resitrack.models.Incident;
import com.thecroods.resitrack.models.IncidentSequence;
import com.thecroods.resitrack.repositories.IncidentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    @Autowired
    private IncidentRepository repo;

    @Autowired
    private MongoOperations mongoOperations;

    /* ================= SEQUENCE ================= */

    public long generateSequence(String seqName) {
        IncidentSequence counter = mongoOperations.findAndModify(
                query(where("_id").is(seqName)),
                new Update().inc("seq", 1),
                options().returnNew(true).upsert(true),
                IncidentSequence.class
        );
        return !Objects.isNull(counter) ? counter.getSeq() : 1;
    }

    /* ================= READ ================= */

    // ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Incident> getAllIncidents() {
        return repo.findAll();
    }

    // Owner or ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("@securityService.isIncidentOwnerOrAdmin(authentication, #id)")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        Incident incident = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident with ID " + id + " not found!")
                );
        return ResponseEntity.ok(incident);
    }

    /* ================= CREATE ================= */

    @PostMapping("/report")
    public Incident reportIncident(
            @Valid @RequestBody Incident incident,
            Authentication authentication) {

        Incident temp = new Incident();
        temp.setId(generateSequence(Incident.SEQUENCE_NAME));
        temp.setDescription(incident.getDescription());
        temp.setWaterLevel(incident.getWaterLevel());
        temp.setSeverity(incident.getSeverity());
        temp.setLatitude(incident.getLatitude());
        temp.setLongitude(incident.getLongitude());
        temp.setStatus(incident.getStatus());
        temp.setTimestamp(incident.getTimestamp());
        temp.setReportedBy(authentication.getName());

        return repo.save(temp);
    }

    /* ================= UPDATE ================= */

    @PutMapping("/update/{id}")
    @PreAuthorize("@securityService.isIncidentOwnerOrAdmin(authentication, #id)")
    public ResponseEntity<Incident> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody Incident details) {

        Incident incident = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident with ID " + id + " not found!")
                );

        incident.setDescription(details.getDescription());
        incident.setWaterLevel(details.getWaterLevel());
        incident.setSeverity(details.getSeverity());
        incident.setLatitude(details.getLatitude());
        incident.setLongitude(details.getLongitude());
        incident.setStatus(details.getStatus());
        incident.setTimestamp(details.getTimestamp());

        return ResponseEntity.ok(repo.save(incident));
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("@securityService.isIncidentOwnerOrAdmin(authentication, #id)")
    public Map<String, Boolean> deleteIncident(@PathVariable Long id) {

        Incident incident = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident with ID " + id + " not found!")
                );

        repo.delete(incident);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
