package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.exceptions.ResourceNotFoundException;
import com.thecroods.resitrack.models.Household;
import com.thecroods.resitrack.models.HouseholdSequence;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import com.thecroods.resitrack.services.DashboardWebSocketService;
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
@RequestMapping("/households")
public class HouseholdController {

    @Autowired
    private HouseholdRepository repo; // Makes the repository var for spring boot repository function

    @Autowired
    private MongoOperations mongoOperations;
    @Autowired
    private DashboardWebSocketService dashboardWebSocketService;

    //Auto increment ID
    public long generateSequence(String seqName) {
        HouseholdSequence counter = mongoOperations.findAndModify(query(where("_id").is(seqName)),
                new Update().inc("seq",1), options().returnNew(true).upsert(true),
                HouseholdSequence.class);
        return !Objects.isNull(counter) ? counter.getSeq() : 1;
    }

    //Get all households - ADMIN Only
    @GetMapping //Read data - GET
    @PreAuthorize("hasRole('ADMIN')") //Method Security
    public List<Household> getHouseholds() {
        return repo.findAll();
    }

    //Get household by ID - ONLY owner or admin
    @GetMapping("/{id}")
    @PreAuthorize("@securityService.isOwnerOrAdmin(authentication, #id)")
    public ResponseEntity<Household> getHousehold(@PathVariable Long id) throws ResourceNotFoundException {
        Household household = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household with ID " + id + " not found!"));
        return ResponseEntity.ok(household);
    }


    @PostMapping("/register") //Create data - POST
    @PreAuthorize("isAuthenticated()")
    public Household registerHousehold(@Valid @RequestBody Household household, Authentication authentication) {
        Household tempHousehold = new Household();
        tempHousehold.setId(generateSequence(Household.SEQUENCE_NAME));
        tempHousehold.setName(household.getName());
        tempHousehold.setAddress(household.getAddress());
        tempHousehold.setLatitude(household.getLatitude());
        tempHousehold.setLongitude(household.getLongitude());
        tempHousehold.setContact(household.getContact());
        tempHousehold.setSpecialNeeds(household.getSpecialNeeds());
        tempHousehold.setCreatedBy(authentication.getName());

        Household saved = repo.save(tempHousehold);

        dashboardWebSocketService.pushDashboardUpdate();

        return saved;
    }

    //Update household by ID - ONLY owner or admin
    @PutMapping("/update/{id}") //Update data
    @PreAuthorize("@securityService.isOwnerOrAdmin(authentication, #id)")
    public ResponseEntity <Household> updateHousehold(@PathVariable(value ="id") Long id,
                                                      @Valid @RequestBody Household householdDetails) throws ResourceNotFoundException {
        Household household = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Household with ID " + id + " not found!")); //Check if household exists

        //Update changes
        household.setName(householdDetails.getName());
        household.setAddress(householdDetails.getAddress());
        household.setLatitude(householdDetails.getLatitude());
        household.setLongitude(householdDetails.getLongitude());
        household.setContact(householdDetails.getContact());
        household.setSpecialNeeds(householdDetails.getSpecialNeeds());
        final Household updatedHousehold = repo.save(household); //Saves changes
        return ResponseEntity.ok(updatedHousehold);
    }

    //Delete household by ID - ONLY owner or admin
    @DeleteMapping("/delete/{id}") //Delete household data using id
    @PreAuthorize("@securityService.isOwnerOrAdmin(authentication, #id)")
    public Map <String, Boolean> deleteHousehold(@PathVariable(value = "id") Long id) throws ResourceNotFoundException {
        Household household = repo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Household with ID " + id + " not found!")); //Check if household exists
        //Deletes household
        repo.delete(household);

        dashboardWebSocketService.pushDashboardUpdate();

        Map <String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }
}
