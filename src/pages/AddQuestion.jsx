import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  FileText, 
  HelpCircle, 
  ListPlus, 
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KMPStringMatcher } from '../dsa/KMP';
import { RabinKarpMatcher } from '../dsa/RabinKarp';
import { DifficultyBadge, MarksBadge, TypeBadge } from '../components/Badge';

export function AddQuestion() {
  const { questions, addQuestion, setActiveTab, DSA_TOPICS, SUBJECTS_LIST, UNITS_LIST } = useApp();

  const [questionId, setQuestionId] = useState(`Q-${1000 + questions.length + 1}`);
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState(SUBJECTS_LIST[0]);
  const [topic, setTopic] = useState('Arrays');
  const [unit, setUnit] = useState(1);
  const [difficulty, setDifficulty] = useState('Easy');
  const [marks, setMarks] = useState(2);
  const [questionType, setQuestionType] = useState('MCQ');
  const [bloomLevel, setBloomLevel] = useState('Understand');
  const [answer, setAnswer] = useState('');

  // MCQ Options
  const [options, setOptions] = useState(['Option A', 'Option B', 'Option C', 'Option D']);
  const [correctOption, setCorrectOption] = useState(0);

  // Duplicate Check Result
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Auto-set Unit based on topic
  useEffect(() => {
    if (['Arrays', 'Linked Lists'].includes(topic)) setUnit(1);
    else if (['Stacks', 'Queues'].includes(topic)) setUnit(2);
    else if (['Trees'].includes(topic)) setUnit(3);
    else if (['Searching', 'Sorting', 'Graphs'].includes(topic)) setUnit(4);
    else if (['Hashing', 'Dynamic Programming'].includes(topic)) setUnit(5);
  }, [topic]);

  // Real-time duplicate check on questionText change
  useEffect(() => {
    if (!questionText.trim() || questionText.length < 15) {
      setDuplicateWarning(null);
      return;
    }

    setIsCheckingDuplicate(true);
    const timer = setTimeout(() => {
      let highestSimilarity = 0;
      let matchedQuestion = null;
      let matchAlgorithm = '';

      for (const q of questions) {
        const kmpRes = KMPStringMatcher.checkSimilarity(questionText, q.text);
        if (kmpRes.similarity > highestSimilarity) {
          highestSimilarity = kmpRes.similarity;
          matchedQuestion = q;
          matchAlgorithm = 'KMP String Matching';
        }
      }

      if (highestSimilarity >= 65 && matchedQuestion) {
        setDuplicateWarning({
          similarity: highestSimilarity,
          matchedQuestion,
          algorithm: matchAlgorithm,
          message: 'Warning: A similar question already exists in the question bank.'
        });
      } else {
        setDuplicateWarning(null);
      }
      setIsCheckingDuplicate(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [questionText, questions]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const updated = options.filter((_, idx) => idx !== index);
      setOptions(updated);
      if (correctOption >= updated.length) {
        setCorrectOption(updated.length - 1);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert('Please enter question text');
      return;
    }

    const newQ = {
      id: questionId,
      text: questionText.trim(),
      subject,
      topic,
      unit: Number(unit),
      difficulty,
      marks: Number(marks),
      questionType,
      bloomLevel,
      options: questionType === 'MCQ' ? options : [],
      correctOption: questionType === 'MCQ' ? correctOption : null,
      answer: answer.trim()
    };

    addQuestion(newQ);

    // Reset Form
    setQuestionId(`Q-${1000 + questions.length + 2}`);
    setQuestionText('');
    setAnswer('');
    setDuplicateWarning(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-400" />
            <span>Add New Academic Question</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create questions with real-time KMP duplicate detection and multi-attribute indexing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
        >
          View All Questions →
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          {/* Top identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Question ID (Hash Key)
              </label>
              <input
                type="text"
                required
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Question Text with Live KMP Duplicate Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Question Text <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                {isCheckingDuplicate ? (
                  <span className="text-indigo-400 animate-pulse">Running KMP Duplicate Check...</span>
                ) : duplicateWarning ? (
                  <span className="text-amber-400 font-bold">⚠️ Duplicate Risk ({duplicateWarning.similarity}%)</span>
                ) : questionText.length > 15 ? (
                  <span className="text-emerald-400">✓ Unique (KMP Verified)</span>
                ) : null}
              </div>
            </div>
            <textarea
              rows={4}
              required
              placeholder="e.g. Explain AVL Tree rotations with diagrams and analyze worst-case search complexity..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          {/* DUPLICATE WARNING BOX (Prominently displayed per requirement) */}
          {duplicateWarning && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 text-amber-200 animate-in fade-in space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{duplicateWarning.message}</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Found high similarity with existing question <strong className="font-mono text-amber-100">{duplicateWarning.matchedQuestion.id}</strong>:
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-medium text-slate-200">
                "{duplicateWarning.matchedQuestion.text}"
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-amber-300/80">
                <span>Detection Engine: <strong>{duplicateWarning.algorithm}</strong></span>
                <span className="font-mono font-bold">Similarity: {duplicateWarning.similarity}%</span>
              </div>
            </div>
          )}

          {/* Categorization Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {DSA_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {UNITS_LIST.map(u => <option key={u.unit} value={u.unit}>Unit {u.unit}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Marks
              </label>
              <select
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={2}>2 Marks</option>
                <option value={5}>5 Marks</option>
                <option value={10}>10 Marks</option>
                <option value={15}>15 Marks</option>
                <option value={20}>20 Marks</option>
              </select>
            </div>
          </div>

          {/* Question Type & Bloom Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Question Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['MCQ', 'Short Answer', 'Descriptive'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setQuestionType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      questionType === type
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Bloom's Taxonomy Level
              </label>
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Remember">Level 1: Remember</option>
                <option value="Understand">Level 2: Understand</option>
                <option value="Apply">Level 3: Apply</option>
                <option value="Analyze">Level 4: Analyze</option>
                <option value="Evaluate">Level 5: Evaluate / Create</option>
              </select>
            </div>
          </div>

          {/* MCQ Options Section if Type === MCQ */}
          {questionType === 'MCQ' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Multiple Choice Options (Select radio for correct answer)
                </span>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOption === idx}
                      onChange={() => setCorrectOption(idx)}
                      className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                      title="Mark as correct answer"
                    />
                    <span className="text-xs font-mono font-bold text-slate-400 w-5">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer / Key Answer */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Answer / Solution Key & Evaluation Scheme
            </label>
            <textarea
              rows={3}
              placeholder="Provide model answer or step-by-step evaluation points..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              * Question will be indexed immediately in <strong>Hash Table</strong> and <strong>B-Tree</strong>.
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Question to Bank</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
