# Relational Schema & Normalization Analysis

## 1. Formal Relational Schemas

- **USERS** ($\underline{\text{id}}$, email, password_hash, first_name, last_name, role, phone, is_active, created_at, updated_at)
  - Candidate Keys: $\{\text{id}\}$, $\{\text{email}\}$
  - Primary Key: $\text{id}$

- **CUSTOMERS** ($\underline{\text{id}}$, $\text{user\_id}^\ast$, company_name, account_tier, address, created_at)
  - Primary Key: $\text{id}$
  - Foreign Key: $\text{user\_id} \to \text{USERS}(\text{id})$

- **TEAMS** ($\underline{\text{id}}$, name, code, description, is_active, created_at)
  - Candidate Keys: $\{\text{id}\}$, $\{\text{code}\}$, $\{\text{name}\}$
  - Primary Key: $\text{id}$

- **AGENTS** ($\underline{\text{id}}$, $\text{user\_id}^\ast$, $\text{team\_id}^\ast$, tier_level, max_active_tickets, is_available, created_at)
  - Primary Key: $\text{id}$
  - Foreign Keys: $\text{user\_id} \to \text{USERS}(\text{id})$, $\text{team\_id} \to \text{TEAMS}(\text{id})$

- **CATEGORIES** ($\underline{\text{id}}$, name, code, description, $\text{default\_team\_id}^\ast$, created_at)
  - Primary Key: $\text{id}$
  - Foreign Key: $\text{default\_team\_id} \to \text{TEAMS}(\text{id})$

- **TICKETS** ($\underline{\text{id}}$, ticket_number, $\text{customer\_id}^\ast$, subject, description, $\text{category\_id}^\ast$, priority, status, $\text{assigned\_agent\_id}^\ast$, $\text{assigned\_team\_id}^\ast$, classification_confidence, is_auto_classified, created_at, updated_at, resolved_at, closed_at)
  - Candidate Keys: $\{\text{id}\}$, $\{\text{ticket\_number}\}$
  - Foreign Keys:
    - $\text{customer\_id} \to \text{CUSTOMERS}(\text{id})$
    - $\text{category\_id} \to \text{CATEGORIES}(\text{id})$
    - $\text{assigned\_agent\_id} \to \text{AGENTS}(\text{id})$
    - $\text{assigned\_team\_id} \to \text{TEAMS}(\text{id})$

- **TICKET_MESSAGES** ($\underline{\text{id}}$, $\text{ticket\_id}^\ast$, $\text{sender\_user\_id}^\ast$, message_text, message_type, created_at)
  - Primary Key: $\text{id}$
  - Foreign Keys: $\text{ticket\_id} \to \text{TICKETS}(\text{id})$, $\text{sender\_user\_id} \to \text{USERS}(\text{id})$

- **ESCALATION_LEVELS** ($\underline{\text{id}}$, level_code, name, description, $\text{target\_team\_id}^\ast$, sla_hours)
  - Candidate Keys: $\{\text{id}\}$, $\{\text{level\_code}\}$
  - Primary Key: $\text{id}$

- **ESCALATION_EDGES** ($\underline{\text{id}}$, $\text{from\_level\_id}^\ast$, $\text{to\_level\_id}^\ast$, weight, condition_description)
  - Primary Key: $\text{id}$
  - Candidate Key: $\{\text{from\_level\_id}, \text{to\_level\_id}\}$
  - Foreign Keys: $\text{from\_level\_id} \to \text{ESCALATION\_LEVELS}(\text{id})$, $\text{to\_level\_id} \to \text{ESCALATION\_LEVELS}(\text{id})$

- **TICKET_ESCALATIONS** ($\underline{\text{id}}$, $\text{ticket\_id}^\ast$, $\text{from\_level\_id}^\ast$, $\text{to\_level\_id}^\ast$, $\text{escalated\_by\_user\_id}^\ast$, escalation_reason, path_taken, created_at)
  - Primary Key: $\text{id}$
  - Foreign Keys:
    - $\text{ticket\_id} \to \text{TICKETS}(\text{id})$
    - $\text{from\_level\_id} \to \text{ESCALATION\_LEVELS}(\text{id})$
    - $\text{to\_level\_id} \to \text{ESCALATION\_LEVELS}(\text{id})$
    - $\text{escalated\_by\_user\_id} \to \text{USERS}(\text{id})$

---

## 2. Functional Dependencies & Normalization Proof

### A. First Normal Form (1NF)
- All attributes are atomic and indivisible (e.g., no multi-valued attributes or repeating groups).
- All columns have defined relational domain types.

### B. Second Normal Form (2NF)
- Relation is in 1NF.
- There are no partial functional dependencies: in every table with composite candidate keys (e.g. `ESCALATION_EDGES` with $\{\text{from\_level\_id}, \text{to\_level\_id}\}$), every non-prime attribute depends on the whole key:
  $$\{\text{from\_level\_id}, \text{to\_level\_id}\} \to \text{weight}, \text{condition\_description}$$

### C. Third Normal Form (3NF)
- Relation is in 2NF.
- No non-prime attribute is transitively dependent on any candidate key:
  - In `TICKETS`, attributes like `company_name` are kept in `CUSTOMERS`, not duplicated in `TICKETS`.
  - In `AGENTS`, `team_name` is stored in `TEAMS`, eliminating transitive dependency $\text{ticket\_id} \to \text{agent\_id} \to \text{team\_name}$.

### D. Boyce-Codd Normal Form (BCNF)
- For every non-trivial functional dependency $X \to Y$, $X$ is a superkey.
- In `USERS`: $\text{id} \to \text{All attributes}$ and $\text{email} \to \text{All attributes}$; both $\text{id}$ and $\text{email}$ are superkeys.
- Therefore, the schema is in BCNF.
