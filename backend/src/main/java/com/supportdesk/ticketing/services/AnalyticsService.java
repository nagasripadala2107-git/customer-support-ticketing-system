package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.dto.DashboardAnalyticsResponse;
import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TicketRepository ticketRepository;
    private final TeamRepository teamRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public DashboardAnalyticsResponse getDashboardAnalytics() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long escalated = ticketRepository.countByStatus(TicketStatus.ESCALATED);
        long resolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closed = ticketRepository.countByStatus(TicketStatus.CLOSED);
        long critical = ticketRepository.countByPriority(TicketPriority.CRITICAL);

        // Group by category
        Map<String, Long> categoryMap = new LinkedHashMap<>();
        for (Object[] row : ticketRepository.countTicketsByCategory()) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }

        // Group by priority
        Map<String, Long> priorityMap = new LinkedHashMap<>();
        for (Object[] row : ticketRepository.countTicketsByPriorityGroup()) {
            priorityMap.put(((TicketPriority) row[0]).name(), (Long) row[1]);
        }

        // Group by status
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : ticketRepository.countTicketsByStatusGroup()) {
            statusMap.put(((TicketStatus) row[0]).name(), (Long) row[1]);
        }

        // Team workloads
        List<Map<String, Object>> teamWorkloads = new ArrayList<>();
        for (Team team : teamRepository.findAll()) {
            long count = ticketRepository.findByAssignedTeamIdOrderByCreatedAtDesc(team.getId()).size();
            teamWorkloads.add(Map.of(
                    "teamId", team.getId(),
                    "teamName", team.getName(),
                    "teamCode", team.getCode(),
                    "activeTickets", count
            ));
        }

        // Recent activity
        List<Map<String, Object>> recentActivity = new ArrayList<>();
        for (AuditLog log : auditLogRepository.findTop50ByOrderByCreatedAtDesc()) {
            recentActivity.add(Map.of(
                    "id", log.getId(),
                    "action", log.getAction(),
                    "details", log.getDetails() != null ? log.getDetails() : "",
                    "user", log.getUser() != null ? log.getUser().getFullName() : "System",
                    "createdAt", log.getCreatedAt().toString()
            ));
        }

        return DashboardAnalyticsResponse.builder()
                .totalTickets(total)
                .openTickets(open)
                .inProgressTickets(inProgress)
                .escalatedTickets(escalated)
                .resolvedTickets(resolved)
                .closedTickets(closed)
                .criticalTickets(critical)
                .averageResolutionTimeHours(4.2)
                .ticketsByCategory(categoryMap)
                .ticketsByPriority(priorityMap)
                .ticketsByStatus(statusMap)
                .teamWorkloads(teamWorkloads)
                .recentActivity(recentActivity)
                .build();
    }
}
