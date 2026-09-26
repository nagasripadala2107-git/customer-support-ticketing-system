package com.supportdesk.ticketing;

import com.supportdesk.ticketing.graph.AdjacencyListGraph;
import com.supportdesk.ticketing.graph.EscalationPathResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ADSA Escalation Graph Test Suite")
class EscalationGraphTest {

    private AdjacencyListGraph graph;

    @BeforeEach
    void setUp() {
        graph = new AdjacencyListGraph();
        graph.addNode("L1_SUPPORT", "Level 1 Support", "Tech Team", 24);
        graph.addNode("L2_SUPPORT", "Level 2 Support", "Tech Team", 12);
        graph.addNode("TECHNICAL_TEAM", "Tech Engineering", "Tech Team", 8);
        graph.addNode("BILLING_SPECIALIST", "Billing Specialist", "Billing Team", 6);
        graph.addNode("SENIOR_ENGINEER", "Staff Architect", "Tech Team", 4);
        graph.addNode("EXECUTIVE_LEAD", "VP Success", "Exec Team", 2);

        graph.addEdge("L1_SUPPORT", "L2_SUPPORT", 1, "Unresolved L1");
        graph.addEdge("L2_SUPPORT", "TECHNICAL_TEAM", 2, "Bug verified");
        graph.addEdge("TECHNICAL_TEAM", "SENIOR_ENGINEER", 3, "Kernel crash");
        graph.addEdge("L1_SUPPORT", "BILLING_SPECIALIST", 1, "Payment dispute");
        graph.addEdge("BILLING_SPECIALIST", "EXECUTIVE_LEAD", 2, "High value SLA dispute");
        graph.addEdge("SENIOR_ENGINEER", "EXECUTIVE_LEAD", 1, "Catastrophic outage");
    }

    @Test
    @DisplayName("Test shortest escalation path via BFS")
    void testFindEscalationPathBFS() {
        EscalationPathResult result = graph.findEscalationPath("L1_SUPPORT", "SENIOR_ENGINEER");

        assertTrue(result.isPathExists());
        assertEquals(3, result.getTotalHops());
        assertEquals(List.of("L1_SUPPORT", "L2_SUPPORT", "TECHNICAL_TEAM", "SENIOR_ENGINEER"), result.getPath());
        assertEquals("L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM -> SENIOR_ENGINEER", result.getFormattedPath());
    }

    @Test
    @DisplayName("Test billing escalation path")
    void testBillingEscalationPath() {
        EscalationPathResult result = graph.findEscalationPath("L1_SUPPORT", "BILLING_SPECIALIST");

        assertTrue(result.isPathExists());
        assertEquals(1, result.getTotalHops());
        assertEquals(List.of("L1_SUPPORT", "BILLING_SPECIALIST"), result.getPath());
    }

    @Test
    @DisplayName("Test BFS level order traversal")
    void testBFSTraversal() {
        List<String> traversal = graph.bfsTraversal("L1_SUPPORT");
        assertNotNull(traversal);
        assertTrue(traversal.size() >= 5);
        assertEquals("L1_SUPPORT", traversal.get(0));
    }

    @Test
    @DisplayName("Test DFS depth first traversal")
    void testDFSTraversal() {
        List<String> traversal = graph.dfsTraversal("L1_SUPPORT");
        assertNotNull(traversal);
        assertTrue(traversal.size() >= 5);
        assertEquals("L1_SUPPORT", traversal.get(0));
    }

    @Test
    @DisplayName("Test cycle detection on acyclic DAG")
    void testCycleDetection() {
        assertFalse(graph.detectCycle(), "Escalation hierarchy should be acyclic");
    }
}
