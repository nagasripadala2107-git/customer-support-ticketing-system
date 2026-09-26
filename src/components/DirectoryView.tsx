import React, { useState } from 'react';
import { db } from '../data/mockDatabase';
import { Users, Building2, Tag, ShieldCheck } from 'lucide-react';

export const DirectoryView: React.FC = () => {
  const [tab, setTab] = useState<'agents' | 'customers' | 'teams' | 'categories'>('agents');

  const agents = db.getAgents();
  const customers = db.getCustomers();
  const teams = db.getTeams();
  const categories = db.getCategories();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Helpdesk Directory &amp; Teams Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Relational view of Customer organizations, Support Agents, Departmental Routing Teams, and Issue Categories
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setTab('agents')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            tab === 'agents'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Support Agents ({agents.length})
        </button>
        <button
          onClick={() => setTab('customers')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            tab === 'customers'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Accounts ({customers.length})
        </button>
        <button
          onClick={() => setTab('teams')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            tab === 'teams'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Department Teams ({teams.length})
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            tab === 'categories'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Issue Categories ({categories.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {tab === 'agents' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4">AGENT NAME</th>
                <th className="py-2.5 px-4">EMAIL</th>
                <th className="py-2.5 px-4">ASSIGNED TEAM</th>
                <th className="py-2.5 px-4 font-mono">TIER LEVEL</th>
                <th className="py-2.5 px-4 font-mono">MAX TICKETS</th>
                <th className="py-2.5 px-4">AVAILABILITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agents.map((a) => {
                const team = teams.find((t) => t.id === a.teamId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {a.user.firstName} {a.user.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{a.user.email}</td>
                    <td className="py-3 px-4 text-slate-700">{team?.name || 'Unassigned'}</td>
                    <td className="py-3 px-4 font-mono font-medium text-blue-700">{a.tierLevel}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">{a.maxActiveTickets}</td>
                    <td className="py-3 px-4">
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
        )}

        {tab === 'customers' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4">ORGANIZATION / COMPANY</th>
                <th className="py-2.5 px-4">PRIMARY CONTACT</th>
                <th className="py-2.5 px-4">EMAIL</th>
                <th className="py-2.5 px-4 font-mono">ACCOUNT TIER</th>
                <th className="py-2.5 px-4">ADDRESS / LOCATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{c.companyName}</td>
                  <td className="py-3 px-4 text-slate-700">
                    {c.user.firstName} {c.user.lastName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{c.user.email}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">{c.accountTier}</td>
                  <td className="py-3 px-4 text-slate-500">{c.address || 'Standard Campus'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'teams' && (
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
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{t.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{t.code}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">{t.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{count} agents</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {tab === 'categories' && (
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
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-bold">{c.code}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{team?.name || 'Unassigned'}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-sm">{c.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
