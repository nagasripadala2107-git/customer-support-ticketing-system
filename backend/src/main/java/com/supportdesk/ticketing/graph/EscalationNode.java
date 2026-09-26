package com.supportdesk.ticketing.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EscalationNode {
    private String code;
    private String name;
    private String teamName;
    private int slaHours;
}
