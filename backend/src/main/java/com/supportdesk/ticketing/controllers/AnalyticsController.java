package com.supportdesk.ticketing.controllers;

import com.supportdesk.ticketing.dto.DashboardAnalyticsResponse;
import com.supportdesk.ticketing.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAnalyticsResponse> getDashboardData() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }
}
