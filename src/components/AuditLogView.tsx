import React from 'react';
import { db } from '../data/mockDatabase';
import { FileText, Shield, CheckCircle2 } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const auditLogs = db.getAuditLogs();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700" />
          <span>System Audit Trail &amp; Compliance Logs</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable historical log of ticket creations, ML classifications, team routing, status updates, and graph escalations
        </p>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900 uppercase tracking-wider">Audit Records (PostgreSQL audit_logs)</span>
          <span className="font-mono text-slate-500">{auditLogs.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-mono">TIMESTAMP</th>
                <th className="py-2.5 px-4">USER / ACTOR</th>
                <th className="py-2.5 px-4 font-mono">ACTION TYPE</th>
                <th className="py-2.5 px-4">ENTITY</th>
                <th className="py-2.5 px-4">AUDIT EVENT DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    {log.createdAt.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {log.userName || 'System'}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        log.action === 'TICKET_CREATE'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : log.action === 'TICKET_ESCALATE'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : log.action === 'CLASSIFY_TICKET'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    {log.entityType} #{log.entityId}
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-snug">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
