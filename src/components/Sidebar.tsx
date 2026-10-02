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
  X,
  BookOpen,
  RotateCcw,
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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenDemoGuide?: () => void;
  onResetDatabase?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  ticketCount,
  isOpenMobile = false,
  onCloseMobile,
  onOpenDemoGuide,
  onResetDatabase,
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

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              H
            </div>
            <span className="font-semibold text-sm text-white">Helpdesk SaaS</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Support Operations
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
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
                onClick={() => handleTabClick(item.id)}
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
                  onClick={() => handleTabClick(item.id)}
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

        {/* Mobile Quick Action Buttons */}
        <div className="md:hidden px-4 py-2 border-t border-slate-800/60 space-y-1">
          {onOpenDemoGuide && (
            <button
              onClick={() => {
                onOpenDemoGuide();
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Evaluation Demo Guide</span>
            </button>
          )}
          {onResetDatabase && (
            <button
              onClick={() => {
                onResetDatabase();
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset Sample Data</span>
            </button>
          )}
        </div>

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
    </>
  );
};
