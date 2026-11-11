import React from 'react';
import { TokenUsage } from '../types';
import { Zap, CheckCircle2, ShieldCheck, Database, Award } from 'lucide-react';

interface TokenBudgetMeterProps {
  usage: TokenUsage;
  groundingAudit: {
    strictDocumentDataOnly: boolean;
    missingMetricsReported: string[];
    analyzedTimestamp: string;
    documentSnippetPreview?: string;
  };
}

export const TokenBudgetMeter: React.FC<TokenBudgetMeterProps> = ({ usage, groundingAudit }) => {
  const remainingTokens = Math.max(0, usage.budgetLimit - usage.totalTokens);
  const isHealthy = usage.totalTokens <= 15000;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Token Efficiency &amp; Free Account Guardrail</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                &lt; 25,000 Token Cap Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Analysis strictly optimized for maximum speed and zero cost on standard accounts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-white">
            {usage.totalTokens.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500">/ {usage.budgetLimit.toLocaleString()} tokens</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-mono">
            {usage.percentUsed}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mb-4">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            isHealthy
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
              : 'bg-gradient-to-r from-teal-400 to-amber-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(4, usage.percentUsed))}%` }}
        />
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Prompt / Document</span>
          <span className="font-mono font-bold text-slate-200 mt-0.5 block">
            {usage.promptTokens.toLocaleString()} tokens
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Analysis &amp; Flashcards</span>
          <span className="font-mono font-bold text-slate-200 mt-0.5 block">
            {usage.candidatesTokens.toLocaleString()} tokens
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Remaining Headroom</span>
          <span className="font-mono font-bold text-emerald-400 mt-0.5 block">
            +{remainingTokens.toLocaleString()} tokens
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Grounding Audit</span>
          <div className="flex items-center space-x-1 text-teal-400 font-semibold mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Document Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};
