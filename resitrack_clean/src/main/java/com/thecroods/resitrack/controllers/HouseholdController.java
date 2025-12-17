package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.exceptions.ResourceNotFoundException;
import com.thecroods.resitrack.models.Household;
import com.thecroods.resitrack.models.HouseholdSequence;
import com.thecroods.resitrack.repositories.HouseholdRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;


@RestController
public class HouseholdController {

    @Autowired
    HouseholdRepository repo; // Makes the repository var for spring boot repository function

    @Autowired
    private MongoOperations mongoOperations;

    //Auto increment ID
    public long generateSequence(String seqName) {
        HouseholdSequence counter = mongoOperations.findAndModify(query(where("_id").is(seqName)),
                new Update().inc("seq",1), options().returnNew(true).upsert(true),
                HouseholdSequence.class);
        return !Objects.isNull(counter) ? counter.getSeq() : 1;
    }

    @GetMapping("/households") //Read data - GET
    public List<Household> getHouseholds() {
        return repo.findAll();
    }

    @GetMapping("/households/{id}") //Read data from specific household id
    public ResponseEntity<Household> getHousehold(@PathVariable(value = "id") Long id) throws
            ResourceNotFoundException {
        Household household = repo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Household with ID " + id + " not found!"));
        return ResponseEntity.ok(household);
    }

    @PostMapping("/register") //Create data - POST
    public Household registerHousehold(@Valid @RequestBody Household household){
        Household tempHousehold = new Household();
        tempHousehold.setId(generateSequence(Household.SEQUENCE_NAME));
        tempHousehold.setName(household.getName());
        tempHousehold.setAddress(household.getAddress());
        tempHousehold.setLatitude(household.getLatitude());
        tempHousehold.setLongitude(household.getLongitude());
        tempHousehold.setContact(household.getContact());
        tempHousehold.setSpecialNeeds(household.getSpecialNeeds());
        return repo.save(tempHousehold);
    }


    @PutMapping("/households/update/{id}") //Update data
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

    @DeleteMapping("/households/delete/{id}") //Delete household data using id
    public Map <String, Boolean> deleteHousehold(@PathVariable(value = "id") Long id) throws ResourceNotFoundException {
        Household household = repo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Household with ID " + id + " not found!")); //Check if household exists
        //Deletes household
        repo.delete(household);
        Map <String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}