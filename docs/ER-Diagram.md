# Customer Support Ticketing System - Entity Relationship (ER) Model

## 1. Overview
The **Customer Support Ticketing System** database is designed for enterprise SaaS helpdesk operations. It enforces relational integrity, 3NF/BCNF normalization, and strict referential constraints across 14 tables.

---

## 2. Mermaid ER Diagram

```mermaid
erDiagram
    USERS ||--o| CUSTOMERS : "extends (1:1)"
    USERS ||--o| AGENTS : "extends (1:1)"
    TEAMS ||--o{ AGENTS : "employs (1:N)"
    TEAMS ||--o{ CATEGORIES : "handles (1:N)"
    CUSTOMERS ||--o{ TICKETS : "opens (1:N)"
    CATEGORIES ||--o{ TICKETS : "classifies (1:N)"
    AGENTS ||--o{ TICKETS : "assigned_to (1:N)"
    TEAMS ||--o{ TICKETS : "routed_to (1:N)"
    TICKETS ||--o{ TICKET_MESSAGES : "contains (1:N)"
    USERS ||--o{ TICKET_MESSAGES : "authors (1:N)"
    TICKETS ||--o{ TICKET_STATUS_HISTORY : "tracks (1:N)"
    TICKETS ||--o{ TICKET_ASSIGNMENTS : "logs (1:N)"
    ESCALATION_LEVELS ||--o{ ESCALATION_EDGES : "from_node (1:N)"
    ESCALATION_LEVELS ||--o{ ESCALATION_EDGES : "to_node (1:N)"
    TICKETS ||--o{ TICKET_ESCALATIONS : "undergoes (1:N)"
    ESCALATION_LEVELS ||--o{ TICKET_ESCALATIONS : "transitions (1:N)"
    USERS ||--o{ NOTIFICATIONS : "receives (1:N)"
    USERS ||--o{ AUDIT_LOGS : "triggers (1:N)"

    USERS {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        varchar role
        varchar phone
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    CUSTOMERS {
        bigint id PK
        bigint user_id FK,UK
        varchar company_name
        varchar account_tier
        text address
        timestamp created_at
    }

    TEAMS {
        bigint id PK
        varchar name UK
        varchar code UK
        text description
        boolean is_active
        timestamp created_at
    }

    AGENTS {
        bigint id PK
        bigint user_id FK,UK
        bigint team_id FK
        varchar tier_level
        int max_active_tickets
        boolean is_available
        timestamp created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar code UK
        text description
        bigint default_team_id FK
        timestamp created_at
    }

    TICKETS {
        bigint id PK
        varchar ticket_number UK
        bigint customer_id FK
        varchar subject
        text description
        bigint category_id FK
        varchar priority
        varchar status
        bigint assigned_agent_id FK
        bigint assigned_team_id FK
        numeric classification_confidence
        boolean is_auto_classified
        timestamp created_at
        timestamp updated_at
        timestamp resolved_at
        timestamp closed_at
    }

    TICKET_MESSAGES {
        bigint id PK
        bigint ticket_id FK
        bigint sender_user_id FK
        text message_text
        varchar message_type
        timestamp created_at
    }

    TICKET_ASSIGNMENTS {
        bigint id PK
        bigint ticket_id FK
        bigint previous_agent_id FK
        bigint new_agent_id FK
        bigint assigned_by_user_id FK
        text reason
        timestamp created_at
    }

    TICKET_STATUS_HISTORY {
        bigint id PK
        bigint ticket_id FK
        varchar old_status
        varchar new_status
        bigint changed_by_user_id FK
        text change_reason
        timestamp created_at
    }

    ESCALATION_LEVELS {
        bigint id PK
        varchar level_code UK
        varchar name
        text description
        bigint target_team_id FK
        int sla_hours
    }

    ESCALATION_EDGES {
        bigint id PK
        bigint from_level_id FK
        bigint to_level_id FK
        int weight
        text condition_description
    }

    TICKET_ESCALATIONS {
        bigint id PK
        bigint ticket_id FK
        bigint from_level_id FK
        bigint to_level_id FK
        bigint escalated_by_user_id FK
        text escalation_reason
        text path_taken
        timestamp created_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint recipient_user_id FK
        bigint ticket_id FK
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar entity_type
        bigint entity_id
        text details
        varchar ip_address
        timestamp created_at
    }
```

---

## 3. Entity Relationships & Cardinalities

1. **User to Customer (1 : 0..1)**: A user with `ROLE_CUSTOMER` has exactly one customer profile.
2. **User to Agent (1 : 0..1)**: A user with `ROLE_AGENT` has exactly one agent profile.
3. **Team to Agent (1 : N)**: A team consists of multiple agents; an agent belongs to at most one team.
4. **Category to Team (N : 1)**: Each category points to a default team for automatic routing.
5. **Customer to Ticket (1 : N)**: A customer may open many support tickets.
6. **Category to Ticket (1 : N)**: Each ticket belongs to exactly one category (predicted by ML classifier or manually modified).
7. **Agent to Ticket (0..1 : N)**: An agent can be assigned multiple tickets.
8. **Team to Ticket (1 : N)**: A ticket is routed to one designated department team.
9. **Ticket to TicketMessage (1 : N)**: A ticket contains an ordered thread of customer responses, agent replies, and internal notes.
10. **EscalationLevel to EscalationEdge (1 : N)**: Graph nodes connect via directed weighted edges representing permissible escalation paths.
11. **Ticket to TicketEscalation (1 : N)**: Historical log of every graph-based escalation traversal applied to the ticket.
