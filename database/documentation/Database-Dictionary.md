# PostgreSQL Relational Database Dictionary

This document details all 14 tables, column definitions, data types, constraints, and relational indexes in `customer_support_db`.

---

## 1. `users`
Base table for authentication and user identities across all personas.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User login email address |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `first_name` | VARCHAR(100) | NOT NULL | Given name |
| `last_name` | VARCHAR(100) | NOT NULL | Surname |
| `role` | VARCHAR(50) | NOT NULL, CHECK | Role (`ROLE_CUSTOMER`, `ROLE_AGENT`, `ROLE_ADMIN`) |
| `phone` | VARCHAR(30) | NULL | Contact phone number |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Account activity status |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Record modification timestamp |

---

## 2. `customers`
Extends `users` with corporate account profiles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Customer profile identifier |
| `user_id` | BIGINT | NOT NULL, UNIQUE, FK -> users(id) | Associated authentication user |
| `company_name` | VARCHAR(255) | NULL | Customer organization name |
| `account_tier` | VARCHAR(50) | CHECK (`STANDARD`, `PRO`, `ENTERPRISE`) | Support SLA tier |
| `address` | TEXT | NULL | Billing / physical campus address |

---

## 3. `teams`
Department support divisions for automated ticket routing.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Team identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Display name |
| `code` | VARCHAR(50) | NOT NULL, UNIQUE | Programmatic code (`BILLING_TEAM`, `TECH_SUPPORT_TEAM`, etc.) |
| `description` | TEXT | NULL | Departmental scope |
| `is_active` | BOOLEAN | DEFAULT TRUE | Operational availability |

---

## 4. `agents`
Support staff assigned to department teams.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Agent profile identifier |
| `user_id` | BIGINT | NOT NULL, UNIQUE, FK -> users(id) | Associated authentication user |
| `team_id` | BIGINT | FK -> teams(id) | Assigned team |
| `tier_level` | VARCHAR(50) | CHECK (`TIER_1`, `TIER_2`, `TIER_3`, `LEAD`) | Support expertise level |
| `max_active_tickets` | INT | NOT NULL, DEFAULT 10 | Workload capacity |
| `is_available` | BOOLEAN | DEFAULT TRUE | Online assignment status |

---

## 5. `categories`
Support issue classifications mapped to the Python ML model.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Category identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Display category name |
| `code` | VARCHAR(50) | NOT NULL, UNIQUE | ML target code (`BILLING`, `TECHNICAL_SUPPORT`, etc.) |
| `default_team_id` | BIGINT | FK -> teams(id) | Target department for automatic routing |

---

## 6. `tickets`
The central support ticket entity.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Ticket identifier |
| `ticket_number` | VARCHAR(50) | NOT NULL, UNIQUE | Human-readable code (`TKT-2026-0001`) |
| `customer_id` | BIGINT | NOT NULL, FK -> customers(id) | Creator customer organization |
| `subject` | VARCHAR(255) | NOT NULL | Issue title summary |
| `description` | TEXT | NOT NULL | Detailed problem statement |
| `category_id` | BIGINT | NOT NULL, FK -> categories(id) | Issue category |
| `priority` | VARCHAR(50) | CHECK (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) | Urgency level |
| `status` | VARCHAR(50) | CHECK (`OPEN`, `IN_PROGRESS`, `ESCALATED`, `RESOLVED`, `CLOSED`) | Lifecycle state |
| `assigned_agent_id` | BIGINT | FK -> agents(id) | Assigned staff member |
| `assigned_team_id` | BIGINT | FK -> teams(id) | Responsible department |
| `classification_confidence` | NUMERIC(5,4) | NULL | Python ML prediction confidence score (0.0000 - 1.0000) |
| `is_auto_classified` | BOOLEAN | DEFAULT TRUE | Whether categorized by ML |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `resolved_at` | TIMESTAMPTZ | NULL | Resolution timestamp |

---

## 7. `ticket_messages`
Conversation thread and internal audit notes.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Message identifier |
| `ticket_id` | BIGINT | NOT NULL, FK -> tickets(id) | Target ticket |
| `sender_user_id` | BIGINT | NOT NULL, FK -> users(id) | Author |
| `message_text` | TEXT | NOT NULL | Content body |
| `message_type` | VARCHAR(50) | CHECK (`CUSTOMER_REPLY`, `AGENT_REPLY`, `INTERNAL_NOTE`) | Message scope |

---

## 8. `escalation_levels` & `escalation_edges`
Persistent nodes and directed edges forming the ADSA Escalation Graph in PostgreSQL.

---

## 9. `ticket_escalations`
Historical execution audit log of graph-based escalations applied to tickets.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Escalation event identifier |
| `ticket_id` | BIGINT | NOT NULL, FK -> tickets(id) | Target ticket |
| `from_level_id` | BIGINT | NOT NULL, FK -> escalation_levels(id) | Origin escalation tier |
| `to_level_id` | BIGINT | NOT NULL, FK -> escalation_levels(id) | Destination escalation tier |
| `escalated_by_user_id` | BIGINT | NOT NULL, FK -> users(id) | Actor executing escalation |
| `escalation_reason` | TEXT | NOT NULL | Justification for escalation |
| `path_taken` | TEXT | NULL | Full traversed route (e.g. `L1 -> L2 -> TECH`) |
