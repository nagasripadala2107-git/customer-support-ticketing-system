package com.supportdesk.ticketing.graph;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * ADSA Core Requirement:
 * Escalation Graph implemented as an Adjacency List.
 * Provides BFS and DFS traversals, cycle detection, and shortest escalation path calculation.
 */
@Component
public class AdjacencyListGraph {

    public static class DirectedEdge {
        @Getter
        private final String targetNode;
        @Getter
        private final int weight;
        @Getter
        private final String condition;

        public DirectedEdge(String targetNode, int weight, String condition) {
            this.targetNode = targetNode;
            this.weight = weight;
            this.condition = condition;
        }
    }

    private final Map<String, EscalationNode> nodeMetadata = new LinkedHashMap<>();
    private final Map<String, List<DirectedEdge>> adjacencyList = new LinkedHashMap<>();

    public synchronized void addNode(String code, String name, String teamName, int slaHours) {
        nodeMetadata.putIfAbsent(code, EscalationNode.builder()
                .code(code)
                .name(name)
                .teamName(teamName)
                .slaHours(slaHours)
                .build());
        adjacencyList.putIfAbsent(code, new ArrayList<>());
    }

    public synchronized void addEdge(String fromNode, String toNode, int weight, String condition) {
        if (!adjacencyList.containsKey(fromNode)) {
            addNode(fromNode, fromNode, "Support Team", 24);
        }
        if (!adjacencyList.containsKey(toNode)) {
            addNode(toNode, toNode, "Support Team", 24);
        }
        // Avoid duplicate edges
        List<DirectedEdge> edges = adjacencyList.get(fromNode);
        boolean exists = edges.stream().anyMatch(e -> e.getTargetNode().equals(toNode));
        if (!exists) {
            edges.add(new DirectedEdge(toNode, weight, condition));
        }
    }

    public boolean hasEdge(String from, String to) {
        List<DirectedEdge> edges = adjacencyList.get(from);
        if (edges == null) return false;
        return edges.stream().anyMatch(e -> e.getTargetNode().equals(to));
    }

    public List<DirectedEdge> getNeighbors(String node) {
        return adjacencyList.getOrDefault(node, Collections.emptyList());
    }

    public EscalationNode getNode(String code) {
        return nodeMetadata.get(code);
    }

    public Set<String> getAllNodeCodes() {
        return adjacencyList.keySet();
    }

    public Map<String, List<DirectedEdge>> getAdjacencyList() {
        return Collections.unmodifiableMap(adjacencyList);
    }

    public Map<String, EscalationNode> getAllNodes() {
        return Collections.unmodifiableMap(nodeMetadata);
    }

