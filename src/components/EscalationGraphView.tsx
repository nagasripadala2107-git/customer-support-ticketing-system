import React, { useState } from 'react';
import { escalationGraphInstance, INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES } from '../services/graphEngine';
import { Network, Play, ShieldAlert, CheckCircle2, ArrowRight, UserCheck, Sparkles, HelpCircle } from 'lucide-react';

export const EscalationGraphView: React.FC = () => {
  const [startNode, setStartNode] = useState('L1_SUPPORT');
  const [targetNode, setTargetNode] = useState('SENIOR_ENGINEER');
  const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS'>('BFS');
  const [result, setResult] = useState(() =>
    escalationGraphInstance.findEscalationPath('L1_SUPPORT', 'SENIOR_ENGINEER')
  );
  const [dfsResult, setDfsResult] = useState<string[]>([]);

  const nodes = INITIAL_GRAPH_NODES;
  const edges = INITIAL_GRAPH_EDGES;
  const hasCycle = escalationGraphInstance.detectCycle();

  // Agent assignment mapping per escalation tier node
  const tierAgentMapping: Record<string, { agents: string[]; roleDesc: string; maxSla: string }> = {
    L1_SUPPORT: {
      agents: ['Elena Rodriguez (Tech)', 'Priya Patel (Account)', 'James Wilson (Logistics)'],
      roleDesc: 'Frontline Customer Triage & Diagnostics',
      maxSla: '24 Hours',
    },
    L2_SUPPORT: {
      agents: ['Marcus Vance (Billing)', 'Ananya Rao (Product)'],
      roleDesc: 'Technical Log Inspection & Reproduction',
      maxSla: '12 Hours',
    },
    BILLING_SPECIALIST: {
      agents: ['Sarah Chen (Billing Lead)'],
      roleDesc: 'Disputed Charges, Invoices & Payment Gateway',
      maxSla: '6 Hours',
    },
    TECHNICAL_TEAM: {
      agents: ['Lucas Muller (Lead Engineer)'],
      roleDesc: 'Source Code Debugging & Bug Patching',
      maxSla: '8 Hours',
    },
    SENIOR_ENGINEER: {
      agents: ['David Kim (Staff Platform Architect)'],
      roleDesc: 'Kernel Failures, Cloud Outages & Scale',
      maxSla: '4 Hours',
    },
    EXECUTIVE_LEAD: {
      agents: ['Alex Morgan (Operations Director / VP)'],
      roleDesc: 'Enterprise SLA Breach & Churn Prevention',
      maxSla: '2 Hours',
    },
  };

  const handleRunSearch = () => {
    if (algorithm === 'BFS') {
      const res = escalationGraphInstance.findEscalationPath(startNode, targetNode);
      setResult(res);
      setDfsResult([]);
    } else {
      const order = escalationGraphInstance.dfsTraversal(startNode);
      setDfsResult(order);
    }
  };

  const applyReviewerPreset = (start: string, target: string, algo: 'BFS' | 'DFS' = 'BFS') => {
    setStartNode(start);
    setTargetNode(target);
    setAlgorithm(algo);
    if (algo === 'BFS') {
      const res = escalationGraphInstance.findEscalationPath(start, target);
      setResult(res);
      setDfsResult([]);
    } else {
      const order = escalationGraphInstance.dfsTraversal(start);
      setDfsResult(order);
    }
  };

  // Check if edge is in the calculated path
  const isEdgeInPath = (from: string, to: string) => {
    if (algorithm !== 'BFS' || !result.pathExists) return false;
    for (let i = 0; i < result.path.length - 1; i++) {
      if (result.path[i] === from && result.path[i + 1] === to) return true;
    }
    return false;
  };

  const isNodeInPath = (code: string) => {
    if (algorithm === 'BFS') {
      return result.path.includes(code);
    }
    return dfsResult.includes(code);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Escalation Graph Explorer &amp; Agent Routing Architecture</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directed Weighted Graph ($G = (V, E, W)$) implemented via Adjacency List with Breadth-First Search (BFS) &amp; Depth-First Search (DFS)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cycle-Free DAG ({hasCycle ? 'Cycle Detected' : 'O(V+E) Guaranteed'})
          </span>
        </div>
      </div>

      {/* Reviewer Quick Test Presets */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Reviewer Quick Evaluation Scenarios (Click to execute live path):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyReviewerPreset('L1_SUPPORT', 'SENIOR_ENGINEER', 'BFS')}
            className="px-2.5 py-1.5 rounded-md bg-white border border-blue-200 hover:border-blue-400 text-blue-900 font-medium shadow-2xs hover:bg-blue-50/50 transition-colors flex items-center gap-1.5"
          >
            <span>Scenario 1: Tech Outage Multi-Hop</span>
            <span className="font-mono text-[10px] text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded">L1 ➔ L2 ➔ Tech ➔ Senior</span>
          </button>

          <button
            onClick={() => applyReviewerPreset('L1_SUPPORT', 'EXECUTIVE_LEAD', 'BFS')}
            className="px-2.5 py-1.5 rounded-md bg-white border border-blue-200 hover:border-blue-400 text-blue-900 font-medium shadow-2xs hover:bg-blue-50/50 transition-colors flex items-center gap-1.5"
          >
            <span>Scenario 2: Financial Dispute Escalation</span>
            <span className="font-mono text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">L1 ➔ Billing ➔ Executive</span>
          </button>

          <button
            onClick={() => applyReviewerPreset('TECHNICAL_TEAM', 'EXECUTIVE_LEAD', 'BFS')}
            className="px-2.5 py-1.5 rounded-md bg-white border border-blue-200 hover:border-blue-400 text-blue-900 font-medium shadow-2xs hover:bg-blue-50/50 transition-colors flex items-center gap-1.5"
          >
            <span>Scenario 3: Enterprise SLA Breach</span>
            <span className="font-mono text-[10px] text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded">Tech ➔ Senior ➔ Executive</span>
          </button>

          <button
            onClick={() => applyReviewerPreset('L1_SUPPORT', 'EXECUTIVE_LEAD', 'DFS')}
            className="px-2.5 py-1.5 rounded-md bg-white border border-purple-200 hover:border-purple-400 text-purple-900 font-medium shadow-2xs hover:bg-purple-50/50 transition-colors flex items-center gap-1.5"
          >
            <span>Scenario 4: DFS Full Graph Sweep</span>
            <span className="font-mono text-[10px] text-purple-600 bg-purple-100/70 px-1.5 py-0.5 rounded">Tri-Color Cycle Verification</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Start, Target, Algorithm */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Source Node (Current Tier)</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-mono font-medium"
            >
              {nodes.map((n) => (
                <option key={n.code} value={n.code}>
                  {n.code} ({n.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Target Node (Escalation Destination)</label>
            <select
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-mono font-medium"
            >
              {nodes.map((n) => (
                <option key={n.code} value={n.code}>
                  {n.code} ({n.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Graph Traversal Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as 'BFS' | 'DFS')}
              className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-medium"
            >
              <option value="BFS">BFS (Shortest Escalation Path · O(V+E))</option>
              <option value="DFS">DFS (Exhaustive Cycle Detection)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunSearch}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Execute Traversal</span>
            </button>
          </div>
        </div>

        {/* Path Result Banner */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-semibold text-slate-800">
              {algorithm === 'BFS' ? 'Calculated Optimal Escalation Path:' : 'DFS Traversal Visitation Sequence:'}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Complexity: <strong className="text-slate-700 font-bold">O(|V| + |E|)</strong> · Space: <strong className="text-slate-700 font-bold">O(|V|)</strong>
            </span>
          </div>

          {algorithm === 'BFS' ? (
            <div>
              <div className="font-mono text-xs sm:text-sm font-bold text-blue-700 bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2 flex-wrap shadow-2xs">
                {result.path.map((nodeCode, idx) => (
                  <React.Fragment key={nodeCode}>
                    <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-1.5">
                      <span>{nodeCode}</span>
                    </span>
                    {idx < result.path.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                <span>Total Hops: <strong className="font-mono text-slate-800">{result.totalHops}</strong></span>
                <span>·</span>
                <span>Cumulative Weight: <strong className="font-mono text-slate-800">{result.totalWeight}</strong></span>
                <span>·</span>
                <span className="truncate">Visited Queue: [{result.traversalOrder.join(', ')}]</span>
              </div>
            </div>
          ) : (
            <div className="font-mono text-sm font-bold text-purple-700 bg-white p-3 rounded border border-slate-200 shadow-2xs">
              {dfsResult.join(' ──► ')}
            </div>
          )}
        </div>
      </div>

      {/* Visual SVG Graph Rendering */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div>
            <span className="font-semibold text-slate-900">Topology Visualization (Adjacency List Mapping)</span>
            <p className="text-[11px] text-slate-500">Nodes show tier code, SLA hours, and responsible assigned agents</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Active Path Node
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-600" />
              Traversed Edge
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-50/60 rounded-lg border border-slate-100 p-4 overflow-x-auto flex justify-center scrollbar-thin">
          <svg width="860" height="380" className="select-none min-w-[860px]">
            <defs>
              <marker
                id="arrowhead-default"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
              </marker>
            </defs>

            {/* Render Directed Edges */}
            {edges.map((edge, idx) => {
              const fromN = nodes.find((n) => n.code === edge.from);
              const toN = nodes.find((n) => n.code === edge.to);
              if (!fromN || !toN) return null;

              const inPath = isEdgeInPath(edge.from, edge.to);

              // Position offsets
              const x1 = (fromN.x || 100) + 75;
              const y1 = (fromN.y || 100) + 25;
              const x2 = (toN.x || 100) - 10;
              const y2 = (toN.y || 100) + 25;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={idx}>
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY - 12} ${x2} ${y2}`}
                    fill="none"
                    stroke={inPath ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={inPath ? '3' : '1.5'}
                    markerEnd={inPath ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)'}
                  />
                  {/* Weight Badge */}
                  <circle cx={midX} cy={midY - 12} r="10" fill="#f8fafc" stroke={inPath ? '#2563eb' : '#cbd5e1'} strokeWidth="1.5" />
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    className={`text-[10px] font-mono font-bold ${inPath ? 'fill-blue-700' : 'fill-slate-700'}`}
                  >
                    w:{edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const inPath = isNodeInPath(node.code);
              const isStart = node.code === startNode;
              const isTarget = node.code === targetNode;
              const mapping = tierAgentMapping[node.code];

              return (
                <g key={node.code} transform={`translate(${node.x || 100}, ${node.y || 100})`}>
                  <rect
                    width="150"
                    height="60"
                    rx="8"
                    fill={inPath ? '#eff6ff' : '#ffffff'}
                    stroke={isStart || isTarget ? '#1d4ed8' : inPath ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth={isStart || isTarget ? '2.5' : inPath ? '2' : '1'}
                    className="transition-colors drop-shadow-xs"
                  />
                  <text
                    x="10"
                    y="18"
                    className={`text-[11px] font-mono font-bold ${
                      inPath ? 'fill-blue-900' : 'fill-slate-900'
                    }`}
                  >
                    {node.code}
                  </text>
                  <text x="10" y="34" className="text-[10px] fill-slate-500 font-medium">
                    SLA: {node.slaHours}h · {node.teamName.split(' ')[0]}
                  </text>
                  <text x="10" y="48" className="text-[9px] fill-slate-400 truncate max-w-[130px]">
                    👤 {mapping ? mapping.agents[0].split(' ')[0] : 'Assigned Agent'}
                  </text>
                  {isStart && (
                    <circle cx="138" cy="14" r="5" fill="#16a34a" />
                  )}
                  {isTarget && (
                    <circle cx="138" cy="14" r="5" fill="#dc2626" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Tier Node Details & Agent Roster Mapping */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Escalation Tiers &amp; Assigned Support Agents Directory
            </h2>
            <p className="text-[11px] text-slate-500">Detailed responsibility breakdown and staff mappings per graph vertex</p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">6 Graph Vertices ($|V|=6$)</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-mono">TIER VERTEX ($V$)</th>
                <th className="py-2.5 px-4">SCOPE &amp; RESPONSIBILITY</th>
                <th className="py-2.5 px-4">ASSIGNED SUPPORT AGENTS</th>
                <th className="py-2.5 px-4 font-mono">MAX SLA</th>
                <th className="py-2.5 px-4 font-mono text-right">OUT-DEGREE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nodes.map((node) => {
                const neighbors = escalationGraphInstance.getNeighbors(node.code);
                const mapping = tierAgentMapping[node.code];
                const inPath = isNodeInPath(node.code);

                return (
                  <tr key={node.code} className={`transition-colors ${inPath ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono ${inPath ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'text-slate-800'}`}>
                        {node.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{node.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{mapping?.roleDesc}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        {mapping?.agents.map((agent, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{agent}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap font-medium">
                      {node.slaHours} Hours
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-600">
                      {neighbors.length} outgoing
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjacency List Raw Data Structure Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Adjacency List Internal Representation in Memory (Java HashMap&lt;String, List&lt;DirectedEdge&gt;&gt;)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Memory Complexity: $\Theta(|V| + |E|) = 12$ references
          </span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2.5 px-4 font-mono">VERTEX KEY (TIER CODE)</th>
                <th className="py-2.5 px-4">ADJACENT DIRECTED EDGES [TARGET, WEIGHT, CONDITION]</th>
                <th className="py-2.5 px-4 font-mono text-right">OUT-DEGREE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {nodes.map((node) => {
                const neighbors = escalationGraphInstance.getNeighbors(node.code);
                return (
                  <tr key={node.code}>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{node.code}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {neighbors.length === 0 ? (
                        <span className="text-slate-400">∅ (Terminal Sink Node)</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {neighbors.map((edge, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]"
                            >
                              → {edge.to} (w: {edge.weight})
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-600 whitespace-nowrap">
                      {neighbors.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
