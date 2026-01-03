package com.thecroods.resitrack.security.service;

import com.thecroods.resitrack.models.Household;
import com.thecroods.resitrack.models.Incident;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import com.thecroods.resitrack.repositories.IncidentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("securityService")
public class SecurityService {

    private final HouseholdRepository householdRepository;
    private final IncidentRepository incidentRepository;

    public SecurityService(HouseholdRepository householdRepository,
                           IncidentRepository incidentRepository) {
        this.householdRepository = householdRepository;
        this.incidentRepository = incidentRepository;
    }

    // Check if user is the owner of the household

    public boolean isOwnerOrAdmin(Authentication auth, Long householdId) {
        if (auth == null || !auth.isAuthenticated()) return false;

        if (isAdmin(auth)) return true;

        Optional<Household> householdOpt = householdRepository.findById(householdId);
        return householdOpt
                .map(h -> h.getCreatedBy().equals(auth.getName()))
                .orElse(false);
    }

    // Check if user is the owner of the incidents

    public boolean isIncidentOwnerOrAdmin(Authentication auth, Long incidentId) {
        if (auth == null || !auth.isAuthenticated()) return false;

        if (isAdmin(auth)) return true;

        Optional<Incident> incidentOpt = incidentRepository.findById(incidentId);
        return incidentOpt
                .map(i -> i.getReportedBy().equals(auth.getName()))
                .orElse(false);
    }

    // Check if user has ROLE_ADMIN

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
