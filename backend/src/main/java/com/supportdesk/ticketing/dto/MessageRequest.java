package com.supportdesk.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    @NotBlank(message = "Message text cannot be blank")
    private String messageText;

    private String messageType; // CUSTOMER_REPLY, AGENT_REPLY, INTERNAL_NOTE
}
