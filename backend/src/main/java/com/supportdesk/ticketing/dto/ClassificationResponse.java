package com.supportdesk.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassificationResponse {
    private String category;
    private Double confidence;
    private String targetTeam;
    private Map<String, Double> probabilities;
    private List<Map<String, Object>> topTokens;
    private String status;
}
