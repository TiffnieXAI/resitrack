package com.thecroods.resitrack.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


// send dashboard metrics to frontend
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetricSnapshot {

    private long totalHouseholds;
    private long safeCount;
    private long notSafeCount;
    private long unverifiedCount;
}
