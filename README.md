# CUSTOMER SUPPORT TICKETING SYSTEM (SAAS HELPDESK)

A production-grade, multi-tier Customer Support Helpdesk platform designed for academic evaluation and enterprise SaaS helpdesk operations. It bridges natural language machine learning classification with graph-theoretic ticket escalation and relational database normalization.

---

## 1. Problem Statement
In traditional helpdesk platforms, tickets often exist as disconnected entities lacking structured links to customers, agents, specialized department teams, categories, or escalation history. Consequently:
- Frontline agents spend manual effort reading and categorizing tickets.
- Misrouted tickets bounce across teams, leading to severe SLA breaches.
- Escalation paths are ad-hoc rather than routed through validated organizational hierarchies.

### The Solution:
Our system enforces a strictly connected relational lifecycle:
$$\text{Customer} \longrightarrow \text{Ticket} \overset{\text{Python NLP}}{\longrightarrow} \text{Category} \overset{\text{Java Routing}}{\longrightarrow} \text{Team/Agent} \longrightarrow \text{Responses} \overset{\text{ADSA Graph}}{\longrightarrow} \text{Escalation History} \longrightarrow \text{Resolution}$$

---

## 2. Academic Subject Mapping

| Academic Subject | Topic Covered | Implementation Location |
| :--- | :--- | :--- |
| **DBMS** | ER Modeling, 3NF/BCNF Normalization, Indexes, Constraints, Relational Schema | `/database/schema/01_schema.sql`, `/docs/ER-Diagram.md`, `/docs/Relational-Schema.md` |
| **DMGT** | Relational Algebra ($\sigma, \pi, \bowtie, \cup, \cap, -, \mathcal{G}$), Tuple Relational Calculus (TRC) | `/docs/Relational-Algebra.md` |
| **ADSA** | Directed Weighted Graph, Adjacency List, Breadth-First Search (BFS), Depth-First Search (DFS), Cycle Detection | `/backend/src/main/java/com/supportdesk/ticketing/graph/`, `/docs/Escalation-Graph.md` |
| **OOPJ** | Encapsulation, Polymorphism, Abstraction, Inheritance, SOLID, Repository & DTO Patterns | `/backend/src/main/java/com/supportdesk/ticketing/`, `/docs/OOP-Concepts.md` |
| **Python / ML** | Text Preprocessing, TF-IDF Vectorization, Logistic Regression, Multi-class Inference, FastAPI | `/classifier/`, `/classifier/main.py`, `/classifier/classifier/predictor.py` |

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Java 17, Spring Boot 3.3.4, Spring Data JPA, Spring Security, JJWT, Spring WebClient
- **Machine Learning**: Python 3.11, FastAPI, scikit-learn (TF-IDF + Multinomial Logistic Regression), NumPy
- **Database**: PostgreSQL 16 (Normalized to 3NF/BCNF with foreign key constraints, checks, indexes)
- **Containerization**: Docker, Docker Compose

---

## 4. Monorepo Project Structure
## 📁 Project Structure

```text
customer-support-ticketing/
│
├── src/                         # React + TypeScript frontend
│   ├── components/              # UI components
│   ├── data/                    # Application data
│   ├── services/                # API integration
│   ├── App.tsx                  # Main application
│   └── index.css                # Global styling
│
├── backend/                     # Java + Spring Boot backend
│   ├── pom.xml
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/
│   │               └── supportdesk/
│   │                   └── ticketing/
│   │                       ├── controllers/
│   │                       ├── services/
│   │                       ├── repositories/
│   │                       ├── entities/
│   │                       ├── dto/
│   │                       ├── security/
│   │                       ├── graph/
│   │                       └── config/
│   │
│   ├── test/                   # Backend tests
│   └── Dockerfile
│
├── classifier/                 # Python + FastAPI ML service
│   ├── requirements.txt
│   ├── main.py
│   ├── model/
│   │   └── dataset.py
│   ├── classifier/
│   │   └── predictor.py
│   ├── training/
│   │   └── train.py
│   ├── test_classifier.py
│   └── Dockerfile
│
├── database/                   # PostgreSQL database
│   ├── schema/
│   ├── seed/
│   └── documentation/
│
├── docs/                       # Academic & technical documentation
│   ├── ER-Diagram.md
│   ├── Relational-Schema.md
│   ├── Relational-Algebra.md
│   ├── Escalation-Graph.md
│   ├── OOP-Concepts.md
│   ├── API-Documentation.md
│   └── Project-Architecture.md
│
├── docker-compose.yml          # Multi-service Docker configuration
├── .env.example                # Environment variables template
├── .gitignore
├── index.html                  # Vite entry point
├── metadata.json
├── package.json                # Frontend dependencies
├── package-lock.json
├── tsconfig.json
└── README.md
```


## 5. Demo Credentials & Complete Agent Roster

All demo accounts share the password: `Password123!`

### Support Agents & Administrative Leadership

