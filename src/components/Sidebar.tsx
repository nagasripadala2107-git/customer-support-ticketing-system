import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  PlusCircle,
  Network,
  Cpu,
  Database,
  Code2,
  FileText,
  Users,
} from 'lucide-react';
import { Role } from '../types';

export type NavTab = 
  | 'dashboard' 
  | 'tickets' 
  | 'new_ticket' 
  | 'escalation_graph' 
  | 'ml_classifier' 
  | 'relational_algebra' 
  | 'code_browser' 
  | 'audit_logs' 
  | 'users_teams';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: Role;
  ticketCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  ticketCount,
}) => {
  const mainNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tickets' as NavTab,
      label: userRole === 'ROLE_CUSTOMER' ? 'My Tickets' : 'Tickets Queue',
      icon: Inbox,
      badge: ticketCount,
    },
    {
      id: 'new_ticket' as NavTab,
      label: 'Create Ticket',
      icon: PlusCircle,
      highlight: true,
    },
  ];

  const academicTools = [
    {
      id: 'escalation_graph' as NavTab,
      label: 'Escalation Graph',
      subtitle: 'ADSA · Adjacency List & BFS',
      icon: Network,
    },
    {
      id: 'ml_classifier' as NavTab,
      label: 'NLP Classifier Lab',
      subtitle: 'Python · TF-IDF & Logistic Reg',
      icon: Cpu,
    },
    {
      id: 'relational_algebra' as NavTab,
      label: 'Relational Algebra',
      subtitle: 'DMGT · σ, π, ⋈ Query Engine',
      icon: Database,
    },
    {
      id: 'code_browser' as NavTab,
      label: 'Monorepo Codebase',
      subtitle: 'Java Spring Boot & FastAPI',
      icon: Code2,
    },
  ];

  const adminItems = [
    {
      id: 'users_teams' as NavTab,
      label: 'Directory & Teams',
      icon: Users,
    },
    {
      id: 'audit_logs' as NavTab,
      label: 'Audit Trail',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Primary Navigation */}
      <div className="p-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Support Operations
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : item.highlight
                  ? 'bg-slate-800/80 text-blue-300 hover:bg-slate-800 hover:text-white border border-blue-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Academic Demonstrations */}
      <div className="px-4 py-2 border-t border-slate-800/60 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Academic Engineering Labs
        </div>
        {academicTools.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-medium border-l-2 border-blue-500'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
              <div className="text-[10px] text-slate-400 pl-6 mt-0.5 font-mono">{item.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Administration & Auditing */}
      {userRole === 'ROLE_ADMIN' && (
        <div className="px-4 py-2 border-t border-slate-800/60 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            System Administration
          </div>
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Architecture Footer Status */}
      <div className="mt-auto p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-500">Backend</span>
          <span className="font-mono text-emerald-400">Spring Boot 3.3</span>
        </div>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-500">Classifier</span>
          <span className="font-mono text-emerald-400">FastAPI ML</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Graph Routing</span>
          <span className="font-mono text-blue-400">BFS Adjacency</span>
        </div>
      </div>
    </aside>
  );
};
