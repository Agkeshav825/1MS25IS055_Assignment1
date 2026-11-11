import React from 'react';
import { TrendingUp, ShieldCheck, Zap, Sparkles, BookOpen, FileText } from 'lucide-react';
import { TokenUsage } from '../types';

interface HeaderProps {
  tokenUsage?: TokenUsage;
  onOpenJargonBuster: () => void;
  onOpenAnalystQuestions: () => void;
  onReset: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  tokenUsage,
  onOpenJargonBuster,
  onOpenAnalystQuestions,
  onReset,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">EarningsPulse</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Analyst Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Corporate Communications Simplifier</p>
          </div>
        </div>

        {/* Operational Guardrails Pill */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Strict Filing Grounding</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>&lt; 25k Token Budget</span>
          </div>
          {tokenUsage && (
            <>
              <span className="text-slate-700">•</span>
              <span className="text-slate-300 font-mono">
                {tokenUsage.totalTokens.toLocaleString()} / {tokenUsage.budgetLimit.toLocaleString()} ({tokenUsage.percentUsed}%)
              </span>
            </>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          {hasResult && (
            <>
              <button
                onClick={onOpenJargonBuster}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Explain corporate buzzwords & accounting jargon"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Jargon Buster</span>
              </button>

              <button
                onClick={onOpenAnalystQuestions}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Questions to ask management on the earnings call"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Earnings Call Q&A</span>
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{hasResult ? 'Analyze Another' : 'New Report'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
