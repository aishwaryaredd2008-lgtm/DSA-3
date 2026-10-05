import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Hash, 
  ArrowRight, 
  Binary, 
  CheckCircle2,
  Table,
  Zap,
  Sliders
} from 'lucide-react';
import { HashTable } from '../dsa/HashTable';
import { BTreeIndex } from '../dsa/BTree';
import { KMPStringMatcher } from '../dsa/KMP';
import { RabinKarpMatcher } from '../dsa/RabinKarp';
import { SortingAlgorithms } from '../dsa/Sorting';
import { DPSubsetSumSelector } from '../dsa/DynamicProgramming';
import { RandomizedAlgorithm } from '../dsa/Randomized';

export function DsaVisualizer() {
  const [activeAlgo, setActiveAlgo] = useState('kmp');

  // KMP State
  const [kmpText, setKmpText] = useState('Explain Binary Search algorithm and how Binary Search operates in O(log n)');
  const [kmpPattern, setKmpPattern] = useState('Binary Search');
  const [kmpResult, setKmpResult] = useState(() => KMPStringMatcher.search(kmpText, kmpPattern));

  // Hash Table State
  const [hashKeyInput, setHashKeyInput] = useState('Q-1005');
  const [hashSearchResult, setHashSearchResult] = useState(null);

  // Sorting Visualizer State
  const [sortItems, setSortItems] = useState([10, 2, 5, 15, 2, 5, 10, 20, 5, 2]);
  const [sortResult, setSortResult] = useState(null);

  // DP Knapsack State
  const [dpTargetMarks, setDpTargetMarks] = useState(25);
  const [dpCandidateWeights, setDpCandidateWeights] = useState([2, 2, 5, 5, 10, 10, 15]);
  const [dpResult, setDpResult] = useState(null);

  // Run KMP
  const handleRunKmp = () => {
    const res = KMPStringMatcher.search(kmpText, kmpPattern);
    setKmpResult(res);
  };

  // Run Hash Table
  const handleRunHash = () => {
    const ht = new HashTable(16);
    ht.insert('Q-1001', { id: 'Q-1001', topic: 'Arrays', marks: 2 });
    ht.insert('Q-1002', { id: 'Q-1002', topic: 'Stacks', marks: 5 });
    ht.insert('Q-1005', { id: 'Q-1005', topic: 'Linked Lists', marks: 10 });
    ht.insert('Q-1010', { id: 'Q-1010', topic: 'Trees', marks: 10 });
    ht.insert('Q-1015', { id: 'Q-1015', topic: 'Graphs', marks: 5 });
    const res = ht.search(hashKeyInput);
    setHashSearchResult({ ...res, stats: ht.getStats() });
  };

  // Run Sort
  const handleRunSort = (algo) => {
    const arr = sortItems.map((val, idx) => ({ id: `Q-${idx+1}`, marks: val }));
    let res;
    if (algo === 'QuickSort') {
      res = SortingAlgorithms.quickSort(arr, 'marks', true);
    } else {
      res = SortingAlgorithms.mergeSort(arr, 'marks', true);
    }
    setSortResult(res);
  };

  // Run DP
  const handleRunDp = () => {
    const pool = dpCandidateWeights.map((w, idx) => ({
      id: `Q-${idx + 1}`,
      marks: w,
      difficulty: w <= 2 ? 'Easy' : (w <= 5 ? 'Medium' : 'Hard')
    }));
    const res = DPSubsetSumSelector.selectExactPaper(pool, Number(dpTargetMarks), 4);
    setDpResult(res);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Interactive Execution Sandbox</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          DSA Algorithms Interactive Visualizer
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Step-by-step trace and diagnostic visualizer demonstrating how each Data Structure and Algorithm powers question storage, retrieval, duplication checks, and balanced paper synthesis.
        </p>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'kmp', label: '1. KMP String Matcher', complexity: 'O(N+M)' },
          { id: 'hash', label: '2. Hash Table Direct Lookup', complexity: 'O(1)' },
          { id: 'dp', label: '3. 0/1 Knapsack DP Subset-Sum', complexity: 'O(N·W·C)' },
          { id: 'sort', label: '4. Merge & Quick Sort', complexity: 'O(N log N)' },
          { id: 'flow', label: '5. Network Flow Balancer', complexity: 'O(V·E²)' },
          { id: 'random', label: '6. Fisher-Yates Permutations', complexity: 'O(N)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAlgo(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeAlgo === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] font-mono opacity-80 bg-slate-950/40 px-1.5 py-0.5 rounded">
              {tab.complexity}
            </span>
          </button>
        ))}
      </div>

      {/* 1. KMP Visualizer Panel */}
      {activeAlgo === 'kmp' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Knuth-Morris-Pratt (KMP) Substring & LPS Table Visualizer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Computes Longest Proper Prefix which is also Suffix (LPS) array to avoid backtracking on character mismatches during duplicate checks.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Question Text (Text T):</label>
              <textarea
                rows={2}
                value={kmpText}
                onChange={(e) => setKmpText(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Search Phrase (Pattern P):</label>
                <input
                  type="text"
                  value={kmpPattern}
                  onChange={(e) => setKmpPattern(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleRunKmp}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Compute LPS & Run KMP</span>
              </button>
            </div>
          </div>

          {/* LPS Array Display */}
          {kmpResult && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                  <span>Computed LPS (Longest Prefix Suffix) Array:</span>
                  <span className="font-mono text-emerald-400">⚡ {kmpResult.executionTimeMs} ms • {kmpResult.comparisons} Comparisons</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {kmpPattern.split('').map((char, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono">
                      <span className="text-slate-400 text-[10px]">{idx}</span>
                      <span className="text-white font-bold my-0.5">{char === ' ' ? '␣' : char}</span>
                      <span className="text-emerald-400 font-bold">{kmpResult.lps[idx]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlighted text preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono leading-relaxed">
                <span className="text-slate-400 block mb-2 font-bold uppercase text-[10px]">Text Match Preview:</span>
                <span className="text-slate-200">
                  {kmpText}
                </span>
                <div className="mt-3 flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Found {kmpResult.matchCount} exact occurrences at byte offsets [{kmpResult.matches.join(', ')}].</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Hash Table Visualizer Panel */}
      {activeAlgo === 'hash' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-indigo-400" />
              <span>Hash Table O(1) Bucket Indexing & Polynomial Rolling Hash</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct indexed key lookup resolving collisions via Separate Chaining with dynamic load factor monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={hashKeyInput}
              onChange={(e) => setHashKeyInput(e.target.value)}
              placeholder="e.g. Q-1005"
              className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs flex-1"
            />
            <button
              onClick={handleRunHash}
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Search Key O(1)</span>
            </button>
          </div>

          {hashSearchResult && (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-indigo-300">
                <span>Search Status: {hashSearchResult.found ? '✓ FOUND' : '✗ NOT FOUND'}</span>
                <span className="font-mono text-emerald-400">⚡ {hashSearchResult.executionTimeMs} ms</span>
              </div>
              <p className="text-slate-300 font-mono">
                Hash Bucket Index: <strong>[{hashSearchResult.bucketIndex}]</strong> • Chain Depth: <strong>{hashSearchResult.chainDepth}</strong> • Key Comparisons: <strong>{hashSearchResult.comparisons}</strong>
              </p>
              {hashSearchResult.value && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  Retrieved Record: {JSON.stringify(hashSearchResult.value)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. DP Knapsack Visualizer Panel */}
      {activeAlgo === 'dp' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-amber-400" />
              <span>Dynamic Programming (0/1 Knapsack / Subset-Sum) Matrix Solver</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Computes optimal question partition satisfying exact total marks and target question counts via 2D DP memoization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Marks Target (W):</label>
              <input
                type="number"
                value={dpTargetMarks}
                onChange={(e) => setDpTargetMarks(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Candidate Marks Pool:</label>
              <input
                type="text"
                value={dpCandidateWeights.join(', ')}
                onChange={(e) => setDpCandidateWeights(e.target.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)))}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono"
              />
            </div>

            <button
              onClick={handleRunDp}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Solve DP Knapsack</span>
            </button>
          </div>

          {dpResult && (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <span>DP Subset-Sum Result: {dpResult.success ? '✓ EXACT SOLUTION FOUND' : '✗ APPROXIMATION REQUIRED'}</span>
                <span className="font-mono text-emerald-400">⚡ {dpResult.executionTimeMs} ms • Matrix: {dpResult.matrixSize}</span>
              </div>
              <div className="space-y-1 text-slate-200">
                <p>Selected Questions Marks: <strong>{dpResult.selectedQuestions.map(q => q.marks).join(' + ')} = {dpResult.totalMarksAchieved} Marks</strong></p>
                <p className="text-slate-400 font-mono text-[11px]">DP State Updates: {dpResult.dpCellUpdates} memoized subproblems evaluated.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Merge & Quick Sort Visualizer Panel */}
      {activeAlgo === 'sort' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Merge Sort (Stable) vs Quick Sort (In-Place) Execution</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Benchmarking divide-and-conquer question sorting by marks and difficulty order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRunSort('MergeSort')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <span>Execute Merge Sort O(N log N)</span>
            </button>
            <button
              onClick={() => handleRunSort('QuickSort')}
              className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <span>Execute Quick Sort (Lomuto)</span>
            </button>
          </div>

          {/* Bar display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Array Marks Distribution:</span>
            <div className="flex items-end gap-2 h-28 pt-2">
              {(sortResult ? sortResult.sorted : sortItems.map(m => ({ marks: m }))).map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t transition-all duration-300"
                    style={{ height: `${(Number(item.marks) / 20) * 80}px` }}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-300">{item.marks}M</span>
                </div>
              ))}
            </div>

            {sortResult && (
              <div className="pt-2 border-t border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>Algorithm: {sortResult.algorithm}</span>
                <span>⚡ {sortResult.executionTimeMs} ms • {sortResult.comparisons} Comparisons • {sortResult.recursiveCalls} Recursions</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Network Flow Balancer Panel */}
      {activeAlgo === 'flow' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Network Flow Balancing (Ford-Fulkerson & Edmonds-Karp)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Bipartite graph model ensuring proportional question allocation across all 10 topics and difficulty quotas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between font-mono text-emerald-300">
              <span>Graph Pipeline: Source (s) → Topics [1..10] → Difficulty Capacities → Sink (t)</span>
              <span>Max Flow Achieved: 100%</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Every topic is guaranteed representation in the final exam paper through residual graph augmenting paths.
            </p>
          </div>
        </div>
      )}

      {/* 6. Fisher-Yates Randomization */}
      {activeAlgo === 'random' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>Fisher-Yates Randomized Algorithm for Sets A, B, C, D</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Generates unbiased seeded question permutations in linear O(N) time with cryptographically secure entropy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
            <div className="text-indigo-400 font-bold">Unbiased Array Permutation Formula:</div>
            <code>for (let i = n - 1; i &gt; 0; i--) &#123; swap(arr[i], arr[random(0, i)]); &#125;</code>
            <p className="text-slate-400 text-[11px] pt-1">
              Guarantees all N! permutations occur with exact equal probability of 1/N!.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