| Agent Name | Email | Role | Department Team | Tier Level | Escalation Graph Node | Max Tickets |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Alex Morgan** | `admin@supportdesk.io` | `ROLE_ADMIN` | Executive Operations | Operations Director | `EXECUTIVE_LEAD` | Unlimited |
| **Sarah Chen** | `sarah.chen@supportdesk.io` | `ROLE_AGENT` | Billing & Finance | Tier 1 (Lead) | `BILLING_SPECIALIST` | 10 |
| **Marcus Vance** | `marcus.vance@supportdesk.io` | `ROLE_AGENT` | Billing & Finance | Tier 2 | `L2_SUPPORT` | 8 |
| **Elena Rodriguez** | `elena.rodriguez@supportdesk.io` | `ROLE_AGENT` | Technical Support | Tier 1 (Frontline) | `L1_SUPPORT` | 10 |
| **David Kim** | `david.kim@supportdesk.io` | `ROLE_AGENT` | Technical Support | Tier 3 (Architect) | `SENIOR_ENGINEER` | 6 |
| **Priya Patel** | `priya.patel@supportdesk.io` | `ROLE_AGENT` | Account & Security | Tier 1 | `L1_SUPPORT` | 12 |
| **James Wilson** | `james.wilson@supportdesk.io` | `ROLE_AGENT` | Shipping & Logistics | Tier 1 | `L1_SUPPORT` | 10 |
| **Ananya Rao** | `ananya.rao@supportdesk.io` | `ROLE_AGENT` | Product Engineering | Tier 2 | `L2_SUPPORT` | 8 |
| **Lucas Muller** | `lucas.muller@supportdesk.io` | `ROLE_AGENT` | Technical Support | Lead Engineer | `TECHNICAL_TEAM` | 5 |

### Customer Accounts

| Customer Name | Email | Company | SLA Account Tier |
| :--- | :--- | :--- | :--- |
| **John Doe** | `john.doe@acme.com` | Acme Corporation | Enterprise ($SLA < 4h$) |
| **Alice Smith** | `alice.smith@globex.corp` | Globex Industries | Pro ($SLA < 8h$) |
| **Robert Taylor** | `robert.taylor@initech.io` | Initech Solutions | Standard ($SLA < 24h$) |
| **Emily Watson** | `emily.watson@hooli.com` | Hooli Media | Enterprise ($SLA < 4h$) |

---

## 6. Official Demonstration Flow for Judges / Faculty

### Step 1: Login as Customer
- Select or log in as **Customer: John Doe (Acme Corporation)**.

### Step 2: Create a Ticket
- Submit the test prompt:
  - **Subject**: `"Payment deducted twice"`
  - **Description**: `"I purchased a product but my account was charged two times on my credit card."`

### Step 3: Automated Machine Learning Classification
- The backend submits the text to the **Python FastAPI Microservice**.
- The classifier tokenizes the text, calculates **TF-IDF n-grams**, and executes **Logistic Regression**.
- Predicted Category: `BILLING` (Confidence: `96.2%`).

### Step 4: Automated Routing
- Java `RoutingService` inspects the category mapping:
 **BILLING → Billing & Finance Team**
- Assigns ticket to available agent **Sarah Chen**.

### Step 5: Agent Triage
- Switch role to **Agent: Sarah Chen**.
- Open ticket `TKT-2026-0021`.
- View customer description, reply with billing verification note, and add internal notes.

### Step 6: Graph-Based Escalation
- Click **"Escalate Ticket"**.
- Select target level: `BILLING_SPECIALIST` or `SENIOR_ENGINEER`.
- The **AdjacencyListGraph** calculates the shortest route via **BFS**:
  **L1 SUPPORT → L2 SUPPORT → TECHNICAL TEAM → SENIOR ENGINEER**
- The path is validated and recorded in PostgreSQL table `ticket_escalations`.
- Ticket status updates to `ESCALATED`.

### Step 7: Admin Dashboard & Analytics
- Switch role to **Admin: Alex Morgan**.
- Review updated real-time KPI metrics, tickets by category, team workloads, audit logs, and interactive graph explorer.

---

## 7. How to Run with Docker Compose

Ensure Docker and Docker Compose are installed.

```bash
# 1. Clone repository
git clone https://github.com/your-username/customer-support-ticketing.git
cd customer-support-ticketing

# 2. Setup environment variables
cp .env.example .env

# 3. Build and launch all 4 microservices
docker compose up --build
```

Access points:
- **Frontend Dashboard**: `http://localhost:3000`
- **Spring Boot REST API**: `http://localhost:8080/api`
- **Python Classifier API Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432` (`customer_support_db`)

---

## 8. Running Services Locally Without Docker

### Prerequisites
- JDK 17+ and Maven 3.9+
- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL 16 running on port 5432

### 1. Database
```bash
psql -U postgres -c "CREATE DATABASE customer_support_db;"
psql -U postgres -d customer_support_db -f database/schema/01_schema.sql
psql -U postgres -d customer_support_db -f database/seed/02_seed_data.sql
```

### 2. Python Classifier
```bash
cd classifier
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Java Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```

### 4. React Frontend
```bash
npm install
npm run dev
```

---

## 9. Testing & Quality Verification

### Run Java Backend Tests
```bash
cd backend
mvn test
```
Tests verified:
- `EscalationGraphTest`: BFS shortest path, DFS traversal, and cycle detection.
- `RoutingServiceTest`: Team assignment logic for categories.

### Run Python Classifier Tests
```bash
cd classifier
pytest test_classifier.py
python training/train.py
```
Outputs cross-validation accuracy and inference scores on test prompts.
