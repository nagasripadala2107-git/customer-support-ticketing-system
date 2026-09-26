import React, { useState } from 'react';
import {
  Ticket,
  TicketMessage,
  TicketEscalation,
  User,
  Agent,
  TicketStatus,
} from '../types';
import { escalationGraphInstance } from '../services/graphEngine';
import {
  ArrowLeft,
  Send,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Shield,
  GitCommit,
  Building2,
} from 'lucide-react';

interface TicketDetailViewProps {
  ticket: Ticket;
  messages: TicketMessage[];
  escalations: TicketEscalation[];
  currentUser: User;
  allAgents: Agent[];
  onBack: () => void;
  onAddMessage: (
    ticketId: number,
    text: string,
    type: 'CUSTOMER_REPLY' | 'AGENT_REPLY' | 'INTERNAL_NOTE'
  ) => void;
  onUpdateStatus: (ticketId: number, newStatus: TicketStatus) => void;
  onEscalateTicket: (
    ticketId: number,
    targetLevelCode: string,
    reason: string,
    pathTaken: string
  ) => void;
  onReassignAgent: (ticketId: number, agentId: number) => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  messages,
  escalations,
  currentUser,
  allAgents,
  onBack,
  onAddMessage,
  onUpdateStatus,
  onEscalateTicket,
  onReassignAgent,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [targetEscalationLevel, setTargetEscalationLevel] = useState('TECHNICAL_TEAM');
  const [escalationReason, setEscalationReason] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(ticket.assignedAgentId || allAgents[0]?.id);

  const isCustomer = currentUser.role === 'ROLE_CUSTOMER';
  const isAgentOrAdmin = currentUser.role === 'ROLE_AGENT' || currentUser.role === 'ROLE_ADMIN';

  // Calculate live escalation path preview using BFS
  const latestEscalation = escalations[escalations.length - 1];
  const currentLevel = latestEscalation?.toLevelCode || 'L1_SUPPORT';
  const pathPreview = escalationGraphInstance.findEscalationPath(currentLevel, targetEscalationLevel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    let type: 'CUSTOMER_REPLY' | 'AGENT_REPLY' | 'INTERNAL_NOTE' = 'CUSTOMER_REPLY';
    if (isAgentOrAdmin) {
      type = isInternalNote ? 'INTERNAL_NOTE' : 'AGENT_REPLY';
    }

    onAddMessage(ticket.id, replyText, type);
    setReplyText('');
  };

