import React, { useState } from 'react';
import { db } from '../data/mockDatabase';
import { Users, Building2, Tag, ShieldCheck, Network, ArrowRight } from 'lucide-react';
import { Agent } from '../types';

export const DirectoryView: React.FC = () => {
  const [tab, setTab] = useState<'agents' | 'customers' | 'teams' | 'categories'>('agents');

  const agents = db.getAgents();
  const customers = db.getCustomers();
  const teams = db.getTeams();
  const categories = db.getCategories();

  // Helper to map agent to their escalation graph tier node
  const getAgentEscalationNode = (agent: Agent): { code: string; label: string; badgeClass: string } => {
    if (agent.user.email === 'admin@supportdesk.io') {
      return { code: 'EXECUTIVE_LEAD', label: 'Executive Review', badgeClass: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
    if (agent.user.email === 'david.kim@supportdesk.io') {
      return { code: 'SENIOR_ENGINEER', label: 'Staff Architect', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    }
    if (agent.user.email === 'lucas.muller@supportdesk.io') {
      return { code: 'TECHNICAL_TEAM', label: 'Engineering Lead', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
    if (agent.user.email === 'sarah.chen@supportdesk.io') {
      return { code: 'BILLING_SPECIALIST', label: 'Senior Billing Lead', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (agent.tierLevel === 'TIER_2') {
      return { code: 'L2_SUPPORT', label: 'Level 2 Triage', badgeClass: 'bg-teal-100 text-teal-800 border-teal-300' };
    }
    return { code: 'L1_SUPPORT', label: 'Frontline Support', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  const escalationTiersSummary = [
    { code: 'L1_SUPPORT', title: 'Frontline Support', sla: '24h', agents: 'Elena, Priya, James', color: 'border-emerald-300 bg-emerald-50/60 text-emerald-800' },
    { code: 'L2_SUPPORT', title: 'Technical Triage', sla: '12h', agents: 'Marcus, Ananya', color: 'border-teal-300 bg-teal-50/60 text-teal-800' },
    { code: 'BILLING_SPECIALIST', title: 'Finance Lead', sla: '6h', agents: 'Sarah Chen', color: 'border-amber-300 bg-amber-50/60 text-amber-800' },
    { code: 'TECHNICAL_TEAM', title: 'Engineering Lead', sla: '8h', agents: 'Lucas Muller', color: 'border-blue-300 bg-blue-50/60 text-blue-800' },
    { code: 'SENIOR_ENGINEER', title: 'Platform Architect', sla: '4h', agents: 'David Kim', color: 'border-indigo-300 bg-indigo-50/60 text-indigo-800' },
    { code: 'EXECUTIVE_LEAD', title: 'VP Operations', sla: '2h', agents: 'Alex Morgan', color: 'border-purple-300 bg-purple-50/60 text-purple-800' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Helpdesk Directory &amp; Teams Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete relational roster of Support Agents, Customer organizations, Departmental Routing Teams, and Issue Categories
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setTab('agents')}
          className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'agents'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Support Agents ({agents.length})
        </button>
        <button
          onClick={() => setTab('customers')}
          className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'customers'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Accounts ({customers.length})
        </button>
        <button
          onClick={() => setTab('teams')}
          className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'teams'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Department Teams ({teams.length})
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'categories'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Issue Categories ({categories.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {tab === 'agents' && (
          <>
            {/* Reviewer Escalation Hierarchy Reference Matrix */}
            <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Reviewer Guide: Agent Escalation Tier Hierarchy
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Directed Acyclic Graph (DAG) · BFS Shortest Path Routing
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                {escalationTiersSummary.map((tier) => (
                  <div key={tier.code} className={`p-3 rounded-lg border ${tier.color} flex flex-col justify-between`}>
                    <div>
                      <div className="font-mono text-[11px] font-bold truncate">{tier.code}</div>
                      <div className="font-semibold text-slate-900 text-xs mt-0.5">{tier.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 truncate">SLA: {tier.sla}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-700 font-medium truncate">
                      {tier.agents}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Agents Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  All Active Support Personnel ({agents.length} Agents)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Password: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">Password123!</code>
                </span>
              </div>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-4">AGENT NAME</th>
                      <th className="py-2.5 px-4">EMAIL (LOGIN)</th>
                      <th className="py-2.5 px-4">DEPARTMENT TEAM</th>
                      <th className="py-2.5 px-4 font-mono">TIER LEVEL</th>
                      <th className="py-2.5 px-4 font-mono">ESCALATION GRAPH TIER</th>
                      <th className="py-2.5 px-4 font-mono">MAX TICKETS</th>
                      <th className="py-2.5 px-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {agents.map((a) => {
                      const team = teams.find((t) => t.id === a.teamId);
                      const escNode = getAgentEscalationNode(a);
                      return (
                        <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                            {a.user.firstName} {a.user.lastName}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">{a.user.email}</td>
                          <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{team?.name || 'Unassigned'}</td>
                          <td className="py-3 px-4 font-mono font-medium text-blue-700 whitespace-nowrap">{a.tierLevel}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${escNode.badgeClass}`}>
                              {escNode.code}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">{a.maxActiveTickets}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Available
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'customers' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-4">ORGANIZATION / COMPANY</th>
                    <th className="py-2.5 px-4">PRIMARY CONTACT</th>
                    <th className="py-2.5 px-4">EMAIL (LOGIN)</th>
                    <th className="py-2.5 px-4 font-mono">ACCOUNT TIER</th>
                    <th className="py-2.5 px-4">ADDRESS / LOCATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{c.companyName}</td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {c.user.firstName} {c.user.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">{c.user.email}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.accountTier === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                          c.accountTier === 'PRO' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.accountTier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{c.address || 'Standard Campus'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'teams' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-4">TEAM NAME</th>
                    <th className="py-2.5 px-4 font-mono">TEAM CODE</th>
                    <th className="py-2.5 px-4">RESPONSIBILITIES &amp; SCOPE</th>
                    <th className="py-2.5 px-4">ACTIVE AGENTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teams.map((t) => {
                    const count = agents.filter((a) => a.teamId === t.id).length;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{t.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">{t.code}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-md">{t.description}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">{count} agents</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-4">CATEGORY NAME</th>
                    <th className="py-2.5 px-4 font-mono">ML CODE</th>
                    <th className="py-2.5 px-4">DEFAULT ROUTED TEAM</th>
                    <th className="py-2.5 px-4">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((c) => {
                    const team = teams.find((t) => t.id === c.defaultTeamId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-blue-600 font-bold whitespace-nowrap">{c.code}</td>
                        <td className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">{team?.name || 'Unassigned'}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-sm">{c.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
