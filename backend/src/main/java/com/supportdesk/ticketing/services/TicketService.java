package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.dto.ClassificationResponse;
import com.supportdesk.ticketing.dto.TicketRequest;
import com.supportdesk.ticketing.dto.TicketResponse;
import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CustomerRepository customerRepository;
    private final CategoryRepository categoryRepository;
    private final TeamRepository teamRepository;
    private final AgentRepository agentRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final ClassificationService classificationService;
    private final RoutingService routingService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    @Transactional
    public TicketResponse createTicket(TicketRequest request, User currentUser) {
        Customer customer = null;
        if (currentUser.getRole() == Role.ROLE_CUSTOMER) {
            customer = customerRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new IllegalStateException("Customer profile not found for user: " + currentUser.getEmail()));
        } else if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + request.getCustomerId()));
        } else {
            customer = customerRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new IllegalStateException("No customer records exist"));
        }

        // 1. NLP Classification via Python FastAPI service
        Category category = null;
        BigDecimal confidence = BigDecimal.valueOf(0.50);
        boolean isAutoClassified = true;

        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            isAutoClassified = false;
        }

        if (category == null) {
            ClassificationResponse mlResult = classificationService.classifyTicket(request.getSubject(), request.getDescription());
            String predictedCode = mlResult.getCategory();
            if (mlResult.getConfidence() != null) {
                confidence = BigDecimal.valueOf(mlResult.getConfidence());
            }

            category = categoryRepository.findByCode(predictedCode)
                    .orElseGet(() -> categoryRepository.findByCode("GENERAL_INQUIRY")
                            .orElseGet(() -> categoryRepository.findAll().stream().findFirst().orElse(null)));
        }

        // 2. Automatic Routing to Team
        Team targetTeam = routingService.determineTargetTeam(category);
        Agent assignedAgent = routingService.selectBestAgent(targetTeam);

        // 3. Priority determination
        TicketPriority priority = TicketPriority.MEDIUM;
        if (request.getPriority() != null) {
            try {
                priority = TicketPriority.valueOf(request.getPriority().toUpperCase());
            } catch (Exception ignored) {}
        } else {
            // Auto detect urgency keywords
            String text = (request.getSubject() + " " + request.getDescription()).toLowerCase();
            if (text.contains("crash") || text.contains("critical") || text.contains("down") || text.contains("timeout")) {
                priority = TicketPriority.CRITICAL;
            } else if (text.contains("urgent") || text.contains("fail") || text.contains("twice") || text.contains("error")) {
                priority = TicketPriority.HIGH;
            }
        }

        // 4. Generate Ticket Number (e.g. TKT-2026-0021)
        long count = ticketRepository.count() + 1;
        String ticketNumber = String.format("TKT-2026-%04d", count);

        // 5. Build and save Ticket
        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .customer(customer)
                .subject(request.getSubject())
                .description(request.getDescription())
                .category(category)
                .priority(priority)
                .status(TicketStatus.OPEN)
                .assignedTeam(targetTeam)
                .assignedAgent(assignedAgent)
                .classificationConfidence(confidence)
                .isAutoClassified(isAutoClassified)
                .build();

        ticket = ticketRepository.save(ticket);

        // 6. Save initial customer message
        TicketMessage initialMessage = TicketMessage.builder()
                .ticket(ticket)
                .senderUser(currentUser)
                .messageText(request.getDescription())
                .messageType(MessageType.CUSTOMER_REPLY)
                .build();
        ticketMessageRepository.save(initialMessage);

        // 7. Audit log & notifications
        auditService.recordAudit(
                currentUser,
                "TICKET_CREATE",
                "TICKET",
                ticket.getId(),
                "Created ticket " + ticket.getTicketNumber() + " (Auto-classified: " + (category != null ? category.getName() : "None") + ")"
        );

        if (assignedAgent != null) {
            notificationService.sendNotification(
                    assignedAgent.getUser(),
                    ticket,
                    "New Ticket Assigned",
                    "Ticket " + ticket.getTicketNumber() + " (" + ticket.getSubject() + ") assigned to you."
            );
        }

        return mapToResponse(ticket);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));
        return mapToResponse(ticket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsForUser(User user, String status, String priority, Long categoryId, Long teamId, String search) {
        if (user.getRole() == Role.ROLE_CUSTOMER) {
            Customer customer = customerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalStateException("Customer profile not found"));
            return ticketRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        if (user.getRole() == Role.ROLE_AGENT) {
            Agent agent = agentRepository.findByUserId(user.getId()).orElse(null);
            if (agent != null && (status == null || status.isBlank())) {
                return ticketRepository.findByAssignedAgentIdOrderByCreatedAtDesc(agent.getId())
                        .stream().map(this::mapToResponse).collect(Collectors.toList());
            }
        }

        TicketStatus statusEnum = null;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            try { statusEnum = TicketStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }

        TicketPriority priorityEnum = null;
        if (priority != null && !priority.isBlank() && !priority.equalsIgnoreCase("ALL")) {
            try { priorityEnum = TicketPriority.valueOf(priority.toUpperCase()); } catch (Exception ignored) {}
        }

        return ticketRepository.searchTickets(statusEnum, priorityEnum, categoryId, teamId, search)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId, TicketStatus newStatus, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        TicketStatus oldStatus = ticket.getStatus();
        ticket.setStatus(newStatus);

        if (newStatus == TicketStatus.RESOLVED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.CLOSED && ticket.getClosedAt() == null) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        ticket = ticketRepository.save(ticket);

        auditService.recordAudit(
                currentUser,
                "TICKET_STATUS_CHANGE",
                "TICKET",
                ticket.getId(),
                "Status changed from " + oldStatus + " to " + newStatus
        );

        notificationService.sendNotification(
                ticket.getCustomer().getUser(),
                ticket,
                "Ticket Status Updated",
                "Your ticket " + ticket.getTicketNumber() + " is now " + newStatus
        );

        return mapToResponse(ticket);
    }

    @Transactional
    public TicketResponse assignTicket(Long ticketId, Long agentId, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found with id: " + agentId));

        ticket.setAssignedAgent(agent);
        if (agent.getTeam() != null) {
            ticket.setAssignedTeam(agent.getTeam());
        }

        ticket = ticketRepository.save(ticket);

        auditService.recordAudit(
                currentUser,
                "TICKET_REASSIGN",
                "TICKET",
                ticket.getId(),
                "Assigned to agent " + agent.getUser().getFullName()
        );

        notificationService.sendNotification(
                agent.getUser(),
                ticket,
                "Ticket Reassigned",
                "Ticket " + ticket.getTicketNumber() + " was assigned to you."
        );

        return mapToResponse(ticket);
    }

    public TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .customerId(ticket.getCustomer() != null ? ticket.getCustomer().getId() : null)
                .customerName(ticket.getCustomer() != null ? ticket.getCustomer().getUser().getFullName() : null)
                .customerEmail(ticket.getCustomer() != null ? ticket.getCustomer().getUser().getEmail() : null)
                .customerCompany(ticket.getCustomer() != null ? ticket.getCustomer().getCompanyName() : null)
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .categoryId(ticket.getCategory() != null ? ticket.getCategory().getId() : null)
                .categoryName(ticket.getCategory() != null ? ticket.getCategory().getName() : null)
                .categoryCode(ticket.getCategory() != null ? ticket.getCategory().getCode() : null)
                .priority(ticket.getPriority() != null ? ticket.getPriority().name() : "MEDIUM")
                .status(ticket.getStatus() != null ? ticket.getStatus().name() : "OPEN")
                .assignedAgentId(ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getId() : null)
                .assignedAgentName(ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getUser().getFullName() : "Unassigned")
                .assignedTeamId(ticket.getAssignedTeam() != null ? ticket.getAssignedTeam().getId() : null)
                .assignedTeamName(ticket.getAssignedTeam() != null ? ticket.getAssignedTeam().getName() : "Unassigned")
                .classificationConfidence(ticket.getClassificationConfidence())
                .isAutoClassified(ticket.getIsAutoClassified())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .closedAt(ticket.getClosedAt())
                .messageCount(ticket.getMessages() != null ? ticket.getMessages().size() : 0)
                .escalationCount(ticket.getEscalations() != null ? ticket.getEscalations().size() : 0)
                .build();
    }
}
