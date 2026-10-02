import React, { useState, useRef } from 'react';
import { User, Ticket, Team, TicketStatus } from '../types';
import {
  Inbox,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  PlusCircle,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  PieChart,
  BarChart3,
  CheckCircle2,
  Filter,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  tickets: Ticket[];
  teams: Team[];
  onOpenTicket: (ticketId: number) => void;
  onCreateTicketClick: () => void;
  onNavigateToGraph: () => void;
}

interface KpiCardItem {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  subtextClass?: string;
  icon?: React.ReactNode;
  badgeDot?: string;
  valueColor?: string;
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

  // Carousel state for mobile
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Status Filter state
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [hoveredStatus, setHoveredStatus] = useState<TicketStatus | null>(null);

  // Filter for Customer
  const myCustomerTickets = isCustomer
    ? tickets.filter((t) => t.customer?.userId === currentUser.id)
    : tickets;

  // Filter for Agent
  const myAgentTickets = isAgent
    ? tickets.filter((t) => t.assignedAgent?.userId === currentUser.id)
    : tickets;

  const relevantTickets = isCustomer ? myCustomerTickets : isAgent ? myAgentTickets : tickets;
  const totalRelevant = Math.max(relevantTickets.length, 1);

  // Status Counts
  const statusCounts: Record<TicketStatus, number> = {
    OPEN: relevantTickets.filter((t) => t.status === 'OPEN').length,
    IN_PROGRESS: relevantTickets.filter((t) => t.status === 'IN_PROGRESS').length,
    WAITING_FOR_CUSTOMER: relevantTickets.filter((t) => t.status === 'WAITING_FOR_CUSTOMER').length,
    ESCALATED: relevantTickets.filter((t) => t.status === 'ESCALATED').length,
    RESOLVED: relevantTickets.filter((t) => t.status === 'RESOLVED').length,
    CLOSED: relevantTickets.filter((t) => t.status === 'CLOSED').length,
  };

  const statusConfigs: {
    status: TicketStatus;
    label: string;
    strokeColor: string;
    dotClass: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    description: string;
  }[] = [
    {
      status: 'OPEN',
      label: 'Open',
      strokeColor: '#3b82f6',
      dotClass: 'bg-blue-500',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-700',
      borderClass: 'border-blue-200',
      description: 'Awaiting first agent triage & assignment',
    },
    {
      status: 'IN_PROGRESS',
      label: 'In Progress',
      strokeColor: '#f59e0b',
      dotClass: 'bg-amber-500',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-200',
      description: 'Under active diagnosis and investigation',
    },
    {
      status: 'WAITING_FOR_CUSTOMER',
      label: 'Waiting Customer',
      strokeColor: '#8b5cf6',
      dotClass: 'bg-purple-500',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-700',
      borderClass: 'border-purple-200',
      description: 'Pending information or test verification from client',
    },
    {
      status: 'ESCALATED',
      label: 'Escalated',
      strokeColor: '#f43f5e',
      dotClass: 'bg-rose-500',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-200',
      description: 'Routed via BFS graph to specialized engineering tier',
    },
    {
      status: 'RESOLVED',
      label: 'Resolved',
      strokeColor: '#0d9488',
      dotClass: 'bg-teal-500',
      bgClass: 'bg-teal-50',
      textClass: 'text-teal-700',
      borderClass: 'border-teal-200',
      description: 'Fix or guidance supplied, pending archival',
    },
    {
      status: 'CLOSED',
      label: 'Closed',
      strokeColor: '#10b981',
      dotClass: 'bg-emerald-500',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-200',
      description: 'Completed, confirmed, and permanently verified',
    },
  ];

  // Pipeline funnel stages
  const intakeCount = statusCounts.OPEN + statusCounts.WAITING_FOR_CUSTOMER;
  const activeTriageCount = statusCounts.IN_PROGRESS + statusCounts.ESCALATED;
  const completedCount = statusCounts.RESOLVED + statusCounts.CLOSED;
  const completionPercentage = Math.round((completedCount / totalRelevant) * 100);

  // SVG Donut calculation
  const donutRadius = 60;
  const circumference = 2 * Math.PI * donutRadius; // ≈ 376.99
  let accumulatedDashOffset = 0;

