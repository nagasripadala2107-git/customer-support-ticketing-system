-- =====================================================================
-- CUSTOMER SUPPORT TICKETING SYSTEM - INITIAL SEED DATA
-- Sample data: 10 Customers, 8 Agents, 5 Teams, 7 Categories, 20+ Tickets, 35+ Messages, Escalation Graph
-- =====================================================================

-- 1. SEED USERS (Password for all demo accounts: 'Password123!')
-- BCrypt hash for 'Password123!' -> $2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone) VALUES
-- Admin
(1, 'admin@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Alex', 'Morgan', 'ROLE_ADMIN', '+1-555-0101'),
-- Support Agents
(2, 'sarah.chen@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Sarah', 'Chen', 'ROLE_AGENT', '+1-555-0102'),
(3, 'marcus.vance@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Marcus', 'Vance', 'ROLE_AGENT', '+1-555-0103'),
(4, 'elena.rodriguez@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Elena', 'Rodriguez', 'ROLE_AGENT', '+1-555-0104'),
(5, 'david.kim@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'David', 'Kim', 'ROLE_AGENT', '+1-555-0105'),
(6, 'priya.patel@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Priya', 'Patel', 'ROLE_AGENT', '+1-555-0106'),
(7, 'james.wilson@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'James', 'Wilson', 'ROLE_AGENT', '+1-555-0107'),
(8, 'ananya.rao@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Ananya', 'Rao', 'ROLE_AGENT', '+1-555-0108'),
(9, 'lucas.muller@supportdesk.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Lucas', 'Muller', 'ROLE_AGENT', '+1-555-0109'),
-- Customers
(10, 'john.doe@acme.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'John', 'Doe', 'ROLE_CUSTOMER', '+1-555-0201'),
(11, 'alice.smith@globex.corp', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Alice', 'Smith', 'ROLE_CUSTOMER', '+1-555-0202'),
(12, 'robert.taylor@initech.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Robert', 'Taylor', 'ROLE_CUSTOMER', '+1-555-0203'),
(13, 'emily.watson@hooli.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Emily', 'Watson', 'ROLE_CUSTOMER', '+1-555-0204'),
(14, 'michael.chang@piedpiper.net', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Michael', 'Chang', 'ROLE_CUSTOMER', '+1-555-0205'),
(15, 'sophia.martinez@umbrella.org', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Sophia', 'Martinez', 'ROLE_CUSTOMER', '+1-555-0206'),
(16, 'william.brown@stark.ind', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'William', 'Brown', 'ROLE_CUSTOMER', '+1-555-0207'),
(17, 'olivia.garcia@cyberdyne.ai', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Olivia', 'Garcia', 'ROLE_CUSTOMER', '+1-555-0208'),
(18, 'daniel.lee@massivedynamic.co', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Daniel', 'Lee', 'ROLE_CUSTOMER', '+1-555-0209'),
(19, 'charlotte.davies@wayne.ent', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bLsh5cQk5eE2e7c4J3UaVl79oPmi', 'Charlotte', 'Davies', 'ROLE_CUSTOMER', '+1-555-0210');

-- Reset users sequence
ALTER SEQUENCE users_id_seq RESTART WITH 20;

-- 2. SEED TEAMS (5 Support Teams)
INSERT INTO teams (id, name, code, description) VALUES
(1, 'Billing & Finance Team', 'BILLING_TEAM', 'Handles subscription charges, invoices, duplicate payments, refunds and payment gateways.'),
(2, 'Technical Support Team', 'TECH_SUPPORT_TEAM', 'Resolves system crashes, API failures, error logs, database timeouts, and integrations.'),
(3, 'Account & Security Team', 'ACCOUNT_SECURITY_TEAM', 'Specializes in SSO, MFA, password resets, account lockouts, and compliance.'),
(4, 'Shipping & Logistics Team', 'SHIPPING_TEAM', 'Tracks physical shipment delays, customs clearances, courier dispatch, and warehouse issues.'),
(5, 'Product Engineering Team', 'PRODUCT_SUPPORT_TEAM', 'Diagnoses bugs, UX glitches, feature requests, regression errors, and platform stability.');

ALTER SEQUENCE teams_id_seq RESTART WITH 6;

-- 3. SEED AGENTS (8 Agents mapped to Teams & Tiers)
INSERT INTO agents (id, user_id, team_id, tier_level, max_active_tickets, is_available) VALUES
(1, 2, 1, 'TIER_1', 10, TRUE), -- Sarah Chen (Billing)
(2, 3, 1, 'TIER_2', 8, TRUE),  -- Marcus Vance (Billing Specialist)
(3, 4, 2, 'TIER_1', 10, TRUE), -- Elena Rodriguez (Tech L1)
(4, 5, 2, 'TIER_3', 6, TRUE),  -- David Kim (Senior Tech / Eng)
(5, 6, 3, 'TIER_1', 12, TRUE), -- Priya Patel (Account Security)
(6, 7, 4, 'TIER_1', 10, TRUE), -- James Wilson (Shipping)
(7, 8, 5, 'TIER_2', 8, TRUE),  -- Ananya Rao (Product Support)
(8, 9, 2, 'LEAD', 5, TRUE);    -- Lucas Muller (Team Lead)

ALTER SEQUENCE agents_id_seq RESTART WITH 9;

-- 4. SEED CUSTOMERS (10 Customer Organizations)
INSERT INTO customers (id, user_id, company_name, account_tier, address) VALUES
(1, 10, 'Acme Corporation', 'ENTERPRISE', '100 Industrial Parkway, Chicago, IL'),
(2, 11, 'Globex Industries', 'PRO', '250 Tech Center Way, Austin, TX'),
(3, 12, 'Initech Solutions', 'STANDARD', '4120 Freemont Blvd, Seattle, WA'),
(4, 13, 'Hooli Media', 'ENTERPRISE', '500 Silicon Ave, Mountain View, CA'),
(5, 14, 'Pied Piper Cloud', 'PRO', '78 Startup Way, Palo Alto, CA'),
(6, 15, 'Umbrella Diagnostics', 'ENTERPRISE', '300 Biopark Drive, Boston, MA'),
(7, 16, 'Stark Logistics', 'PRO', '88 Harbor Blvd, New York, NY'),
(8, 17, 'Cyberdyne Systems', 'ENTERPRISE', '12 Robotics Lane, San Francisco, CA'),
(9, 18, 'Massive Dynamic', 'STANDARD', '90 Innovation Plaza, Cambridge, MA'),
(10, 19, 'Wayne Enterprises', 'ENTERPRISE', '1007 Mountain Drive, Gotham, NJ');

ALTER SEQUENCE customers_id_seq RESTART WITH 11;

-- 5. SEED CATEGORIES (7 Categories matching ML Classifier)
INSERT INTO categories (id, name, code, description, default_team_id) VALUES
(1, 'Billing & Invoicing', 'BILLING', 'Payment processing errors, double charges, tax invoices, and renewal fees.', 1),
(2, 'Technical Support', 'TECHNICAL_SUPPORT', 'Server connection issues, SDK errors, code exceptions, and API rate limits.', 2),
(3, 'Account Access', 'ACCOUNT_ACCESS', 'Login credential recovery, MFA token resets, and enterprise SSO.', 3),
(4, 'Shipping & Delivery', 'SHIPPING', 'Damaged shipments, tracking delays, lost parcels, and courier routing.', 4),
(5, 'Refund & Cancellation', 'REFUND', 'Subscription cancellation requests, chargebacks, and partial refunds.', 1),
(6, 'Product Bug / Issue', 'PRODUCT_ISSUE', 'Feature defects, UI rendering glitches, export failure, and unexpected crashes.', 5),
(7, 'General Inquiry', 'GENERAL_INQUIRY', 'Product pricing information, onboarding questions, and sales consultations.', 2);

ALTER SEQUENCE categories_id_seq RESTART WITH 8;

-- 6. SEED ESCALATION GRAPH NODES (Levels)
INSERT INTO escalation_levels (id, level_code, name, description, target_team_id, sla_hours) VALUES
(1, 'L1_SUPPORT', 'Level 1 Frontline Support', 'Initial triage, basic troubleshooting, FAQ resolution', 2, 24),
(2, 'L2_SUPPORT', 'Level 2 Technical Triage', 'Advanced log inspection, reproduction, customer data check', 2, 12),
(3, 'TECHNICAL_TEAM', 'Technical Engineering Team', 'Bug verification, patch deployment, database query diagnostics', 2, 8),
(4, 'BILLING_SPECIALIST', 'Senior Billing Specialist', 'Gateway ledger adjustments, bank disputes, charge reversals', 1, 6),
(5, 'SENIOR_ENGINEER', 'Staff Platform Architect', 'Kernel debugging, infrastructure outages, critical security flaws', 2, 4),
(6, 'EXECUTIVE_LEAD', 'VP of Customer Success', 'High-impact enterprise escalation, SLA breach review', 5, 2);

ALTER SEQUENCE escalation_levels_id_seq RESTART WITH 7;

-- 7. SEED ESCALATION GRAPH EDGES (Directed paths for BFS / DFS search)
INSERT INTO escalation_edges (from_level_id, to_level_id, weight, condition_description) VALUES
(1, 2, 1, 'Standard technical escalation when unresolved within 4 hours'),
(2, 3, 2, 'Requires developer code inspection or backend patch'),
(3, 5, 3, 'Critical platform bug or database corruption requiring architect'),
(1, 4, 1, 'Billing anomaly requiring payment processor ledger investigation'),
(4, 6, 2, 'High-value customer dispute exceeding $5,000 threshold'),
(5, 6, 1, 'Total system outage or contractual enterprise SLA breach');

-- 8. SEED TICKETS (20 Realistic Production Tickets)
INSERT INTO tickets (id, ticket_number, customer_id, subject, description, category_id, priority, status, assigned_agent_id, assigned_team_id, classification_confidence, is_auto_classified, created_at, updated_at) VALUES
(1, 'TKT-2026-0001', 1, 'Payment deducted twice for Enterprise Annual Plan', 'We noticed our corporate credit card was billed $4,800 twice on March 15th for order INV-8921. Please refund the duplicate transaction immediately.', 1, 'HIGH', 'IN_PROGRESS', 1, 1, 0.9620, TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, 'TKT-2026-0002', 2, 'Cannot login to my account after enabling 2FA', 'Our team administrator configured Okta SAML with Google Authenticator, but the 6-digit TOTP code returns invalid credentials error.', 3, 'HIGH', 'OPEN', 5, 3, 0.9450, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 'TKT-2026-0003', 3, 'My package has not arrived - tracking shows delivered', 'Tracking number FEDEX-98124 shows delivered to reception dock, but our facilities manager confirms no courier arrived today.', 4, 'MEDIUM', 'IN_PROGRESS', 6, 4, 0.9580, TRUE, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(4, 'TKT-2026-0004', 4, 'The application crashes when I upload a 50MB CSV file', 'Whenever we upload customer batch CSV imports over 40MB, the web app freezes and returns a 504 Gateway Timeout error.', 2, 'CRITICAL', 'ESCALATED', 4, 2, 0.9710, TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(5, 'TKT-2026-0005', 5, 'I want to request a refund for unused monthly seats', 'We downsized our team by 15 seats last week. Can we receive a prorated refund credit toward next month billing cycle?', 5, 'LOW', 'RESOLVED', 2, 1, 0.9320, TRUE, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(6, 'TKT-2026-0006', 6, 'Dashboard metric charts not updating in real time', 'The analytics overview shows stale data from 12 hours ago unless we perform a hard browser refresh (Ctrl+F5).', 6, 'MEDIUM', 'OPEN', 7, 5, 0.9120, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(7, 'TKT-2026-0007', 7, 'Enterprise API key generation returning 403 Forbidden', 'We generated a new production API token in developer settings, but GET /v2/analytics queries reject the Bearer token.', 2, 'HIGH', 'IN_PROGRESS', 3, 2, 0.9480, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
(8, 'TKT-2026-0008', 8, 'Incorrect tax calculation on Q1 European invoice', 'Our German VAT rate is 19% but the generated invoice applied 21%. Please reissue the credit note with correct tax identifier.', 1, 'MEDIUM', 'RESOLVED', 1, 1, 0.9510, TRUE, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(9, 'TKT-2026-0009', 9, 'Questions about HIPAA compliance and BAA agreement', 'We are preparing for our annual medical audit and need a counter-signed Business Associate Agreement and SOC2 Type II report.', 7, 'LOW', 'CLOSED', 8, 2, 0.8840, TRUE, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(10, 'TKT-2026-0010', 10, 'SSO redirect loop after domain verification', 'Navigating to login.wayne.ent redirects back and forth 5 times before failing with ERR_TOO_MANY_REDIRECTS.', 3, 'CRITICAL', 'ESCALATED', 5, 3, 0.9670, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(11, 'TKT-2026-0011', 1, 'Billing address update not reflected on PDF invoice', 'Updated our headquarters address in the billing portal, but the monthly PDF statement still prints our former address.', 1, 'LOW', 'RESOLVED', 1, 1, 0.9230, TRUE, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(12, 'TKT-2026-0012', 2, 'Webhook delivery failing with SSL handshake error', 'Our internal endpoint receives SSL peer unverified exception during automated event push notifications.', 2, 'HIGH', 'IN_PROGRESS', 4, 2, 0.9600, TRUE, CURRENT_TIMESTAMP - INTERVAL '18 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
(13, 'TKT-2026-0013', 3, 'Replacement hardware missing power supply cables', 'The warranty replacement unit arrived yesterday, but box 2 of 2 containing power cords and brackets was not delivered.', 4, 'MEDIUM', 'OPEN', 6, 4, 0.9410, TRUE, CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
(14, 'TKT-2026-0014', 4, 'Export to Excel button truncates utf-8 characters', 'Customer names with non-Latin characters (accented vowels, kanji) render as question marks in the downloaded .xlsx.', 6, 'LOW', 'OPEN', 7, 5, 0.8990, TRUE, CURRENT_TIMESTAMP - INTERVAL '16 hours', CURRENT_TIMESTAMP - INTERVAL '16 hours'),
(15, 'TKT-2026-0015', 5, 'Cancellation request before auto-renew date', 'Please confirm our annual contract will not renew on April 1st. We have archived all historical workspace data.', 5, 'MEDIUM', 'RESOLVED', 2, 1, 0.9430, TRUE, CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(16, 'TKT-2026-0016', 6, 'Query timeout on PostgreSQL connector during peak hours', 'Database synchronization takes over 300 seconds between 9 AM and 11 AM EST, triggering connection pool exhaustion.', 2, 'CRITICAL', 'ESCALATED', 4, 2, 0.9780, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(17, 'TKT-2026-0017', 7, 'Request for custom team onboarding session', 'We just hired 25 new customer success specialists and would like to schedule a 60-minute remote training session.', 7, 'LOW', 'CLOSED', 8, 2, 0.8750, TRUE, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(18, 'TKT-2026-0018', 8, 'Mobile app push notifications stopped working on iOS 18', 'Following the latest iOS release, ticket assignment alerts no longer trigger APNS banner alerts on mobile devices.', 6, 'MEDIUM', 'IN_PROGRESS', 7, 5, 0.9150, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '8 hours'),
(19, 'TKT-2026-0019', 9, 'Reset master admin password for locked out account', 'The previous IT manager left the company without handing over master credentials. We have official notary authorization.', 3, 'HIGH', 'IN_PROGRESS', 5, 3, 0.9540, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(20, 'TKT-2026-0020', 10, 'Expedited shipping upgrade requested for order #90211', 'We need to upgrade delivery from ground transit to overnight priority air. We will authorize the additional freight charge.', 4, 'HIGH', 'OPEN', 6, 4, 0.9380, TRUE, CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '5 hours');

ALTER SEQUENCE tickets_id_seq RESTART WITH 21;

-- 9. SEED TICKET MESSAGES (Realistic Customer / Agent conversations & Internal notes)
INSERT INTO ticket_messages (ticket_id, sender_user_id, message_text, message_type, created_at) VALUES
-- Ticket 1
(1, 10, 'We noticed our corporate credit card was billed $4,800 twice on March 15th for order INV-8921. Please refund the duplicate transaction immediately.', 'CUSTOMER_REPLY', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(1, 2, 'Hello John, thank you for reaching out. I am looking into your invoice records and contacting our Stripe payment processor to confirm the duplicate charge.', 'AGENT_REPLY', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 2, 'Internal Note: Confirmed two charges with identical reference code #AUTH-4921. Reversal initiated via gateway.', 'INTERNAL_NOTE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 2, 'Good news John, we have processed a refund of $4,800. It typically reflects on your corporate statement within 3 to 5 business days.', 'AGENT_REPLY', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Ticket 4
(4, 13, 'Whenever we upload customer batch CSV imports over 40MB, the web app freezes and returns a 504 Gateway Timeout error.', 'CUSTOMER_REPLY', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(4, 4, 'Elena (L1): Reproduced the upload timeout on files exceeding 100,000 rows. Memory limit in Nginx proxy buffers is capped at 32MB.', 'INTERNAL_NOTE', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(4, 4, 'Hello Emily, our engineering team is actively investigating this. We have adjusted worker thread pool allocation in staging.', 'AGENT_REPLY', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(4, 5, 'Senior Engineer Note: Identified blocking stream parser in CSV processor. Refactoring to streaming chunk processor in sprint release 4.1.', 'INTERNAL_NOTE', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

-- Ticket 10
(10, 19, 'Navigating to login.wayne.ent redirects back and forth 5 times before failing with ERR_TOO_MANY_REDIRECTS.', 'CUSTOMER_REPLY', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(10, 6, 'Priya (Account Security): Checking SAML ACS URL assertion headers for Wayne Enterprises domain.', 'INTERNAL_NOTE', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
(10, 6, 'Escalating ticket to Technical Engineering due to misconfigured TLS cert on custom domain proxy.', 'INTERNAL_NOTE', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

-- Ticket 16
(16, 15, 'Database synchronization takes over 300 seconds between 9 AM and 11 AM EST, triggering connection pool exhaustion.', 'CUSTOMER_REPLY', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(16, 5, 'Investigating RDS slow query logs. Missing composite index on (tenant_id, created_at) causing sequential table scan on 12M rows.', 'INTERNAL_NOTE', CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- 10. SEED TICKET ESCALATIONS
INSERT INTO ticket_escalations (ticket_id, from_level_id, to_level_id, escalated_by_user_id, escalation_reason, path_taken) VALUES
(4, 1, 3, 4, 'High memory heap exhaustion during large CSV batch import; requires backend code patch', 'L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM'),
(10, 1, 2, 6, 'Complex enterprise SAML assertion looping requires infrastructure team token trace', 'L1_SUPPORT -> L2_SUPPORT'),
(16, 2, 5, 5, 'PostgreSQL database pool starvation during peak business hours; platform architect intervention required', 'L2_SUPPORT -> TECHNICAL_TEAM -> SENIOR_ENGINEER');

-- 11. SEED NOTIFICATIONS
INSERT INTO notifications (recipient_user_id, ticket_id, title, message) VALUES
(2, 1, 'Ticket Assigned', 'Ticket TKT-2026-0001 (Payment deducted twice) was automatically assigned to you.'),
(5, 4, 'Ticket Escalated', 'Ticket TKT-2026-0004 was escalated to Technical Engineering.'),
(6, 10, 'Urgent Ticket Alert', 'Ticket TKT-2026-0010 (SSO redirect loop) marked CRITICAL for Wayne Enterprises.'),
(10, 1, 'Ticket Updated', 'Agent Sarah Chen replied to your ticket TKT-2026-0001.');

-- 12. SEED AUDIT LOGS
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
(10, 'TICKET_CREATE', 'TICKET', 1, 'Customer created ticket with subject: Payment deducted twice for Enterprise Annual Plan'),
(1, 'CLASSIFY_TICKET', 'TICKET', 1, 'ML Classifier evaluated category as BILLING with confidence 0.9620'),
(1, 'ROUTE_TICKET', 'TICKET', 1, 'Auto-routed to Billing & Finance Team based on BILLING category'),
(4, 'TICKET_ESCALATE', 'TICKET', 4, 'Agent Elena Rodriguez escalated ticket via Graph path: L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM'),
(5, 'TICKET_STATUS_CHANGE', 'TICKET', 5, 'Agent Marcus Vance updated status from IN_PROGRESS to RESOLVED');
