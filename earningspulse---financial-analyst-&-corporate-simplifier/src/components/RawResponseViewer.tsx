import React, { useState } from 'react';
import { Copy, CheckCheck, FileCode, CheckCircle2 } from 'lucide-react';

interface RawResponseViewerProps {
  rawResponse: string;
}

export const RawResponseViewer: React.FC<RawResponseViewerProps> = ({ rawResponse }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Standard Formatted Analysis (Exact Specification)</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Specification Compliant
              </span>
            </h3>
            <p className="text-xs text-slate-400">Verbatim model output formatted according to layout sections 1, 2, and 3</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
        >
          {copied ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Layout</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
        {rawResponse}
      </div>
    </div>
  );
};
