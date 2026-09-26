import React from 'react';
import { User, Ticket, Team } from '../types';
import {
  Inbox,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  PlusCircle,
  FolderGit2,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  tickets: Ticket[];
  teams: Team[];
  onOpenTicket: (ticketId: number) => void;
  onCreateTicketClick: () => void;
  onNavigateToGraph: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  tickets,
  teams,
  onOpenTicket,
  onCreateTicketClick,
  onNavigateToGraph,
}) => {
  const isCustomer = currentUser.role === 'ROLE_CUSTOMER';
  const isAgent = currentUser.role === 'ROLE_AGENT';
  const isAdmin = currentUser.role === 'ROLE_ADMIN';

  // Metrics calculation
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const escalatedCount = tickets.filter((t) => t.status === 'ESCALATED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const criticalCount = tickets.filter((t) => t.priority === 'CRITICAL').length;

  // Filter for Customer
  const myCustomerTickets = isCustomer
    ? tickets.filter((t) => t.customer?.userId === currentUser.id)
    : tickets;

  // Filter for Agent
  const myAgentTickets = isAgent
    ? tickets.filter((t) => t.assignedAgent?.userId === currentUser.id)
    : tickets;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    const name = t.category?.name || 'General Inquiry';
    categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  // Priority counts
  const priorityCounts: Record<string, number> = {
    LOW: tickets.filter((t) => t.priority === 'LOW').length,
    MEDIUM: tickets.filter((t) => t.priority === 'MEDIUM').length,
    HIGH: tickets.filter((t) => t.priority === 'HIGH').length,
    CRITICAL: tickets.filter((t) => t.priority === 'CRITICAL').length,
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isCustomer ? 'Customer Support Portal' : isAgent ? 'Agent Helpdesk Console' : 'Operational Administration'}
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Welcome, {currentUser.firstName} {currentUser.lastName}</span>
            <span>·</span>
            <span>
              Organization:{' '}
              {isCustomer
                ? myCustomerTickets[0]?.customer?.companyName || 'Acme Corporation'
                : 'Support Desk Global Operations'}
            </span>
            <span>·</span>
            <span className="font-mono text-blue-600 font-semibold">{currentUser.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCreateTicketClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>

          <button
            onClick={onNavigateToGraph}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-blue-600" />
            <span>View Escalation Graph</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Tickets</span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {isCustomer ? myCustomerTickets.length : total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all categories</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Open Queue</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            {isCustomer ? myCustomerTickets.filter((t) => t.status === 'OPEN').length : openCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting response</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>In Progress</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {isCustomer ? myCustomerTickets.filter((t) => t.status === 'IN_PROGRESS').length : inProgressCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Under investigation</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Escalated</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
            {isCustomer ? myCustomerTickets.filter((t) => t.status === 'ESCALATED').length : escalatedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Graph BFS routed</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Resolved</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {isCustomer ? myCustomerTickets.filter((t) => t.status === 'RESOLVED').length : resolvedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Closed or verified</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Avg SLA Response</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">4.2h</div>
          <div className="text-[11px] text-emerald-600 mt-1">Target &lt; 8.0h</div>
        </div>
      </div>

      {/* Admin Analytics / Distribution Section */}
      {(isAdmin || isAgent) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Tickets by Category (NLP Classification)</h2>
                <p className="text-xs text-slate-500">Distribution generated via Python TF-IDF + Logistic Regression</p>
              </div>
              <span className="text-xs font-mono text-slate-400">7 Active Domains</span>
            </div>

            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([catName, count]) => {
                const percentage = Math.round((count / (total || 1)) * 100);
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{catName}</span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} tickets · {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-slate-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity & Team Workload */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Priority Breakdown</h2>
              <p className="text-xs text-slate-500 mb-3">Service level classification</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[11px]">CRITICAL</div>
                  <div className="text-lg font-bold font-mono text-rose-600">{priorityCounts.CRITICAL}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[11px]">HIGH</div>
                  <div className="text-lg font-bold font-mono text-amber-600">{priorityCounts.HIGH}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[11px]">MEDIUM</div>
                  <div className="text-lg font-bold font-mono text-blue-600">{priorityCounts.MEDIUM}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[11px]">LOW</div>
                  <div className="text-lg font-bold font-mono text-slate-600">{priorityCounts.LOW}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-semibold text-slate-900 mb-2">Team Workload Distribution</h3>
              <div className="space-y-2 text-xs">
                {teams.slice(0, 4).map((team) => {
                  const teamTickets = tickets.filter((t) => t.assignedTeamId === team.id).length;
                  return (
                    <div key={team.id} className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-600 truncate max-w-[180px]">{team.name}</span>
                      <span className="font-mono text-slate-900 font-semibold">{teamTickets}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operational Queue Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isCustomer ? 'My Recent Tickets' : isAgent ? 'Assigned Queue' : 'Recent System Tickets'}
            </h2>
            <p className="text-xs text-slate-500">Click any row to open conversation thread, responses, and escalation actions</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {(isCustomer ? myCustomerTickets : isAgent ? myAgentTickets : tickets).slice(0, 8).length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-mono">TICKET NUMBER</th>
                <th className="py-2.5 px-4">SUBJECT</th>
                <th className="py-2.5 px-4">CATEGORY</th>
                <th className="py-2.5 px-4">PRIORITY</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4">ASSIGNED TEAM</th>
                <th className="py-2.5 px-4 font-mono">CONFIDENCE</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(isCustomer ? myCustomerTickets : isAgent ? myAgentTickets : tickets).slice(0, 8).map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onOpenTicket(ticket.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                    {ticket.ticketNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                    {ticket.subject}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {ticket.category?.name || 'General Inquiry'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        ticket.priority === 'CRITICAL'
                          ? 'text-rose-600'
                          : ticket.priority === 'HIGH'
                          ? 'text-amber-600'
                          : ticket.priority === 'MEDIUM'
                          ? 'text-blue-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        ticket.status === 'OPEN'
                          ? 'text-blue-700'
                          : ticket.status === 'IN_PROGRESS'
                          ? 'text-amber-700'
                          : ticket.status === 'ESCALATED'
                          ? 'text-rose-700 font-bold'
                          : 'text-emerald-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ticket.status === 'OPEN'
                            ? 'bg-blue-600'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'bg-amber-600'
                            : ticket.status === 'ESCALATED'
                            ? 'bg-rose-600'
                            : 'bg-emerald-600'
                        }`}
                      />
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {ticket.assignedTeam?.name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                    {(ticket.classificationConfidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTicket(ticket.id);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      View Thread
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
