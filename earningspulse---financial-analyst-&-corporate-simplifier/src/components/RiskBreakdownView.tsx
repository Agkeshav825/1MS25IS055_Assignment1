import React, { useState } from 'react';
import { RiskFactor } from '../types';
import { ShieldAlert, Truck, Scale, BarChart2, Globe, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface RiskBreakdownViewProps {
  risks: RiskFactor[];
}

export const RiskBreakdownView: React.FC<RiskBreakdownViewProps> = ({ risks }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supply_chain':
        return <Truck className="w-4 h-4 text-amber-400" />;
      case 'regulatory':
        return <Scale className="w-4 h-4 text-rose-400" />;
      case 'geopolitical':
        return <Globe className="w-4 h-4 text-indigo-400" />;
      case 'market':
      default:
        return <BarChart2 className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'supply_chain':
        return 'Supply Chain & Manufacturing';
      case 'regulatory':
        return 'Regulatory & Legal Compliance';
      case 'geopolitical':
        return 'Geopolitical & Cross-Border';
      case 'market':
      default:
        return 'Market & Competitive';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            High Severity
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Moderate
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Watch Item
          </span>
        );
    }
  };

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Risk Factor Breakdown</span>
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                2 to 3 Disclosed Threats
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Unhedged breakdown of operational, market, and regulatory vulnerabilities
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-rose-400 font-medium">
          <ShieldAlert className="w-4 h-4" />
          <span>Filing Disclosed Only</span>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-3.5 mt-5">
        {risks.map((risk, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all hover:border-slate-700"
            >
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="p-4 sm:p-5 flex items-start justify-between cursor-pointer select-none gap-3"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(risk.category)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-slate-400">
                        {getCategoryLabel(risk.category)}
                      </span>
                      {getSeverityBadge(risk.severity)}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {risk.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-500 shrink-0">
                  <span className="text-xs hidden sm:inline">Details</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-900 space-y-4">
                  {/* Plain Language Investor Impact */}
                  <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    <div className="flex items-center space-x-1.5 text-rose-300 font-semibold text-xs mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Impact on Earnings & Valuation</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {risk.plainLanguageImpact}
                    </p>
                  </div>

                  {/* Excerpt from the filing */}
                  {risk.filingExcerpt && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px] mb-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Filing Disclosure Excerpt</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-300 italic leading-relaxed">
                        "{risk.filingExcerpt}"
                      </p>
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
