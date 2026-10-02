import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import { Bell, CheckCircle2, BookOpen, RotateCcw, ShieldCheck, Menu, X } from 'lucide-react';

interface TopNavProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  allUsers: User[];
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: number) => void;
  onOpenDemoGuide: () => void;
  onResetDatabase: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentUser,
  onSelectUser,
  allUsers,
  notifications,
  onMarkNotificationRead,
  onOpenDemoGuide,
  onResetDatabase,
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const keyRoles = [
    { label: 'Customer: John Doe (Acme Corp)', email: 'john.doe@acme.com', role: 'CUSTOMER', tierBadge: 'Enterprise SLA' },
    { label: 'Agent: Elena Rodriguez (Tech L1)', email: 'elena.rodriguez@supportdesk.io', role: 'AGENT', tierBadge: 'L1_SUPPORT' },
    { label: 'Agent: Sarah Chen (Billing Lead)', email: 'sarah.chen@supportdesk.io', role: 'AGENT', tierBadge: 'BILLING_SPECIALIST' },
    { label: 'Agent: Marcus Vance (Billing T2)', email: 'marcus.vance@supportdesk.io', role: 'AGENT', tierBadge: 'L2_SUPPORT' },
    { label: 'Agent: Lucas Muller (Tech Lead)', email: 'lucas.muller@supportdesk.io', role: 'AGENT', tierBadge: 'TECHNICAL_TEAM' },
    { label: 'Agent: David Kim (Senior Tech)', email: 'david.kim@supportdesk.io', role: 'AGENT', tierBadge: 'SENIOR_ENGINEER' },
    { label: 'Admin: Alex Morgan (System Admin)', email: 'admin@supportdesk.io', role: 'ADMIN', tierBadge: 'EXECUTIVE_LEAD' },
  ];

  return (
    <header className="h-14 border-b border-slate-200 bg-white sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
      {/* Zone 1: Wordmark Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>

        <a href="#dashboard" className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            H
          </div>
          <span className="truncate">Helpdesk SaaS</span>
        </a>
        <span className="hidden sm:inline text-xs text-slate-400">·</span>
        <span className="hidden lg:inline text-xs font-medium text-slate-500">Customer Support Ticketing System</span>
      </div>

      {/* Zone 2: Navigation / Quick Action Links */}
      <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
        <button
          onClick={onOpenDemoGuide}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Evaluation Demo Guide</span>
        </button>

        <button
          onClick={onResetDatabase}
          title="Reset database to original 20 seed tickets"
          className="flex items-center gap-1.5 px-2 py-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Zone 3: Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-mono font-medium rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] text-slate-500 font-mono">{unreadCount} unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-2 rounded text-xs transition-colors cursor-pointer ${
                        notif.isRead ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/60 text-slate-900 border border-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{notif.title}</span>
                        {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-left transition-colors"
          >
            <div className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-none">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="text-[10px] text-slate-500 leading-none mt-1">
                {currentUser.role.replace('ROLE_', '')}
              </span>
            </div>
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Interactive Demo Role
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {keyRoles.map((item) => {
                  const u = allUsers.find((user) => user.email === item.email);
                  if (!u) return null;
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={item.email}
                      onClick={() => {
                        onSelectUser(u);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-start justify-between text-xs hover:bg-slate-50 transition-colors ${
                        isCurrent ? 'bg-blue-50/50 text-blue-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900">{item.label}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">{item.email}</span>
                          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {item.tierBadge}
                          </span>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 pt-2 px-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  RBAC Active
                </span>
                <span className="font-mono text-slate-400">{currentUser.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
