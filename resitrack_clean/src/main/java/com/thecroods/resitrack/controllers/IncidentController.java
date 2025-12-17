package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.exceptions.ResourceNotFoundException;
import com.thecroods.resitrack.models.Incident;
import com.thecroods.resitrack.repositories.IncidentRepository;
import com.thecroods.resitrack.services.SequenceGeneratorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class IncidentController {

    @Autowired
    private IncidentRepository repo;

    @Autowired
    private SequenceGeneratorService sequenceGenerator;

    @GetMapping("/incidents")
    public List<Incident> getAll() {
        return repo.findAll();
    }

    @GetMapping("/incidents/{id}")
    public ResponseEntity<Incident> getById(@PathVariable Long id) {
        Incident incident = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + id + " not found"));
        return ResponseEntity.ok(incident);
    }

    @PostMapping("/incidents")
    public Incident create(@Valid @RequestBody Incident incident) {
        incident.setId(sequenceGenerator.generateSequence(Incident.SEQUENCE_NAME));
        return repo.save(incident);
    }

    @PutMapping("/incidents/{id}")
    public ResponseEntity<Incident> update(
            @PathVariable Long id,
            @Valid @RequestBody Incident data) {

        Incident incident = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + id + " not found"));

        incident.setDescription(data.getDescription());
        incident.setWaterLevel(data.getWaterLevel());
        incident.setSeverity(data.getSeverity());
        incident.setLatitude(data.getLatitude());
        incident.setLongitude(data.getLongitude());
        incident.setStatus(data.getStatus());
        incident.setReportedBy(data.getReportedBy());
        incident.setTimestamp(data.getTimestamp());

        return ResponseEntity.ok(repo.save(incident));
    }

    @DeleteMapping("/incidents/{id}")
    public Map<String, Boolean> delete(@PathVariable Long id) {
        Incident incident = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + id + " not found"));

        repo.delete(incident);

        Map<String, Boolean> res = new HashMap<>();
        res.put("deleted", true);
        return res;
    }
}
