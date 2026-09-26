import React from 'react';
import { CheckCircle2, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

interface DemoGuideModalProps {
  onClose: () => void;
  onSelectRole: (role: 'CUSTOMER' | 'AGENT' | 'ADMIN') => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  onClose,
  onSelectRole,
}) => {
  const steps = [
    {
      step: 1,
      title: 'Login as Customer',
      role: 'CUSTOMER' as const,
      desc: 'Use the top-right role switcher or select "Customer: John Doe (Acme Corp)".',
    },
    {
      step: 2,
      title: 'Create Test Ticket',
      desc: 'Click "Create New Ticket", then choose the evaluation preset: Subject: "Payment deducted twice" / Description: "I purchased a product but my account was charged two times on my credit card."',
    },
    {
      step: 3,
      title: 'Verify Python ML Classification',
      desc: 'Observe the live classifier panel. The TF-IDF + Logistic Regression model analyzes n-grams and predicts Category = BILLING with ~96% confidence.',
    },
    {
      step: 4,
      title: 'Verify Java Automatic Routing',
      desc: 'The backend inspects the predicted BILLING category and automatically routes the ticket to the "Billing & Finance Team" and assigns an available agent (Sarah Chen).',
    },
    {
      step: 5,
      title: 'Switch Role to Agent: Sarah Chen',
      role: 'AGENT' as const,
      desc: 'Switch role to "Agent: Sarah Chen". Navigate to the tickets queue and open the newly created ticket.',
    },
    {
      step: 6,
      title: 'Agent Response & Internal Note',
      desc: 'Add an agent response and a private internal note. Observe how the status transitions from OPEN to IN_PROGRESS.',
    },
    {
      step: 7,
      title: 'Escalate Ticket via Graph BFS',
      desc: 'Click "Escalate (Graph BFS)". Choose target level (e.g., BILLING_SPECIALIST or SENIOR_ENGINEER). The graph calculates the minimum-hop route using Breadth-First Search (BFS).',
    },
    {
      step: 8,
      title: 'Verify Escalation Record in DB',
      desc: 'The escalation is committed to the PostgreSQL ticket_escalations table, status changes to ESCALATED, and notification is sent.',
    },
    {
      step: 9,
      title: 'Admin Analytics & Graph Inspector',
      role: 'ADMIN' as const,
      desc: 'Switch role to "Admin: Alex Morgan". Open Dashboard to see real-time KPIs, Category distribution, and explore the ADSA Escalation Graph and Relational Algebra Query Engine.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Faculty &amp; Judge Evaluation Guide</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-mono text-sm">
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600">
          This guide outlines the step-by-step evaluation workflow requested in the problem statement. Every step corresponds to real code execution in Java, Python, and PostgreSQL.
        </p>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {steps.map((item) => (
            <div key={item.step} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-mono flex items-center justify-center">
                    {item.step}
                  </span>
                  <span>{item.title}</span>
                </span>
                {item.role && (
                  <button
                    onClick={() => {
                      onSelectRole(item.role);
                      onClose();
                    }}
                    className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 font-mono text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <span>Switch to {item.role}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-slate-600 pl-7 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Fully Connected SaaS Lifecycle</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
          >
            Start Demonstration
          </button>
        </div>
      </div>
    </div>
  );
};
