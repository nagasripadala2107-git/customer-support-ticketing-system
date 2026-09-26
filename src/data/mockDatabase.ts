import {
  User,
  Customer,
  Agent,
  Team,
  Category,
  Ticket,
  TicketMessage,
  TicketEscalation,
  NotificationItem,
  AuditLogItem,
  TicketStatus,
  TicketPriority,
} from '../types';

export const INITIAL_USERS: User[] = [
  // Admin
  {
    id: 1,
    email: 'admin@supportdesk.io',
    firstName: 'Alex',
    lastName: 'Morgan',
    role: 'ROLE_ADMIN',
    phone: '+1-555-0101',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  // Support Agents
  {
    id: 2,
    email: 'sarah.chen@supportdesk.io',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'ROLE_AGENT',
    phone: '+1-555-0102',
    isActive: true,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    email: 'marcus.vance@supportdesk.io',
    firstName: 'Marcus',
    lastName: 'Vance',
    role: 'ROLE_AGENT',
    phone: '+1-555-0103',
    isActive: true,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 4,
    email: 'elena.rodriguez@supportdesk.io',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    role: 'ROLE_AGENT',
    phone: '+1-555-0104',
    isActive: true,
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 5,
    email: 'david.kim@supportdesk.io',
    firstName: 'David',
    lastName: 'Kim',
    role: 'ROLE_AGENT',
    phone: '+1-555-0105',
    isActive: true,
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 6,
    email: 'priya.patel@supportdesk.io',
    firstName: 'Priya',
    lastName: 'Patel',
    role: 'ROLE_AGENT',
    phone: '+1-555-0106',
    isActive: true,
    createdAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 7,
    email: 'james.wilson@supportdesk.io',
    firstName: 'James',
    lastName: 'Wilson',
    role: 'ROLE_AGENT',
    phone: '+1-555-0107',
    isActive: true,
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 8,
    email: 'ananya.rao@supportdesk.io',
    firstName: 'Ananya',
    lastName: 'Rao',
    role: 'ROLE_AGENT',
    phone: '+1-555-0108',
    isActive: true,
    createdAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 9,
    email: 'lucas.muller@supportdesk.io',
    firstName: 'Lucas',
    lastName: 'Muller',
    role: 'ROLE_AGENT',
    phone: '+1-555-0109',
    isActive: true,
    createdAt: '2026-01-07T00:00:00Z',
  },
  // Customers
  {
    id: 10,
    email: 'john.doe@acme.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0201',
    isActive: true,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 11,
    email: 'alice.smith@globex.corp',
    firstName: 'Alice',
    lastName: 'Smith',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0202',
    isActive: true,
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 12,
    email: 'robert.taylor@initech.io',
    firstName: 'Robert',
    lastName: 'Taylor',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0203',
    isActive: true,
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 13,
    email: 'emily.watson@hooli.com',
    firstName: 'Emily',
    lastName: 'Watson',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0204',
    isActive: true,
    createdAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 14,
    email: 'michael.chang@piedpiper.net',
    firstName: 'Michael',
    lastName: 'Chang',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0205',
    isActive: true,
    createdAt: '2026-01-14T00:00:00Z',
  },
  {
    id: 15,
    email: 'sophia.martinez@umbrella.org',
    firstName: 'Sophia',
    lastName: 'Martinez',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0206',
    isActive: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 16,
    email: 'william.brown@stark.ind',
    firstName: 'William',
    lastName: 'Brown',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0207',
    isActive: true,
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 17,
    email: 'olivia.garcia@cyberdyne.ai',
    firstName: 'Olivia',
    lastName: 'Garcia',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0208',
    isActive: true,
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 18,
    email: 'daniel.lee@massivedynamic.co',
    firstName: 'Daniel',
    lastName: 'Lee',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0209',
    isActive: true,
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 19,
    email: 'charlotte.davies@wayne.ent',
    firstName: 'Charlotte',
    lastName: 'Davies',
    role: 'ROLE_CUSTOMER',
    phone: '+1-555-0210',
    isActive: true,
    createdAt: '2026-01-19T00:00:00Z',
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 1,
    name: 'Billing & Finance Team',
    code: 'BILLING_TEAM',
    description: 'Handles subscription charges, invoices, duplicate payments, refunds and payment gateways.',
    isActive: true,
  },
  {
    id: 2,
    name: 'Technical Support Team',
    code: 'TECH_SUPPORT_TEAM',
    description: 'Resolves system crashes, API failures, error logs, database timeouts, and integrations.',
    isActive: true,
  },
  {
    id: 3,
    name: 'Account & Security Team',
    code: 'ACCOUNT_SECURITY_TEAM',
    description: 'Specializes in SSO, MFA, password resets, account lockouts, and compliance.',
    isActive: true,
  },
  {
    id: 4,
    name: 'Shipping & Logistics Team',
    code: 'SHIPPING_TEAM',
    description: 'Tracks physical shipment delays, customs clearances, courier dispatch, and warehouse issues.',
    isActive: true,
  },
  {
    id: 5,
    name: 'Product Engineering Team',
    code: 'PRODUCT_SUPPORT_TEAM',
    description: 'Diagnoses bugs, UX glitches, feature requests, regression errors, and platform stability.',
    isActive: true,
  },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 1,
    userId: 2,
    user: INITIAL_USERS[1],
    teamId: 1,
    tierLevel: 'TIER_1',
    maxActiveTickets: 10,
    isAvailable: true,
  },
  {
    id: 2,
    userId: 3,
    user: INITIAL_USERS[2],
    teamId: 1,
    tierLevel: 'TIER_2',
    maxActiveTickets: 8,
    isAvailable: true,
  },
  {
    id: 3,
    userId: 4,
    user: INITIAL_USERS[3],
    teamId: 2,
    tierLevel: 'TIER_1',
    maxActiveTickets: 10,
    isAvailable: true,
  },
  {
    id: 4,
    userId: 5,
    user: INITIAL_USERS[4],
    teamId: 2,
    tierLevel: 'TIER_3',
    maxActiveTickets: 6,
    isAvailable: true,
  },
  {
    id: 5,
    userId: 6,
    user: INITIAL_USERS[5],
    teamId: 3,
    tierLevel: 'TIER_1',
    maxActiveTickets: 12,
    isAvailable: true,
  },
  {
    id: 6,
    userId: 7,
    user: INITIAL_USERS[6],
    teamId: 4,
    tierLevel: 'TIER_1',
    maxActiveTickets: 10,
    isAvailable: true,
  },
  {
    id: 7,
    userId: 8,
    user: INITIAL_USERS[7],
    teamId: 5,
    tierLevel: 'TIER_2',
    maxActiveTickets: 8,
    isAvailable: true,
  },
  {
    id: 8,
    userId: 9,
    user: INITIAL_USERS[8],
    teamId: 2,
    tierLevel: 'LEAD',
    maxActiveTickets: 5,
    isAvailable: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    userId: 10,
    user: INITIAL_USERS[9],
    companyName: 'Acme Corporation',
    accountTier: 'ENTERPRISE',
    address: '100 Industrial Parkway, Chicago, IL',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 2,
    userId: 11,
    user: INITIAL_USERS[10],
    companyName: 'Globex Industries',
    accountTier: 'PRO',
    address: '250 Tech Center Way, Austin, TX',
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 3,
    userId: 12,
    user: INITIAL_USERS[11],
    companyName: 'Initech Solutions',
    accountTier: 'STANDARD',
    address: '4120 Freemont Blvd, Seattle, WA',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 4,
    userId: 13,
    user: INITIAL_USERS[12],
    companyName: 'Hooli Media',
    accountTier: 'ENTERPRISE',
    address: '500 Silicon Ave, Mountain View, CA',
    createdAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 5,
    userId: 14,
    user: INITIAL_USERS[13],
    companyName: 'Pied Piper Cloud',
    accountTier: 'PRO',
    address: '78 Startup Way, Palo Alto, CA',
    createdAt: '2026-01-14T00:00:00Z',
  },
  {
    id: 6,
    userId: 15,
    user: INITIAL_USERS[14],
    companyName: 'Umbrella Diagnostics',
    accountTier: 'ENTERPRISE',
    address: '300 Biopark Drive, Boston, MA',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 7,
    userId: 16,
    user: INITIAL_USERS[15],
    companyName: 'Stark Logistics',
    accountTier: 'PRO',
    address: '88 Harbor Blvd, New York, NY',
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 8,
    userId: 17,
    user: INITIAL_USERS[16],
    companyName: 'Cyberdyne Systems',
    accountTier: 'ENTERPRISE',
    address: '12 Robotics Lane, San Francisco, CA',
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 9,
    userId: 18,
    user: INITIAL_USERS[17],
    companyName: 'Massive Dynamic',
    accountTier: 'STANDARD',
    address: '90 Innovation Plaza, Cambridge, MA',
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 10,
    userId: 19,
    user: INITIAL_USERS[18],
    companyName: 'Wayne Enterprises',
    accountTier: 'ENTERPRISE',
    address: '1007 Mountain Drive, Gotham, NJ',
    createdAt: '2026-01-19T00:00:00Z',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Billing & Invoicing',
    code: 'BILLING',
    description: 'Payment processing errors, double charges, tax invoices, and renewal fees.',
    defaultTeamId: 1,
  },
  {
    id: 2,
    name: 'Technical Support',
    code: 'TECHNICAL_SUPPORT',
    description: 'Server connection issues, SDK errors, code exceptions, and API rate limits.',
    defaultTeamId: 2,
  },
  {
    id: 3,
    name: 'Account Access',
    code: 'ACCOUNT_ACCESS',
    description: 'Login credential recovery, MFA token resets, and enterprise SSO.',
    defaultTeamId: 3,
  },
  {
    id: 4,
    name: 'Shipping & Delivery',
    code: 'SHIPPING',
    description: 'Damaged shipments, tracking delays, lost parcels, and courier routing.',
    defaultTeamId: 4,
  },
  {
    id: 5,
    name: 'Refund & Cancellation',
    code: 'REFUND',
    description: 'Subscription cancellation requests, chargebacks, and partial refunds.',
    defaultTeamId: 1,
  },
  {
    id: 6,
    name: 'Product Bug / Issue',
    code: 'PRODUCT_ISSUE',
    description: 'Feature defects, UI rendering glitches, export failure, and unexpected crashes.',
    defaultTeamId: 5,
  },
  {
    id: 7,
    name: 'General Inquiry',
    code: 'GENERAL_INQUIRY',
    description: 'Product pricing information, onboarding questions, and sales consultations.',
    defaultTeamId: 2,
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    ticketNumber: 'TKT-2026-0001',
    customerId: 1,
    subject: 'Payment deducted twice for Enterprise Annual Plan',
    description:
      'We noticed our corporate credit card was billed $4,800 twice on March 15th for order INV-8921. Please refund the duplicate transaction immediately.',
    categoryId: 1,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAgentId: 1,
    assignedTeamId: 1,
    classificationConfidence: 0.962,
    isAutoClassified: true,
    createdAt: '2026-03-23T10:15:00Z',
    updatedAt: '2026-03-25T14:20:00Z',
  },
  {
    id: 2,
    ticketNumber: 'TKT-2026-0002',
    customerId: 2,
    subject: 'Cannot login to my account after enabling 2FA',
    description:
      'Our team administrator configured Okta SAML with Google Authenticator, but the 6-digit TOTP code returns invalid credentials error.',
    categoryId: 3,
    priority: 'HIGH',
    status: 'OPEN',
    assignedAgentId: 5,
    assignedTeamId: 3,
    classificationConfidence: 0.945,
    isAutoClassified: true,
    createdAt: '2026-03-24T08:30:00Z',
    updatedAt: '2026-03-24T08:30:00Z',
  },
  {
    id: 3,
    ticketNumber: 'TKT-2026-0003',
    customerId: 3,
    subject: 'My package has not arrived - tracking shows delivered',
    description:
      'Tracking number FEDEX-98124 shows delivered to reception dock, but our facilities manager confirms no courier arrived today.',
    categoryId: 4,
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedAgentId: 6,
    assignedTeamId: 4,
    classificationConfidence: 0.958,
    isAutoClassified: true,
    createdAt: '2026-03-22T11:00:00Z',
    updatedAt: '2026-03-26T04:10:00Z',
  },
  {
    id: 4,
    ticketNumber: 'TKT-2026-0004',
    customerId: 4,
    subject: 'The application crashes when I upload a 50MB CSV file',
    description:
      'Whenever we upload customer batch CSV imports over 40MB, the web app freezes and returns a 504 Gateway Timeout error.',
    categoryId: 2,
    priority: 'CRITICAL',
    status: 'ESCALATED',
    assignedAgentId: 4,
    assignedTeamId: 2,
    classificationConfidence: 0.971,
    isAutoClassified: true,
    createdAt: '2026-03-21T09:45:00Z',
    updatedAt: '2026-03-26T05:00:00Z',
  },
  {
    id: 5,
    ticketNumber: 'TKT-2026-0005',
    customerId: 5,
    subject: 'I want to request a refund for unused monthly seats',
    description:
      'We downsized our team by 15 seats last week. Can we receive a prorated refund credit toward next month billing cycle?',
    categoryId: 5,
    priority: 'LOW',
    status: 'RESOLVED',
    assignedAgentId: 2,
    assignedTeamId: 1,
    classificationConfidence: 0.932,
    isAutoClassified: true,
    createdAt: '2026-03-20T16:00:00Z',
    updatedAt: '2026-03-25T11:30:00Z',
    resolvedAt: '2026-03-25T11:30:00Z',
  },
  {
    id: 6,
    ticketNumber: 'TKT-2026-0006',
    customerId: 6,
    subject: 'Dashboard metric charts not updating in real time',
    description:
      'The analytics overview shows stale data from 12 hours ago unless we perform a hard browser refresh (Ctrl+F5).',
    categoryId: 6,
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedAgentId: 7,
    assignedTeamId: 5,
    classificationConfidence: 0.912,
    isAutoClassified: true,
    createdAt: '2026-03-25T07:15:00Z',
    updatedAt: '2026-03-25T07:15:00Z',
  },
  {
    id: 7,
    ticketNumber: 'TKT-2026-0007',
    customerId: 7,
    subject: 'Enterprise API key generation returning 403 Forbidden',
    description:
      'We generated a new production API token in developer settings, but GET /v2/analytics queries reject the Bearer token.',
    categoryId: 2,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAgentId: 3,
    assignedTeamId: 2,
    classificationConfidence: 0.948,
    isAutoClassified: true,
    createdAt: '2026-03-24T14:20:00Z',
    updatedAt: '2026-03-26T01:10:00Z',
  },
  {
    id: 8,
    ticketNumber: 'TKT-2026-0008',
    customerId: 8,
    subject: 'Incorrect tax calculation on Q1 European invoice',
    description:
      'Our German VAT rate is 19% but the generated invoice applied 21%. Please reissue the credit note with correct tax identifier.',
    categoryId: 1,
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignedAgentId: 1,
    assignedTeamId: 1,
    classificationConfidence: 0.951,
    isAutoClassified: true,
    createdAt: '2026-03-19T13:00:00Z',
    updatedAt: '2026-03-24T16:45:00Z',
    resolvedAt: '2026-03-24T16:45:00Z',
  },
  {
    id: 9,
    ticketNumber: 'TKT-2026-0009',
    customerId: 9,
    subject: 'Questions about HIPAA compliance and BAA agreement',
    description:
      'We are preparing for our annual medical audit and need a counter-signed Business Associate Agreement and SOC2 Type II report.',
    categoryId: 7,
    priority: 'LOW',
    status: 'CLOSED',
    assignedAgentId: 8,
    assignedTeamId: 2,
    classificationConfidence: 0.884,
    isAutoClassified: true,
    createdAt: '2026-03-16T10:00:00Z',
    updatedAt: '2026-03-22T09:00:00Z',
    resolvedAt: '2026-03-21T18:00:00Z',
    closedAt: '2026-03-22T09:00:00Z',
  },
  {
    id: 10,
    ticketNumber: 'TKT-2026-0010',
    customerId: 10,
    subject: 'SSO redirect loop after domain verification',
    description:
      'Navigating to login.wayne.ent redirects back and forth 5 times before failing with ERR_TOO_MANY_REDIRECTS.',
    categoryId: 3,
    priority: 'CRITICAL',
    status: 'ESCALATED',
    assignedAgentId: 5,
    assignedTeamId: 3,
    classificationConfidence: 0.967,
    isAutoClassified: true,
    createdAt: '2026-03-25T11:45:00Z',
    updatedAt: '2026-03-26T04:45:00Z',
  },
  {
    id: 11,
    ticketNumber: 'TKT-2026-0011',
    customerId: 1,
    subject: 'Billing address update not reflected on PDF invoice',
    description:
      'Updated our headquarters address in the billing portal, but the monthly PDF statement still prints our former address.',
    categoryId: 1,
    priority: 'LOW',
    status: 'RESOLVED',
    assignedAgentId: 1,
    assignedTeamId: 1,
    classificationConfidence: 0.923,
    isAutoClassified: true,
    createdAt: '2026-03-18T15:20:00Z',
    updatedAt: '2026-03-21T10:00:00Z',
    resolvedAt: '2026-03-21T10:00:00Z',
  },
  {
    id: 12,
    ticketNumber: 'TKT-2026-0012',
    customerId: 2,
    subject: 'Webhook delivery failing with SSL handshake error',
    description:
      'Our internal endpoint receives SSL peer unverified exception during automated event push notifications.',
    categoryId: 2,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAgentId: 4,
    assignedTeamId: 2,
    classificationConfidence: 0.96,
    isAutoClassified: true,
    createdAt: '2026-03-25T18:00:00Z',
    updatedAt: '2026-03-26T01:30:00Z',
  },
  {
    id: 13,
    ticketNumber: 'TKT-2026-0013',
    customerId: 3,
    subject: 'Replacement hardware missing power supply cables',
    description:
      'The warranty replacement unit arrived yesterday, but box 2 of 2 containing power cords and brackets was not delivered.',
    categoryId: 4,
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedAgentId: 6,
    assignedTeamId: 4,
    classificationConfidence: 0.941,
    isAutoClassified: true,
    createdAt: '2026-03-25T21:10:00Z',
    updatedAt: '2026-03-25T21:10:00Z',
  },
  {
    id: 14,
    ticketNumber: 'TKT-2026-0014',
    customerId: 4,
    subject: 'Export to Excel button truncates utf-8 characters',
    description:
      'Customer names with non-Latin characters (accented vowels, kanji) render as question marks in the downloaded .xlsx.',
    categoryId: 6,
    priority: 'LOW',
    status: 'OPEN',
    assignedAgentId: 7,
    assignedTeamId: 5,
    classificationConfidence: 0.899,
    isAutoClassified: true,
    createdAt: '2026-03-25T19:30:00Z',
    updatedAt: '2026-03-25T19:30:00Z',
  },
  {
    id: 15,
    ticketNumber: 'TKT-2026-0015',
    customerId: 5,
    subject: 'Cancellation request before auto-renew date',
    description:
      'Please confirm our annual contract will not renew on April 1st. We have archived all historical workspace data.',
    categoryId: 5,
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignedAgentId: 2,
    assignedTeamId: 1,
    classificationConfidence: 0.943,
    isAutoClassified: true,
    createdAt: '2026-03-17T12:00:00Z',
    updatedAt: '2026-03-23T15:00:00Z',
    resolvedAt: '2026-03-23T15:00:00Z',
  },
  {
    id: 16,
    ticketNumber: 'TKT-2026-0016',
    customerId: 6,
    subject: 'Query timeout on PostgreSQL connector during peak hours',
    description:
      'Database synchronization takes over 300 seconds between 9 AM and 11 AM EST, triggering connection pool exhaustion.',
    categoryId: 2,
    priority: 'CRITICAL',
    status: 'ESCALATED',
    assignedAgentId: 4,
    assignedTeamId: 2,
    classificationConfidence: 0.978,
    isAutoClassified: true,
    createdAt: '2026-03-24T10:00:00Z',
    updatedAt: '2026-03-26T04:20:00Z',
  },
  {
    id: 17,
    ticketNumber: 'TKT-2026-0017',
    customerId: 7,
    subject: 'Request for custom team onboarding session',
    description:
      'We just hired 25 new customer success specialists and would like to schedule a 60-minute remote training session.',
    categoryId: 7,
    priority: 'LOW',
    status: 'CLOSED',
    assignedAgentId: 8,
    assignedTeamId: 2,
    classificationConfidence: 0.875,
    isAutoClassified: true,
    createdAt: '2026-03-12T14:00:00Z',
    updatedAt: '2026-03-19T11:00:00Z',
    resolvedAt: '2026-03-18T16:00:00Z',
    closedAt: '2026-03-19T11:00:00Z',
  },
  {
    id: 18,
    ticketNumber: 'TKT-2026-0018',
    customerId: 8,
    subject: 'Mobile app push notifications stopped working on iOS 18',
    description:
      'Following the latest iOS release, ticket assignment alerts no longer trigger APNS banner alerts on mobile devices.',
    categoryId: 6,
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedAgentId: 7,
    assignedTeamId: 5,
    classificationConfidence: 0.915,
    isAutoClassified: true,
    createdAt: '2026-03-24T16:45:00Z',
    updatedAt: '2026-03-25T21:00:00Z',
  },
  {
    id: 19,
    ticketNumber: 'TKT-2026-0019',
    customerId: 9,
    subject: 'Reset master admin password for locked out account',
    description:
      'The previous IT manager left the company without handing over master credentials. We have official notary authorization.',
    categoryId: 3,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAgentId: 5,
    assignedTeamId: 3,
    classificationConfidence: 0.954,
    isAutoClassified: true,
    createdAt: '2026-03-25T09:10:00Z',
    updatedAt: '2026-03-26T03:15:00Z',
  },
  {
    id: 20,
    ticketNumber: 'TKT-2026-0020',
    customerId: 10,
    subject: 'Expedited shipping upgrade requested for order #90211',
    description:
      'We need to upgrade delivery from ground transit to overnight priority air. We will authorize the additional freight charge.',
    categoryId: 4,
    priority: 'HIGH',
    status: 'OPEN',
    assignedAgentId: 6,
    assignedTeamId: 4,
    classificationConfidence: 0.938,
    isAutoClassified: true,
    createdAt: '2026-03-26T02:00:00Z',
    updatedAt: '2026-03-26T02:00:00Z',
  },
];

