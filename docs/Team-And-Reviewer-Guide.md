# Customer Support Ticketing System (SaaS Helpdesk)
## Complete Project & Team Evaluation Guide (Pin-to-Pin Breakdown)

> **Document Version**: 2.0  
> **Target Audience**: Project Team Members, Evaluators, Reviewers, Faculty & Judges  
> **Tech Stack**: React 19 + TypeScript, Java 17 Spring Boot 3.3, Python 3.11 FastAPI, PostgreSQL 16 (BCNF)

---

## 📑 Table of Contents
1. [Executive Summary & Architecture at a Glance](#1-executive-summary--architecture-at-a-glance)
2. [User Roles & RBAC Permission Matrix](#2-user-roles--rbac-permission-matrix)
3. [Tab 1: Dashboard View & Operational Analytics](#3-tab-1-dashboard-view--operational-analytics)
4. [Tab 2: Tickets Queue & Search Filters](#4-tab-2-tickets-queue--search-filters)
5. [Tab 3: Ticket Detail View, Timeline & Escalation Modal](#5-tab-3-ticket-detail-view-timeline--escalation-modal)
6. [Tab 4: Create New Ticket Modal & Real-time AI Tagging](#6-tab-4-create-new-ticket-modal--real-time-ai-tagging)
7. [Tab 5: Escalation Graph Explorer (ADSA Graph Theory)](#7-tab-5-escalation-graph-explorer-adsa-graph-theory)
8. [Tab 6: NLP Classifier Lab (Python Machine Learning)](#8-tab-6-nlp-classifier-lab-python-machine-learning)
9. [Tab 7: Relational Algebra Query Engine (DBMS & DMGT)](#9-tab-7-relational-algebra-query-engine-dbms--dmgt)
10. [Tab 8: Monorepo Codebase Browser](#10-tab-8-monorepo-codebase-browser)
11. [Tab 9: Directory & Teams Management](#11-tab-9-directory--teams-management)
12. [Tab 10: Audit Trail & Compliance Ledger](#12-tab-10-audit-trail--compliance-ledger)
13. [Top Header Bar & Interactive Role Switcher](#13-top-header-bar--interactive-role-switcher)
14. [Official 9-Step Evaluation Walkthrough for Reviewers](#14-official-9-step-evaluation-walkthrough-for-reviewers)
15. [How to Save or Print this Guide as a PDF](#15-how-to-save-or-print-this-guide-as-a-pdf)

---

## 1. Executive Summary & Architecture at a Glance

### What is this Project?
This system is an **Enterprise Customer Support SaaS Helpdesk** designed to solve the critical problems of modern customer support:
1. **Manual Sorting is Slow**: Replaced with automated **Natural Language Processing (NLP)** that reads incoming ticket text and predicts the department in milliseconds.
2. **Confusing Escalation Transfers**: Replaced with **Graph-Theoretic Routing** (Breadth-First Search) that calculates the shortest path between support tiers while preventing circular routing traps.
3. **Audit & Compliance Gaps**: Backed by a **PostgreSQL relational database normalized to BCNF (Boyce-Codd Normal Form)** with an immutable audit log.

### 4-Tier Monorepo Architecture:
```
┌────────────────────────────────────────────────────────┐
│             Presentation Tier (Frontend)               │
│        React 19 + TypeScript + Tailwind CSS (Vite)     │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (HTTP)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Application Tier (Backend)                 │
│         Java 17 + Spring Boot 3.3.4 REST APIs          │
│   (JWT Security, Routing Engine, ADSA Graph Algorithms)│
└─────────────┬────────────────────────────┬─────────────┘
              │ WebClient                  │ Hibernate / JDBC
              ▼                            ▼
┌───────────────────────────┐  ┌──────────────────────────┐
│   Machine Learning Tier   │  │  Data Persistence Tier   │
│ Python 3.11 FastAPI (NLP) │  │ PostgreSQL 16 Relational │
│ TF-IDF + Logistic Regress │  │ Database (14 BCNF Tables)│
└───────────────────────────┘  └──────────────────────────┘
```

---

## 2. User Roles & RBAC Permission Matrix

The application enforces **Role-Based Access Control (RBAC)** across three primary roles. All demo accounts share the password: `Password123!`

| Role Name | Demo User Email | Who They Are | What They Can See & Do |
| :--- | :--- | :--- | :--- |
| **CUSTOMER** | `john.doe@acme.com` | End-user from a client organization (e.g. Acme Corp) | • Create new tickets<br>• View only their company's tickets<br>• Send customer replies to conversation threads<br>• View ticket resolution status |
| **AGENT** | `sarah.chen@supportdesk.io`<br>`elena.rodriguez@supportdesk.io`<br>`david.kim@supportdesk.io` | Helpdesk support personnel assigned to a department | • View assigned tickets queue<br>• Send official agent replies<br>• Add private internal notes hidden from customers<br>• Reassign tickets to other agents<br>• Trigger Graph BFS Escalations |
| **ADMIN** | `admin@supportdesk.io` | Operations Director & System Administrator | • Global access to all system tickets & analytics<br>• Access to Directory & Teams management<br>• Access to Immutable Audit Logs<br>• Access to Academic Engineering Labs |

---

## 3. Tab 1: Dashboard View & Operational Analytics

### What it is:
The main operational command center providing real-time high-level visibility into support desk operations, volume metrics, and SLA adherence.

### Key Features (Pin-to-Pin):

1. **Top Welcome & Context Header**:
   - Shows current user's name, organization, role badge, and quick buttons: **"Create New Ticket"** and **"View Escalation Graph"**.
   - On mobile screens, automatically collapses into a mobile navigation drawer triggered via the top hamburger button (`☰`).

2. **6 KPI Metric Cards (Swipeable Carousel with Slide Dots on Mobile)**:
   - **Total Tickets**: Total volume across the system or customer scope.
   - **Open Queue**: Newly logged tickets awaiting response.
   - **In Progress**: Active diagnosis and investigation.
   - **Escalated**: Tickets transferred to specialized tiers via graph algorithms.
   - **Resolved**: Tickets where solution was delivered.
   - **Avg SLA Response**: Current average time (`4.2h`) vs enterprise target (`< 8.0h`).
   - *Mobile Behavior*: Swipes horizontally with scroll snapping, accompanied by **6 animated slide dots** that highlight the active card. Tapping any dot smoothly jumps to that card.

3. **Ticket Lifecycle & Status Distribution Graph**:
   - **Interactive Radial Donut Chart**: An SVG ring chart visualizing proportions of all 6 statuses (`OPEN`, `IN_PROGRESS`, `WAITING_FOR_CUSTOMER`, `ESCALATED`, `RESOLVED`, `CLOSED`).
   - **Center Stat Display**: Displays total volume and `% Closed / Resolved` rate. Hovering any slice displays its exact ticket count and share.
   - **Status Progress Meters**: Shows individual percentage progress bars for every status.
   - **Resolution Funnel**: Summarizes Phase 1 (Ingestion), Phase 2 (Active Investigation), and Phase 3 (Closed).
   - **1-Click Table Filter**: Clicking any donut slice or status pill immediately filters the table below to show only those tickets.

4. **Category & Priority Analytics (Admin & Agent View)**:
   - **Category Distribution**: Distribution generated via Python NLP classification across 7 domains.
   - **Priority Breakdown**: Visual metric boxes for `CRITICAL`, `HIGH`, `MEDIUM`, and `LOW`.
   - **Team Workload Distribution**: Displays active ticket counts across teams.

5. **Operational Queue Table**:
   - Shows ticket number, subject, category, priority badge, status indicator, assigned team, ML confidence score, and a **"View Thread"** button to open the full timeline.

---

## 4. Tab 2: Tickets Queue & Search Filters

### What it is:
The central ticket management table allowing agents and customers to search, sort, and slice tickets according to operational criteria.

### Key Features (Pin-to-Pin):
- **Real-Time Search Bar**: Instant multi-field text search matching Ticket Number (e.g. `TKT-2026-0004`), Subject keywords, or Customer Company Name.
- **Filter Dropdowns**:
  - Filter by **Status** (`ALL`, `OPEN`, `IN_PROGRESS`, `ESCALATED`, `RESOLVED`, `CLOSED`).
  - Filter by **Priority** (`ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
  - Filter by **Category** (`Billing`, `Technical Support`, `Account Access`, `Shipping`, etc.).
  - Filter by **Assigned Team** (`Billing & Finance`, `Technical Support`, etc.).
- **Sorting Options**: Sort ascending or descending by Created Date, Priority Level, or ML Classification Confidence.
- **Direct Row Click**: Clicking any ticket row opens its detailed conversation timeline.

---

## 5. Tab 3: Ticket Detail View, Timeline & Escalation Modal

### What it is:
The heart of customer-agent collaboration. Displays full conversation history, audit timeline, metadata, and escalation tools.

### Key Features (Pin-to-Pin):

1. **Ticket Header & Meta Panel**:
   - Ticket Number, Subject, Priority badge, Category code, and Current Status badge.
   - SLA Countdown Timer indicating hours elapsed vs maximum SLA threshold.

2. **Conversation Timeline**:
   - **Customer Messages** (Blue bubbles on left): Inquiries and follow-ups.
   - **Agent Replies** (Dark slate bubbles on right): Official customer-facing answers.
   - **Internal Notes** (Amber shaded with lock icon): Private agent-to-agent notes invisible to customers.
   - **System Audit Events** (Centered timeline pills): Records state changes (e.g., *"Status changed from OPEN to IN_PROGRESS by Sarah Chen"*).

3. **Action Bar**:
   - **Send Reply**: Toggle between public customer response and private internal note.
   - **Update Status**: Dropdown to transition ticket between `OPEN`, `IN_PROGRESS`, `RESOLVED`, and `CLOSED`.
   - **Reassign Agent**: Select another available staff member from the department.
   - **Escalate (Graph BFS) Button**: Opens the Graph Escalation Modal.

4. **Graph BFS Escalation Modal**:
   - Shows current tier (e.g. `L1_SUPPORT`).
   - Agent selects destination tier (e.g. `SENIOR_ENGINEER`).
   - Agent enters an escalation reason (e.g., *"Production database memory leak requires staff architect inspection"*).
   - The system executes **Breadth-First Search (BFS)** to determine the shortest path:
     $$\text{L1\_SUPPORT} \to \text{L2\_SUPPORT} \to \text{TECHNICAL\_TEAM} \to \text{SENIOR\_ENGINEER}$$
   - Commits the record to PostgreSQL `ticket_escalations` table and updates ticket status to `ESCALATED`.

---

## 6. Tab 4: Create New Ticket Modal & Real-time AI Tagging

### What it is:
The customer intake portal where users submit new issues, featuring real-time AI classification before submission.

### Key Features (Pin-to-Pin):
- **Evaluation Preset**: Includes a 1-click button: *"Fill Evaluation Preset: Payment deducted twice"* for fast faculty testing.
- **Form Fields**:
  - Customer Organization selector (locked to current customer when logged in as a customer).
  - Subject input field.
  - Description textarea.
- **Real-time ML Classifier Feedback Badge**:
  - As the user types, the form queries the Python NLP model.
  - Displays predicted category (e.g. `BILLING`), confidence level (e.g. `96.2%`), and automatically assigns default priority.
- **Submission Action**:
  - Creates the ticket in PostgreSQL.
  - Automatically routes to the assigned team.
  - Immediately opens the newly created ticket in the queue.

---

## 7. Tab 5: Escalation Graph Explorer (ADSA Graph Theory)

### What it is:
An interactive computer science visualizer demonstrating **Graph Theory** applied to enterprise support desk routing.

### Key Theoretical Concepts:
- **Graph Formulation**: Modeled as a Directed Weighted Graph $G = (V, E, W)$ where vertices $V$ are support tiers, directed edges $E$ are authorized transfers, and weights $W$ represent administrative hop costs.
- **Adjacency List Structure**: Implemented using a Java `HashMap<String, List<DirectedEdge>>` requiring $\Theta(|V| + |E|) = 12$ references instead of an $O(V^2) = 36$ dense matrix.
- **BFS Shortest Path ($O(V+E)$)**: Calculates the minimum-hop path using a FIFO Queue and parent backtracking map.
- **DFS Cycle Detection**: Uses the Tri-Color algorithm (`WHITE`, `GRAY`, `BLACK`) to verify that the graph is a strict **Directed Acyclic Graph (DAG)** and prevent infinite escalation loops.

### Visualizer Features (Pin-to-Pin):
- **Reviewer Quick Presets**: 1-click execution buttons for:
  - *Scenario 1: Tech Outage Multi-Hop* (`L1 ➔ L2 ➔ Tech ➔ Senior`)
  - *Scenario 2: Financial Dispute Escalation* (`L1 ➔ Billing ➔ Executive`)
  - *Scenario 3: Enterprise SLA Breach* (`Tech ➔ Senior ➔ Executive`)
  - *Scenario 4: DFS Full Graph Sweep* (Cycle Verification)
- **Interactive Source & Target Selectors**: Pick any start and destination tier to run BFS or DFS live.
- **SVG Graph Canvas**: Nodes render with tier names, SLA hours, and primary assigned agents. Directed edges light up in blue when traversed in the active path.
- **Internal Adjacency List Table**: Displays the raw memory representation and out-degree for each vertex.

---

## 8. Tab 6: NLP Classifier Lab (Python Machine Learning)

### What it is:
A live testing playground for the **Natural Language Processing (NLP)** classification microservice.

### Key Machine Learning Concepts:
- **Vectorization**: Uses **TF-IDF** (Term Frequency–Inverse Document Frequency) with unigram and bigram tokenization ($1 \le n \le 2$).
- **Algorithm**: **Multinomial Logistic Regression** with L2 regularization ($\lambda = 1.0$) trained on 140+ real-world support ticket examples across 7 categories.
- **Confidence Output**: Softmax probability distribution over all 7 classes.

### Playground Features (Pin-to-Pin):
- **Preset Test Prompts**: Clickable sample prompts for Billing, Technical Crash, 2FA Authentication, Courier Logistics, and Refund requests.
- **Custom Input Sandbox**: Freeform Subject and Description inputs.
- **Live Output Panel**:
  - **Predicted Category** with colorful icon badge.
  - **Overall Confidence Meter** (e.g., `96.2% Confidence`).
  - **Probability Distribution Chart**: Horizontal bars displaying the softmax score for all 7 candidate categories.
  - **Default Routing Output**: Displays which department team and agent will receive the ticket automatically.

---

## 9. Tab 7: Relational Algebra Query Engine (DBMS & DMGT)

### What it is:
An academic database visualizer showing how business inquiries are translated into formal mathematical **Relational Algebra** and **Tuple Relational Calculus (TRC)** expressions.

### Mathematical Operations Covered:
1. **$\sigma$ (Selection)**: Horizontal filtering of tuples ($\sigma_{\text{status} = \text{'OPEN'}}(\text{TICKETS})$).
2. **$\pi$ (Projection)**: Vertical selection of specific attributes ($\pi_{\text{ticket\_number, subject}}(\text{TICKETS})$).
3. **$\bowtie$ (Natural Join)**: Combining related relations on primary/foreign key ($\text{TICKETS} \bowtie_{\text{customer\_id}} \text{CUSTOMERS}$).
4. **$\cup$ (Union)**: Combining distinct relation sets.
5. **$\cap$ (Intersection)**: Common elements across sets.
6. **$-$ (Set Difference)**: Tuples in relation A not present in relation B.
7. **$\mathcal{G}$ (Aggregate Grouping)**: Counting tickets grouped by category.

### Features in the Tab:
- **Interactive Query Selector**: Choose between Selection, Projection, Joins, Set Ops, and Aggregation queries.
- **Formula Cards**: Displays mathematical Relational Algebra formula, Formal TRC expression, and executable SQL query.
- **Live Result Table**: Displays the generated relation table and row count.

---

## 10. Tab 8: Monorepo Codebase Browser

### What it is:
An integrated in-app **Code Inspector** enabling reviewers to inspect the project's real backend, machine learning, and database source code directly in the browser.

### Monorepo Structure:
- **Backend (Java Spring Boot 3.3)**:
  - `SecurityConfig.java`: Spring Security & JWT filter configuration.
  - `RoutingService.java`: Category-to-team routing logic.
  - `EscalationGraphService.java`: Adjacency list and BFS/DFS graph algorithms.
- **Machine Learning (Python FastAPI)**:
  - `main.py`: FastAPI routes (`/predict`, `/health`).
  - `predictor.py`: TF-IDF vectorization & Logistic Regression model inference.
- **Database (PostgreSQL 16)**:
  - `01_schema.sql`: 14 tables normalized to BCNF, constraints, and audit triggers.
  - `02_seed_data.sql`: Initial seed records for teams, agents, customers, and tickets.

---

## 11. Tab 9: Directory & Teams Management

### What it is:
A relational directory providing full visibility into organizational structure, support personnel, and customer accounts.

### Features in the Tab:
1. **Agent Escalation Tier Hierarchy Reference Matrix**:
   - Visual cards outlining the 6 tiers (`L1_SUPPORT`, `L2_SUPPORT`, `BILLING_SPECIALIST`, `TECHNICAL_TEAM`, `SENIOR_ENGINEER`, `EXECUTIVE_LEAD`), their SLA targets, and assigned agents.
2. **Support Agents Table (8 Agents)**:
   - Name, Email, Assigned Department, Tier Level, **Escalation Graph Tier Badge**, Max Tickets capacity, and Availability status.
3. **Customer Accounts Table (10 Organizations)**:
   - Company Name, Primary Contact, Email, SLA Account Tier (`ENTERPRISE`, `PRO`, `STANDARD`), and Campus Location.
4. **Department Teams Table (5 Teams)**:
   - Team Name, Code, Responsibilities scope, and Active Agent count.
5. **Issue Categories Table (7 Categories)**:
   - Category Name, ML Code, Default Routed Team, and Functional Description.

---

## 12. Tab 10: Audit Trail & Compliance Ledger

### What it is:
An immutable chronological ledger that tracks every critical system action for security, compliance, and dispute resolution.

### Events Recorded:
- `TICKET_CREATE`: Logged whenever a customer or agent files a ticket.
- `CLASSIFY_TICKET`: Records the NLP prediction and confidence score.
- `TICKET_UPDATE_STATUS`: Records every transition (e.g., from `OPEN` to `IN_PROGRESS`).
- `TICKET_ESCALATE`: Records the source tier, destination tier, path taken, and reason.
- `REASSIGN_AGENT`: Logs agent transfer events.

---

## 13. Top Header Bar & Interactive Role Switcher

### Features:
- **Brand Title**: Helpdesk SaaS wordmark with navigation anchor.
- **Evaluation Demo Guide Button**: Opens the modal with step-by-step instructions.
- **Reset Sample Data Button**: Resets the database to original seed state if tickets are modified during testing.
- **Notifications Bell**: Live unread notification counter and popover list.
- **Interactive Role Switcher**:
  - Dropdown permitting instant role-switching between Customer (`John Doe`), Agents across various tiers (`Elena`, `Sarah`, `Marcus`, `Lucas`, `David`), and Admin (`Alex Morgan`).
  - Every agent in the dropdown displays their assigned **Escalation Tier Badge**.

---

## 14. Official 9-Step Evaluation Walkthrough for Reviewers

Reviewers can execute this exact 9-step evaluation sequence to verify end-to-end functionality:

1. **Step 1: Log in as Customer**
   - Use the top-right switcher to select **Customer: John Doe (Acme Corp)**.
2. **Step 2: Create a Ticket**
   - Click **Create New Ticket** $\to$ click **"Fill Evaluation Preset"** (Subject: *"Payment deducted twice"*).
3. **Step 3: Verify Python ML Classification**
   - Confirm that the NLP classifier detects Category = `BILLING` with ~`96.2%` confidence.
4. **Step 4: Verify Automated Java Routing**
   - Click Submit. Verify the ticket is assigned to the **Billing & Finance Team** (Agent: Sarah Chen).
5. **Step 5: Switch to Agent: Sarah Chen**
   - Switch role to Sarah Chen. Open the newly created ticket in the queue.
6. **Step 6: Agent Reply & Internal Note**
   - Add an agent response and a private internal note. Observe status transition to `IN_PROGRESS`.
7. **Step 7: Escalate Ticket via Graph BFS**
   - Click **"Escalate Ticket"** $\to$ pick destination `SENIOR_ENGINEER`.
   - The graph algorithm computes the BFS shortest route (`L1 ➔ L2 ➔ Tech ➔ Senior`).
8. **Step 8: Verify Escalation Record**
   - Status updates to `ESCALATED`. Check the timeline and PostgreSQL `ticket_escalations` table.
9. **Step 9: Admin Dashboard & Graphs**
   - Switch to **Admin: Alex Morgan**. Review the **Status Donut Graph**, **Escalation Graph**, and **Relational Algebra** query engine.

---

## 15. How to Save or Print this Guide as a PDF

To share this document with your group or submit it to evaluators:

1. **In Google Chrome or Microsoft Edge**:
   - Open this document or preview page.
   - Press `Ctrl + P` (Windows) or `Cmd + P` (Mac).
   - In the Destination dropdown, choose **"Save as PDF"**.
   - Check **"Background graphics"** for clean color rendering.
   - Click **Save**.
2. **In VS Code / IDE**:
   - Right-click this Markdown file $\to$ select **"Markdown: Open Preview"**.
   - Right-click within the preview $\to$ choose **"Print"** or **"Export to PDF"**.
