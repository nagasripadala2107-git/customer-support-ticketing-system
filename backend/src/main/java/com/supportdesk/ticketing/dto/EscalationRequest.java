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
public class EscalationRequest {
    @NotBlank(message = "Target level code is required")
    private String targetLevelCode; // e.g. "TECHNICAL_TEAM", "SENIOR_ENGINEER", "BILLING_SPECIALIST"

    @NotBlank(message = "Escalation reason is required")
    private String reason;

    private String currentLevelCode; // Optional; defaults to current ticket escalation state or L1_SUPPORT
}
