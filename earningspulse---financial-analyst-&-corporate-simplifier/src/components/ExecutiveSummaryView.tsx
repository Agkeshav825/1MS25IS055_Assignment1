import React, { useState } from 'react';
import { Takeaway, MetricKPI } from '../types';
import { TrendingUp, AlertCircle, Quote, ArrowUpRight, ArrowDownRight, Layers, HelpCircle, CheckCircle } from 'lucide-react';

interface ExecutiveSummaryViewProps {
  takeaways: Takeaway[];
  kpis: MetricKPI[];
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({ takeaways, kpis }) => {
  const [viewMode, setViewMode] = useState<'plain' | 'comparison'>('plain');
  const [expandedQuoteIdx, setExpandedQuoteIdx] = useState<number | null>(null);

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Executive Summary</span>
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Top 3 Takeaways
              </span>
            </h2>
            <p className="text-xs text-slate-400">Plain-language translation of top corporate financial figures</p>
          </div>
        </div>

        {/* View Mode Switcher: Plain Language vs Corporate Speak Comparison */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('plain')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'plain'
                ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Plain English
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center space-x-1 ${
              viewMode === 'comparison'
                ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Corporate Speak vs Reality</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      {kpis && kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
          {kpis.map((kpi, idx) => {
            const isNegative = kpi.yoy && (kpi.yoy.includes('-') || kpi.yoy.toLowerCase().includes('down'));
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  kpi.isProvided
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{kpi.label}</span>
                  {kpi.isProvided ? (
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                      Not Provided
                    </span>
                  )}
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className={`text-base sm:text-lg font-bold font-mono tracking-tight ${kpi.isProvided ? 'text-white' : 'text-amber-300 text-xs italic'}`}>
                    {kpi.value}
                  </span>
                  {kpi.yoy && (
                    <span className={`text-xs font-medium inline-flex items-center ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isNegative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {kpi.yoy}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top 3 Financial Takeaways */}
      <div className="space-y-4">
        {takeaways.map((takeaway, index) => {
          const isMissing = takeaway.isNotProvided || /not provided|not disclosed/i.test(takeaway.plainLanguage);

          return (
            <div
              key={index}
              className={`rounded-xl border p-4.5 sm:p-5 transition-all ${
                isMissing
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-teal-400 border border-slate-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {takeaway.title}
                  </h3>
                </div>

                {/* Missing Metric Guardrail Badge */}
                {isMissing ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
                    <AlertCircle className="w-3 h-3" />
                    <span>Explicit Missing Metric</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    <TrendingUp className="w-3 h-3" />
                    <span>Filing Verified</span>
                  </span>
                )}
              </div>

              {/* View Mode: Comparison vs Standard */}
              {viewMode === 'comparison' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-1">
                      <Quote className="w-3.5 h-3.5" />
                      <span>Corporate PR Language</span>
                    </div>
                    <p className="text-slate-300 italic font-mono text-[11px] leading-relaxed">
                      "{takeaway.corporateSpeakVsMeaning?.corporateText || takeaway.plainLanguage}"
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/30 text-xs">
                    <div className="flex items-center space-x-1.5 text-teal-300 font-semibold mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>What It Means For Investors</span>
                    </div>
                    <p className="text-teal-100 font-sans leading-relaxed text-xs">
                      {takeaway.plainLanguage}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-8">
                  {takeaway.plainLanguage}
                </p>
              )}

              {/* Highlighted Key Financial Numbers */}
              {takeaway.metrics && takeaway.metrics.length > 0 && (
                <div className="mt-3 pl-8 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-slate-500 font-medium">Extracted Data:</span>
                  {takeaway.metrics.map((metric, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2 py-0.5 rounded bg-slate-800/80 text-teal-300 font-mono text-xs border border-slate-700"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              )}

              {/* Source filing quote expandable */}
              {takeaway.filingQuote && (
                <div className="mt-3 pl-8">
                  <button
                    onClick={() => setExpandedQuoteIdx(expandedQuoteIdx === index ? null : index)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors"
                  >
                    <Quote className="w-3 h-3 text-slate-500" />
                    <span>{expandedQuoteIdx === index ? 'Hide filing excerpt' : 'View verified filing excerpt'}</span>
                  </button>
                  {expandedQuoteIdx === index && (
                    <div className="mt-2 p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                      {takeaway.filingQuote}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