export const INITIAL_MESSAGES: TicketMessage[] = [
  // Ticket 1
  {
    id: 1,
    ticketId: 1,
    senderUserId: 10,
    messageText:
      'We noticed our corporate credit card was billed $4,800 twice on March 15th for order INV-8921. Please refund the duplicate transaction immediately.',
    messageType: 'CUSTOMER_REPLY',
    createdAt: '2026-03-23T10:15:00Z',
  },
  {
    id: 2,
    ticketId: 1,
    senderUserId: 2,
    messageText:
      'Hello John, thank you for reaching out. I am looking into your invoice records and contacting our Stripe payment processor to confirm the duplicate charge.',
    messageType: 'AGENT_REPLY',
    createdAt: '2026-03-24T09:00:00Z',
  },
  {
    id: 3,
    ticketId: 1,
    senderUserId: 2,
    messageText:
      'Internal Note: Confirmed two charges with identical reference code #AUTH-4921. Reversal initiated via gateway.',
    messageType: 'INTERNAL_NOTE',
    createdAt: '2026-03-24T09:05:00Z',
  },
  {
    id: 4,
    ticketId: 1,
    senderUserId: 2,
    messageText:
      'Good news John, we have processed a refund of $4,800. It typically reflects on your corporate statement within 3 to 5 business days.',
    messageType: 'AGENT_REPLY',
    createdAt: '2026-03-25T14:20:00Z',
  },
  // Ticket 4
  {
    id: 5,
    ticketId: 4,
    senderUserId: 13,
    messageText:
      'Whenever we upload customer batch CSV imports over 40MB, the web app freezes and returns a 504 Gateway Timeout error.',
    messageType: 'CUSTOMER_REPLY',
    createdAt: '2026-03-21T09:45:00Z',
  },
  {
    id: 6,
    ticketId: 4,
    senderUserId: 4,
    messageText:
      'Internal Note: Reproduced upload timeout on files exceeding 100,000 rows. Nginx client_max_body_size is 32MB. Escalating to Engineering.',
    messageType: 'INTERNAL_NOTE',
    createdAt: '2026-03-22T10:30:00Z',
  },
  {
    id: 7,
    ticketId: 4,
    senderUserId: 4,
    messageText:
      'Hello Emily, our engineering team is actively investigating this. We have adjusted worker thread pool allocation in staging.',
    messageType: 'AGENT_REPLY',
    createdAt: '2026-03-23T11:15:00Z',
  },
  {
    id: 8,
    ticketId: 4,
    senderUserId: 5,
    messageText:
      'Senior Engineer Note: Identified blocking stream parser in CSV processor. Refactoring to streaming chunk processor in sprint release 4.1.',
    messageType: 'INTERNAL_NOTE',
    createdAt: '2026-03-26T05:00:00Z',
  },
  // Ticket 10
  {
    id: 9,
    ticketId: 10,
    senderUserId: 19,
    messageText:
      'Navigating to login.wayne.ent redirects back and forth 5 times before failing with ERR_TOO_MANY_REDIRECTS.',
    messageType: 'CUSTOMER_REPLY',
    createdAt: '2026-03-25T11:45:00Z',
  },
  {
    id: 10,
    ticketId: 10,
    senderUserId: 6,
    messageText:
      'Priya (Account Security): Checking SAML ACS URL assertion headers for Wayne Enterprises domain.',
    messageType: 'INTERNAL_NOTE',
    createdAt: '2026-03-25T15:00:00Z',
  },
  {
    id: 11,
    ticketId: 10,
    senderUserId: 6,
    messageText:
      'Escalating ticket to Technical Engineering due to misconfigured TLS cert on custom domain proxy.',
    messageType: 'INTERNAL_NOTE',
    createdAt: '2026-03-26T04:45:00Z',
  },
];

