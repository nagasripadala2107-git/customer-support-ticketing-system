import React, { useState } from 'react';
import { FileText, Download, Printer, Copy, Check, ExternalLink, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export const TeamGuideView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const getDirectPdfUrl = () => {
    return `${window.location.origin}/guide.pdf`;
  };

  const handleCopyLink = () => {
    const url = getDirectPdfUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Sticky Header with Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-30">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
              PDF DOCUMENT
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">
              Team &amp; Reviewer Evaluation Guide
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full pin-to-pin breakdown of all tabs, machine learning, graph algorithms, and demo credentials
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
            title="Copy direct link to share on WhatsApp or group"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
          </button>

          <a
            href="/guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open Raw PDF</span>
          </a>

          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Shareable Link Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 sm:p-4 text-xs text-slate-800 space-y-2">
        <div className="font-semibold text-blue-900 flex items-center gap-1.5">
          <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Direct Link to Share with your Team / WhatsApp Group:</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            readOnly
            value={getDirectPdfUrl()}
            className="flex-1 p-2 rounded-lg border border-blue-200 bg-white font-mono text-[11px] text-slate-700 select-all"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs whitespace-nowrap"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          * Anyone who clicks this link on a mobile phone will open the PDF document directly in their mobile viewer.
        </p>
      </div>

      {/* Printable / Rendered Document Body */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-800">
        {/* Title Block */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
            MASTER SPECIFICATION &middot; V2.0
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Support Ticketing System (SaaS Helpdesk)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pin-to-Pin Architectural Walkthrough, Role Hierarchy, and Academic Engineering Demonstrations
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
            <span>Executive Summary &amp; Architecture</span>
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">
            The platform is an enterprise-grade 4-tier Monorepo designed to eliminate manual ticket sorting and arbitrary escalations using Machine Learning and Graph Algorithms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900">Frontend Tier</div>
              <div className="text-slate-500 mt-1">React 19, TypeScript, Tailwind CSS, Vite (Port 3000) with mobile swipe carousel &amp; slide dots.</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900">Application Tier</div>
              <div className="text-slate-500 mt-1">Java 17 Spring Boot 3.3.4 (Port 8080) with Spring Security, JWT authentication, &amp; Graph BFS engine.</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900">Machine Learning Tier</div>
              <div className="text-slate-500 mt-1">Python 3.11 FastAPI (Port 8000) using TF-IDF n-grams + Multinomial Logistic Regression.</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900">Database Tier</div>
              <div className="text-slate-500 mt-1">PostgreSQL 16 relational database with 14 tables normalized to BCNF and audit triggers.</div>
            </div>
          </div>
        </div>

        {/* Section 2: User Roles & Credentials */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            <span>Demo Credentials &amp; Role Hierarchy</span>
          </h3>
          <p className="text-xs text-slate-500">All demo accounts share the password: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-bold">Password123!</code></p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">ROLE / NAME</th>
                  <th className="p-2.5">EMAIL</th>
                  <th className="p-2.5">DEPARTMENT TEAM</th>
                  <th className="p-2.5">TIER NODE</th>
                  <th className="p-2.5">RESPONSIBILITIES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Customer (John Doe)</td>
                  <td className="p-2.5 font-mono text-slate-600">john.doe@acme.com</td>
                  <td className="p-2.5">Acme Corporation</td>
                  <td className="p-2.5 font-mono text-blue-600 font-bold">Enterprise</td>
                  <td className="p-2.5">Creates tickets, views company status, replies</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Agent (Elena Rodriguez)</td>
                  <td className="p-2.5 font-mono text-slate-600">elena.rodriguez@supportdesk.io</td>
                  <td className="p-2.5">Technical Support</td>
                  <td className="p-2.5 font-mono text-emerald-600 font-bold">L1_SUPPORT</td>
                  <td className="p-2.5">Frontline diagnostics, replies, internal notes</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Agent (Sarah Chen)</td>
                  <td className="p-2.5 font-mono text-slate-600">sarah.chen@supportdesk.io</td>
                  <td className="p-2.5">Billing &amp; Finance</td>
                  <td className="p-2.5 font-mono text-amber-600 font-bold">BILLING_SPECIALIST</td>
                  <td className="p-2.5">Billing lead, invoice corrections, double debits</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Agent (David Kim)</td>
                  <td className="p-2.5 font-mono text-slate-600">david.kim@supportdesk.io</td>
                  <td className="p-2.5">Technical Support</td>
                  <td className="p-2.5 font-mono text-indigo-600 font-bold">SENIOR_ENGINEER</td>
                  <td className="p-2.5">Tier 3 architect, kernel &amp; cloud outages</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Admin (Alex Morgan)</td>
                  <td className="p-2.5 font-mono text-slate-600">admin@supportdesk.io</td>
                  <td className="p-2.5">Executive Operations</td>
                  <td className="p-2.5 font-mono text-purple-600 font-bold">EXECUTIVE_LEAD</td>
                  <td className="p-2.5">Full system management, SLA breach reviews, audit logs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Pin-to-Pin Tabs Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
            <span>Pin-to-Pin Tab Guide</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 1: Dashboard View &amp; Mobile Carousel</div>
              <p className="text-slate-600">
                • <strong>6 Metric Cards</strong>: Total Tickets, Open Queue, In Progress, Escalated, Resolved, Avg SLA (4.2h). On mobile screens, cards swipe horizontally with 6 interactive slide dots.<br />
                • <strong>Ticket Status Donut Graph</strong>: Interactive SVG ring chart showing proportions of Open, In Progress, Waiting, Escalated, Resolved, and Closed tickets with dynamic center stats.<br />
                • <strong>1-Click Filtering</strong>: Clicking any status slice immediately filters the table below to only show tickets of that status.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 2: Tickets Queue &amp; Search</div>
              <p className="text-slate-600">
                • Real-time search bar matching ticket numbers, subjects, or company names.<br />
                • Dropdowns to filter by Status, Priority, Category, and Assigned Team.<br />
                • Multi-column sorting by creation date, priority, or ML confidence.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 3: Ticket Detail View &amp; Escalation</div>
              <p className="text-slate-600">
                • Live conversation timeline with Customer replies, Agent answers, and private Internal Notes.<br />
                • SLA Countdown Timer.<br />
                • <strong>Graph BFS Escalation Modal</strong>: Computes minimum-hop shortest route to transfer ticket to another tier and commits an audit log.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 4: Escalation Graph Explorer (ADSA)</div>
              <p className="text-slate-600">
                • Directed Weighted Graph: <code>L1_SUPPORT ➔ L2_SUPPORT ➔ TECHNICAL_TEAM ➔ SENIOR_ENGINEER</code> and <code>L1 ➔ BILLING_SPECIALIST ➔ EXECUTIVE_LEAD</code>.<br />
                • <strong>BFS Traversal ($O(V+E)$)</strong> computes the shortest path.<br />
                • <strong>DFS Tri-Color Cycle Detection</strong> confirms the network is a strictly acyclic DAG.<br />
                • 1-click Reviewer Quick Presets for instant live demonstration.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 5: NLP Classifier Lab (Machine Learning)</div>
              <p className="text-slate-600">
                • Python FastAPI microservice using TF-IDF n-grams + Multinomial Logistic Regression.<br />
                • Predicts 7 categories (Billing, Tech, Account, Shipping, Refund, Product Issue, General Inquiry).<br />
                • Interactive sandbox allows reviewers to type custom text and observe live probability bars.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 6: Relational Algebra (DBMS / DMGT)</div>
              <p className="text-slate-600">
                • Academic engine visualizing Selection ($\sigma$), Projection ($\pi$), Natural Join ($\bowtie$), Union ($\cup$), Intersection ($\cap$), and Aggregations.<br />
                • Displays Relational Algebra formula, Formal TRC expression, and executable SQL query side-by-side.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Tab 7: Monorepo Codebase Browser</div>
              <p className="text-slate-600">
                • In-app code browser letting reviewers inspect Java Spring Boot controllers, Python classifier scripts, and PostgreSQL BCNF schema directly in the browser.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: 9-Step Evaluation Flow */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
            <span>Official 9-Step Reviewer Evaluation Sequence</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span><strong>Log in as Customer</strong>: Switch to <em>Customer: John Doe (Acme Corp)</em> via the top-right header menu.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span><strong>Create Ticket</strong>: Click <em>Create New Ticket</em> ➔ click <em>Fill Evaluation Preset</em> (<em>"Payment deducted twice"</em>).</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span><strong>Verify NLP Classification</strong>: Confirm that the AI predicts Category = <code>BILLING</code> with ~<code>96.2%</code> confidence.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
              <span><strong>Verify Automated Routing</strong>: Click Submit. The system assigns the ticket to <strong>Billing &amp; Finance Team</strong> (Sarah Chen).</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
              <span><strong>Switch to Agent: Sarah Chen</strong>: Open the ticket in the queue. Add a reply and private internal note.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">6</span>
              <span><strong>Escalate via Graph BFS</strong>: Click <em>Escalate Ticket</em> ➔ pick <code>SENIOR_ENGINEER</code>. BFS routes: <code>L1 ➔ L2 ➔ Tech ➔ Senior</code>.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">7</span>
              <span><strong>Verify DB Record</strong>: Ticket status becomes <code>ESCALATED</code> and audit log is recorded in PostgreSQL.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">8</span>
              <span><strong>Admin Inspection</strong>: Switch to <strong>Admin: Alex Morgan</strong>. Review the Status Donut Graph, Escalation Graph Explorer, and Relational Algebra.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
