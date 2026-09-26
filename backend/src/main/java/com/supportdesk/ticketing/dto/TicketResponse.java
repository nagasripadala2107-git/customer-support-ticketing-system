package com.supportdesk.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String ticketNumber;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerCompany;
    private String subject;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String categoryCode;
    private String priority;
    private String status;
    private Long assignedAgentId;
    private String assignedAgentName;
    private Long assignedTeamId;
    private String assignedTeamName;
    private BigDecimal classificationConfidence;
    private Boolean isAutoClassified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private int messageCount;
    private int escalationCount;
}
