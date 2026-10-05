import React from 'react';
import { 
  Database, 
  Layers, 
  FileText, 
  ShieldAlert, 
  PlusCircle, 
  FileCog, 
  Search, 
  Files, 
  Cpu, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DifficultyBadge, MarksBadge, TypeBadge } from '../components/Badge';

export function Dashboard() {
  const { questions, generatedPapers, setActiveTab, getDsaEngineStats, setSelectedPaperForPreview } = useApp();
  const dsaStats = getDsaEngineStats();

  // Compute key statistics
  const totalQuestions = questions.length;
  const uniqueSubjects = Array.from(new Set(questions.map(q => q.subject))).length;
  const uniqueTopics = Array.from(new Set(questions.map(q => q.topic))).length;
  const generatedPapersCount = generatedPapers.length;
  const duplicateQuestionsCount = dsaStats.duplicateCount;

  const easyCount = questions.filter(q => q.difficulty === 'Easy').length;
  const mediumCount = questions.filter(q => q.difficulty === 'Medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'Hard').length;

  const mcqCount = questions.filter(q => q.questionType === 'MCQ').length;
  const shortCount = questions.filter(q => q.questionType === 'Short Answer').length;
  const descCount = questions.filter(q => q.questionType === 'Descriptive').length;

  // Topic distribution for chart
  const topicCounts = questions.reduce((acc, q) => {
    acc[q.topic] = (acc[q.topic] || 0) + 1;
    return acc;
  }, {});

  const topicEntries = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const maxTopicVal = Math.max(1, ...Object.values(topicCounts));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DSA-Powered Automated Question Bank System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Question Paper Generation Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Leveraging Hash Tables O(1), B-Tree Indexing, KMP String Matching, 0/1 Knapsack Dynamic Programming, and Network Flow algorithms to generate perfectly balanced, duplicate-free question papers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('generate')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
            >
              <FileCog className="w-4 h-4" />
              <span>Generate Paper</span>
            </button>
            <button
              onClick={() => setActiveTab('add-question')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-sm font-semibold transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Questions</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalQuestions}</div>
          <div className="text-[11px] text-indigo-400 mt-1 font-mono">O(1) Hash Table Indexed</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Topics & Units</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{uniqueTopics} <span className="text-xs font-normal text-slate-400">Topics / 5 Units</span></div>
          <div className="text-[11px] text-purple-400 mt-1 font-mono">B-Tree Multilevel Index</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Generated Papers</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{generatedPapersCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Sets A, B, C, D Ready</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Duplicate Alert</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{duplicateQuestionsCount} <span className="text-xs font-normal text-slate-400">Pairs</span></div>
          <div className="text-[11px] text-amber-400 mt-1 font-mono">KMP & Rabin-Karp</div>
        </div>

        {/* Difficulty Breakdown Cards */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-2 sm:col-start-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Easy Questions</span>
            <span className="text-xs font-bold text-emerald-400">{easyCount}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(easyCount/totalQuestions)*100}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Medium Questions</span>
            <span className="text-xs font-bold text-amber-400">{mediumCount}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(mediumCount/totalQuestions)*100}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Hard Questions</span>
            <span className="text-xs font-bold text-rose-400">{hardCount}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(hardCount/totalQuestions)*100}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Question Types</span>
            <span className="text-xs font-bold text-indigo-400">{mcqCount} MCQ / {shortCount} S / {descCount} D</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden flex">
            <div className="bg-purple-500 h-full" style={{ width: `${(mcqCount/totalQuestions)*100}%` }} />
            <div className="bg-blue-500 h-full" style={{ width: `${(shortCount/totalQuestions)*100}%` }} />
            <div className="bg-cyan-500 h-full" style={{ width: `${(descCount/totalQuestions)*100}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setActiveTab('add-question')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all group text-center"
          >
            <PlusCircle className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold">Add Question</span>
            <span className="text-[10px] text-slate-400 mt-0.5">With KMP Duplicate Check</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all group text-center"
          >
            <Database className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold">Question Bank</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Merge / Quick Sort</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all group text-center"
          >
            <FileCog className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold">Generate Paper</span>
            <span className="text-[10px] text-slate-400 mt-0.5">10-Step DSA Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all group text-center"
          >
            <Search className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold">Search Questions</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Hash O(1) / B-Tree Range</span>
          </button>

          <button
            onClick={() => setActiveTab('papers')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all group text-center col-span-2 sm:col-span-1"
          >
            <Files className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold">View Papers</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Print & Export PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions by Topic Bar Distribution */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Questions by Topic</h3>
              <p className="text-xs text-slate-400 mt-0.5">Syllabus coverage indexed via B-Tree</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              10 DSA Modules
            </span>
          </div>

          <div className="space-y-3">
            {topicEntries.map(([topic, count]) => {
              const pct = Math.round((count / maxTopicVal) * 100);
              return (
                <div key={topic} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{topic}</span>
                    <span className="text-slate-400 font-mono">{count} Questions ({Math.round((count/totalQuestions)*100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DSA Methodology Status Panel */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>DSA Architecture</span>
              </h3>
              <button
                onClick={() => setActiveTab('visualizer')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <span>Live Trace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Hash Table Index</span>
                  <span className="text-indigo-400 font-mono">O(1)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Load Factor: {dsaStats.hashTableStats.loadFactor} • {dsaStats.hashTableStats.nonEmptyBuckets} active buckets
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>B-Tree Multi-Index</span>
                  <span className="text-purple-400 font-mono">O(log N)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Indexed by Topic, Unit, and Marks for range queries
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>KMP & Rabin-Karp</span>
                  <span className="text-emerald-400 font-mono">O(N+M)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Polynomial rolling hash for duplicate detection
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>0/1 Knapsack DP</span>
                  <span className="text-amber-400 font-mono">O(N·W·C)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Exact total marks & question count constraint solver
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('visualizer')}
            className="w-full py-2.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-colors text-center"
          >
            Launch Interactive Algorithm Visualizer →
          </button>
        </div>
      </div>

      {/* Recent Generated Papers Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Recent Generated Question Papers</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick access to exam paper sets & archives</p>
          </div>
          <button
            onClick={() => setActiveTab('papers')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            View All ({generatedPapers.length}) →
          </button>
        </div>

        {generatedPapers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-300">No question papers generated yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Use the automated DSA generation engine to build customized question papers in seconds.
            </p>
            <button
              onClick={() => setActiveTab('generate')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/25"
            >
              Generate First Paper Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedPapers.slice(0, 3).map(paper => (
              <div
                key={paper.id || paper.paperId}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{paper.paperId || paper.id}</span>
                    <span className="text-[10px] text-slate-400">{new Date(paper.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{paper.subject}</h4>
                  <p className="text-xs text-slate-400 mt-1">{paper.examTitle || 'End-Semester Exam'}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <MarksBadge marks={paper.totalMarks} />
                    <span className="text-xs text-slate-400">{paper.questionCount} Questions</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-mono">Sets A, B, C, D</span>
                  <button
                    onClick={() => {
                      setSelectedPaperForPreview(paper);
                      setActiveTab('preview');
                    }}
                    className="text-xs text-indigo-400 hover:text-white font-semibold flex items-center gap-1"
                  >
                    <span>Preview & Print</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
