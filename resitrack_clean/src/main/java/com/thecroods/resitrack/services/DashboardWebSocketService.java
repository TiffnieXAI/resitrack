package com.thecroods.resitrack.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.thecroods.resitrack.services.MetricsService;
import com.thecroods.resitrack.models.MetricSnapshot;



@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MetricsService metricsService;

    public void pushDashboardUpdate() {
        try {
            MetricSnapshot snapshot = metricsService.getDashboardMetrics();
            log.info("📊 Sending dashboard snapshot: {}", snapshot);
            messagingTemplate.convertAndSend("/topic/dashboard", snapshot);
        } catch (Exception e) {
            log.error("WebSocket push failed", e);
        }
    }
}
