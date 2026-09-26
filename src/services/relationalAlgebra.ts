import { db } from '../data/mockDatabase';

export interface RelationalQueryResult {
  queryId: string;
  title: string;
  operator: string;
  algebraExpression: string;
  trcExpression: string;
  sqlEquivalent: string;
  description: string;
  columns: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export function executeRelationalQuery(queryId: string): RelationalQueryResult {
  const tickets = db.getTickets();
  const customers = db.getCustomers();
  const agents = db.getAgents();
  const teams = db.getTeams();
  const escalations = db.getEscalations();

  switch (queryId) {
    case 'selection_high_priority': {
      // Selection: sigma priority in ('HIGH', 'CRITICAL') (TICKETS)
      const filtered = tickets.filter(
        (t) => t.priority === 'HIGH' || t.priority === 'CRITICAL'
      );
      return {
        queryId,
        title: 'High & Critical Priority Tickets',
        operator: 'Selection (σ)',
        algebraExpression: 'σ_{priority = "HIGH" ∨ priority = "CRITICAL"}(TICKETS)',
        trcExpression: '{ t | t ∈ TICKETS ∧ (t.priority = "HIGH" ∨ t.priority = "CRITICAL") }',
        sqlEquivalent: 'SELECT ticket_number, subject, priority, status FROM tickets WHERE priority IN (\'HIGH\', \'CRITICAL\');',
        description: 'Demonstrates horizontal selection filter isolating urgent system issues.',
        columns: ['ticketNumber', 'subject', 'priority', 'status', 'assignedTeam'],
        rows: filtered.map((t) => ({
          ticketNumber: t.ticketNumber,
          subject: t.subject,
          priority: t.priority,
          status: t.status,
          assignedTeam: t.assignedTeam?.name || 'Unassigned',
        })),
      };
    }

    case 'projection_customer_tickets': {
      // Join & Projection for Acme Corporation (Customer ID 1)
      const joined = tickets
        .filter((t) => t.customerId === 1)
        .map((t) => {
          const cust = customers.find((c) => c.id === t.customerId);
          return {
            ticketNumber: t.ticketNumber,
            subject: t.subject,
            companyName: cust?.companyName || '',
            status: t.status,
            createdAt: t.createdAt.split('T')[0],
          };
        });

      return {
        queryId,
        title: 'Tickets Belonging to Customer (Acme Corp)',
        operator: 'Projection (π) & Theta Join (⋈)',
        algebraExpression:
          'π_{ticket_number, subject, company_name, status}(σ_{c.id = 1}(TICKETS ⋈_{t.customer_id = c.id} CUSTOMERS))',
        trcExpression:
          '{ <t.number, t.subject, c.company, t.status> | t ∈ TICKETS ∧ c ∈ CUSTOMERS ∧ t.customer_id = c.id ∧ c.id = 1 }',
        sqlEquivalent:
          'SELECT t.ticket_number, t.subject, c.company_name, t.status FROM tickets t JOIN customers c ON t.customer_id = c.id WHERE c.id = 1;',
        description: 'Performs relational join between tickets and customer profiles and projects key attributes.',
        columns: ['ticketNumber', 'subject', 'companyName', 'status', 'createdAt'],
        rows: joined,
      };
    }

    case 'unresolved_team_tickets': {
      // Unresolved tickets for Billing Team (Team ID 1)
      const unresolved = tickets
        .filter(
          (t) =>
            t.assignedTeamId === 1 &&
            t.status !== 'RESOLVED' &&
            t.status !== 'CLOSED'
        )
        .map((t) => ({
          ticketNumber: t.ticketNumber,
          subject: t.subject,
          status: t.status,
          priority: t.priority,
          assignedAgent: t.assignedAgent?.user.firstName || 'Unassigned',
        }));

      return {
        queryId,
        title: 'Unresolved Tickets for Billing Team',
        operator: 'Selection (σ) with Compound Predicate (∧)',
        algebraExpression:
          'σ_{assigned_team_id = 1 ∧ status ≠ "RESOLVED" ∧ status ≠ "CLOSED"}(TICKETS)',
        trcExpression:
          '{ t | t ∈ TICKETS ∧ t.assigned_team_id = 1 ∧ t.status ∉ {"RESOLVED", "CLOSED"} }',
        sqlEquivalent:
          'SELECT ticket_number, subject, status, priority FROM tickets WHERE assigned_team_id = 1 AND status NOT IN (\'RESOLVED\', \'CLOSED\');',
        description: 'Retrieves active operational queue for department SLA tracking.',
        columns: ['ticketNumber', 'subject', 'status', 'priority', 'assignedAgent'],
        rows: unresolved,
      };
    }

    case 'join_escalations': {
      // Natural join with Ticket Escalations
      const escalatedRows = escalations.map((esc) => {
        const ticket = tickets.find((t) => t.id === esc.ticketId);
        return {
          ticketNumber: ticket?.ticketNumber || `TKT-${esc.ticketId}`,
          subject: ticket?.subject || 'N/A',
          pathTaken: esc.pathTaken,
          reason: esc.escalationReason,
          escalatedBy: esc.escalatedByName,
        };
      });

      return {
        queryId,
        title: 'Escalated Tickets and Historical Graph Path',
        operator: 'Natural Join (⋈)',
        algebraExpression:
          'π_{ticket_number, subject, path_taken, escalation_reason}(TICKETS ⋈_{t.id = e.ticket_id} TICKET_ESCALATIONS)',
        trcExpression:
          '{ <t.number, t.subject, e.path, e.reason> | t ∈ TICKETS ∧ e ∈ TICKET_ESCALATIONS ∧ t.id = e.ticket_id }',
        sqlEquivalent:
          'SELECT t.ticket_number, t.subject, e.path_taken, e.escalation_reason FROM tickets t JOIN ticket_escalations e ON t.id = e.ticket_id;',
        description: 'Demonstrates historical audit trail mapping tickets to calculated graph routes.',
        columns: ['ticketNumber', 'subject', 'pathTaken', 'reason', 'escalatedBy'],
        rows: escalatedRows,
      };
    }

    case 'aggregate_customers_multi_open': {
      // Find customers with >1 open tickets
      const customerCounts: Record<number, number> = {};
      tickets
        .filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
        .forEach((t) => {
          customerCounts[t.customerId] = (customerCounts[t.customerId] || 0) + 1;
        });

      const multi = Object.entries(customerCounts)
        .filter(([_, count]) => count > 1)
        .map(([cId, count]) => {
          const cust = customers.find((c) => c.id === Number(cId));
          return {
            customerId: Number(cId),
            companyName: cust?.companyName || 'Unknown',
            accountTier: cust?.accountTier || 'STANDARD',
            activeTicketCount: count,
          };
        });

      return {
        queryId,
        title: 'Customers with Multiple Open Tickets',
        operator: 'Aggregation (𝒢) & Selection (σ)',
        algebraExpression:
          'σ_{count > 1}(_{customer_id}𝒢_{COUNT(id) → count}(σ_{status = "OPEN"}(TICKETS))) ⋈ CUSTOMERS',
        trcExpression:
          '{ <c.id, c.company, count> | c ∈ CUSTOMERS ∧ count = |{ t | t ∈ TICKETS ∧ t.customer_id = c.id ∧ t.status = "OPEN" }| ∧ count > 1 }',
        sqlEquivalent:
          'SELECT c.id, c.company_name, COUNT(t.id) AS active_tickets FROM customers c JOIN tickets t ON c.id = t.customer_id WHERE t.status = \'OPEN\' GROUP BY c.id, c.company_name HAVING COUNT(t.id) > 1;',
        description: 'Identifies accounts experiencing multiple simultaneous service issues.',
        columns: ['customerId', 'companyName', 'accountTier', 'activeTicketCount'],
        rows: multi,
      };
    }

    case 'set_difference_available_agents': {
      // Agents with zero assigned active tickets
      const busyAgentIds = new Set(
        tickets
          .filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'ESCALATED')
          .map((t) => t.assignedAgentId)
          .filter(Boolean)
      );

      const freeAgents = agents
        .filter((a) => !busyAgentIds.has(a.id))
        .map((a) => {
          const t = teams.find((tm) => tm.id === a.teamId);
          return {
            agentId: a.id,
            name: `${a.user.firstName} ${a.user.lastName}`,
            email: a.user.email,
            team: t?.name || 'Unassigned',
            tierLevel: a.tierLevel,
          };
        });

      return {
        queryId,
        title: 'Agents with Empty Active Ticket Queue',
        operator: 'Set Difference (-)',
        algebraExpression:
          'π_{id, name}(AGENTS) - π_{assigned_agent_id}(σ_{status ∈ {"OPEN", "IN_PROGRESS"}}(TICKETS))',
        trcExpression:
          '{ a | a ∈ AGENTS ∧ ¬∃ t ∈ TICKETS (t.assigned_agent_id = a.id ∧ t.status ∈ {"OPEN", "IN_PROGRESS"}) }',
        sqlEquivalent:
          'SELECT a.id, u.first_name, u.last_name FROM agents a JOIN users u ON a.user_id = u.id WHERE a.id NOT IN (SELECT assigned_agent_id FROM tickets WHERE assigned_agent_id IS NOT NULL AND status IN (\'OPEN\', \'IN_PROGRESS\'));',
        description: 'Uses set difference to identify unburdened staff for rebalancing.',
        columns: ['agentId', 'name', 'email', 'team', 'tierLevel'],
        rows: freeAgents,
      };
    }

    default:
      return executeRelationalQuery('selection_high_priority');
  }
}
