package com.thecroods.resitrack.security.service;

import com.thecroods.resitrack.models.Household;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("securityService") // Must match the name used in @PreAuthorize
public class SecurityService {

    private final HouseholdRepository householdRepository;

    public SecurityService(HouseholdRepository householdRepository) {
        this.householdRepository = householdRepository;
    }

    public boolean isOwnerOrAdmin(Authentication auth, Long householdId) {
        if (auth == null || !auth.isAuthenticated()) {
            return false; // Not authenticated
        }

        // Check if user has ROLE_ADMIN
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return true; // Admin has access to everything
        }

        // Check if user is the owner of the household
        Optional<Household> householdOpt = householdRepository.findById(householdId);
        if (householdOpt.isEmpty()) {
            return false; // Household does not exist
        }

        Household household = householdOpt.get();
        String ownerUsername = household.getCreatedBy(); // Make sure this field exists in Household
        String currentUsername = auth.getName();

        return currentUsername.equals(ownerUsername);
    }
}
