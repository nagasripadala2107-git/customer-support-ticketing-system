import React, { useState, useEffect } from 'react';
import { Customer, TicketPriority, ClassificationResult } from '../types';
import { classifyTicketText, runLocalInference } from '../services/classifierEngine';
import { Cpu, Sparkles, Building2, Check, ArrowRight } from 'lucide-react';

interface NewTicketModalProps {
  customers: Customer[];
  currentCustomerId?: number;
  onClose: () => void;
  onSubmit: (data: {
    customerId: number;
    subject: string;
    description: string;
    categoryId: number;
    priority: TicketPriority;
    classificationConfidence: number;
    isAutoClassified: boolean;
  }) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  customers,
  currentCustomerId,
  onClose,
  onSubmit,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(
    currentCustomerId || customers[0]?.id || 1
  );
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);

  // Auto classify on debounce when subject or description changes
  useEffect(() => {
    if (!subject.trim() && !description.trim()) {
      setClassification(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const result = await classifyTicketText(subject, description, true);
        setClassification(result);
      } catch {
        setClassification(runLocalInference(subject, description));
      } finally {
        setIsClassifying(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [subject, description]);

  const presetSamples = [
    {
      label: '1. Billing Duplicate (Evaluator Prompt)',
      subject: 'Payment deducted twice',
      description: 'I purchased a product but my account was charged two times on my credit card.',
      priority: 'HIGH' as TicketPriority,
    },
    {
      label: '2. Application Crash (Tech Support)',
      subject: 'The application crashes when I upload a 50MB CSV file',
      description: 'Whenever we upload customer batch CSV imports over 40MB, the web app freezes and returns 504 error.',
      priority: 'CRITICAL' as TicketPriority,
    },
    {
      label: '3. 2FA Lockout (Account Access)',
      subject: 'Cannot login to my account after enabling 2FA',
      description: 'Our team administrator configured Okta SAML with Google Authenticator, but the 6-digit TOTP code fails.',
      priority: 'HIGH' as TicketPriority,
    },
    {
      label: '4. Lost Parcel (Shipping)',
      subject: 'My package has not arrived - tracking shows delivered',
      description: 'Tracking number FEDEX-98124 shows delivered to reception dock, but facilities confirms no courier arrived.',
      priority: 'MEDIUM' as TicketPriority,
    },
  ];

  const handleApplyPreset = (sample: typeof presetSamples[0]) => {
    setSubject(sample.subject);
    setDescription(sample.description);
    setPriority(sample.priority);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const result = classification || runLocalInference(subject, description);

    // Map predicted category code to category ID
    const categoryMap: Record<string, number> = {
      BILLING: 1,
      TECHNICAL_SUPPORT: 2,
      ACCOUNT_ACCESS: 3,
      SHIPPING: 4,
      REFUND: 5,
      PRODUCT_ISSUE: 6,
      GENERAL_INQUIRY: 7,
    };

    const catId = categoryMap[result.category] || 7;

    onSubmit({
      customerId: selectedCustomerId,
      subject,
      description,
      categoryId: catId,
      priority,
      classificationConfidence: result.confidence,
      isAutoClassified: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New Support Ticket</h2>
            <p className="text-xs text-slate-500">
              Automated category classification via Python NLP &amp; Spring Boot departmental routing
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-mono text-sm">
            ✕
          </button>
        </div>

        {/* Evaluation Quick-Fill Buttons */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Faculty Evaluation Presets (Click to autofill):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {presetSamples.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 hover:border-blue-300 transition-colors"
              >
                <div className="font-semibold">{preset.label}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{preset.subject}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Customer Account</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                className="w-full p-2 rounded border border-slate-200 bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full p-2 rounded border border-slate-200 bg-white"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Ticket Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Payment deducted twice"
              className="w-full p-2.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the technical or billing problem clearly..."
              className="w-full p-2.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Machine Learning Classification Result Panel */}
          {classification && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Python ML Classifier &amp; Spring Boot Routing</span>
                  {isClassifying && <span className="text-[10px] text-amber-400">(analyzing...)</span>}
                </div>
                <span className="font-mono text-[11px] text-slate-400">TF-IDF + Logistic Regression</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded bg-slate-800 border border-slate-700">
                  <div className="text-slate-400 text-[11px]">Predicted Category</div>
                  <div className="text-sm font-bold text-white mt-0.5">{classification.category}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-800 border border-slate-700">
                  <div className="text-slate-400 text-[11px]">ML Confidence</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                    {(classification.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-800 border border-slate-700">
                  <div className="text-slate-400 text-[11px]">Auto-Routed Team</div>
                  <div className="text-sm font-bold text-blue-400 mt-0.5 truncate flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{classification.targetTeam}</span>
                  </div>
                </div>
              </div>

              {classification.topTokens.length > 0 && (
                <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                  <span>Top Contributing N-Grams:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {classification.topTokens.map((t, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">
                        "{t.token}" ({t.weight})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!subject.trim() || !description.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors disabled:opacity-50"
            >
              <span>Submit &amp; Route Ticket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
