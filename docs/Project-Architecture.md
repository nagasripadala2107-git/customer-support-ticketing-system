# Multi-Tier System Architecture & Sequence Diagrams

## 1. System Topology Overview

```
                         ┌─────────────────────────────────────────┐
                         │          React 19 + TypeScript          │
                         │           Vite + Tailwind CSS           │
                         │             (Port: 3000)                │
                         └────────────────────┬────────────────────┘
                                              │ HTTP / JSON
                                              ▼
                         ┌─────────────────────────────────────────┐
                         │       Spring Boot 3.3.4 (Java 17)       │
                         │       REST API & Business Logic         │
                         │             (Port: 8080)                │
                         └───────┬─────────────────────────┬───────┘
            REST / WebClient     │                         │ JDBC / Hibernate
                                 ▼                         ▼
            ┌─────────────────────────────┐       ┌─────────────────────────────┐
            │    FastAPI NLP Classifier   │       │   PostgreSQL 16 Relational  │
            │  TF-IDF + Logistic Regress  │       │       Database (3NF)        │
            │        (Port: 8000)         │       │        (Port: 5432)         │
            └─────────────────────────────┘       └─────────────────────────────┘
```

---

## 2. Sequence Diagram: Ticket Creation, Classification & Routing

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (UI)
    participant Java as Spring Boot Backend
    participant Python as Python FastAPI (ML)
    participant DB as PostgreSQL DB
    actor Agent as Assigned Support Agent

    Customer->>Java: POST /api/tickets {subject, description}
    Note over Java: Extract token, verify JWT
    Java->>Python: POST /predict {subject, description}
    Note over Python: Clean text, TF-IDF Vectorization, LogisticRegression.predict_proba()
    Python-->>Java: 200 OK {category: "BILLING", confidence: 0.9412}
    Java->>DB: Query Team for Category (Billing Team)
    DB-->>Java: Billing & Finance Team
    Java->>DB: Query available Agent with lowest workload
    DB-->>Java: Sarah Chen (Agent ID 1)
    Java->>DB: INSERT into tickets, ticket_messages, audit_logs, notifications
    DB-->>Java: Ticket persisted (TKT-2026-0021)
    Java-->>Customer: 201 Created (Ticket Details + Assigned Team)
    Java-)Agent: Realtime Notification (Ticket Assigned to your queue)
```

---

## 3. Sequence Diagram: Graph-Based Ticket Escalation

```mermaid
sequenceDiagram
    autonumber
    actor Agent as Support Agent (UI)
    participant Java as Spring Boot Backend
    participant Graph as AdjacencyListGraph (ADSA)
    participant DB as PostgreSQL DB

    Agent->>Java: POST /api/tickets/4/escalate {target: "SENIOR_ENGINEER", reason: "Memory leak"}
    Java->>Graph: findEscalationPath("L1_SUPPORT", "SENIOR_ENGINEER")
    Note over Graph: Run BFS queue exploration, discover shortest route, backtrack parentMap
    Graph-->>Java: EscalationPathResult {exists: true, hops: 3, path: "L1 -> L2 -> TECH -> SENIOR"}
    Java->>DB: INSERT into ticket_escalations (ticket_id, path_taken, reason)
    Java->>DB: UPDATE tickets SET status = 'ESCALATED', assigned_team_id = 2
    Java->>DB: INSERT into audit_logs & notifications
    DB-->>Java: Commit Transaction
    Java-->>Agent: 201 Created (Escalation Path Confirmed)
```
