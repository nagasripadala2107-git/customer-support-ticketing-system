import React, { useState, useMemo } from 'react';
import { Ticket, Category, Team } from '../types';
import { Search, Filter, Plus, ArrowUpDown } from 'lucide-react';

interface TicketListViewProps {
  tickets: Ticket[];
  categories: Category[];
  teams: Team[];
  onOpenTicket: (id: number) => void;
  onCreateTicketClick: () => void;
}

export const TicketListView: React.FC<TicketListViewProps> = ({
  tickets,
  categories,
  teams,
  onOpenTicket,
  onCreateTicketClick,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'confidence'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
      if (categoryFilter !== 'ALL' && String(t.categoryId) !== categoryFilter) return false;
      if (teamFilter !== 'ALL' && String(t.assignedTeamId) !== teamFilter) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesSubject = t.subject.toLowerCase().includes(query);
        const matchesNumber = t.ticketNumber.toLowerCase().includes(query);
        const matchesCustomer = t.customer?.companyName.toLowerCase().includes(query) || false;
        return matchesSubject || matchesNumber || matchesCustomer;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'createdAt') {
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? -diff : diff;
      }
      if (sortBy === 'confidence') {
        const diff = a.classificationConfidence - b.classificationConfidence;
        return sortOrder === 'desc' ? -diff : diff;
      }
      return 0;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter, teamFilter, sortBy, sortOrder]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Support Tickets Directory</h1>
          <div className="text-xs text-slate-500 mt-1">
            <span>Normalized relational queue</span>
            <span className="mx-2">·</span>
            <span className="font-mono text-slate-700 font-semibold">{filteredTickets.length} matching records</span>
          </div>
        </div>

        <button
          onClick={onCreateTicketClick}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket number (e.g. TKT-2026-0001), subject, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Quick Clear */}
          {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || categoryFilter !== 'ALL' || teamFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setCategoryFilter('ALL');
                setTeamFilter('ALL');
                setSearch('');
              }}
              className="text-xs text-rose-600 hover:underline px-2 whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1 px-2 rounded border border-slate-200 text-xs bg-slate-50"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-1 px-2 rounded border border-slate-200 text-xs bg-slate-50"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1 px-2 rounded border border-slate-200 text-xs bg-slate-50"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Department Team</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full py-1 px-2 rounded border border-slate-200 text-xs bg-slate-50"
            >
              <option value="ALL">All Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <p>No tickets match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4 font-mono">TICKET NUMBER</th>
                  <th className="py-2.5 px-4">SUBJECT & CUSTOMER</th>
                  <th className="py-2.5 px-4">CATEGORY</th>
                  <th className="py-2.5 px-4">PRIORITY</th>
                  <th className="py-2.5 px-4">STATUS</th>
                  <th className="py-2.5 px-4">ASSIGNED TO</th>
                  <th className="py-2.5 px-4 font-mono">ML CONFIDENCE</th>
                  <th className="py-2.5 px-4 text-right">UPDATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onOpenTicket(ticket.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {ticket.ticketNumber}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900 truncate">{ticket.subject}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{ticket.customer?.companyName || 'Acme Corp'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{ticket.customer?.accountTier || 'STANDARD'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
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
                        className={`inline-flex items-center gap-1.5 font-medium ${
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
                      <div className="font-medium text-slate-800">
                        {ticket.assignedAgent?.user.firstName
                          ? `${ticket.assignedAgent.user.firstName} ${ticket.assignedAgent.user.lastName}`
                          : 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-400">{ticket.assignedTeam?.name}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                      {(ticket.classificationConfidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {ticket.updatedAt.split('T')[0]}
                    </td>
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