export const INITIAL_ESCALATIONS: TicketEscalation[] = [
  {
    id: 1,
    ticketId: 4,
    fromLevelId: 1,
    toLevelId: 3,
    fromLevelCode: 'L1_SUPPORT',
    toLevelCode: 'TECHNICAL_TEAM',
    escalatedByUserId: 4,
    escalatedByName: 'Elena Rodriguez',
    escalationReason:
      'High memory heap exhaustion during large CSV batch import; requires backend code patch',
    pathTaken: 'L1_SUPPORT → L2_SUPPORT → TECHNICAL_TEAM',
    createdAt: '2026-03-22T10:35:00Z',
  },
  {
    id: 2,
    ticketId: 10,
    fromLevelId: 1,
    toLevelId: 2,
    fromLevelCode: 'L1_SUPPORT',
    toLevelCode: 'L2_SUPPORT',
    escalatedByUserId: 6,
    escalatedByName: 'Priya Patel',
    escalationReason:
      'Complex enterprise SAML assertion looping requires infrastructure team token trace',
    pathTaken: 'L1_SUPPORT → L2_SUPPORT',
    createdAt: '2026-03-26T04:45:00Z',
  },
  {
    id: 3,
    ticketId: 16,
    fromLevelId: 2,
    toLevelId: 5,
    fromLevelCode: 'L2_SUPPORT',
    toLevelCode: 'SENIOR_ENGINEER',
    escalatedByUserId: 5,
    escalatedByName: 'David Kim',
    escalationReason:
      'PostgreSQL database pool starvation during peak business hours; platform architect intervention required',
    pathTaken: 'L2_SUPPORT → TECHNICAL_TEAM → SENIOR_ENGINEER',
    createdAt: '2026-03-25T08:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    recipientUserId: 2,
    ticketId: 1,
    title: 'Ticket Assigned',
    message: 'Ticket TKT-2026-0001 (Payment deducted twice) was automatically assigned to you.',
    isRead: false,
    createdAt: '2026-03-23T10:16:00Z',
  },
  {
    id: 2,
    recipientUserId: 5,
    ticketId: 4,
    title: 'Ticket Escalated',
    message: 'Ticket TKT-2026-0004 was escalated to Technical Engineering.',
    isRead: false,
    createdAt: '2026-03-22T10:35:00Z',
  },
  {
    id: 3,
    recipientUserId: 6,
    ticketId: 10,
    title: 'Urgent Ticket Alert',
    message: 'Ticket TKT-2026-0010 (SSO redirect loop) marked CRITICAL for Wayne Enterprises.',
    isRead: false,
    createdAt: '2026-03-25T11:46:00Z',
  },
  {
    id: 4,
    recipientUserId: 10,
    ticketId: 1,
    title: 'Ticket Updated',
    message: 'Agent Sarah Chen replied to your ticket TKT-2026-0001.',
    isRead: true,
    createdAt: '2026-03-25T14:20:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 1,
    userId: 10,
    userName: 'John Doe',
    action: 'TICKET_CREATE',
    entityType: 'TICKET',
    entityId: 1,
    details: 'Customer created ticket: Payment deducted twice for Enterprise Annual Plan',
    createdAt: '2026-03-23T10:15:00Z',
  },
  {
    id: 2,
    userId: 1,
    userName: 'System Classifier',
    action: 'CLASSIFY_TICKET',
    entityType: 'TICKET',
    entityId: 1,
    details: 'Python ML evaluated category as BILLING with confidence 0.9620',
    createdAt: '2026-03-23T10:15:02Z',
  },
  {
    id: 3,
    userId: 1,
    userName: 'System Router',
    action: 'ROUTE_TICKET',
    entityType: 'TICKET',
    entityId: 1,
    details: 'Auto-routed to Billing & Finance Team (Agent: Sarah Chen)',
    createdAt: '2026-03-23T10:15:03Z',
  },
  {
    id: 4,
    userId: 4,
    userName: 'Elena Rodriguez',
    action: 'TICKET_ESCALATE',
    entityType: 'TICKET',
    entityId: 4,
    details: 'Escalated via Graph path: L1_SUPPORT → L2_SUPPORT → TECHNICAL_TEAM',
    createdAt: '2026-03-22T10:35:00Z',
  },
  {
    id: 5,
    userId: 2,
    userName: 'Sarah Chen',
    action: 'TICKET_STATUS_CHANGE',
    entityType: 'TICKET',
    entityId: 1,
    details: 'Status changed from OPEN to IN_PROGRESS',
    createdAt: '2026-03-24T09:00:00Z',
  },
  {
    id: 6,
    userId: 3,
    userName: 'Marcus Vance',
    action: 'TICKET_STATUS_CHANGE',
    entityType: 'TICKET',
    entityId: 5,
    details: 'Status changed from IN_PROGRESS to RESOLVED',
    createdAt: '2026-03-25T11:30:00Z',
  },
];

