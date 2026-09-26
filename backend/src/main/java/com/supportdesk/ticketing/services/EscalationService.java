package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.dto.EscalationPathResponse;
import com.supportdesk.ticketing.dto.EscalationRequest;
import com.supportdesk.ticketing.dto.EscalationResponse;
import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.graph.AdjacencyListGraph;
import com.supportdesk.ticketing.graph.EscalationPathResult;
import com.supportdesk.ticketing.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EscalationService {

    private final AdjacencyListGraph escalationGraph;
    private final TicketRepository ticketRepository;
    private final EscalationLevelRepository escalationLevelRepository;
    private final TicketEscalationRepository ticketEscalationRepository;
    private final TeamRepository teamRepository;
    private final AgentRepository agentRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public EscalationPathResponse calculateEscalationPath(String startLevel, String targetLevel) {
        EscalationPathResult result = escalationGraph.findEscalationPath(startLevel, targetLevel);
        return EscalationPathResponse.builder()
                .routeExists(result.isPathExists())
                .sourceLevel(result.getStartNode())
                .targetLevel(result.getTargetNode())
                .pathNodes(result.getPath())
                .hopCount(result.getTotalHops())
                .totalWeight(result.getTotalWeight())
                .formattedRoute(result.getFormattedPath())
                .traversalSequence(result.getTraversalOrder())
                .algorithm(result.getAlgorithmUsed())
                .build();
    }

    @Transactional
    public EscalationResponse escalateTicket(Long ticketId, EscalationRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        // Determine current escalation level
        String currentLevelCode = request.getCurrentLevelCode();
        if (currentLevelCode == null || currentLevelCode.isBlank()) {
            List<TicketEscalation> past = ticketEscalationRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
            if (!past.isEmpty()) {
                currentLevelCode = past.get(past.size() - 1).getToLevel().getLevelCode();
            } else {
                currentLevelCode = "L1_SUPPORT";
            }
        }

        String targetLevelCode = request.getTargetLevelCode();

        // 1. Verify path in Escalation Graph
        EscalationPathResult pathResult = escalationGraph.findEscalationPath(currentLevelCode, targetLevelCode);
        if (!pathResult.isPathExists()) {
            throw new IllegalStateException("Invalid escalation route: No connected path in graph from " 
                    + currentLevelCode + " to " + targetLevelCode);
        }

        // 2. Fetch or create database level entities
        EscalationLevel fromLevel = escalationLevelRepository.findByLevelCode(currentLevelCode)
                .orElseGet(() -> escalationLevelRepository.save(EscalationLevel.builder()
                        .levelCode(currentLevelCode)
                        .name(currentLevelCode.replace("_", " "))
                        .slaHours(24)
                        .build()));

        EscalationLevel toLevel = escalationLevelRepository.findByLevelCode(targetLevelCode)
                .orElseGet(() -> escalationLevelRepository.save(EscalationLevel.builder()
                        .levelCode(targetLevelCode)
                        .name(targetLevelCode.replace("_", " "))
                        .slaHours(8)
                        .build()));

        // 3. Persist TicketEscalation record in PostgreSQL
        TicketEscalation escalation = TicketEscalation.builder()
                .ticket(ticket)
                .fromLevel(fromLevel)
                .toLevel(toLevel)
                .escalatedByUser(currentUser)
                .escalationReason(request.getReason())
                .pathTaken(pathResult.getFormattedPath())
                .build();

        ticketEscalationRepository.save(escalation);

        // 4. Update ticket status to ESCALATED
        ticket.setStatus(TicketStatus.ESCALATED);

        // Reassign to higher tier team/agent if defined on target level
        if (toLevel.getTargetTeam() != null) {
            ticket.setAssignedTeam(toLevel.getTargetTeam());
            List<Agent> agents = agentRepository.findByTeamIdAndIsAvailableTrue(toLevel.getTargetTeam().getId());
            if (!agents.isEmpty()) {
                ticket.setAssignedAgent(agents.get(0));
            }
        }

        ticketRepository.save(ticket);

        // 5. Audit Log
        auditService.recordAudit(
                currentUser,
                "TICKET_ESCALATE",
                "TICKET",
                ticket.getId(),
                "Escalated via path: " + pathResult.getFormattedPath() + ". Reason: " + request.getReason()
        );

        // 6. Notification
        if (ticket.getAssignedAgent() != null) {
            notificationService.sendNotification(
                    ticket.getAssignedAgent().getUser(),
                    ticket,
                    "Ticket Escalated",
                    "Ticket " + ticket.getTicketNumber() + " was escalated to your queue."
            );
        }

        return EscalationResponse.builder()
                .id(escalation.getId())
                .ticketId(ticket.getId())
                .fromLevelCode(fromLevel.getLevelCode())
                .fromLevelName(fromLevel.getName())
                .toLevelCode(toLevel.getLevelCode())
                .toLevelName(toLevel.getName())
                .escalatedByName(currentUser.getFullName())
                .escalationReason(escalation.getEscalationReason())
                .pathTaken(escalation.getPathTaken())
                .createdAt(escalation.getCreatedAt())
                .build();
    }
}
