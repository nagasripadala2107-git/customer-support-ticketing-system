# REST API Documentation

Base URL: `http://localhost:8080/api`
Python Service URL: `http://localhost:8000`

---

## 1. Authentication Endpoints

### POST `/auth/login`
Authenticates a user and issues a signed JWT Bearer token.

**Request Body**:
```json
{
  "email": "sarah.chen@supportdesk.io",
  "password": "Password123!"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 2,
  "email": "sarah.chen@supportdesk.io",
  "firstName": "Sarah",
  "lastName": "Chen",
  "role": "ROLE_AGENT",
  "agentId": 1,
  "teamId": 1,
  "teamName": "Billing & Finance Team"
}
```

---

### POST `/auth/register`
Registers a new customer organization account.

**Request Body**:
```json
{
  "email": "jane.doe@enterprise.com",
  "password": "Password123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "companyName": "Enterprise Corp",
  "phone": "+1-555-0199"
}
```

---

## 2. Ticket Endpoints

### POST `/tickets`
Creates a ticket, triggers automated Python ML classification, routes to team, and assigns an agent.
**Headers**: `Authorization: Bearer <TOKEN>`

**Request Body**:
```json
{
  "subject": "Payment deducted twice",
  "description": "I purchased a product but my account was charged two times."
}
```

**Response (201 Created)**:
```json
{
  "id": 21,
  "ticketNumber": "TKT-2026-0021",
  "customerId": 1,
  "customerName": "John Doe",
  "subject": "Payment deducted twice",
  "description": "I purchased a product but my account was charged two times.",
  "categoryId": 1,
  "categoryName": "Billing & Invoicing",
  "categoryCode": "BILLING",
  "priority": "HIGH",
  "status": "OPEN",
  "assignedAgentId": 1,
  "assignedAgentName": "Sarah Chen",
  "assignedTeamId": 1,
  "assignedTeamName": "Billing & Finance Team",
  "classificationConfidence": 0.9620,
  "isAutoClassified": true,
  "createdAt": "2026-09-26T12:00:00"
}
```

---

### GET `/tickets`
Retrieves tickets filtered by role and parameters.
**Parameters**: `status`, `priority`, `categoryId`, `teamId`, `search`

---

### PUT `/tickets/{id}/status`
Transitions the status of a ticket.

**Request Body**:
```json
{
  "status": "RESOLVED"
}
```

---

## 3. Escalation Endpoints

### POST `/tickets/{ticketId}/escalate`
Executes graph-based escalation. Verifies route in Adjacency List graph, updates status to `ESCALATED`, logs audit entry, and dispatches notification.

**Request Body**:
```json
{
  "targetLevelCode": "SENIOR_ENGINEER",
  "reason": "Platform memory leak causing server crash in production"
}
```

**Response (201 Created)**:
```json
{
  "id": 4,
  "ticketId": 4,
  "fromLevelCode": "L1_SUPPORT",
  "fromLevelName": "Level 1 Frontline Support",
  "toLevelCode": "SENIOR_ENGINEER",
  "toLevelName": "Staff Platform Architect",
  "escalatedByName": "Sarah Chen",
  "escalationReason": "Platform memory leak causing server crash in production",
  "pathTaken": "L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM -> SENIOR_ENGINEER",
  "createdAt": "2026-09-26T12:05:00"
}
```

---

### GET `/escalation/path`
Calculates optimal route between two nodes using BFS.
**Parameters**: `start=L1_SUPPORT`, `target=SENIOR_ENGINEER`

**Response (200 OK)**:
```json
{
  "routeExists": true,
  "sourceLevel": "L1_SUPPORT",
  "targetLevel": "SENIOR_ENGINEER",
  "pathNodes": ["L1_SUPPORT", "L2_SUPPORT", "TECHNICAL_TEAM", "SENIOR_ENGINEER"],
  "hopCount": 3,
  "totalWeight": 6,
  "formattedRoute": "L1_SUPPORT -> L2_SUPPORT -> TECHNICAL_TEAM -> SENIOR_ENGINEER",
  "algorithm": "BFS_SHORTEST_PATH"
}
```

---

## 4. Python Microservice Endpoints (Port 8000)

### POST `/predict`
Runs TF-IDF Vectorizer + Logistic Regression on ticket text.

**Request Body**:
```json
{
  "subject": "Payment deducted twice",
  "description": "I was charged twice for the same order."
}
```

**Response (200 OK)**:
```json
{
  "category": "BILLING",
  "confidence": 0.9412,
  "target_team": "Billing & Finance Team",
  "probabilities": {
    "BILLING": 0.9412,
    "REFUND": 0.0315,
    "TECHNICAL_SUPPORT": 0.0102,
    "ACCOUNT_ACCESS": 0.0071,
    "SHIPPING": 0.0042,
    "PRODUCT_ISSUE": 0.0038,
    "GENERAL_INQUIRY": 0.0020
  },
  "top_tokens": [
    {"token": "payment", "weight": 2.14},
    {"token": "charged", "weight": 1.95},
    {"token": "deducted", "weight": 1.72}
  ],
  "status": "CLASSIFIED"
}
```
