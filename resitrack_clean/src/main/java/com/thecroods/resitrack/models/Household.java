package com.thecroods.resitrack.models;

import com.thecroods.resitrack.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

//Use same parameters in db
@Document(collection = "households")
@Data
@NoArgsConstructor
public class Household {

    @Transient
    public static final String SEQUENCE_NAME = "household_seq"; //Auto increment ID

    @Id
    private long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotBlank(message = "Contact is required")
    private String contact;

    private String specialNeeds;

    @Field("status")
    @NotNull
    private Status status = Status.UNVERIFIED; //locked to enum, StatusService can only change it

    private String createdBy;
}