// Persistent Repository Manager
class InMemoryDB {
  private users: User[] = [...INITIAL_USERS];
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private agents: Agent[] = [...INITIAL_AGENTS];
  private teams: Team[] = [...INITIAL_TEAMS];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private tickets: Ticket[] = [...INITIAL_TICKETS];
  private messages: TicketMessage[] = [...INITIAL_MESSAGES];
  private escalations: TicketEscalation[] = [...INITIAL_ESCALATIONS];
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  private auditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];

  constructor() {
    this.hydrateRelations();
    this.loadFromStorage();
    this.hydrateRelations();
  }

  private hydrateRelations() {
    // 1. Link agent -> team and user
    this.agents.forEach((agent) => {
      if (!agent.user) {
        agent.user = this.users.find((u) => u.id === agent.userId) || this.users[0];
      }
      if (!agent.team) {
        agent.team = this.teams.find((t) => t.id === agent.teamId);
      }
    });

    // 2. Link customer -> user
    this.customers.forEach((customer) => {
      if (!customer.user) {
        customer.user = this.users.find((u) => u.id === customer.userId) || this.users[0];
      }
    });

    // 3. Link tickets -> customer, category, assignedTeam, assignedAgent
    this.tickets.forEach((ticket) => {
      ticket.customer = this.customers.find((c) => c.id === ticket.customerId);
      ticket.category = this.categories.find((c) => c.id === ticket.categoryId);
      ticket.assignedTeam = this.teams.find((t) => t.id === ticket.assignedTeamId);
      ticket.assignedAgent = this.agents.find((a) => a.id === ticket.assignedAgentId);
    });

    // 4. Link messages -> senderUser
    this.messages.forEach((msg) => {
      if (!msg.senderUser) {
        msg.senderUser = this.users.find((u) => u.id === msg.senderUserId);
      }
    });
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const savedTickets = localStorage.getItem('cs_tickets');
      const savedMessages = localStorage.getItem('cs_messages');
      const savedEscalations = localStorage.getItem('cs_escalations');
      const savedAuditLogs = localStorage.getItem('cs_audit_logs');
      const savedNotifications = localStorage.getItem('cs_notifications');

      if (savedTickets) this.tickets = JSON.parse(savedTickets);
      if (savedMessages) this.messages = JSON.parse(savedMessages);
      if (savedEscalations) this.escalations = JSON.parse(savedEscalations);
      if (savedAuditLogs) this.auditLogs = JSON.parse(savedAuditLogs);
      if (savedNotifications) this.notifications = JSON.parse(savedNotifications);
    } catch {
      // ignore
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cs_tickets', JSON.stringify(this.tickets));
      localStorage.setItem('cs_messages', JSON.stringify(this.messages));
      localStorage.setItem('cs_escalations', JSON.stringify(this.escalations));
      localStorage.setItem('cs_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('cs_notifications', JSON.stringify(this.notifications));
    } catch {
      // ignore
    }
  }

  public getUsers() {
    return this.users;
  }
  public getCustomers() {
    return this.customers;
  }
  public getAgents() {
    return this.agents;
  }
  public getTeams() {
    return this.teams;
  }
  public getCategories() {
    return this.categories;
  }
  public getTickets() {
    return this.tickets;
  }
  public getMessages() {
    return this.messages;
  }
  public getEscalations() {
    return this.escalations;
  }
  public getNotifications() {
    return this.notifications;
  }
  public getAuditLogs() {
    return this.auditLogs;
  }

  public getTicketById(id: number): Ticket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  public getMessagesByTicket(ticketId: number): TicketMessage[] {
    return this.messages.filter((m) => m.ticketId === ticketId);
  }

  public getEscalationsByTicket(ticketId: number): TicketEscalation[] {
    return this.escalations.filter((e) => e.ticketId === ticketId);
  }

  public createTicket(
    data: {
      customerId: number;
      subject: string;
      description: string;
      categoryId: number;
      priority: TicketPriority;
      classificationConfidence: number;
      isAutoClassified: boolean;
    },
    currentUser: User
  ): Ticket {
    const nextId = this.tickets.length + 1;
    const ticketNumber = `TKT-2026-${String(nextId).padStart(4, '0')}`;
    const category = this.categories.find((c) => c.id === data.categoryId);
    const assignedTeamId = category?.defaultTeamId || 2;
    const team = this.teams.find((t) => t.id === assignedTeamId);

    // Pick agent with available capacity in that team
    const teamAgents = this.agents.filter(
      (a) => a.teamId === assignedTeamId && a.isAvailable
    );
    const assignedAgentId = teamAgents[0]?.id;
    const agent = this.agents.find((a) => a.id === assignedAgentId);

    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: nextId,
      ticketNumber,
      customerId: data.customerId,
      customer: this.customers.find((c) => c.id === data.customerId),
      subject: data.subject,
      description: data.description,
      categoryId: data.categoryId,
      category,
      priority: data.priority,
      status: 'OPEN',
      assignedTeamId,
      assignedTeam: team,
      assignedAgentId,
      assignedAgent: agent,
      classificationConfidence: data.classificationConfidence,
      isAutoClassified: data.isAutoClassified,
      createdAt: now,
      updatedAt: now,
    };

    this.tickets.unshift(newTicket);

    // Initial message
    this.messages.push({
      id: this.messages.length + 1,
      ticketId: newTicket.id,
      senderUserId: currentUser.id,
      senderUser: currentUser,
      messageText: data.description,
      messageType: 'CUSTOMER_REPLY',
      createdAt: now,
    });

    // Audit Log
    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      action: 'TICKET_CREATE',
      entityType: 'TICKET',
      entityId: newTicket.id,
      details: `Created ticket ${ticketNumber} (Auto-Classified: ${category?.name || 'General'})`,
      createdAt: now,
    });

    // Notification to agent
    if (agent) {
      this.notifications.unshift({
        id: this.notifications.length + 1,
        recipientUserId: agent.userId,
        ticketId: newTicket.id,
        title: 'New Ticket Assigned',
        message: `Ticket ${ticketNumber} was automatically assigned to you.`,
        isRead: false,
        createdAt: now,
      });
    }

    this.saveToStorage();
    return newTicket;
  }

  public addMessage(
    ticketId: number,
    senderUser: User,
    messageText: string,
    messageType: 'CUSTOMER_REPLY' | 'AGENT_REPLY' | 'INTERNAL_NOTE'
  ): TicketMessage {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const now = new Date().toISOString();
    const newMsg: TicketMessage = {
      id: this.messages.length + 1,
      ticketId,
      senderUserId: senderUser.id,
      senderUser,
      messageText,
      messageType,
      createdAt: now,
    };

    this.messages.push(newMsg);
    ticket.updatedAt = now;

    if (messageType === 'AGENT_REPLY' && ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
    }

    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      userId: senderUser.id,
      userName: `${senderUser.firstName} ${senderUser.lastName}`,
      action: 'TICKET_MESSAGE',
      entityType: 'TICKET',
      entityId: ticketId,
      details: `Added message (${messageType}) on ${ticket.ticketNumber}`,
      createdAt: now,
    });

    this.saveToStorage();
    return newMsg;
  }

  public updateTicketStatus(
    ticketId: number,
    newStatus: TicketStatus,
    user: User
  ): Ticket {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const oldStatus = ticket.status;
    ticket.status = newStatus;
    const now = new Date().toISOString();
    ticket.updatedAt = now;

    if (newStatus === 'RESOLVED' && !ticket.resolvedAt) {
      ticket.resolvedAt = now;
    } else if (newStatus === 'CLOSED' && !ticket.closedAt) {
      ticket.closedAt = now;
    }

    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      action: 'TICKET_STATUS_CHANGE',
      entityType: 'TICKET',
      entityId: ticketId,
      details: `Status changed from ${oldStatus} to ${newStatus}`,
      createdAt: now,
    });

    this.saveToStorage();
    return ticket;
  }

  public escalateTicket(
    ticketId: number,
    targetLevelCode: string,
    reason: string,
    pathTaken: string,
    user: User
  ): TicketEscalation {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const pastEscalations = this.getEscalationsByTicket(ticketId);
    const fromLevelCode = pastEscalations[pastEscalations.length - 1]?.toLevelCode || 'L1_SUPPORT';

    const now = new Date().toISOString();
    const escalation: TicketEscalation = {
      id: this.escalations.length + 1,
      ticketId,
      fromLevelId: 1,
      toLevelId: 2,
      fromLevelCode,
      toLevelCode: targetLevelCode,
      escalatedByUserId: user.id,
      escalatedByName: `${user.firstName} ${user.lastName}`,
      escalationReason: reason,
      pathTaken,
      createdAt: now,
    };

    this.escalations.push(escalation);
    ticket.status = 'ESCALATED';
    ticket.updatedAt = now;

    // If escalating to Senior Engineer, reassign to David Kim (Tier 3)
    if (targetLevelCode === 'SENIOR_ENGINEER') {
      ticket.assignedAgentId = 4;
      ticket.assignedAgent = this.agents.find((a) => a.id === 4);
    } else if (targetLevelCode === 'BILLING_SPECIALIST') {
      ticket.assignedAgentId = 2; // Marcus Vance
      ticket.assignedAgent = this.agents.find((a) => a.id === 2);
    }

    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      action: 'TICKET_ESCALATE',
      entityType: 'TICKET',
      entityId: ticketId,
      details: `Escalated via path: ${pathTaken}. Reason: ${reason}`,
      createdAt: now,
    });

    if (ticket.assignedAgent) {
      this.notifications.unshift({
        id: this.notifications.length + 1,
        recipientUserId: ticket.assignedAgent.userId,
        ticketId,
        title: 'Escalated Ticket Transferred',
        message: `Ticket ${ticket.ticketNumber} was escalated to your tier: ${targetLevelCode}`,
        isRead: false,
        createdAt: now,
      });
    }

    this.saveToStorage();
    return escalation;
  }

  public reassignTicket(
    ticketId: number,
    newAgentId: number,
    user: User
  ): Ticket {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const agent = this.agents.find((a) => a.id === newAgentId);
    if (!agent) throw new Error('Agent not found');

    const oldAgentName = ticket.assignedAgent
      ? `${ticket.assignedAgent.user.firstName} ${ticket.assignedAgent.user.lastName}`
      : 'Unassigned';
    const newAgentName = `${agent.user.firstName} ${agent.user.lastName}`;

    ticket.assignedAgentId = newAgentId;
    ticket.assignedAgent = agent;
    const now = new Date().toISOString();
    ticket.updatedAt = now;

    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      action: 'TICKET_ASSIGNMENT',
      entityType: 'TICKET',
      entityId: ticketId,
      details: `Reassigned ticket from ${oldAgentName} to ${newAgentName} (${agent.tierLevel})`,
      createdAt: now,
    });

    this.notifications.unshift({
      id: this.notifications.length + 1,
      recipientUserId: agent.userId,
      ticketId,
      title: 'Ticket Reassigned to You',
      message: `Ticket ${ticket.ticketNumber} was reassigned to you by ${user.firstName} ${user.lastName}.`,
      isRead: false,
      createdAt: now,
    });

    this.saveToStorage();
    return ticket;
  }

  public markNotificationAsRead(id: number) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveToStorage();
    }
  }

  public resetToFactoryDefaults() {
    localStorage.removeItem('cs_tickets');
    localStorage.removeItem('cs_messages');
    localStorage.removeItem('cs_escalations');
    localStorage.removeItem('cs_audit_logs');
    localStorage.removeItem('cs_notifications');
    this.tickets = [...INITIAL_TICKETS];
    this.messages = [...INITIAL_MESSAGES];
    this.escalations = [...INITIAL_ESCALATIONS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.hydrateRelations();
  }
}

export const db = new InMemoryDB();
