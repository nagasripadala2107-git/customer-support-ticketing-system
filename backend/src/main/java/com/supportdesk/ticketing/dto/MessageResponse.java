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
public class MessageResponse {
    private Long id;
    private Long ticketId;
    private Long senderUserId;
    private String senderName;
    private String senderRole;
    private String messageText;
    private String messageType;
    private LocalDateTime createdAt;
}
