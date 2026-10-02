import React, { useState } from 'react';
import { db } from './data/mockDatabase';
import { User, TicketStatus, TicketPriority } from './types';
import { TopNav } from './components/TopNav';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TicketListView } from './components/TicketListView';
import { TicketDetailView } from './components/TicketDetailView';
import { NewTicketModal } from './components/NewTicketModal';
import { EscalationGraphView } from './components/EscalationGraphView';
import { ClassifierPlayground } from './components/ClassifierPlayground';
import { RelationalAlgebraView } from './components/RelationalAlgebraView';
import { MonorepoCodeBrowser } from './components/MonorepoCodeBrowser';
import { DirectoryView } from './components/DirectoryView';
import { AuditLogView } from './components/AuditLogView';
import { DemoGuideModal } from './components/DemoGuideModal';
import { TeamGuideView } from './components/TeamGuideView';

export default function App() {
  const allUsers = db.getUsers();
  // Default to Customer: John Doe (Acme Corp) to initiate the evaluation flow!
  const [currentUser, setCurrentUser] = useState<User>(allUsers[9]);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState<boolean>(false);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync state with database
  const [tickets, setTickets] = useState(() => db.getTickets());
  const [messages, setMessages] = useState(() => db.getMessages());
  const [escalations, setEscalations] = useState(() => db.getEscalations());
  const [notifications, setNotifications] = useState(() => db.getNotifications());

  const refreshState = () => {
    setTickets([...db.getTickets()]);
    setMessages([...db.getMessages()]);
    setEscalations([...db.getEscalations()]);
    setNotifications([...db.getNotifications()]);
  };

  const handleOpenTicket = (id: number) => {
    setSelectedTicketId(id);
    setCurrentTab('tickets');
  };

  const handleCreateTicket = (data: {
    customerId: number;
    subject: string;
    description: string;
    categoryId: number;
    priority: TicketPriority;
    classificationConfidence: number;
    isAutoClassified: boolean;
  }) => {
    const newTicket = db.createTicket(data, currentUser);
    refreshState();
    setShowNewTicketModal(false);
    setSelectedTicketId(newTicket.id);
    setCurrentTab('tickets');
  };

  const handleAddMessage = (
    ticketId: number,
    text: string,
    type: 'CUSTOMER_REPLY' | 'AGENT_REPLY' | 'INTERNAL_NOTE'
  ) => {
    db.addMessage(ticketId, currentUser, text, type);
    refreshState();
  };

  const handleUpdateStatus = (ticketId: number, newStatus: TicketStatus) => {
    db.updateTicketStatus(ticketId, newStatus, currentUser);
    refreshState();
  };

  const handleEscalateTicket = (
    ticketId: number,
    targetLevelCode: string,
    reason: string,
    pathTaken: string
  ) => {
    db.escalateTicket(ticketId, targetLevelCode, reason, pathTaken, currentUser);
    refreshState();
  };

  const handleReassignAgent = (ticketId: number, agentId: number) => {
    db.reassignTicket(ticketId, agentId, currentUser);
    refreshState();
  };

  const handleMarkNotificationRead = (id: number) => {
    db.markNotificationAsRead(id);
    refreshState();
  };

  const handleResetDatabase = () => {
    db.resetToFactoryDefaults();
    refreshState();
    setSelectedTicketId(null);
  };

  const handleRoleSelectFromGuide = (role: 'CUSTOMER' | 'AGENT' | 'ADMIN') => {
    if (role === 'CUSTOMER') {
      setCurrentUser(allUsers[9]); // John Doe
    } else if (role === 'AGENT') {
      setCurrentUser(allUsers[1]); // Sarah Chen (Billing)
    } else {
      setCurrentUser(allUsers[0]); // Alex Morgan (Admin)
    }
  };

  const selectedTicket = selectedTicketId ? db.getTicketById(selectedTicketId) : null;
  const ticketMessages = selectedTicketId ? db.getMessagesByTicket(selectedTicketId) : [];
  const ticketEscalations = selectedTicketId ? db.getEscalationsByTicket(selectedTicketId) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <TopNav
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        allUsers={allUsers}
        notifications={notifications.filter((n) => n.recipientUserId === currentUser.id)}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
        onResetDatabase={handleResetDatabase}
        isMobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Body with Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'new_ticket') {
              setShowNewTicketModal(true);
            } else {
              setSelectedTicketId(null);
              setCurrentTab(tab);
            }
          }}
          userRole={currentUser.role}
          ticketCount={tickets.filter((t) => t.status !== 'CLOSED').length}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onOpenDemoGuide={() => setShowDemoGuide(true)}
          onResetDatabase={handleResetDatabase}
        />

        <main className="flex-1 overflow-y-auto min-w-0 w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              tickets={tickets}
              teams={db.getTeams()}
              onOpenTicket={handleOpenTicket}
              onCreateTicketClick={() => setShowNewTicketModal(true)}
              onNavigateToGraph={() => {
                setSelectedTicketId(null);
                setCurrentTab('escalation_graph');
              }}
            />
          )}

          {currentTab === 'tickets' && (
            selectedTicket ? (
              <TicketDetailView
                ticket={selectedTicket}
                messages={ticketMessages}
                escalations={ticketEscalations}
                currentUser={currentUser}
                allAgents={db.getAgents()}
                onBack={() => setSelectedTicketId(null)}
                onAddMessage={handleAddMessage}
                onUpdateStatus={handleUpdateStatus}
                onEscalateTicket={handleEscalateTicket}
                onReassignAgent={handleReassignAgent}
              />
            ) : (
              <TicketListView
                tickets={tickets}
                categories={db.getCategories()}
                teams={db.getTeams()}
                onOpenTicket={handleOpenTicket}
                onCreateTicketClick={() => setShowNewTicketModal(true)}
              />
            )
          )}

          {currentTab === 'team_guide' && <TeamGuideView />}

          {currentTab === 'escalation_graph' && <EscalationGraphView />}

          {currentTab === 'ml_classifier' && <ClassifierPlayground />}

          {currentTab === 'relational_algebra' && <RelationalAlgebraView />}

          {currentTab === 'code_browser' && <MonorepoCodeBrowser />}

          {currentTab === 'users_teams' && <DirectoryView />}

          {currentTab === 'audit_logs' && <AuditLogView />}
        </main>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <NewTicketModal
          customers={db.getCustomers()}
          currentCustomerId={
            currentUser.role === 'ROLE_CUSTOMER'
              ? db.getCustomers().find((c) => c.userId === currentUser.id)?.id
              : undefined
          }
          onClose={() => setShowNewTicketModal(false)}
          onSubmit={handleCreateTicket}
        />
      )}

      {/* Evaluation Demo Guide Modal */}
      {showDemoGuide && (
        <DemoGuideModal
          onClose={() => setShowDemoGuide(false)}
          onSelectRole={handleRoleSelectFromGuide}
        />
      )}
    </div>
  );
}
