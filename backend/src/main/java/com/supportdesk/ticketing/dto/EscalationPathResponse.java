package com.supportdesk.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EscalationPathResponse {
    private boolean routeExists;
    private String sourceLevel;
    private String targetLevel;
    private List<String> pathNodes;
    private int hopCount;
    private int totalWeight;
    private String formattedRoute;
    private List<String> traversalSequence;
    private String algorithm;
}
