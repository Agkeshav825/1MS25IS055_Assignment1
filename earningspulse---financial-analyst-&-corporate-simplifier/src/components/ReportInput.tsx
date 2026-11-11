import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, Zap, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { SAMPLE_REPORTS } from '../data/sampleReports';
import { SampleReport } from '../types';

interface ReportInputProps {
  onAnalyze: (payload: { text?: string; pdfBase64?: string; mimeType?: string; filename?: string }) => void;
  isLoading: boolean;
}

export const ReportInput: React.FC<ReportInputProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'upload' | 'paste'>('sample');
  const [selectedSample, setSelectedSample] = useState<SampleReport>(SAMPLE_REPORTS[0]);
  const [pastedText, setPastedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; base64?: string; text?: string; mimeType: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Approximate token calculation (~4 chars per token)
  const currentText = activeTab === 'sample' ? selectedSample.content : activeTab === 'paste' ? pastedText : (uploadedFile?.text || '');
  const estimatedTokens = Math.round(currentText.length / 4);
  const maxSafeTokens = 25000;
  const isWithinBudget = estimatedTokens <= maxSafeTokens;

  const handleFileProcess = (file: File) => {
    setUploadError(null);
    const sizeStr = (file.size / 1024).toFixed(1) + ' KB';

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          size: sizeStr,
          base64: reader.result as string,
          mimeType: 'application/pdf',
        });
      };
      reader.onerror = () => setUploadError('Could not read PDF file.');
      reader.readAsDataURL(file);
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setUploadedFile({
          name: file.name,
          size: sizeStr,
          text,
          mimeType: file.type || 'text/plain',
        });
      };
      reader.onerror = () => setUploadError('Could not read text file.');
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
      setActiveTab('upload');
    }
  };

  const handleSubmit = () => {
    if (isLoading) return;

    if (activeTab === 'sample') {
      onAnalyze({
        text: selectedSample.content,
        filename: `${selectedSample.company} ${selectedSample.quarter}`,
      });
    } else if (activeTab === 'upload') {
      if (!uploadedFile) {
        setUploadError('Please select or drop a file first.');
        return;
      }
      if (uploadedFile.base64) {
        onAnalyze({
          pdfBase64: uploadedFile.base64,
          mimeType: uploadedFile.mimeType,
          filename: uploadedFile.name,
        });
      } else {
        onAnalyze({
          text: uploadedFile.text,
          mimeType: uploadedFile.mimeType,
          filename: uploadedFile.name,
        });
      }
    } else if (activeTab === 'paste') {
      if (!pastedText.trim()) {
        setUploadError('Please paste your earnings report text or press release transcript.');
        return;
      }
      onAnalyze({
        text: pastedText,
        filename: 'Pasted Earnings Document',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Badge & Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Operational Rule #1: Strictly Under 25,000 Tokens for Free Accounts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Transform Earnings Reports Into <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Actionable Intelligence</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Upload any corporate 10-K, 10-Q, or earnings release. Receive the top 3 plain-language takeaways, an unhedged risk breakdown, and an interactive study flashcard set.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-7 backdrop-blur-xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-6 space-x-2">
          <button
            onClick={() => setActiveTab('sample')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'sample'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Curated Filings (1-Click Test)</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'upload'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF / Text</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'paste'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Transcript</span>
          </button>
        </div>

        {/* Tab 1: Sample Reports */}
        {activeTab === 'sample' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Select an authentic filing to immediately evaluate the analysis engine without needing to download external files:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_REPORTS.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedSample(report)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all text-left ${
                    selectedSample.id === report.id
                      ? 'bg-teal-950/40 border-teal-500/60 ring-1 ring-teal-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{report.icon}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {report.ticker}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{report.company}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{report.quarter}</p>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {report.tagline}
                  </p>
                </div>
              ))}
            </div>

            {/* Document preview snippet */}
            <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="font-mono text-[11px]">Preview: {selectedSample.company} Report Excerpt</span>
                <span className="text-[11px] font-mono text-emerald-400">~{estimatedTokens.toLocaleString()} tokens (Well under 25,000 constraint)</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-3">
                {selectedSample.content.slice(0, 320)}...
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Upload Document */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-teal-400 bg-teal-950/30'
                  : 'border-slate-700 hover:border-teal-500/50 bg-slate-950/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Click or drag & drop earnings filing</p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF (10-K, 10-Q, Shareholder Letter) or TXT files</p>
            </div>

            {uploadedFile && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-400">{uploadedFile.size} • {uploadedFile.mimeType}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Paste Text */}
        {activeTab === 'paste' && (
          <div className="space-y-3">
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste earnings press release, SEC filing excerpt, or call transcript here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{pastedText.length.toLocaleString()} characters</span>
              <span className={`font-mono ${isWithinBudget ? 'text-emerald-400' : 'text-amber-400'}`}>
                Estimated ~{estimatedTokens.toLocaleString()} / 25,000 tokens
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {uploadError && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Operational Constraints Assurance */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Document-Only Grounding</span>
            </div>
            <div className="flex items-center space-x-1 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Missing Metrics Flagged</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-teal-500/20 ${
              isLoading
                ? 'bg-teal-700 text-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Simplifying Filing...</span>
              </>
            ) : (
              <>
                <span>Generate Investment Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
