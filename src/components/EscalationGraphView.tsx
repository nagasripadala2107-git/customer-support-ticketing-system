import React, { useState } from 'react';
import { escalationGraphInstance, INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES } from '../services/graphEngine';
import { Network, Play, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Escalation Graph Explorer (ADSA Architecture)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directed Weighted Graph implemented via Adjacency List with Breadth-First Search (BFS) &amp; Depth-First Search (DFS)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cycle-Free DAG (O(V+E))
          </span>
        </div>
      </div>

      {/* Control Panel: Start, Target, Algorithm */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
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
                  {n.code}
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
                  {n.code}
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
              <option value="BFS">BFS (Shortest Escalation Path)</option>
              <option value="DFS">DFS (Exhaustive Branch Exploration)</option>
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
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              {algorithm === 'BFS' ? 'Calculated Optimal Escalation Path:' : 'DFS Traversal Visitation Sequence:'}
            </span>
            <span className="font-mono text-slate-400">
              Time Complexity: <strong className="text-slate-700 font-bold">O(V + E)</strong>
            </span>
          </div>

          {algorithm === 'BFS' ? (
            <div>
              <div className="font-mono text-sm font-bold text-blue-700 bg-white p-3 rounded border border-slate-200 flex items-center gap-2 flex-wrap">
                {result.path.map((nodeCode, idx) => (
                  <React.Fragment key={nodeCode}>
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900">
                      {nodeCode}
                    </span>
                    {idx < result.path.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-4">
                <span>Total Hops: <strong className="font-mono text-slate-800">{result.totalHops}</strong></span>
                <span>·</span>
                <span>Total Edge Weight: <strong className="font-mono text-slate-800">{result.totalWeight}</strong></span>
                <span>·</span>
                <span>Visited Queue: [{result.traversalOrder.join(', ')}]</span>
              </div>
            </div>
          ) : (
            <div className="font-mono text-sm font-bold text-purple-700 bg-white p-3 rounded border border-slate-200">
              {dfsResult.join(' ──► ')}
            </div>
          )}
        </div>
      </div>

      {/* Visual SVG Graph Rendering */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900">Topology Visualization (Adjacency List Mapping)</span>
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

        <div className="w-full bg-slate-50/60 rounded-lg border border-slate-100 p-4 overflow-x-auto flex justify-center">
          <svg width="840" height="360" className="select-none">
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
              const x1 = (fromN.x || 100) + 70;
              const y1 = (fromN.y || 100) + 20;
              const x2 = (toN.x || 100) - 10;
              const y2 = (toN.y || 100) + 20;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={idx}>
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY - 10} ${x2} ${y2}`}
                    fill="none"
                    stroke={inPath ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={inPath ? '3' : '1.5'}
                    markerEnd={inPath ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)'}
                  />
                  {/* Weight Badge */}
                  <circle cx={midX} cy={midY - 10} r="9" fill="#f8fafc" stroke={inPath ? '#2563eb' : '#cbd5e1'} />
                  <text
                    x={midX}
                    y={midY - 7}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-slate-700"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const inPath = isNodeInPath(node.code);
              const isStart = node.code === startNode;
              const isTarget = node.code === targetNode;

              return (
                <g key={node.code} transform={`translate(${node.x || 100}, ${node.y || 100})`}>
                  <rect
                    width="140"
                    height="50"
                    rx="8"
                    fill={inPath ? '#eff6ff' : '#ffffff'}
                    stroke={isStart || isTarget ? '#1d4ed8' : inPath ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth={inPath ? '2' : '1'}
                    className="transition-colors"
                  />
                  <text
                    x="10"
                    y="20"
                    className={`text-[11px] font-mono font-bold ${
                      inPath ? 'fill-blue-900' : 'fill-slate-800'
                    }`}
                  >
                    {node.code}
                  </text>
                  <text x="10" y="38" className="text-[10px] fill-slate-500">
                    SLA: {node.slaHours}h · {node.teamName.split(' ')[0]}
                  </text>
                  {isStart && (
                    <circle cx="130" cy="15" r="4" fill="#16a34a" />
                  )}
                  {isTarget && (
                    <circle cx="130" cy="15" r="4" fill="#dc2626" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Adjacency List Raw Data Structure Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Adjacency List Internal Representation in Memory (Java HashMap&lt;String, List&lt;DirectedEdge&gt;&gt;)
          </h2>
        </div>
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
                  <td className="py-3 px-4 font-bold text-slate-900">{node.code}</td>
                  <td className="py-3 px-4 text-slate-700">
                    {neighbors.length === 0 ? (
                      <span className="text-slate-400">∅ (Terminal Sink Node)</span>
                    ) : (
                      neighbors.map((edge, i) => (
                        <span
                          key={i}
                          className="inline-block mr-2 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]"
                        >
                          → {edge.to} (w: {edge.weight})
                        </span>
                      ))
                    )}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-600">
                    {neighbors.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
