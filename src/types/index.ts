export type Role = 'ROLE_CUSTOMER' | 'ROLE_AGENT' | 'ROLE_ADMIN';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TicketStatus = 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_CUSTOMER' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED';

export type MessageType = 
  | 'CUSTOMER_REPLY' 
  | 'AGENT_REPLY' 
  | 'INTERNAL_NOTE' 
  | 'SYSTEM_EVENT';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: number;
  userId: number;
  user: User;
  companyName: string;
  accountTier: 'STANDARD' | 'PRO' | 'ENTERPRISE';
  address?: string;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface Agent {
  id: number;
  userId: number;
  user: User;
  teamId: number;
  team?: Team;
  tierLevel: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'LEAD';
  maxActiveTickets: number;
  isAvailable: boolean;
}

export interface Category {
  id: number;
  name: string;
  code: string; // BILLING, TECHNICAL_SUPPORT, ACCOUNT_ACCESS, SHIPPING, REFUND, PRODUCT_ISSUE, GENERAL_INQUIRY
  description: string;
  defaultTeamId: number;
  defaultTeam?: Team;
}

export interface Ticket {
  id: number;
  ticketNumber: string; // e.g. TKT-2026-0001
  customerId: number;
  customer?: Customer;
  subject: string;
  description: string;
  categoryId: number;
  category?: Category;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId?: number;
  assignedAgent?: Agent;
  assignedTeamId: number;
  assignedTeam?: Team;
  classificationConfidence: number; // e.g. 0.9620
  isAutoClassified: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  senderUserId: number;
  senderUser?: User;
  messageText: string;
  messageType: MessageType;
  createdAt: string;
}

export interface EscalationLevel {
  id: number;
  levelCode: string; // L1_SUPPORT, L2_SUPPORT, TECHNICAL_TEAM, BILLING_SPECIALIST, SENIOR_ENGINEER, EXECUTIVE_LEAD
  name: string;
  description: string;
  targetTeamId: number;
  slaHours: number;
}

export interface EscalationEdge {
  id: number;
  fromLevelId: number;
  toLevelId: number;
  weight: number;
  conditionDescription: string;
}

export interface TicketEscalation {
  id: number;
  ticketId: number;
  fromLevelId: number;
  toLevelId: number;
  fromLevelCode: string;
  toLevelCode: string;
  escalatedByUserId: number;
  escalatedByName: string;
  escalationReason: string;
  pathTaken: string; // e.g. "L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM"
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  recipientUserId: number;
  ticketId?: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: number;
  userId?: number;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: number;
  details: string;
  createdAt: string;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  targetTeam: string;
  probabilities: Record<string, number>;
  topTokens: { token: string; weight: number }[];
  status: string;
}

export interface GraphNodeData {
  code: string;
  name: string;
  teamName: string;
  slaHours: number;
  x?: number;
  y?: number;
}

export interface EscalationPathResult {
  pathExists: boolean;
  startNode: string;
  targetNode: string;
  path: string[];
  totalHops: number;
  totalWeight: number;
  formattedPath: string;
  traversalOrder: string[];
  algorithmUsed: string;
}
