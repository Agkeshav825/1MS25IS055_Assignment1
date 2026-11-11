import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { BookOpen, RotateCw, ChevronLeft, ChevronRight, Check, RefreshCw, Copy, CheckCheck, Code2, Download, Shuffle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardsDeckProps {
  flashcards: Flashcard[];
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({ flashcards }) => {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'study' | 'quiz' | 'json'>('study');
  const [copiedJson, setCopiedJson] = useState(false);

  // Sync when flashcards prop updates
  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  }, [flashcards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'study') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, cards.length, viewMode]);

  const currentCard = cards[currentIndex] || {
    front: 'Financial Metric',
    back: 'Report Context and Meaning',
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleMastered = (idx: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
        if (next.size === cards.length) {
          // Trigger victory confetti!
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // ignore
          }
        }
      }
      return next;
    });
  };

  // Clean JSON string matching operational constraints
  const cleanJsonString = JSON.stringify(
    flashcards.map((c) => ({
      front: c.front,
      back: c.back,
    })),
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(cleanJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([cleanJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings-flashcards.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csvContent =
      'Front,Back\n' +
      flashcards
        .map((c) => `"${c.front.replace(/"/g, '""')}","${c.back.replace(/"/g, '""')}"`)
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings-flashcards-anki.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isMastered = masteredIds.has(currentIndex);

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Flashcard Set</span>
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                JSON &amp; Interactive Deck
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Key financial terms and definitions parsed directly from filing data
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('study')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
              viewMode === 'study'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Interactive 3D Deck</span>
          </button>

          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
              viewMode === 'json'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>JSON Format</span>
          </button>
        </div>
      </div>

      {viewMode === 'study' ? (
        <div className="mt-6 max-w-xl mx-auto">
          {/* Deck Stats Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-cyan-400 font-bold">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium flex items-center space-x-1">
                <Trophy className="w-3 h-3" />
                <span>{masteredIds.size} Mastered</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShuffle}
                className="hover:text-slate-200 flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                title="Shuffle cards"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle</span>
              </button>
              <button
                onClick={() => {
                  setMasteredIds(new Set());
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="hover:text-slate-200 text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                title="Reset progress"
              >
                Reset
              </button>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 w-full h-64 sm:h-72 cursor-pointer select-none group"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-800 group-hover:border-cyan-500/50 p-6 flex flex-col justify-between shadow-2xl transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                    Term / Metric
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                    <RotateCw className="w-3 h-3" />
                    <span>Click or Spacebar to flip</span>
                  </span>
                </div>

                <div className="text-center my-auto">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentCard.front}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">Tap to view report definition &amp; context</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <span>Front</span>
                  {isMastered && (
                    <span className="text-emerald-400 font-medium flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Mastered</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Back of Card (Rotated 180deg) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/40 border-2 border-teal-500/40 p-6 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20">
                    Definition &amp; Filing Context
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {currentCard.front}
                  </span>
                </div>

                <div className="my-auto overflow-y-auto max-h-36 pr-1">
                  <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>Back</span>
                  <span className="text-cyan-400">Click to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation & Mastery Controls */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Previous card (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </button>

              <button
                onClick={() => toggleMastered(currentIndex)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isMastered
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 border border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isMastered ? 'Mastered!' : 'Mark Mastered'}</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Next card (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Raw JSON Format View */
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Clean parsed JSON array formatted precisely to operational specifications:
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1.5"
              >
                {copiedJson ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.JSON</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1.5"
                title="Export for Anki / Quizlet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Anki CSV</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-96">
            <code>{cleanJsonString}</code>
          </pre>
        </div>
      )}
    </section>
  );
};
