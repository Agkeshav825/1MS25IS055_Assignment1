import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageSquare, UserCheck, Target, HelpCircle, RefreshCw } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalystQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
}

interface QuestionItem {
  question: string;
  targetExecutive: string;
  strategicFocus: string;
  whyItMatters: string;
}

export const AnalystQuestionsModal: React.FC<AnalystQuestionsModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && result && questions.length === 0) {
      loadQuestions();
    }
  }, [isOpen, result]);

  const loadQuestions = async () => {
    if (!result) return;
    setLoading(true);
    try {
      const res = await fetch('/api/earnings-call-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: result.executiveSummary.takeaways,
          risks: result.riskFactors,
        }),
      });
      const data = await res.json();
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Earnings Call Analyst Q&amp;A Prep</h3>
              <p className="text-xs text-slate-400">
                Institutional-grade questions to probe management on margin headwinds and risks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Formulated strictly from disclosed financial risks &amp; guidance numbers</span>
            <button
              onClick={loadQuestions}
              disabled={loading}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Synthesizing institutional analyst inquiries...</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-cyan-400">
                      <Target className="w-3.5 h-3.5" />
                      <span>{q.strategicFocus}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>Target: {q.targetExecutive}</span>
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-snug">
                    "{q.question}"
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-medium text-[11px] block mb-0.5">
                      Why Wall Street Asks This:
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {q.whyItMatters}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
