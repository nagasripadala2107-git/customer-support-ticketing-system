# Relational Algebra & Discrete Mathematics (DMGT / DBMS)

This document provides formal mathematical relational algebra expressions and Tuple Relational Calculus (TRC) formulations for queries implemented in the Customer Support Ticketing System.

---

## 1. Fundamental Relational Algebra Operations

| Operator | Symbol | Purpose | Example Syntax |
| :--- | :---: | :--- | :--- |
| **Selection** | $\sigma$ | Selects tuples satisfying a propositional logic condition $p$ | $\sigma_{\text{priority} = \text{'HIGH'}}(R)$ |
| **Projection** | $\pi$ | Selects specified attribute columns and removes duplicates | $\pi_{\text{ticket\_number}, \text{subject}}(R)$ |
| **Natural Join** | $\bowtie$ | Combines tuples matching common attribute names | $R \bowtie S$ |
| **Theta Join** | $\bowtie_{\theta}$ | Combines tuples satisfying condition $\theta$ | $R \bowtie_{R.a = S.b} S$ |
| **Union** | $\cup$ | Set of tuples in $R$ or $S$ (requires union compatibility) | $R \cup S$ |
| **Intersection** | $\cap$ | Set of tuples in both $R$ and $S$ | $R \cap S = R - (R - S)$ |
| **Set Difference** | $-$ | Set of tuples in $R$ but not in $S$ | $R - S$ |
| **Cartesian Product** | $\times$ | All possible pairs of tuples from $R$ and $S$ | $R \times S$ |
| **Aggregate Function** | $\mathcal{G}$ | Calculates count, sum, average, min, max grouped by attributes | $_{\text{team\_id}}\mathcal{G}_{\text{COUNT}(\text{id})}(R)$ |

---

## 2. Core Academic Query Formulations

### Query 1: Find all High-Priority or Critical Tickets
**Objective**: Retrieve ticket number, subject, priority, and status for tickets with priority 'HIGH' or 'CRITICAL'.

**Relational Algebra Expression**:
$$\pi_{\text{ticket\_number}, \text{subject}, \text{priority}, \text{status}} \left( \sigma_{\text{priority} = \text{'HIGH'} \;\lor\; \text{priority} = \text{'CRITICAL'}}(\text{TICKETS}) \right)$$

**SQL Equivalent**:
```sql
SELECT ticket_number, subject, priority, status
FROM tickets
WHERE priority IN ('HIGH', 'CRITICAL');
```

---

### Query 2: Find all Tickets Belonging to Customer "Acme Corporation" (Customer ID = 1)
**Objective**: Retrieve all ticket information opened by Acme Corporation, joined with customer and user profile.

**Relational Algebra Expression**:
$$\pi_{\text{ticket\_number}, \text{subject}, \text{company\_name}, \text{status}} \left( \sigma_{\text{CUSTOMERS.id} = 1} \left( \text{TICKETS} \bowtie_{\text{TICKETS.customer\_id} = \text{CUSTOMERS.id}} \text{CUSTOMERS} \right) \right)$$

**SQL Equivalent**:
```sql
SELECT t.ticket_number, t.subject, c.company_name, t.status
FROM tickets t
JOIN customers c ON t.customer_id = c.id
WHERE c.id = 1;
```

---

### Query 3: Find all Unresolved Tickets Assigned to the "Billing & Finance Team" (Team ID = 1)
**Objective**: Filter tickets whose status is neither 'RESOLVED' nor 'CLOSED' and are assigned to team ID 1.

**Relational Algebra Expression**:
$$\pi_{\text{ticket\_number}, \text{subject}, \text{status}, \text{assigned\_agent\_id}} \left( \sigma_{\text{assigned\_team\_id} = 1 \;\land\; \text{status} \neq \text{'RESOLVED'} \;\land\; \text{status} \neq \text{'CLOSED'}}(\text{TICKETS}) \right)$$

**SQL Equivalent**:
```sql
SELECT ticket_number, subject, status, assigned_agent_id
FROM tickets
WHERE assigned_team_id = 1
  AND status NOT IN ('RESOLVED', 'CLOSED');
```

