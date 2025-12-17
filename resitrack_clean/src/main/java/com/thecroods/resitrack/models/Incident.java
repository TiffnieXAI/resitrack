package com.thecroods.resitrack.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "incidents")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Incident {

    @Transient
    public static final String SEQUENCE_NAME = "incident_seq";

    @Id
    private Long id;

    @NotBlank
    private String description;

    @NotNull
    private Double waterLevel;

    @NotBlank
    private String severity;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private String status = "reported";

    @NotBlank
    private String reportedBy;

    @NotBlank
    private String timestamp;
}
