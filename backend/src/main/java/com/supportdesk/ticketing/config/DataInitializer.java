package com.supportdesk.ticketing.config;

import com.supportdesk.ticketing.graph.AdjacencyListGraph;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initializes the in-memory Adjacency List Escalation Graph on application startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdjacencyListGraph escalationGraph;

    @Override
    public void run(String... args) {
        log.info("Bootstrapping Support Desk Escalation Graph (Adjacency List)...");

        // 1. Add Vertices (Escalation Nodes)
        escalationGraph.addNode("L1_SUPPORT", "Level 1 Frontline Support", "Technical Support Team", 24);
        escalationGraph.addNode("L2_SUPPORT", "Level 2 Technical Triage", "Technical Support Team", 12);
        escalationGraph.addNode("TECHNICAL_TEAM", "Technical Engineering Team", "Technical Support Team", 8);
        escalationGraph.addNode("BILLING_SPECIALIST", "Senior Billing Specialist", "Billing & Finance Team", 6);
        escalationGraph.addNode("SENIOR_ENGINEER", "Staff Platform Architect", "Technical Support Team", 4);
        escalationGraph.addNode("EXECUTIVE_LEAD", "VP of Customer Success", "Product Engineering Team", 2);

        // 2. Add Directed Edges (from, to, weight, condition)
        escalationGraph.addEdge("L1_SUPPORT", "L2_SUPPORT", 1, "Technical issue unresolved after 4 hours triage");
        escalationGraph.addEdge("L2_SUPPORT", "TECHNICAL_TEAM", 2, "Confirmed platform bug or reproducible error");
        escalationGraph.addEdge("TECHNICAL_TEAM", "SENIOR_ENGINEER", 3, "Core kernel crash or database integrity fault");
        escalationGraph.addEdge("L1_SUPPORT", "BILLING_SPECIALIST", 1, "Payment dispute, duplicate deduction, or gateway failure");
        escalationGraph.addEdge("BILLING_SPECIALIST", "EXECUTIVE_LEAD", 2, "High-value enterprise customer dispute");
        escalationGraph.addEdge("SENIOR_ENGINEER", "EXECUTIVE_LEAD", 1, "Critical SLA breach or catastrophic outage");

        log.info("Escalation Graph initialized successfully with {} nodes.", escalationGraph.getAllNodeCodes().size());
        log.info("Cycle detection check: graph contains cycle = {}", escalationGraph.detectCycle());
    }
}