  const donutSegments = statusConfigs.map((cfg) => {
    const count = statusCounts[cfg.status];
    const fraction = count / totalRelevant;
    const strokeDash = fraction * circumference;
    const offset = accumulatedDashOffset;
    accumulatedDashOffset += strokeDash;
    return {
      ...cfg,
      count,
      percentage: Math.round(fraction * 100),
      strokeDasharray: `${strokeDash} ${circumference - strokeDash}`,
      strokeDashoffset: -offset,
    };
  });

  // Filtered tickets for the table
  const displayedTickets = selectedStatusFilter === 'ALL'
    ? relevantTickets
    : relevantTickets.filter((t) => t.status === selectedStatusFilter);

  // Category counts
  const categoryCounts: Record<string, number> = {};
  relevantTickets.forEach((t) => {
    const name = t.category?.name || 'General Inquiry';
    categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  // Priority counts
  const priorityCounts: Record<string, number> = {
    LOW: relevantTickets.filter((t) => t.priority === 'LOW').length,
    MEDIUM: relevantTickets.filter((t) => t.priority === 'MEDIUM').length,
    HIGH: relevantTickets.filter((t) => t.priority === 'HIGH').length,
    CRITICAL: relevantTickets.filter((t) => t.priority === 'CRITICAL').length,
  };

  const kpiData: KpiCardItem[] = [
    {
      id: 'total',
      label: 'Total Tickets',
      value: relevantTickets.length,
      subtext: 'Across all categories',
      icon: <Inbox className="w-4 h-4 text-slate-400" />,
      valueColor: 'text-slate-900',
    },
    {
      id: 'open',
      label: 'Open Queue',
      value: statusCounts.OPEN,
      subtext: 'Awaiting response',
      badgeDot: 'bg-blue-500',
      valueColor: 'text-blue-600',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      value: statusCounts.IN_PROGRESS,
      subtext: 'Under investigation',
      icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
      valueColor: 'text-amber-600',
    },
    {
      id: 'escalated',
      label: 'Escalated',
      value: statusCounts.ESCALATED,
      subtext: 'Graph BFS routed',
      icon: <ArrowUpRight className="w-4 h-4 text-rose-500" />,
      valueColor: 'text-rose-600',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      value: statusCounts.RESOLVED,
      subtext: 'Pending closure',
      badgeDot: 'bg-teal-500',
      valueColor: 'text-teal-600',
    },
    {
      id: 'closed',
      label: 'Closed',
      value: statusCounts.CLOSED,
      subtext: 'Verified & completed',
      badgeDot: 'bg-emerald-500',
      valueColor: 'text-emerald-600',
    },
  ];

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardEl = container.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 12 : 280;
    const index = Math.round(scrollLeft / cardWidth);
    const clampedIndex = Math.max(0, Math.min(kpiData.length - 1, index));
    if (clampedIndex !== activeSlide) {
      setActiveSlide(clampedIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardElements = container.children;
    if (cardElements[index]) {
      (cardElements[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setActiveSlide(index);
    }
  };

  const renderKpiCard = (item: KpiCardItem) => (
    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-medium">{item.label}</span>
        {item.icon ? (
          item.icon
        ) : item.badgeDot ? (
          <span className={`w-2 h-2 rounded-full ${item.badgeDot}`} />
        ) : null}
      </div>
      <div>
        <div className={`text-2xl font-bold font-mono ${item.valueColor || 'text-slate-900'} tabular-nums`}>
          {item.value}
        </div>
        <div className={`text-[11px] ${item.subtextClass || 'text-slate-400'} mt-1 truncate`}>
          {item.subtext}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 md:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {isCustomer ? 'Customer Support Portal' : isAgent ? 'Agent Helpdesk Console' : 'Operational Administration'}
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span>Welcome, {currentUser.firstName} {currentUser.lastName}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Organization:{' '}
              {isCustomer
                ? myCustomerTickets[0]?.customer?.companyName || 'Acme Corporation'
                : 'Support Desk Global Operations'}
            </span>
            <span>·</span>
            <span className="font-mono text-blue-600 font-semibold">{currentUser.role}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onCreateTicketClick}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Create New Ticket</span>
          </button>

          <button
            onClick={onNavigateToGraph}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="whitespace-nowrap">View Escalation Graph</span>
          </button>
        </div>
      </div>

      {/* Mobile KPI Cards Carousel with Slide Dots (Visible on screens < md) */}
      <div className="block md:hidden space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-0.5">
          <span className="font-semibold text-slate-800">Operational Metrics</span>
          <span className="text-[11px] font-mono text-slate-400">
            Card {activeSlide + 1} of {kpiData.length}
          </span>
        </div>

        {/* Swipeable Carousel */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-pan-x no-scrollbar"
        >
          {kpiData.map((item) => (
            <div
              key={item.id}
              className="w-[82vw] sm:w-[50vw] max-w-[320px] shrink-0 snap-center"
            >
              {renderKpiCard(item)}
            </div>
          ))}
        </div>

        {/* Slide Dots Indicator & Navigation Controls */}
        <div className="flex items-center justify-between pt-1 px-1">
          {/* Quick Prev Button */}
          <button
            onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
            aria-label="Previous metric"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Dots */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Metric slide indicators">
            {kpiData.map((item, idx) => {
              const isActive = activeSlide === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Jump to ${item.label}`}
                  className={`transition-all duration-300 rounded-full focus:outline-hidden ${
                    isActive
                      ? 'w-6 h-2 bg-blue-600 shadow-2xs'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>

          {/* Quick Next Button */}
          <button
            onClick={() => scrollToSlide(Math.min(kpiData.length - 1, activeSlide + 1))}
            disabled={activeSlide === kpiData.length - 1}
            aria-label="Next metric"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop KPI Cards Grid (Visible on md and above) */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((item) => renderKpiCard(item))}
      </div>

      {/* MAIN TICKET STATUS & LIFECYCLE ANALYTICS GRAPH (Open, Closed, Escalated, In Progress) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Ticket Lifecycle &amp; Status Distribution Graph
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual real-time status proportions: Open, In Progress, Waiting, Escalated, Resolved, and Closed
            </p>
          </div>

          {/* Status Quick Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({relevantTickets.length})
            </button>
            {statusConfigs.map((cfg) => {
              const count = statusCounts[cfg.status];
              const isSelected = selectedStatusFilter === cfg.status;
              return (
                <button
                  key={cfg.status}
                  onClick={() => setSelectedStatusFilter(isSelected ? 'ALL' : cfg.status)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 border ${
                    isSelected
                      ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} font-bold ring-1 ring-offset-1`
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                  <span>{cfg.label}</span>
                  <span className="font-mono text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts Grid: Left Donut Graph + Right Status Breakdown Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Interactive Radial Donut Graph */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="18"
                />

                {/* Status Segments */}
                {donutSegments.map((seg) => {
                  if (seg.count === 0) return null;
                  const isHovered = hoveredStatus === seg.status;
                  const isFiltered = selectedStatusFilter === seg.status;

                  return (
                    <circle
                      key={seg.status}
                      cx="80"
                      cy="80"
                      r={donutRadius}
                      fill="transparent"
                      stroke={seg.strokeColor}
                      strokeWidth={isHovered || isFiltered ? '24' : '18'}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      onMouseEnter={() => setHoveredStatus(seg.status)}
                      onMouseLeave={() => setHoveredStatus(null)}
                      onClick={() => setSelectedStatusFilter(selectedStatusFilter === seg.status ? 'ALL' : seg.status)}
                    />
                  );
                })}
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                {hoveredStatus || (selectedStatusFilter !== 'ALL' && selectedStatusFilter) ? (
                  <>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {statusConfigs.find((c) => c.status === (hoveredStatus || selectedStatusFilter))?.label}
                    </span>
                    <span className="text-3xl font-extrabold font-mono text-slate-900 leading-tight">
                      {statusCounts[(hoveredStatus || selectedStatusFilter) as TicketStatus]}
                    </span>
                    <span className="text-[11px] font-mono text-blue-600 font-semibold mt-0.5">
                      {Math.round((statusCounts[(hoveredStatus || selectedStatusFilter) as TicketStatus] / totalRelevant) * 100)}% of total
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Volume</span>
                    <span className="text-3xl font-extrabold font-mono text-slate-900 leading-tight">
                      {relevantTickets.length}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                      {completionPercentage}% Closed / Done
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                Tip: Click any ring segment or legend item to filter the table below
              </span>
            </div>
          </div>

          {/* Right: Detailed Status Progress Meters & Pipeline Breakdown */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pb-1 border-b border-slate-100">
              <span>STATUS CATEGORY</span>
              <span>COUNT · SHARE</span>
            </div>

            <div className="space-y-3">
              {donutSegments.map((item) => {
                const isSelected = selectedStatusFilter === item.status;
                const isHovered = hoveredStatus === item.status;

                return (
                  <div
                    key={item.status}
                    onClick={() => setSelectedStatusFilter(isSelected ? 'ALL' : item.status)}
                    onMouseEnter={() => setHoveredStatus(item.status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border border-blue-200 shadow-2xs'
                        : isHovered
                        ? 'bg-slate-50 border border-slate-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.strokeColor }}
                        />
                        <span className="font-semibold text-slate-800">{item.label}</span>
                        <span className="hidden sm:inline text-[11px] text-slate-400">· {item.description}</span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-xs tabular-nums">
                        {item.count} tickets <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.strokeColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lifecycle Funnel Summary Bar */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Ticket Resolution Pipeline Funnel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Stage 1 */}
            <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
              <div className="flex items-center justify-between text-[11px] text-blue-700 font-medium">
                <span>Phase 1: Ingestion &amp; Triage</span>
                <span className="font-mono font-bold">{intakeCount}</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                {Math.round((intakeCount / totalRelevant) * 100)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Open &amp; Waiting for response</div>
            </div>

            {/* Stage 2 */}
            <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/50">
              <div className="flex items-center justify-between text-[11px] text-amber-700 font-medium">
                <span>Phase 2: Active Investigation</span>
                <span className="font-mono font-bold">{activeTriageCount}</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                {Math.round((activeTriageCount / totalRelevant) * 100)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">In Progress &amp; Graph Escalated</div>
            </div>

            {/* Stage 3 */}
            <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
              <div className="flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                <span>Phase 3: Resolved &amp; Closed</span>
                <span className="font-mono font-bold">{completedCount}</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                {completionPercentage}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Successfully solved &amp; verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category & Priority Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 lg:col-span-2 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Tickets by Category (NLP Classification)</h2>
              <p className="text-xs text-slate-500">Distribution generated via Python TF-IDF + Logistic Regression</p>
            </div>
            <span className="text-xs font-mono text-slate-400">7 Active Domains</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([catName, count]) => {
              const percentage = Math.round((count / totalRelevant) * 100);
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate pr-2">{catName}</span>
                    <span className="font-mono text-slate-500 tabular-nums shrink-0">
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
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 space-y-6 shadow-2xs">
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
                const teamTickets = relevantTickets.filter((t) => t.assignedTeamId === team.id).length;
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

      {/* Operational Queue Table with Active Filter Banner */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isCustomer ? 'My Recent Tickets' : isAgent ? 'Assigned Queue' : 'Recent System Tickets'}
            </h2>
            <p className="text-xs text-slate-500">
              Click any row to open conversation thread, responses, and escalation actions
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {displayedTickets.slice(0, 10).length} of {displayedTickets.length} records
          </span>
        </div>

        {/* Active Filter Notification Banner */}
        {selectedStatusFilter !== 'ALL' && (
          <div className="px-4 sm:px-6 py-2 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Filtered by status: <strong>{selectedStatusFilter.replace('_', ' ')}</strong> ({displayedTickets.length} tickets matching)
              </span>
            </div>
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className="flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 text-[11px] underline"
            >
              <X className="w-3.5 h-3.5" />
              Clear filter
            </button>
          </div>
        )}

        <div className="overflow-x-auto scrollbar-thin">
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
              {displayedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No tickets found matching the selected status filter ({selectedStatusFilter}).
                  </td>
                </tr>
              ) : (
                displayedTickets.slice(0, 10).map((ticket) => (
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
                            : ticket.status === 'WAITING_FOR_CUSTOMER'
                            ? 'text-purple-700'
                            : ticket.status === 'ESCALATED'
                            ? 'text-rose-700 font-bold'
                            : ticket.status === 'RESOLVED'
                            ? 'text-teal-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ticket.status === 'OPEN'
                              ? 'bg-blue-600'
                              : ticket.status === 'IN_PROGRESS'
                              ? 'bg-amber-600'
                              : ticket.status === 'WAITING_FOR_CUSTOMER'
                              ? 'bg-purple-600'
                              : ticket.status === 'ESCALATED'
                              ? 'bg-rose-600'
                              : ticket.status === 'RESOLVED'
                              ? 'bg-teal-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        {ticket.status.replace(/_/g, ' ')}
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
                        className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
                      >
                        View Thread
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
