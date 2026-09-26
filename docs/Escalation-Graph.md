# Graph Algorithms & Data Structures (ADSA) - Escalation Graph

## 1. Graph Theoretical Formulation

The Support Ticket Escalation System is modeled as a **Directed Weighted Graph**:
$$G = (V, E, W)$$

Where:
- **Vertices ($V$)**: Support escalation tiers / teams:
  $$V = \{ \text{L1\_SUPPORT}, \text{L2\_SUPPORT}, \text{TECHNICAL\_TEAM}, \text{BILLING\_SPECIALIST}, \text{SENIOR\_ENGINEER}, \text{EXECUTIVE\_LEAD} \}$$
- **Directed Edges ($E \subseteq V \times V$)**: Permissible escalation transfers from tier $u$ to tier $v$:
  $$(u, v) \in E \iff \text{Tier } u \text{ is authorized to transfer tickets directly to Tier } v$$
- **Weight Function ($W: E \to \mathbb{Z}^+$)**: Administrative hop cost / SLA urgency weight.

---

## 2. Adjacency List Data Structure Representation

Instead of an $O(V^2)$ dense matrix where most entries are empty, we implement an **Adjacency List** utilizing a Hash Map of Dynamic Lists:

```java
// Java Spring Boot Backend Implementation
Map<String, List<DirectedEdge>> adjacencyList = new LinkedHashMap<>();
```

### Memory Complexity Comparison
- **Adjacency Matrix**: $\Theta(|V|^2) = \Theta(6^2) = 36$ integer slots regardless of sparsity.
- **Adjacency List**: $\Theta(|V| + |E|) = 6 \text{ nodes} + 6 \text{ edges} = 12$ references. Provides superior cache locality and optimal traversal speed.

### Topology Adjacency List Layout
```
L1_SUPPORT        ──► [ (L2_SUPPORT, weight=1), (BILLING_SPECIALIST, weight=1) ]
L2_SUPPORT        ──► [ (TECHNICAL_TEAM, weight=2) ]
TECHNICAL_TEAM    ──► [ (SENIOR_ENGINEER, weight=3) ]
BILLING_SPECIALIST──► [ (EXECUTIVE_LEAD, weight=2) ]
SENIOR_ENGINEER   ──► [ (EXECUTIVE_LEAD, weight=1) ]
EXECUTIVE_LEAD    ──► [ ]
```

---

## 3. Traversal Algorithms

### A. Breadth-First Search (BFS) - Shortest Escalation Path
When an agent selects a target escalation level, the system must compute the minimum-hop path from their current tier to the destination tier.

#### Algorithm Steps:
1. Initialize a FIFO Queue $Q$, a visited set $S$, and a parent backtracking map $P$.
2. Enqueue $u_{\text{start}}$, mark visited.
3. While $Q$ is not empty:
   - Dequeue vertex $c$.
   - If $c = v_{\text{target}}$, terminate search.
   - For each neighbor $n \in \text{Adj}[c]$:
     - If $n \notin S$:
       - Mark $n \in S$.
       - Set $P[n] = c$.
       - Enqueue $n$.
4. Reconstruct path by following $P$ from $v_{\text{target}}$ back to $u_{\text{start}}$.

#### Example Run: `findEscalationPath("L1_SUPPORT", "SENIOR_ENGINEER")`
- Queue progression:
  1. `[L1_SUPPORT]`
  2. `[L2_SUPPORT, BILLING_SPECIALIST]`
  3. `[BILLING_SPECIALIST, TECHNICAL_TEAM]`
  4. `[TECHNICAL_TEAM, EXECUTIVE_LEAD]`
  5. `[EXECUTIVE_LEAD, SENIOR_ENGINEER]` -> Target reached!
- Backtracking trace:
  $$\text{SENIOR\_ENGINEER} \leftarrow \text{TECHNICAL\_TEAM} \leftarrow \text{L2\_SUPPORT} \leftarrow \text{L1\_SUPPORT}$$
- Returned Path:
  $$\text{L1\_SUPPORT} \to \text{L2\_SUPPORT} \to \text{TECHNICAL\_TEAM} \to \text{SENIOR\_ENGINEER}$$

#### Time and Space Complexity:
- **Time Complexity**: $O(|V| + |E|)$
- **Space Complexity**: $O(|V|)$

---

### B. Depth-First Search (DFS) & Cycle Detection
To prevent circular escalation traps (e.g., $A \to B \to C \to A$), the graph must remain a **Directed Acyclic Graph (DAG)**.

We execute the **Tri-Color Cycle Detection Algorithm**:
- **White (0)**: Node not yet examined.
- **Gray (1)**: Node currently being processed in recursion stack.
- **Black (2)**: Node and all its descendants fully explored.

If during DFS from node $u$, we encounter an outgoing edge to an already **Gray** node $v$, a back-edge exists, indicating a cycle:
$$\text{State}[v] = 1 \implies \text{Cycle Detected} \implies \text{Reject Edge Insertion}$$
