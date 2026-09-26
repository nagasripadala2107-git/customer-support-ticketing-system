package com.supportdesk.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long escalatedTickets;
    private long resolvedTickets;
    private long closedTickets;
    private long criticalTickets;
    private double averageResolutionTimeHours;
    private Map<String, Long> ticketsByCategory;
    private Map<String, Long> ticketsByPriority;
    private Map<String, Long> ticketsByStatus;
    private List<Map<String, Object>> teamWorkloads;
    private List<Map<String, Object>> recentActivity;
}
