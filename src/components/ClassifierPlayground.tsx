import React, { useState, useEffect } from 'react';
import { classifyTicketText, runLocalInference, CATEGORIES, CATEGORY_ROUTING_MAP } from '../services/classifierEngine';
import { ClassificationResult } from '../types';
import { Cpu, Sparkles, Building2, Check, ArrowRight } from 'lucide-react';

export const ClassifierPlayground: React.FC = () => {
  const [subject, setSubject] = useState('Payment deducted twice');
  const [description, setDescription] = useState(
    'I purchased a product but my account was charged two times on my credit card.'
  );
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    classifyTicketText(subject, description, true)
      .then((res) => {
        if (active) {
          setClassification(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setClassification(runLocalInference(subject, description));
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [subject, description]);

  const presetSamples = [
    {
      label: 'Billing (Official Prompt)',
      subject: 'Payment deducted twice',
      description: 'I purchased a product but my account was charged two times on my credit card.',
    },
    {
      label: 'Technical Crash (SRE)',
      subject: 'The application crashes when I upload a 50MB CSV file',
      description: 'Whenever we upload customer batch CSV imports over 40MB, the web app freezes and returns 504 error.',
    },
    {
      label: 'Authentication (Okta/2FA)',
      subject: 'Cannot login to my account after enabling 2FA',
      description: 'Our team administrator configured Okta SAML with Google Authenticator, but the 6-digit TOTP code fails.',
    },
    {
      label: 'Logistics (Courier)',
      subject: 'My package has not arrived - tracking shows delivered',
      description: 'Tracking number FEDEX-98124 shows delivered to reception dock, but facilities confirms no courier arrived.',
    },
    {
      label: 'Refund Request',
      subject: 'I want to request a refund for unused monthly seats',
      description: 'We downsized our team by 15 seats last week. Can we receive a prorated refund credit toward next month?',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <span>Python Machine Learning Classifier Playground</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Demonstrates NLP text preprocessing, Sublinear TF-IDF vectorization, and Multinomial Logistic Regression classification
        </p>
      </div>

      {/* Preset Quick Fill */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Test Pre-Trained Benchmark Prompts:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {presetSamples.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSubject(p.subject);
                setDescription(p.description);
              }}
              className="p-2 rounded bg-white hover:bg-slate-100 border border-slate-200 text-left transition-colors"
            >
              <div className="font-semibold text-slate-900">{p.label}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.subject}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form & Realtime Prediction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Text Box */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Input Support Ticket Text
          </h2>

          <div>
            <label className="block text-slate-700 text-xs font-medium mb-1">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-medium mb-1">Detailed Description Body</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-semibold text-slate-700 block">Classifier Pipeline Specs:</span>
            <ul className="list-disc list-inside text-slate-500 text-[11px] space-y-0.5">
              <li>Token cleaning: lowercase, alphanumeric regex filtering</li>
              <li>Vectorization: TF-IDF with sublinear TF scaling (1 + log(tf))</li>
              <li>N-Grams: Unigrams &amp; Bigrams (1, 2)</li>
              <li>Classifier: Multinomial Logistic Regression with Softmax normalization</li>
              <li>Execution Status: <span className="font-mono text-emerald-600">{classification?.status || 'READY'}</span></li>
            </ul>
          </div>
        </div>

        {/* Right: Predicted Results & Probabilities */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Classification &amp; Routing Decision
            </h2>
            {loading && <span className="text-xs text-amber-500 font-mono">Inference in progress...</span>}
          </div>

          {classification && (
            <>
              {/* Highlight Card */}
              <div className="p-4 rounded-lg bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Predicted Category</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(classification.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>
                <div className="text-xl font-bold tracking-tight">{classification.category}</div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Assigned Department</span>
                  <span className="font-semibold text-blue-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {classification.targetTeam}
                  </span>
                </div>
              </div>

              {/* Probability Distribution across 7 Categories */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Probability Distribution across 7 Categories ($P(y = c \mid x)$):
                </span>
                <div className="space-y-1.5 text-xs">
                  {CATEGORIES.map((cat) => {
                    const prob = classification.probabilities[cat] || 0;
                    const percent = Math.round(prob * 100);
                    const isWinner = cat === classification.category;

                    return (
                      <div key={cat} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={isWinner ? 'font-bold text-slate-900' : 'text-slate-600'}>
                            {cat}
                          </span>
                          <span className="font-mono text-slate-500 tabular-nums">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isWinner ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top N-Gram Weights */}
              {classification.topTokens.length > 0 && (
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Most Influential Tokens in Input:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {classification.topTokens.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] border border-slate-200"
                      >
                        {t.token} <strong className="text-blue-600">(+{t.weight})</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
