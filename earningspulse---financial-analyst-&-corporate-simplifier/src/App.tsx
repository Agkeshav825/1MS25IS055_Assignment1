import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReportInput } from './components/ReportInput';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { RiskBreakdownView } from './components/RiskBreakdownView';
import { FlashcardsDeck } from './components/FlashcardsDeck';
import { TokenBudgetMeter } from './components/TokenBudgetMeter';
import { RawResponseViewer } from './components/RawResponseViewer';
import { JargonBusterModal } from './components/JargonBusterModal';
import { AnalystQuestionsModal } from './components/AnalystQuestionsModal';
import { AnalysisResult } from './types';
import { AlertTriangle, Download, Printer, Share2, Sparkles, CheckCircle2, ChevronRight, BarChart3, ShieldAlert, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verbatim'>('dashboard');
  const [showJargonBuster, setShowJargonBuster] = useState(false);
  const [showAnalystQuestions, setShowAnalystQuestions] = useState(false);
  const [documentTitle, setDocumentTitle] = useState<string>('Earnings Report');

  const handleAnalyze = async (payload: {
    text?: string;
    pdfBase64?: string;
    mimeType?: string;
    filename?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setDocumentTitle(payload.filename || 'Earnings Report');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze report.');
      }

      setResult(data);
      setActiveTab('dashboard');
      // Scroll to dashboard
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while connecting to the financial analysis engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result.rawResponse], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/\s+/g, '-').toLowerCase()}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navigation */}
      <Header
        tokenUsage={result?.tokenUsage}
        onOpenJargonBuster={() => setShowJargonBuster(true)}
        onOpenAnalystQuestions={() => setShowAnalystQuestions(true)}
        onReset={() => {
          setResult(null);
          setErrorMessage(null);
        }}
        hasResult={Boolean(result)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center space-x-3 text-rose-300 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="flex-1">
              <span className="font-semibold">Analysis Error: </span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs px-2.5 py-1 rounded bg-rose-900/50 hover:bg-rose-900 text-rose-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* If no result, show ingestion panel */}
        {!result && (
          <ReportInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {/* If result is ready, show investment dashboard */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dashboard Control & Title Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <span>Investment Memo</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-teal-400 font-medium">{documentTitle}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                  <span>Executive Investment Brief</span>
                </h1>
              </div>

              {/* View Selector & Export Tools */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
                      activeTab === 'dashboard'
                        ? 'bg-teal-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Structured Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('verbatim')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
                      activeTab === 'verbatim'
                        ? 'bg-teal-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Verbatim Markdown</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleExportMarkdown}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                    title="Export as Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                    title="Print / Save as PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Token Guardrail & Budget Monitor */}
            <TokenBudgetMeter
              usage={result.tokenUsage}
              groundingAudit={result.groundingAudit}
            />

            {/* Structured Dashboard Tab */}
            {activeTab === 'dashboard' ? (
              <div className="space-y-8">
                {/* Section 1: Executive Summary */}
                <ExecutiveSummaryView
                  takeaways={result.executiveSummary.takeaways}
                  kpis={result.executiveSummary.kpis}
                />

                {/* Section 2: Risk Factor Breakdown */}
                <RiskBreakdownView risks={result.riskFactors} />

                {/* Section 3: Flashcard Set (JSON & Interactive) */}
                <FlashcardsDeck flashcards={result.flashcards} />
              </div>
            ) : (
              /* Verbatim Response Tab */
              <RawResponseViewer rawResponse={result.rawResponse} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">EarningsPulse</span>
            <span>•</span>
            <span>Corporate Earnings &amp; 10-K Simplification Engine</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-emerald-400 font-mono">Token Cap: &lt; 25,000</span>
            <span>•</span>
            <span className="text-cyan-400">Strict Document Grounding</span>
            <span>•</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JargonBusterModal
        isOpen={showJargonBuster}
        onClose={() => setShowJargonBuster(false)}
      />

      <AnalystQuestionsModal
        isOpen={showAnalystQuestions}
        onClose={() => setShowAnalystQuestions(false)}
        result={result}
      />
    </div>
  );
}
