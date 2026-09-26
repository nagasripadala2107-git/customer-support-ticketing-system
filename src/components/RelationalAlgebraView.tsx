import React, { useState } from 'react';
import { executeRelationalQuery, RelationalQueryResult } from '../services/relationalAlgebra';
import { Database, Terminal, Play, BookOpen } from 'lucide-react';

export const RelationalAlgebraView: React.FC = () => {
  const queryOptions = [
    { id: 'selection_high_priority', label: '1. Selection (σ) - High & Critical Priority Tickets' },
    { id: 'projection_customer_tickets', label: '2. Projection (π) & Join (⋈) - Customer "Acme Corp" Tickets' },
    { id: 'unresolved_team_tickets', label: '3. Selection (σ) - Unresolved Billing Team Queue' },
    { id: 'join_escalations', label: '4. Natural Join (⋈) - Tickets With Escalation History' },
    { id: 'aggregate_customers_multi_open', label: '5. Aggregation (𝒢) - Customers with >1 Open Tickets' },
    { id: 'set_difference_available_agents', label: '6. Set Difference (-) - Agents with Zero Active Tickets' },
  ];

  const [selectedQueryId, setSelectedQueryId] = useState(queryOptions[0].id);
  const [queryResult, setQueryResult] = useState<RelationalQueryResult>(() =>
    executeRelationalQuery(queryOptions[0].id)
  );

  const handleSelectQuery = (id: string) => {
    setSelectedQueryId(id);
    setQueryResult(executeRelationalQuery(id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-600" />
          <span>Relational Algebra &amp; Discrete Math (DMGT / DBMS) Query Engine</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Formal evaluation of selection (σ), projection (π), natural join (⋈), set difference (−), and aggregation (𝒢) over normalized 3NF relations
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
          Select Academic Relational Operation:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {queryOptions.map((opt) => {
            const isSelected = opt.id === selectedQueryId;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectQuery(opt.id)}
                className={`p-2.5 text-left rounded-lg text-xs transition-colors border ${
                  isSelected
                    ? 'bg-purple-50 text-purple-900 border-purple-300 font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Formulation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Relational Algebra Card */}
        <div className="bg-slate-900 text-white p-5 rounded-lg space-y-3 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>RELATIONAL ALGEBRA FORMULATION</span>
            <span className="text-purple-400 font-bold">{queryResult.operator}</span>
          </div>
          <div className="p-3 rounded bg-slate-800 border border-slate-700 text-purple-300 text-sm overflow-x-auto">
            {queryResult.algebraExpression}
          </div>
          <div className="text-[11px] text-slate-400">
            Tuple Relational Calculus (TRC):
            <div className="text-emerald-400 mt-0.5 overflow-x-auto text-xs">{queryResult.trcExpression}</div>
          </div>
        </div>

        {/* SQL Equivalent Card */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>EQUIVALENT POSTGRESQL QUERY</span>
            <span className="font-mono text-slate-400">RDBMS DQL</span>
          </div>
          <pre className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-800 text-xs overflow-x-auto font-mono">
            {queryResult.sqlEquivalent}
          </pre>
          <p className="text-slate-500 text-[11px] leading-relaxed">{queryResult.description}</p>
        </div>
      </div>

      {/* Resulting Tuple Set */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Query Output Tuples (Result Relation)
          </h2>
          <span className="font-mono text-xs text-slate-500">{queryResult.rows.length} tuples returned</span>
        </div>

        {queryResult.rows.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No tuples satisfy this predicate.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium font-mono">
                <tr>
                  {queryResult.columns.map((col) => (
                    <th key={col} className="py-2.5 px-4 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queryResult.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 font-mono text-[11px]">
                    {queryResult.columns.map((col) => (
                      <td key={col} className="py-2.5 px-4 text-slate-800 whitespace-nowrap">
                        {String(row[col] ?? 'NULL')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
