package com.supportdesk.ticketing.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EscalationPathResult {
    private boolean pathExists;
    private String startNode;
    private String targetNode;
    private List<String> path;
    private int totalHops;
    private int totalWeight;
    private String formattedPath;
    private List<String> traversalOrder;
    private String algorithmUsed;
}
