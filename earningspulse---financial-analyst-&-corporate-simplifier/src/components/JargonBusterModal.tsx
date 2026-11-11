import React, { useState } from 'react';
import { X, Search, Sparkles, BookOpen, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';

interface JargonBusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_TERMS = [
  'EBITDA Margin Accretion',
  'Constant Currency (FX Neutral)',
  'Channel Inventory Destocking',
  'Operating Leverage',
  'Deferred Revenue Backlog',
  'Free Cash Flow Conversion',
  'Restructuring & One-off Charges',
];

export const JargonBusterModal: React.FC<JargonBusterModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    term: string;
    plainDefinition: string;
    realWorldAnalogy: string;
    whyWallStreetCares: string;
    redFlagWarning: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (termToLookup: string) => {
    if (!termToLookup.trim()) return;
    setLoading(true);
    setSearchTerm(termToLookup);
    try {
      const res = await fetch('/api/simplify-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: termToLookup }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Corporate Speak Jargon Buster</h3>
              <p className="text-xs text-slate-400">Decode complex accounting buzzwords into plain investor English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup(searchTerm)}
                placeholder="Enter corporate buzzword (e.g. Non-GAAP, Amortization, FX Headwind)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => handleLookup(searchTerm)}
              disabled={loading || !searchTerm.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center space-x-1"
            >
              {loading ? <span>Decoding...</span> : <span>Simplify</span>}
            </button>
          </div>

          {/* Quick Click Common Terms */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick Suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TERMS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleLookup(t)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          {result && !loading && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-bold text-amber-300 text-sm">{result.term}</h4>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Plain-Language Translation
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                  <span>Plain Definition:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed pl-5">
                  {result.plainDefinition}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-teal-950/20 border border-teal-500/20">
                <span className="text-xs font-semibold text-teal-300 flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-World Analogy:</span>
                </span>
                <p className="text-xs text-teal-100 leading-relaxed pl-5">
                  "{result.realWorldAnalogy}"
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Why Wall Street Cares:</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pl-5">
                  {result.whyWallStreetCares}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                <span className="text-xs font-semibold text-rose-300 flex items-center space-x-1 mb-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Red Flag Warning for Retail Investors:</span>
                </span>
                <p className="text-xs text-rose-200 leading-relaxed pl-5">
                  {result.redFlagWarning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
