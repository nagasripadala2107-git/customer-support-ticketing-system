import { EscalationPathResult, GraphNodeData } from '../types';

export interface DirectedEdgeData {
  from: string;
  to: string;
  weight: number;
  condition: string;
}

export const INITIAL_GRAPH_NODES: GraphNodeData[] = [
  {
    code: 'L1_SUPPORT',
    name: 'Level 1 Frontline Support',
    teamName: 'Technical Support Team',
    slaHours: 24,
    x: 80,
    y: 180,
  },
  {
    code: 'L2_SUPPORT',
    name: 'Level 2 Technical Triage',
    teamName: 'Technical Support Team',
    slaHours: 12,
    x: 280,
    y: 100,
  },
  {
    code: 'BILLING_SPECIALIST',
    name: 'Senior Billing Specialist',
    teamName: 'Billing & Finance Team',
    slaHours: 6,
    x: 280,
    y: 260,
  },
  {
    code: 'TECHNICAL_TEAM',
    name: 'Technical Engineering Team',
    teamName: 'Technical Support Team',
    slaHours: 8,
    x: 480,
    y: 100,
  },
  {
    code: 'SENIOR_ENGINEER',
    name: 'Staff Platform Architect',
    teamName: 'Technical Support Team',
    slaHours: 4,
    x: 680,
    y: 100,
  },
  {
    code: 'EXECUTIVE_LEAD',
    name: 'VP of Customer Success',
    teamName: 'Product Engineering Team',
    slaHours: 2,
    x: 700,
    y: 260,
  },
];

export const INITIAL_GRAPH_EDGES: DirectedEdgeData[] = [
  {
    from: 'L1_SUPPORT',
    to: 'L2_SUPPORT',
    weight: 1,
    condition: 'Technical anomaly requiring log inspection',
  },
  {
    from: 'L2_SUPPORT',
    to: 'TECHNICAL_TEAM',
    weight: 2,
    condition: 'Confirmed code defect or bug reproduction',
  },
  {
    from: 'TECHNICAL_TEAM',
    to: 'SENIOR_ENGINEER',
    weight: 3,
    condition: 'Infrastructure outage, memory leak, or kernel fault',
  },
  {
    from: 'L1_SUPPORT',
    to: 'BILLING_SPECIALIST',
    weight: 1,
    condition: 'Payment dispute, double charge, or invoice reversal',
  },
  {
    from: 'BILLING_SPECIALIST',
    to: 'EXECUTIVE_LEAD',
    weight: 2,
    condition: 'Disputed amount > $5,000 or enterprise account churn risk',
  },
  {
    from: 'SENIOR_ENGINEER',
    to: 'EXECUTIVE_LEAD',
    weight: 1,
    condition: 'Contractual enterprise SLA breach review',
  },
];

export class EscalationGraph {
  private adjacencyList: Map<string, { to: string; weight: number; condition: string }[]> = new Map();
  private nodeMap: Map<string, GraphNodeData> = new Map();

  constructor() {
    INITIAL_GRAPH_NODES.forEach((n) => {
      this.nodeMap.set(n.code, n);
      this.adjacencyList.set(n.code, []);
    });

    INITIAL_GRAPH_EDGES.forEach((e) => {
      const list = this.adjacencyList.get(e.from) || [];
      list.push({ to: e.to, weight: e.weight, condition: e.condition });
      this.adjacencyList.set(e.from, list);
    });
  }

  public getNodes(): GraphNodeData[] {
    return Array.from(this.nodeMap.values());
  }

  public getEdges(): DirectedEdgeData[] {
    const edges: DirectedEdgeData[] = [];
    this.adjacencyList.forEach((list, from) => {
      list.forEach((item) => {
        edges.push({
          from,
          to: item.to,
          weight: item.weight,
          condition: item.condition,
        });
      });
    });
    return edges;
  }

  public getNeighbors(code: string) {
    return this.adjacencyList.get(code) || [];
  }

  /**
   * Breadth-First Search (BFS) to find the shortest escalation path.
   * Time Complexity: O(V + E)
   */
  public findEscalationPath(startNode: string, targetNode: string): EscalationPathResult {
    if (!this.adjacencyList.has(startNode) || !this.adjacencyList.has(targetNode)) {
      return {
        pathExists: false,
        startNode,
        targetNode,
        path: [],
        totalHops: 0,
        totalWeight: 0,
        formattedPath: 'Unrecognized nodes in escalation graph',
        traversalOrder: [],
        algorithmUsed: 'BFS_SHORTEST_PATH',
      };
    }

    if (startNode === targetNode) {
      return {
        pathExists: true,
        startNode,
        targetNode,
        path: [startNode],
        totalHops: 0,
        totalWeight: 0,
        formattedPath: startNode,
        traversalOrder: [startNode],
        algorithmUsed: 'BFS_SHORTEST_PATH',
      };
    }

    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);
    const parentMap = new Map<string, string>();
    const weightMap = new Map<string, number>();
    const traversalOrder: string[] = [];

    weightMap.set(startNode, 0);

    let found = false;

    while (queue.length > 0) {
      const current = queue.shift()!;
      traversalOrder.push(current);

      if (current === targetNode) {
        found = true;
        break;
      }

      for (const edge of this.getNeighbors(current)) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          parentMap.set(edge.to, current);
          weightMap.set(edge.to, (weightMap.get(current) || 0) + edge.weight);
          queue.push(edge.to);
        }
      }
    }

    if (!found) {
      return {
        pathExists: false,
        startNode,
        targetNode,
        path: [],
        totalHops: 0,
        totalWeight: 0,
        formattedPath: `No viable escalation route between ${startNode} and ${targetNode}`,
        traversalOrder,
        algorithmUsed: 'BFS_SHORTEST_PATH',
      };
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | undefined = targetNode;
    while (curr) {
      path.unshift(curr);
      curr = parentMap.get(curr);
    }

    return {
      pathExists: true,
      startNode,
      targetNode,
      path,
      totalHops: path.length - 1,
      totalWeight: weightMap.get(targetNode) || path.length - 1,
      formattedPath: path.join(' → '),
      traversalOrder,
      algorithmUsed: 'BFS_SHORTEST_PATH',
    };
  }

  /**
   * Depth-First Search (DFS) Traversal
   */
  public dfsTraversal(startNode: string): string[] {
    const visited = new Set<string>();
    const order: string[] = [];

    const dfs = (node: string) => {
      visited.add(node);
      order.push(node);
      for (const edge of this.getNeighbors(node)) {
        if (!visited.has(edge.to)) {
          dfs(edge.to);
        }
      }
    };

    if (this.adjacencyList.has(startNode)) {
      dfs(startNode);
    }
    return order;
  }

  /**
   * Cycle Detection using 3-color DFS
   */
  public detectCycle(): boolean {
    const state = new Map<string, number>(); // 0: unvisited, 1: visiting, 2: visited
    this.adjacencyList.forEach((_, key) => state.set(key, 0));

    const hasCycleDFS = (node: string): boolean => {
      state.set(node, 1);
      for (const edge of this.getNeighbors(node)) {
        const s = state.get(edge.to) || 0;
        if (s === 1) return true;
        if (s === 0 && hasCycleDFS(edge.to)) return true;
      }
      state.set(node, 2);
      return false;
    };

    for (const node of this.adjacencyList.keys()) {
      if ((state.get(node) || 0) === 0) {
        if (hasCycleDFS(node)) return true;
      }
    }
    return false;
  }
}

export const escalationGraphInstance = new EscalationGraph();