    /**
     * Breadth-First Search (BFS) Traversal:
     * Explores graph level by level starting from source node.
     * Time Complexity: O(V + E)
     * Space Complexity: O(V)
     */
    public List<String> bfsTraversal(String startNode) {
        List<String> visitedOrder = new ArrayList<>();
        if (!adjacencyList.containsKey(startNode)) {
            return visitedOrder;
        }

        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();

        visited.add(startNode);
        queue.add(startNode);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            visitedOrder.add(current);

            for (DirectedEdge edge : getNeighbors(current)) {
                if (!visited.contains(edge.getTargetNode())) {
                    visited.add(edge.getTargetNode());
                    queue.add(edge.getTargetNode());
                }
            }
        }
        return visitedOrder;
    }

    /**
     * Depth-First Search (DFS) Traversal:
     * Explores branches as deep as possible before backtracking.
     * Time Complexity: O(V + E)
     */
    public List<String> dfsTraversal(String startNode) {
        List<String> visitedOrder = new ArrayList<>();
        if (!adjacencyList.containsKey(startNode)) {
            return visitedOrder;
        }
        Set<String> visited = new HashSet<>();
        dfsHelper(startNode, visited, visitedOrder);
        return visitedOrder;
    }

    private void dfsHelper(String current, Set<String> visited, List<String> visitedOrder) {
        visited.add(current);
        visitedOrder.add(current);

        for (DirectedEdge edge : getNeighbors(current)) {
            if (!visited.contains(edge.getTargetNode())) {
                dfsHelper(edge.getTargetNode(), visited, visitedOrder);
            }
        }
    }

    /**
     * Shortest Escalation Path using BFS:
     * Computes optimal route from startNode to targetNode.
     * Returns structured result containing path, hops, formatted string, and traversal order.
     */
    public EscalationPathResult findEscalationPath(String startNode, String targetNode) {
        if (!adjacencyList.containsKey(startNode) || !adjacencyList.containsKey(targetNode)) {
            return EscalationPathResult.builder()
                    .pathExists(false)
                    .startNode(startNode)
                    .targetNode(targetNode)
                    .path(Collections.emptyList())
                    .totalHops(0)
                    .formattedPath("No route exists (nodes not recognized)")
                    .algorithmUsed("BFS_SHORTEST_PATH")
                    .build();
        }

        if (startNode.equals(targetNode)) {
            return EscalationPathResult.builder()
                    .pathExists(true)
                    .startNode(startNode)
                    .targetNode(targetNode)
                    .path(List.of(startNode))
                    .totalHops(0)
                    .formattedPath(startNode)
                    .algorithmUsed("BFS_SHORTEST_PATH")
                    .build();
        }

        Queue<String> queue = new LinkedList<>();
        Map<String, String> parentMap = new HashMap<>();
        Map<String, Integer> weightMap = new HashMap<>();
        Set<String> visited = new HashSet<>();
        List<String> traversalOrder = new ArrayList<>();

        queue.add(startNode);
        visited.add(startNode);
        parentMap.put(startNode, null);
        weightMap.put(startNode, 0);

        boolean found = false;

        while (!queue.isEmpty()) {
            String current = queue.poll();
            traversalOrder.add(current);

            if (current.equals(targetNode)) {
                found = true;
                break;
            }

            for (DirectedEdge edge : getNeighbors(current)) {
                String neighbor = edge.getTargetNode();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parentMap.put(neighbor, current);
                    weightMap.put(neighbor, weightMap.get(current) + edge.getWeight());
                    queue.add(neighbor);
                }
            }
        }

        if (!found) {
            return EscalationPathResult.builder()
                    .pathExists(false)
                    .startNode(startNode)
                    .targetNode(targetNode)
                    .path(Collections.emptyList())
                    .totalHops(0)
                    .formattedPath("No viable escalation route between " + startNode + " and " + targetNode)
                    .traversalOrder(traversalOrder)
                    .algorithmUsed("BFS_SHORTEST_PATH")
                    .build();
        }

        // Reconstruct path by backtracking parentMap
        LinkedList<String> path = new LinkedList<>();
        String curr = targetNode;
        while (curr != null) {
            path.addFirst(curr);
            curr = parentMap.get(curr);
        }

        String formatted = String.join(" -> ", path);

        return EscalationPathResult.builder()
                .pathExists(true)
                .startNode(startNode)
                .targetNode(targetNode)
                .path(path)
                .totalHops(path.size() - 1)
                .totalWeight(weightMap.getOrDefault(targetNode, path.size() - 1))
                .formattedPath(formatted)
                .traversalOrder(traversalOrder)
                .algorithmUsed("BFS_SHORTEST_PATH")
                .build();
    }

    /**
     * Find all possible escalation paths between start and target using DFS backtracking.
     */
    public List<List<String>> findAllPaths(String start, String target) {
        List<List<String>> allPaths = new ArrayList<>();
        if (!adjacencyList.containsKey(start) || !adjacencyList.containsKey(target)) {
            return allPaths;
        }
        Set<String> isVisited = new LinkedHashSet<>();
        List<String> currentPath = new ArrayList<>();
        currentPath.add(start);
        findAllPathsDFS(start, target, isVisited, currentPath, allPaths);
        return allPaths;
    }

    private void findAllPathsDFS(String u, String d, Set<String> isVisited, List<String> currentPath, List<List<String>> allPaths) {
        if (u.equals(d)) {
            allPaths.add(new ArrayList<>(currentPath));
            return;
        }

        isVisited.add(u);

        for (DirectedEdge edge : getNeighbors(u)) {
            String v = edge.getTargetNode();
            if (!isVisited.contains(v)) {
                currentPath.add(v);
                findAllPathsDFS(v, d, isVisited, currentPath, allPaths);
                currentPath.remove(currentPath.size() - 1);
            }
        }

        isVisited.remove(u);
    }

    /**
     * Detects cycles in directed graph using DFS coloring:
     * 0: unvisited, 1: visiting (in call stack), 2: fully processed.
     */
    public boolean detectCycle() {
        Map<String, Integer> state = new HashMap<>(); // 0: White, 1: Gray, 2: Black
        for (String node : adjacencyList.keySet()) {
            state.put(node, 0);
        }

        for (String node : adjacencyList.keySet()) {
            if (state.get(node) == 0) {
                if (hasCycleDFS(node, state)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean hasCycleDFS(String current, Map<String, Integer> state) {
        state.put(current, 1); // Mark as currently exploring in stack

        for (DirectedEdge edge : getNeighbors(current)) {
            String neighbor = edge.getTargetNode();
            Integer neighborState = state.getOrDefault(neighbor, 0);
            if (neighborState == 1) {
                return true; // Cycle detected!
            }
            if (neighborState == 0 && hasCycleDFS(neighbor, state)) {
                return true;
            }
        }

        state.put(current, 2); // Fully processed
        return false;
    }
}
