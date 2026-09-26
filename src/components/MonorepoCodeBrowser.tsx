import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Folder } from 'lucide-react';

interface CodeFile {
  path: string;
  name: string;
  category: 'JAVA_BACKEND' | 'PYTHON_ML' | 'DATABASE_SQL' | 'DOCKER_CONFIG' | 'DOCUMENTATION';
  language: string;
  content: string;
}

export const MonorepoCodeBrowser: React.FC = () => {
  const files: CodeFile[] = [
    {
      path: 'backend/src/main/java/com/supportdesk/ticketing/graph/AdjacencyListGraph.java',
      name: 'AdjacencyListGraph.java (ADSA)',
      category: 'JAVA_BACKEND',
      language: 'java',
      content: `package com.supportdesk.ticketing.graph;

import lombok.Getter;
import org.springframework.stereotype.Component;
import java.util.*;

/**
 * ADSA Escalation Graph implemented as an Adjacency List.
 * Provides BFS and DFS traversals, cycle detection, and shortest escalation path calculation.
 */
@Component
public class AdjacencyListGraph {

    public static class DirectedEdge {
        @Getter private final String targetNode;
        @Getter private final int weight;
        @Getter private final String condition;

        public DirectedEdge(String targetNode, int weight, String condition) {
            this.targetNode = targetNode;
            this.weight = weight;
            this.condition = condition;
        }
    }

    private final Map<String, EscalationNode> nodeMetadata = new LinkedHashMap<>();
    private final Map<String, List<DirectedEdge>> adjacencyList = new LinkedHashMap<>();

    public synchronized void addNode(String code, String name, String teamName, int slaHours) {
        nodeMetadata.putIfAbsent(code, EscalationNode.builder()
                .code(code).name(name).teamName(teamName).slaHours(slaHours).build());
        adjacencyList.putIfAbsent(code, new ArrayList<>());
    }

    public synchronized void addEdge(String fromNode, String toNode, int weight, String condition) {
        adjacencyList.putIfAbsent(fromNode, new ArrayList<>());
        adjacencyList.putIfAbsent(toNode, new ArrayList<>());
        adjacencyList.get(fromNode).add(new DirectedEdge(toNode, weight, condition));
    }

    /**
     * Breadth-First Search (BFS) to compute minimum-hop escalation route
     * Time Complexity: O(V + E) | Space Complexity: O(V)
     */
    public EscalationPathResult findEscalationPath(String startNode, String targetNode) {
        if (!adjacencyList.containsKey(startNode) || !adjacencyList.containsKey(targetNode)) {
            return EscalationPathResult.builder().pathExists(false).build();
        }

        Queue<String> queue = new LinkedList<>();
        Map<String, String> parentMap = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(startNode);
        visited.add(startNode);
        parentMap.put(startNode, null);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            if (current.equals(targetNode)) break;

            for (DirectedEdge edge : adjacencyList.getOrDefault(current, Collections.emptyList())) {
                String neighbor = edge.getTargetNode();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parentMap.put(neighbor, current);
                    queue.add(neighbor);
                }
            }
        }

        LinkedList<String> path = new LinkedList<>();
        String curr = targetNode;
        while (curr != null) {
            path.addFirst(curr);
            curr = parentMap.get(curr);
        }

        return EscalationPathResult.builder()
                .pathExists(path.getFirst().equals(startNode))
                .path(path)
                .totalHops(path.size() - 1)
                .formattedPath(String.join(" -> ", path))
                .build();
    }
}`,
    },
    {
      path: 'backend/src/main/java/com/supportdesk/ticketing/services/TicketService.java',
      name: 'TicketService.java (Routing & ML)',
      category: 'JAVA_BACKEND',
      language: 'java',
      content: `package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.dto.*;
import com.supportdesk.ticketing.entities.*;
import com.supportdesk.ticketing.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ClassificationService classificationService;
    private final RoutingService routingService;
    private final AuditService auditService;

    @Transactional
    public TicketResponse createTicket(TicketRequest request, User currentUser) {
        // 1. Invoke Python FastAPI Microservice for TF-IDF NLP classification
        ClassificationResponse mlResult = classificationService.classifyTicket(
                request.getSubject(), request.getDescription());

        // 2. Automatic Routing to Department Support Team
        Category category = resolveCategory(mlResult.getCategory());
        Team targetTeam = routingService.determineTargetTeam(category);
        Agent assignedAgent = routingService.selectBestAgent(targetTeam);

        // 3. Format Ticket Number TKT-2026-XXXX
        String ticketNumber = String.format("TKT-2026-%04d", ticketRepository.count() + 1);

        // 4. Save Ticket Entity in PostgreSQL
        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .subject(request.getSubject())
                .description(request.getDescription())
                .category(category)
                .status(TicketStatus.OPEN)
                .assignedTeam(targetTeam)
                .assignedAgent(assignedAgent)
                .classificationConfidence(BigDecimal.valueOf(mlResult.getConfidence()))
                .build();

        ticket = ticketRepository.save(ticket);
        auditService.recordAudit(currentUser, "TICKET_CREATE", "TICKET", ticket.getId(), "Created ticket");
        return mapToResponse(ticket);
    }
}`,
    },
    {
      path: 'classifier/classifier/predictor.py',
      name: 'predictor.py (TF-IDF + Logistic Reg)',
      category: 'PYTHON_ML',
      language: 'python',
      content: `"""
NLP Ticket Classifier Engine
Uses TF-IDF Vectorizer + Logistic Regression across 7 defined support categories.
"""
import re
from typing import Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from model.dataset import TRAINING_DATA

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\\s]", " ", text)
    return re.sub(r"\\s+", " ", text).strip()

class TicketClassifier:
    def __init__(self):
        self.pipeline: Pipeline = None
        self._train_model()

    def _train_model(self):
        corpus = [f"{clean_text(s)} {clean_text(d)}" for s, d, _ in TRAINING_DATA]
        labels = [cat for _, _, cat in TRAINING_DATA]

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=2500, sublinear_tf=True)),
            ("clf", LogisticRegression(C=2.5, max_iter=500, multi_class="multinomial"))
        ])
        self.pipeline.fit(corpus, labels)

    def predict(self, subject: str, description: str) -> Dict[str, Any]:
        combined = f"{clean_text(subject)} {clean_text(description)}"
        probas = self.pipeline.predict_proba([combined])[0]
        classes = self.pipeline.classes_
        best_idx = int(np.argmax(probas))

        return {
            "category": str(classes[best_idx]),
            "confidence": float(np.round(probas[best_idx], 4)),
            "probabilities": {str(c): float(p) for c, p in zip(classes, probas)}
        }

classifier_instance = TicketClassifier()`,
    },
    {
      path: 'database/schema/01_schema.sql',
      name: '01_schema.sql (PostgreSQL 3NF DDL)',
      category: 'DATABASE_SQL',
      language: 'sql',
      content: `-- PostgreSQL 16 Normalized Database Schema (3NF/BCNF)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN'))
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED')),
    assigned_agent_id BIGINT REFERENCES agents(id),
    assigned_team_id BIGINT REFERENCES teams(id),
    classification_confidence NUMERIC(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_escalations (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    from_level_id BIGINT NOT NULL REFERENCES escalation_levels(id),
    to_level_id BIGINT NOT NULL REFERENCES escalation_levels(id),
    escalated_by_user_id BIGINT NOT NULL REFERENCES users(id),
    escalation_reason TEXT NOT NULL,
    path_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    },
    {
      path: 'docker-compose.yml',
      name: 'docker-compose.yml (Multi-Service)',
      category: 'DOCKER_CONFIG',
      language: 'yaml',
      content: `services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: customer_support_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]

  classifier:
    build: ./classifier
    ports: ["8000:8000"]
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]

  backend:
    build: ./backend
    depends_on:
      postgres: { condition: service_healthy }
      classifier: { condition: service_healthy }
    ports: ["8080:8080"]
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/customer_support_db
      CLASSIFIER_SERVICE_URL: http://classifier:8000

  frontend:
    build: .
    ports: ["3000:3000"]`,
    },
  ];

  const [activeFile, setActiveFile] = useState<CodeFile>(files[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <span>Full Monorepo Source Code Inspector</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Inspect source files across Java Spring Boot backend, Python FastAPI ML classifier, PostgreSQL DDL schemas, and Docker configs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: File Tree */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-slate-400" />
            <span>Monorepo Architecture</span>
          </div>

          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = file.path === activeFile.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left p-2 rounded text-xs transition-colors flex items-start gap-2 ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div>{file.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-3 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col text-slate-200">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="font-mono text-xs text-slate-300 flex items-center gap-2 truncate">
              <span className="text-blue-400 font-semibold">{activeFile.category}</span>
              <span>·</span>
              <span className="truncate">{activeFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-900 text-slate-100 max-h-[580px]">
            <pre>
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
