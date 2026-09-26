package com.supportdesk.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EscalationResponse {
    private Long id;
    private Long ticketId;
    private String fromLevelCode;
    private String fromLevelName;
    private String toLevelCode;
    private String toLevelName;
    private String escalatedByName;
    private String escalationReason;
    private String pathTaken;
    private LocalDateTime createdAt;
}
