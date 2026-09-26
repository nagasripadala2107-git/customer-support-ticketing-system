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
public class TicketRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private Long customerId;
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private Long categoryId; // Optional: If omitted, ML classifier determines it
}