  const handleExecuteEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationReason.trim()) return;

    onEscalateTicket(
      ticket.id,
      targetEscalationLevel,
      escalationReason,
      pathPreview.formattedPath
    );
    setShowEscalateModal(false);
    setEscalationReason('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">{ticket.ticketNumber}</span>
              <span className="text-slate-400">·</span>
              <span
                className={`text-xs font-semibold ${
                  ticket.priority === 'CRITICAL'
                    ? 'text-rose-600'
                    : ticket.priority === 'HIGH'
                    ? 'text-amber-600'
                    : 'text-blue-600'
                }`}
              >
                {ticket.priority} PRIORITY
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 mt-0.5">{ticket.subject}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isAgentOrAdmin && (
            <>
              <button
                onClick={() => setShowEscalateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Escalate (Graph BFS)</span>
              </button>

              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Reassign</span>
              </button>

              {ticket.status !== 'RESOLVED' && (
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'RESOLVED')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </>
          )}

          {isCustomer && ticket.status === 'RESOLVED' && (
            <button
              onClick={() => onUpdateStatus(ticket.id, 'CLOSED')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Close Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Escalation Route Banner if Escalated */}
      {ticket.status === 'ESCALATED' && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-4 text-xs text-rose-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Shield className="w-4 h-4 text-rose-600" />
            <span>Active Escalation Hierarchy</span>
          </div>
          <div className="font-mono text-slate-700 bg-white p-2 rounded border border-rose-100 flex items-center gap-2">
            <span>Path:</span>
            <span className="font-bold text-rose-700">
              {latestEscalation?.pathTaken || 'L1_SUPPORT → L2_SUPPORT → TECHNICAL_TEAM'}
            </span>
          </div>
          {latestEscalation && (
            <div className="mt-2 text-[11px] text-slate-600">
              <span>Reason: {latestEscalation.escalationReason}</span>
              <span className="mx-2">·</span>
              <span>Escalated by: {latestEscalation.escalatedByName}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Left Conversation Thread / Right Ticket Details Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline & Responses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Conversation Thread & Audit Timeline
            </h2>

            {/* Initial Ticket Description Box */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-900">
                  {ticket.customer?.user.firstName} {ticket.customer?.user.lastName} (Customer)
                </span>
                <span className="font-mono text-[11px]">{ticket.createdAt.replace('T', ' ').slice(0, 16)}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 pt-2">
              {messages.map((msg) => {
                const isInternal = msg.messageType === 'INTERNAL_NOTE';
                const isAgent = msg.messageType === 'AGENT_REPLY';

                // Hide internal notes from customer
                if (isInternal && isCustomer) return null;

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-lg text-xs ${
                      isInternal
                        ? 'bg-amber-50/80 border border-amber-200 text-amber-950'
                        : isAgent
                        ? 'bg-blue-50/50 border border-blue-200 text-slate-900 ml-4'
                        : 'bg-slate-50 border border-slate-200 text-slate-900 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium">
                        {isInternal && <Lock className="w-3 h-3 text-amber-700" />}
                        <span className={isInternal ? 'font-bold text-amber-900' : 'text-slate-900 font-semibold'}>
                          {msg.senderUser?.firstName} {msg.senderUser?.lastName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{msg.messageType.replace('_', ' ')}</span>
                      </div>
                      <span className="font-mono text-slate-400">
                        {msg.createdAt.replace('T', ' ').slice(0, 16)}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.messageText}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSend} className="pt-4 border-t border-slate-200 space-y-3">
              {isAgentOrAdmin && (
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="msgType"
                      checked={!isInternalNote}
                      onChange={() => setIsInternalNote(false)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-700 font-medium">Customer Reply</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="msgType"
                      checked={isInternalNote}
                      onChange={() => setIsInternalNote(true)}
                      className="text-amber-600 focus:ring-0"
                    />
                    <span className="text-amber-900 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Internal Staff Note
                    </span>
                  </label>
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Add private triage note visible only to support agents and engineers...'
                      : 'Type your message to customer / support...'
                  }
                  className="w-full p-3 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Markdown supported</span>
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold transition-colors ${
                    isInternalNote
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  } disabled:opacity-50`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isInternalNote ? 'Post Internal Note' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Ticket Metadata Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4 text-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ticket Details</h2>

            {/* Status Selector */}
            <div>
              <span className="text-slate-500 block text-[11px] mb-1">Status</span>
              {isAgentOrAdmin ? (
                <select
                  value={ticket.status}
                  onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                  className="w-full py-1.5 px-2 rounded border border-slate-200 font-medium text-slate-900 bg-slate-50"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
                  <option value="ESCALATED">ESCALATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              ) : (
                <div className="font-semibold text-slate-900 font-mono">{ticket.status}</div>
              )}
            </div>

            {/* Customer Organization */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-500 block text-[11px] mb-1">Customer Account</span>
              <div className="font-semibold text-slate-900">{ticket.customer?.companyName || 'Acme Corp'}</div>
              <div className="text-slate-500 text-[11px]">{ticket.customer?.user.email}</div>
              <div className="font-mono text-[10px] text-blue-600 mt-0.5">
                TIER: {ticket.customer?.accountTier || 'STANDARD'}
              </div>
            </div>

            {/* Category & ML Confidence */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-500 block text-[11px] mb-1">Classified Category</span>
              <div className="font-semibold text-slate-900">{ticket.category?.name || 'General Inquiry'}</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Confidence: {(ticket.classificationConfidence * 100).toFixed(1)}% (Python TF-IDF)
              </div>
            </div>

            {/* Assigned Department Team */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-500 block text-[11px] mb-1">Assigned Support Team</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{ticket.assignedTeam?.name || 'Unassigned'}</span>
              </div>
            </div>

            {/* Assigned Agent */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-500 block text-[11px] mb-1">Assigned Agent</span>
              <div className="font-semibold text-slate-900">
                {ticket.assignedAgent
                  ? `${ticket.assignedAgent.user.firstName} ${ticket.assignedAgent.user.lastName}`
                  : 'Unassigned'}
              </div>
              {ticket.assignedAgent && (
                <div className="text-[11px] text-slate-400 font-mono">
                  {ticket.assignedAgent.tierLevel} · {ticket.assignedAgent.user.email}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="border-t border-slate-100 pt-3 space-y-1 text-[11px] text-slate-500">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-mono text-slate-700">{ticket.createdAt.split('T')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span className="font-mono text-slate-700">{ticket.updatedAt.split('T')[0]}</span>
              </div>
              {ticket.resolvedAt && (
                <div className="flex justify-between text-emerald-600">
                  <span>Resolved:</span>
                  <span className="font-mono">{ticket.resolvedAt.split('T')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Escalate Ticket via Graph BFS */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-rose-600" />
                <h2 className="text-sm font-bold text-slate-900">Escalate Ticket via Adjacency List Graph</h2>
              </div>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteEscalation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Escalation Tier</label>
                <select
                  value={targetEscalationLevel}
                  onChange={(e) => setTargetEscalationLevel(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="L2_SUPPORT">L2_SUPPORT (Level 2 Technical Triage)</option>
                  <option value="TECHNICAL_TEAM">TECHNICAL_TEAM (Technical Engineering Team)</option>
                  <option value="BILLING_SPECIALIST">BILLING_SPECIALIST (Senior Billing Specialist)</option>
                  <option value="SENIOR_ENGINEER">SENIOR_ENGINEER (Staff Platform Architect)</option>
                  <option value="EXECUTIVE_LEAD">EXECUTIVE_LEAD (VP Customer Success)</option>
                </select>
              </div>

              {/* Live BFS Path Preview Box */}
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Calculated Shortest Escalation Route (BFS):
                </span>
                <div className="font-mono text-blue-700 font-semibold text-xs">
                  {pathPreview.formattedPath}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                  <span>Hops: <strong className="font-mono">{pathPreview.totalHops}</strong></span>
                  <span>·</span>
                  <span>Cumulative Weight: <strong className="font-mono">{pathPreview.totalWeight}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Escalation Reason & Technical Details</label>
                <textarea
                  rows={3}
                  required
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Explain why frontline tier cannot resolve this and what specialized intervention is required..."
                  className="w-full p-2.5 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!escalationReason.trim()}
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  Confirm & Escalate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reassign Agent */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900">Reassign Support Agent</h2>
            <div className="space-y-2">
              <label className="block text-slate-600">Select Available Agent</label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(Number(e.target.value))}
                className="w-full p-2 rounded border border-slate-200 bg-slate-50"
              >
                {allAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.user.firstName} {a.user.lastName} ({a.tierLevel} · {a.team?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReassignAgent(ticket.id, selectedAgentId);
                  setShowAssignModal(false);
                }}
                className="px-3 py-1.5 rounded bg-slate-900 text-white font-medium"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
