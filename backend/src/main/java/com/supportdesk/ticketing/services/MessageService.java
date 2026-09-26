package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.dto.MessageRequest;
import com.supportdesk.ticketing.dto.MessageResponse;
import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.TicketMessageRepository;
import com.supportdesk.ticketing.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final TicketMessageRepository ticketMessageRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesByTicket(Long ticketId) {
        return ticketMessageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse addMessage(Long ticketId, MessageRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        MessageType messageType = MessageType.CUSTOMER_REPLY;
        if (currentUser.getRole() == Role.ROLE_AGENT || currentUser.getRole() == Role.ROLE_ADMIN) {
            if ("INTERNAL_NOTE".equalsIgnoreCase(request.getMessageType())) {
                messageType = MessageType.INTERNAL_NOTE;
            } else {
                messageType = MessageType.AGENT_REPLY;
                // If agent replied to customer, change status if it was waiting
                if (ticket.getStatus() == TicketStatus.OPEN) {
                    ticket.setStatus(TicketStatus.IN_PROGRESS);
                    ticketRepository.save(ticket);
                }
            }
        } else {
            // Customer replied
            if (ticket.getStatus() == TicketStatus.WAITING_FOR_CUSTOMER) {
                ticket.setStatus(TicketStatus.IN_PROGRESS);
                ticketRepository.save(ticket);
            }
        }

        TicketMessage message = TicketMessage.builder()
                .ticket(ticket)
                .senderUser(currentUser)
                .messageText(request.getMessageText())
                .messageType(messageType)
                .build();

        message = ticketMessageRepository.save(message);

        // Notify other party
        if (messageType == MessageType.CUSTOMER_REPLY && ticket.getAssignedAgent() != null) {
            notificationService.sendNotification(
                    ticket.getAssignedAgent().getUser(),
                    ticket,
                    "Customer Replied",
                    "Customer replied on ticket " + ticket.getTicketNumber()
            );
        } else if (messageType == MessageType.AGENT_REPLY && ticket.getCustomer() != null) {
            notificationService.sendNotification(
                    ticket.getCustomer().getUser(),
                    ticket,
                    "Agent Replied",
                    "Support agent replied to ticket " + ticket.getTicketNumber()
            );
        }

        auditService.recordAudit(
                currentUser,
                "TICKET_MESSAGE_ADD",
                "TICKET",
                ticket.getId(),
                "Added message (" + messageType + ")"
        );

        return mapToResponse(message);
    }

    private MessageResponse mapToResponse(TicketMessage msg) {
        return MessageResponse.builder()
                .id(msg.getId())
                .ticketId(msg.getTicket().getId())
                .senderUserId(msg.getSenderUser().getId())
                .senderName(msg.getSenderUser().getFullName())
                .senderRole(msg.getSenderUser().getRole().name())
                .messageText(msg.getMessageText())
                .messageType(msg.getMessageType().name())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
