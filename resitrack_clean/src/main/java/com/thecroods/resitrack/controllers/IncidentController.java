package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.exceptions.ResourceNotFoundException;
import com.thecroods.resitrack.models.Incident;
import com.thecroods.resitrack.repositories.IncidentRepository;
import com.thecroods.resitrack.services.SequenceGeneratorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    private final IncidentRepository repo;
    private final SequenceGeneratorService sequenceGenerator;

    public IncidentController(IncidentRepository repo,
                              SequenceGeneratorService sequenceGenerator) {
        this.repo = repo;
        this.sequenceGenerator = sequenceGenerator;
    }

    // ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Incident> getAll() {
        return repo.findAll();
    }

    // Owner or ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("@securityService.isIncidentOwnerOrAdmin(authentication, #id)")
    public ResponseEntity<Incident> getById(@PathVariable Long id) {
        Incident incident = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident " + id + " not found")
                );
        return ResponseEntity.ok(incident);
    }

    // Any authenticated user
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Incident create(@Valid @RequestBody Incident incident,
                           Authentication authentication) {
        incident.setId(sequenceGenerator.generateSequence(Incident.SEQUENCE_NAME));
        incident.setReportedBy(authentication.getName());
        return repo.save(incident);
    }

    // Owner or ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("@securityService.isIncidentOwnerOrAdmin(authentication, #id)")
    public ResponseEntity<Incident> update(@PathVariable Long id,
                                           @Valid @RequestBody Incident data) {

        Incident incident = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident " + id + " not found")
                );

        incident.setDescription(data.getDescription());
        incident.setWaterLevel(data.getWaterLevel());
        incident.setSeverity(data.getSeverity());
        incident.setLatitude(data.getLatitude());
        incident.setLongitude(data.getLongitude());
        incident.setStatus(data.getStatus());
        incident.setTimestamp(data.getTimestamp());

        return ResponseEntity.ok(repo.save(incident));
    }

    // Owner or ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("@securityService.isIncidentOwnerOrAdmin(authentication, #id)")
    public Map<String, Boolean> delete(@PathVariable Long id) {

        Incident incident = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident " + id + " not found")
                );

        repo.delete(incident);

        Map<String, Boolean> res = new HashMap<>();
        res.put("deleted", true);
        return res;
    }
}
