-- =====================================================================
-- CUSTOMER SUPPORT TICKETING SYSTEM - RELATIONAL DATABASE SCHEMA (PostgreSQL)
-- Database: customer_support_db
-- Normalized to 3NF / BCNF
-- =====================================================================

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ticket_escalations CASCADE;
DROP TABLE IF EXISTS escalation_edges CASCADE;
DROP TABLE IF EXISTS escalation_levels CASCADE;
DROP TABLE IF EXISTS ticket_status_history CASCADE;
DROP TABLE IF EXISTS ticket_assignments CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE (Base authentication and credentials)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN')),
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. CUSTOMERS TABLE (Specialized customer profile)
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    account_tier VARCHAR(50) DEFAULT 'STANDARD' CHECK (account_tier IN ('STANDARD', 'PRO', 'ENTERPRISE')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TEAMS TABLE (Departmental teams for automated routing)
CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AGENTS TABLE (Specialized agent profile)
CREATE TABLE agents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
    tier_level VARCHAR(50) NOT NULL DEFAULT 'TIER_1' CHECK (tier_level IN ('TIER_1', 'TIER_2', 'TIER_3', 'LEAD')),
    max_active_tickets INT NOT NULL DEFAULT 10,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_team ON agents(team_id);

-- 5. CATEGORIES TABLE (Support issue domains linked to ML classifier)
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    default_team_id BIGINT REFERENCES teams(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TICKETS TABLE (Core support ticket entity)
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'ESCALATED', 'RESOLVED', 'CLOSED')),
    assigned_agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
    assigned_team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
    classification_confidence NUMERIC(5, 4),
    is_auto_classified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tickets_customer ON tickets(customer_id);
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_agent ON tickets(assigned_agent_id);
CREATE INDEX idx_tickets_team ON tickets(assigned_team_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- 7. TICKET MESSAGES TABLE (Conversation thread & internal notes)
CREATE TABLE ticket_messages (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    message_text TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER_REPLY' CHECK (message_type IN ('CUSTOMER_REPLY', 'AGENT_REPLY', 'INTERNAL_NOTE', 'SYSTEM_EVENT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX idx_messages_created_at ON ticket_messages(created_at);

-- 8. TICKET ASSIGNMENTS TABLE (Historical assignments audit)
CREATE TABLE ticket_assignments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    previous_agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
    new_agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
    assigned_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TICKET STATUS HISTORY TABLE
CREATE TABLE ticket_status_history (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_history_ticket ON ticket_status_history(ticket_id);

-- 10. ESCALATION LEVELS (Graph Nodes)
CREATE TABLE escalation_levels (
    id BIGSERIAL PRIMARY KEY,
    level_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
    sla_hours INT NOT NULL DEFAULT 24
);

-- 11. ESCALATION EDGES (Graph Directed Edges: From Level -> To Level)
CREATE TABLE escalation_edges (
    id BIGSERIAL PRIMARY KEY,
    from_level_id BIGINT NOT NULL REFERENCES escalation_levels(id) ON DELETE CASCADE,
    to_level_id BIGINT NOT NULL REFERENCES escalation_levels(id) ON DELETE CASCADE,
    weight INT NOT NULL DEFAULT 1,
    condition_description TEXT,
    UNIQUE(from_level_id, to_level_id)
);

-- 12. TICKET ESCALATIONS TABLE (Executed ticket escalations)
CREATE TABLE ticket_escalations (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    from_level_id BIGINT NOT NULL REFERENCES escalation_levels(id) ON DELETE RESTRICT,
    to_level_id BIGINT NOT NULL REFERENCES escalation_levels(id) ON DELETE RESTRICT,
    escalated_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    escalation_reason TEXT NOT NULL,
    path_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_escalations_ticket ON ticket_escalations(ticket_id);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id, is_read);

-- 14. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
