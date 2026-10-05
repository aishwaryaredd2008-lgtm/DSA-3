import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Cpu,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RabinKarpMatcher } from '../dsa/RabinKarp';
import { KMPStringMatcher } from '../dsa/KMP';
import { Modal } from '../components/Modal';

export function DuplicateDetection() {
  const { questions, deleteQuestion, addToast } = useApp();

  const [threshold, setThreshold] = useState(60);
  const [selectedPairForReview, setSelectedPairForReview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Scan Question Bank for duplicates
  const duplicatePairs = useMemo(() => {
    return RabinKarpMatcher.scanQuestionBankForDuplicates(questions, threshold);
  }, [questions, threshold]);

  const highRiskCount = duplicatePairs.filter(p => p.similarityPercentage >= 85).length;
  const moderateRiskCount = duplicatePairs.filter(p => p.similarityPercentage >= 65 && p.similarityPercentage < 85).length;

  const handleRunRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addToast(`Duplicate scan completed: ${duplicatePairs.length} similar pairs detected.`, 'info');
    }, 400);
  };

  const handleDeleteDuplicate = (questionId) => {
    deleteQuestion(questionId);
    setSelectedPairForReview(null);
    addToast(`Duplicate question ${questionId} removed.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span>Duplicate & Plagiarism Detection Audit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detecting semantic and syntactic question clones using Knuth-Morris-Pratt (KMP) and Rabin-Karp Rolling Hash algorithms.
          </p>
        </div>

        <button
          onClick={handleRunRescan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isScanning ? 'animate-spin' : ''}`} />
          <span>Run Full Bank Audit</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Duplicate Pairs</span>
          <div className="text-3xl font-black text-amber-400 mt-1">{duplicatePairs.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Rabin-Karp & KMP Matches</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">High Plagiarism Risk (≥85%)</span>
          <div className="text-3xl font-black text-rose-400 mt-1">{highRiskCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Exact or near-identical text</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Moderate Similarity (65-84%)</span>
          <div className="text-3xl font-black text-amber-300 mt-1">{moderateRiskCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Shared algorithm concept</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Sensitivity Threshold</span>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="range"
              min="40"
              max="95"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="flex-1 accent-amber-500"
            />
            <span className="font-mono text-xs font-bold text-slate-200">{threshold}%</span>
          </div>
        </div>
      </div>

      {/* Algorithm Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Active Detection Engines: <strong>KMP String Matcher</strong> (O(N+M)) & <strong>Rabin-Karp Rolling Hash</strong> (O(N+M))</span>
        </div>
        <span className="text-emerald-400 font-mono text-[11px]">Real-time Verification Active</span>
      </div>

      {/* Duplicates List */}
      <div className="space-y-4">
        {duplicatePairs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Duplicate Questions Found</h3>
            <p className="text-xs text-slate-400 mt-1">All question records meet uniqueness standards above {threshold}% threshold.</p>
          </div>
        ) : (
          duplicatePairs.map((pair, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all ${
                pair.similarityPercentage >= 85
                  ? 'bg-slate-900 border-rose-500/40 shadow-rose-950/20 shadow-lg'
                  : 'bg-slate-900 border-amber-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                    pair.similarityPercentage >= 85
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {pair.similarityPercentage}% Similarity
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {pair.status}
                  </span>
                  <span className="text-xs text-slate-400">• {pair.topic}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Algorithm: <strong className="text-indigo-300">KMP + Rabin-Karp</strong></span>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Question 1 */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-400">{pair.id1}</span>
                    <span className="text-[10px] text-slate-400">{pair.marks1} Marks</span>
                  </div>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">{pair.q1Text}</p>
                </div>

                {/* Question 2 */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-400">{pair.id2}</span>
                    <span className="text-[10px] text-slate-400">{pair.marks2} Marks</span>
                  </div>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">{pair.q2Text}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Recommended Action: Remove duplicate copy or rephrase concept.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteDuplicate(pair.id2)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete {pair.id2}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPairForReview(pair)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Detailed Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Review Modal */}
      <Modal
        isOpen={!!selectedPairForReview}
        onClose={() => setSelectedPairForReview(null)}
        title="Duplicate Pair Resolution"
        subtitle={`Comparing ${selectedPairForReview?.id1} and ${selectedPairForReview?.id2}`}
      >
        {selectedPairForReview && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>Plagiarism Score:</span>
                <span className="text-amber-400 text-sm font-mono">{selectedPairForReview.similarityPercentage}%</span>
              </div>
              <p className="text-slate-300">
                Algorithm: <strong>Knuth-Morris-Pratt (KMP) LPS Substring Matcher & Rabin-Karp Rolling Modulo Hash</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-indigo-400 block mb-1">Question 1 ({selectedPairForReview.id1}):</span>
                <p className="text-white text-xs">{selectedPairForReview.q1Text}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-purple-400 block mb-1">Question 2 ({selectedPairForReview.id2}):</span>
                <p className="text-white text-xs">{selectedPairForReview.q2Text}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedPairForReview(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
              >
                Keep Both
              </button>
              <button
                onClick={() => handleDeleteDuplicate(selectedPairForReview.id2)}
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-500"
              >
                Delete Duplicate ({selectedPairForReview.id2})
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
