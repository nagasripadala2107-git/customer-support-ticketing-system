package com.supportdesk.ticketing.controllers;

import com.supportdesk.ticketing.dto.EscalationPathResponse;
import com.supportdesk.ticketing.dto.EscalationRequest;
import com.supportdesk.ticketing.dto.EscalationResponse;
import com.supportdesk.ticketing.entities.TicketEscalation;
import com.supportdesk.ticketing.entities.User;
import com.supportdesk.ticketing.graph.AdjacencyListGraph;
import com.supportdesk.ticketing.repositories.TicketEscalationRepository;
import com.supportdesk.ticketing.repositories.UserRepository;
import com.supportdesk.ticketing.services.EscalationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EscalationController {

    private final EscalationService escalationService;
    private final AdjacencyListGraph escalationGraph;
    private final TicketEscalationRepository ticketEscalationRepository;
    private final UserRepository userRepository;

    @PostMapping("/tickets/{ticketId}/escalate")
    public ResponseEntity<EscalationResponse> escalateTicket(
            @PathVariable Long ticketId,
            @Valid @RequestBody EscalationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        EscalationResponse response = escalationService.escalateTicket(ticketId, request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/tickets/{ticketId}/escalations")
    public ResponseEntity<List<EscalationResponse>> getTicketEscalations(@PathVariable Long ticketId) {
        List<TicketEscalation> list = ticketEscalationRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
        List<EscalationResponse> responses = list.stream().map(e -> EscalationResponse.builder()
                .id(e.getId())
                .ticketId(e.getTicket().getId())
                .fromLevelCode(e.getFromLevel().getLevelCode())
                .fromLevelName(e.getFromLevel().getName())
                .toLevelCode(e.getToLevel().getLevelCode())
                .toLevelName(e.getToLevel().getName())
                .escalatedByName(e.getEscalatedByUser().getFullName())
                .escalationReason(e.getEscalationReason())
                .pathTaken(e.getPathTaken())
                .createdAt(e.getCreatedAt())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/escalation/path")
    public ResponseEntity<EscalationPathResponse> getEscalationPath(
            @RequestParam(defaultValue = "L1_SUPPORT") String start,
            @RequestParam(defaultValue = "SENIOR_ENGINEER") String target) {
        return ResponseEntity.ok(escalationService.calculateEscalationPath(start, target));
    }

    @GetMapping("/escalation/graph")
    public ResponseEntity<Map<String, Object>> getGraphStructure() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("nodes", escalationGraph.getAllNodes().values());
        
        List<Map<String, Object>> edges = new ArrayList<>();
        escalationGraph.getAdjacencyList().forEach((from, edgeList) -> {
            for (AdjacencyListGraph.DirectedEdge edge : edgeList) {
                edges.add(Map.of(
                        "from", from,
                        "to", edge.getTargetNode(),
                        "weight", edge.getWeight(),
                        "condition", edge.getCondition() != null ? edge.getCondition() : ""
                ));
            }
        });
        response.put("edges", edges);
        response.put("bfsSampleL1", escalationGraph.bfsTraversal("L1_SUPPORT"));
        response.put("dfsSampleL1", escalationGraph.dfsTraversal("L1_SUPPORT"));
        response.put("cycleDetected", escalationGraph.detectCycle());
        return ResponseEntity.ok(response);
    }
}
