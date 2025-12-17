package com.thecroods.resitrack.models;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

//Use same parameters in db
@Document(collection = "households")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Household {

    @Transient
    public static final String SEQUENCE_NAME = "household_seq"; //Auto increment ID

    @Id
    @Generated
    private Long id;

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
    private String status = "unverified";
}
