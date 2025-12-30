package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.models.MetricSnapshot;
import com.thecroods.resitrack.services.MetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    @Autowired
    private MetricsService metricsService;


    @GetMapping("/dashboard")
    public ResponseEntity<MetricSnapshot> getDashboardMetrics() {

        // 1: call service to calculate metrics
        MetricSnapshot snapshot = metricsService.getDashboardMetrics();

        // 2: return metrics to frontend
        return ResponseEntity.ok(snapshot); // JSON resp
    }
}