---

### Query 4: Find all Escalated Tickets and their Graph Traversal Path
**Objective**: Join tickets with ticket escalations to see historical escalation routes.

**Relational Algebra Expression**:
$$\pi_{\text{ticket\_number}, \text{subject}, \text{path\_taken}, \text{escalation\_reason}} \left( \text{TICKETS} \bowtie_{\text{TICKETS.id} = \text{TICKET\_ESCALATIONS.ticket\_id}} \text{TICKET\_ESCALATIONS} \right)$$

**SQL Equivalent**:
```sql
SELECT t.ticket_number, t.subject, te.path_taken, te.escalation_reason
FROM tickets t
JOIN ticket_escalations te ON t.id = te.ticket_id;
```

---

### Query 5: Find Customers who have More Than One Open Ticket
**Objective**: Group open tickets by customer and select customers where ticket count $> 1$.

**Relational Algebra Expression**:
$$\text{OPEN\_TICKETS} \leftarrow \sigma_{\text{status} = \text{'OPEN'}}(\text{TICKETS})$$
$$\text{CUSTOMER\_COUNTS} \leftarrow {}_{\text{customer\_id}}\mathcal{G}_{\text{COUNT}(\text{id}) \to \text{ticket\_count}}(\text{OPEN\_TICKETS})$$
$$\text{MULTIPLE\_OPEN} \leftarrow \sigma_{\text{ticket\_count} > 1}(\text{CUSTOMER\_COUNTS})$$
$$\text{RESULT} \leftarrow \pi_{\text{CUSTOMERS.id}, \text{company\_name}, \text{ticket\_count}}\left( \text{MULTIPLE\_OPEN} \bowtie_{\text{MULTIPLE\_OPEN.customer\_id} = \text{CUSTOMERS.id}} \text{CUSTOMERS} \right)$$

**SQL Equivalent**:
```sql
SELECT c.id, c.company_name, COUNT(t.id) AS ticket_count
FROM customers c
JOIN tickets t ON c.id = t.customer_id
WHERE t.status = 'OPEN'
GROUP BY c.id, c.company_name
HAVING COUNT(t.id) > 1;
```

---

### Query 6: Set Difference - Active Agents with Zero Assigned Tickets
**Objective**: Find agents who currently have no active tickets in their queue.

**Relational Algebra Expression**:
$$\text{ALL\_AGENTS} \leftarrow \pi_{\text{id}}(\sigma_{\text{is\_available} = \text{TRUE}}(\text{AGENTS}))$$
$$\text{BUSY\_AGENTS} \leftarrow \pi_{\text{assigned\_agent\_id}}(\sigma_{\text{status} \in \{\text{'OPEN'}, \text{'IN\_PROGRESS'}, \text{'ESCALATED'}\}}(\text{TICKETS}))$$
$$\text{FREE\_AGENTS} \leftarrow \text{ALL\_AGENTS} - \text{BUSY\_AGENTS}$$

**SQL Equivalent**:
```sql
SELECT a.id, u.first_name, u.last_name
FROM agents a
JOIN users u ON a.user_id = u.id
WHERE a.is_available = TRUE
  AND a.id NOT IN (
      SELECT assigned_agent_id 
      FROM tickets 
      WHERE assigned_agent_id IS NOT NULL 
        AND status IN ('OPEN', 'IN_PROGRESS', 'ESCALATED')
  );
```

---

## 3. Tuple Relational Calculus (TRC) Formulation

### Expression for All High Priority Tickets
$$\{ t \mid t \in \text{TICKETS} \land (t[\text{priority}] = \text{'HIGH'} \lor t[\text{priority}] = \text{'CRITICAL'}) \}$$

### Expression for Tickets Escalated to Senior Engineer
$$\{ t \mid t \in \text{TICKETS} \land \exists e \in \text{TICKET\_ESCALATIONS} \; (e[\text{ticket\_id}] = t[\text{id}] \land \exists l \in \text{ESCALATION\_LEVELS} \; (e[\text{to\_level\_id}] = l[\text{id}] \land l[\text{level\_code}] = \text{'SENIOR\_ENGINEER'})) \}$$
