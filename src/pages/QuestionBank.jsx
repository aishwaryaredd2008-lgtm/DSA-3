import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Sparkles, 
  Cpu, 
  Layers, 
  Check, 
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DifficultyBadge, MarksBadge, TypeBadge, AlgorithmBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { SortingAlgorithms } from '../dsa/Sorting';
import { KMPStringMatcher } from '../dsa/KMP';

export function QuestionBank() {
  const { questions, deleteQuestion, updateQuestion, setActiveTab, DSA_TOPICS, SUBJECTS_LIST } = useApp();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');

  // Sorting state & algorithm selection
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortAlgorithm, setSortAlgorithm] = useState('MergeSort'); // 'MergeSort' or 'QuickSort'
  const [sortBenchmark, setSortBenchmark] = useState(null);

  // Modals state
  const [viewQuestion, setViewQuestion] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [duplicateCheckModal, setDuplicateCheckModal] = useState(null);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = searchTerm === '' || 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchType = selectedType === 'All' || q.questionType === selectedType;
      const matchUnit = selectedUnit === 'All' || String(q.unit) === String(selectedUnit);

      return matchSearch && matchTopic && matchDiff && matchType && matchUnit;
    });
  }, [questions, searchTerm, selectedTopic, selectedDifficulty, selectedType, selectedUnit]);

  // Sort questions using selected DSA algorithm (Merge Sort vs Quick Sort)
  const sortedQuestions = useMemo(() => {
    const isAsc = sortOrder === 'asc';
    let result;
    if (sortAlgorithm === 'QuickSort') {
      result = SortingAlgorithms.quickSort(filteredQuestions, sortField, isAsc);
    } else {
      result = SortingAlgorithms.mergeSort(filteredQuestions, sortField, isAsc);
    }
    return result.sorted;
  }, [filteredQuestions, sortField, sortOrder, sortAlgorithm]);

  // Run benchmark on demand
  const handleRunSortBenchmark = () => {
    const bench = SortingAlgorithms.benchmarkSorts(filteredQuestions, sortField);
    setSortBenchmark(bench);
  };

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Perform instant KMP duplicate check for a specific question against all others
  const handleCheckQuestionDuplicate = (targetQ) => {
    const comparisons = [];
    questions.forEach(q => {
      if (q.id !== targetQ.id) {
        const sim = KMPStringMatcher.checkSimilarity(targetQ.text, q.text);
        if (sim.similarity >= 30) {
          comparisons.push({
            other: q,
            similarity: sim.similarity,
            isDuplicate: sim.isDuplicate,
            matchedTokens: sim.matchedTokens,
            algorithm: 'KMP String Matching'
          });
        }
      }
    });

    comparisons.sort((a, b) => b.similarity - a.similarity);

    setDuplicateCheckModal({
      question: targetQ,
      comparisons
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editQuestion) {
      updateQuestion(editQuestion);
      setEditQuestion(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Question Bank Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-medium">
              {questions.length} Items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, edit and execute algorithmic sorting (Merge Sort / Quick Sort) on question records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('add-question')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Sorting Selector */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {/* Search & Main Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ID, keyword, phrase..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Topic */}
          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Topics</option>
              {DSA_TOPICS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="Short Answer">Short Answer</option>
              <option value="Descriptive">Descriptive</option>
            </select>
          </div>

          {/* Unit */}
          <div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Units (1-5)</option>
              <option value="1">Unit 1 (Linear)</option>
              <option value="2">Unit 2 (Stacks/Queues)</option>
              <option value="3">Unit 3 (Trees/Heaps)</option>
              <option value="4">Unit 4 (Graphs/Sorts)</option>
              <option value="5">Unit 5 (Hashing/DP)</option>
            </select>
          </div>
        </div>

        {/* Algorithm Sorting Switcher & Execution Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sorting Algorithm:</span>
            </span>

            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setSortAlgorithm('MergeSort')}
                className={`px-3 py-1 rounded-md font-mono text-[11px] transition-all ${
                  sortAlgorithm === 'MergeSort'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Merge Sort O(N log N)
              </button>
              <button
                onClick={() => setSortAlgorithm('QuickSort')}
                className={`px-3 py-1 rounded-md font-mono text-[11px] transition-all ${
                  sortAlgorithm === 'QuickSort'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quick Sort O(N log N)
              </button>
            </div>

            <button
              onClick={handleRunSortBenchmark}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Benchmark Both
            </button>
          </div>

          <div className="text-slate-400 text-xs">
            Showing <strong className="text-slate-200">{sortedQuestions.length}</strong> of {questions.length} questions
          </div>
        </div>

        {/* Benchmark Results Display */}
        {sortBenchmark && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-bold text-indigo-300">Merge Sort (Stable)</div>
              <div className="text-slate-400 mt-1 font-mono text-[11px]">
                Time: {sortBenchmark.mergeSort.executionTimeMs}ms • Comparisons: {sortBenchmark.mergeSort.comparisons} • Recurse: {sortBenchmark.mergeSort.recursiveCalls}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-bold text-purple-300">Quick Sort (In-Place)</div>
              <div className="text-slate-400 mt-1 font-mono text-[11px]">
                Time: {sortBenchmark.quickSort.executionTimeMs}ms • Comparisons: {sortBenchmark.quickSort.comparisons} • Swaps: {sortBenchmark.quickSort.swaps}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Questions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/75 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th 
                  onClick={() => handleSortToggle('id')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4 min-w-[280px]">Question Text</th>
                <th 
                  onClick={() => handleSortToggle('topic')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Topic & Unit</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSortToggle('difficulty')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Difficulty</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSortToggle('marks')}
                  className="p-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Marks</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {sortedQuestions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No questions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                sortedQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-400">
                      {q.id}
                    </td>
                    <td className="p-4 text-slate-200">
                      <div className="line-clamp-2 leading-relaxed font-normal">{q.text}</div>
                      {q.bloomLevel && (
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          Bloom's: {q.bloomLevel}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-semibold">{q.topic}</div>
                      <div className="text-[10px] text-slate-400">Unit {q.unit}</div>
                    </td>
                    <td className="p-4">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="p-4">
                      <MarksBadge marks={q.marks} />
                    </td>
                    <td className="p-4">
                      <TypeBadge type={q.questionType} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewQuestion(q)}
                          title="View Question Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCheckQuestionDuplicate(q)}
                          title="Run KMP Duplicate Check"
                          className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditQuestion(q)}
                          title="Edit Question"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(q.id)}
                          title="Delete Question"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      <Modal
        isOpen={!!viewQuestion}
        onClose={() => setViewQuestion(null)}
        title={`Question Details: ${viewQuestion?.id}`}
        subtitle={`${viewQuestion?.subject} • Unit ${viewQuestion?.unit}`}
      >
        {viewQuestion && (
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Question Text</span>
              <p className="text-white text-base leading-relaxed">{viewQuestion.text}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Topic</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">{viewQuestion.topic}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Difficulty</span>
                <span className="mt-1 block"><DifficultyBadge difficulty={viewQuestion.difficulty} /></span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Marks</span>
                <span className="mt-1 block"><MarksBadge marks={viewQuestion.marks} /></span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Type</span>
                <span className="mt-1 block"><TypeBadge type={viewQuestion.questionType} /></span>
              </div>
            </div>

            {viewQuestion.options && viewQuestion.options.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">MCQ Options</span>
                <div className="space-y-2">
                  {viewQuestion.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg text-xs flex items-center justify-between ${
                        idx === viewQuestion.correctOption
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                      {idx === viewQuestion.correctOption && <span className="text-[10px] text-emerald-400 font-mono">✓ Correct Answer</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Key Answer / Scheme</span>
              <p className="text-slate-300 text-xs leading-relaxed">{viewQuestion.answer || 'No key answer specified.'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editQuestion}
        onClose={() => setEditQuestion(null)}
        title={`Edit Question: ${editQuestion?.id}`}
      >
        {editQuestion && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Question Text</label>
              <textarea
                rows={3}
                required
                value={editQuestion.text}
                onChange={(e) => setEditQuestion({ ...editQuestion, text: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                <select
                  value={editQuestion.topic}
                  onChange={(e) => setEditQuestion({ ...editQuestion, topic: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  {DSA_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                <select
                  value={editQuestion.difficulty}
                  onChange={(e) => setEditQuestion({ ...editQuestion, difficulty: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Marks</label>
                <select
                  value={editQuestion.marks}
                  onChange={(e) => setEditQuestion({ ...editQuestion, marks: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value={2}>2 Marks</option>
                  <option value={5}>5 Marks</option>
                  <option value={10}>10 Marks</option>
                  <option value={15}>15 Marks</option>
                  <option value={20}>20 Marks</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Type</label>
                <select
                  value={editQuestion.questionType}
                  onChange={(e) => setEditQuestion({ ...editQuestion, questionType: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="Descriptive">Descriptive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Key Answer</label>
              <textarea
                rows={2}
                value={editQuestion.answer || ''}
                onChange={(e) => setEditQuestion({ ...editQuestion, answer: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-md shadow-indigo-600/25"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete question <strong className="text-indigo-400 font-mono">{deleteConfirmId}</strong> from the question bank? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteQuestion(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-500 shadow-md shadow-rose-600/25"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* KMP DUPLICATE CHECK MODAL */}
      <Modal
        isOpen={!!duplicateCheckModal}
        onClose={() => setDuplicateCheckModal(null)}
        title="Duplicate Analysis (KMP String Matching)"
        subtitle={`Target Question: ${duplicateCheckModal?.question?.id}`}
      >
        {duplicateCheckModal && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Target Text:</span>
              <p className="text-white font-medium text-xs mt-1">{duplicateCheckModal.question.text}</p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Algorithm Used:</span>
              <span className="font-mono text-emerald-400">Knuth-Morris-Pratt (KMP) + N-Gram LPS</span>
            </div>

            {duplicateCheckModal.comparisons.length === 0 ? (
              <div className="p-6 text-center text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                ✓ No similar questions detected in the question bank. This question is 100% unique!
              </div>
            ) : (
              <div className="space-y-3">
                {duplicateCheckModal.comparisons.map((c, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border ${
                      c.similarity >= 70
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-indigo-300 font-mono">{c.other.id} ({c.other.topic})</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        c.similarity >= 70 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {c.similarity}% Similarity
                      </span>
                    </div>
                    <p className="text-xs text-slate-200">{c.other.text}</p>
                    {c.matchedTokens && c.matchedTokens.length > 0 && (
                      <div className="mt-2 text-[10px] text-slate-400">
                        Matched phrases: <code className="text-indigo-300">{c.matchedTokens.join(', ')}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
