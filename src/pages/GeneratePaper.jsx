import React, { useState } from 'react';
import { 
  FileCog, 
  Sparkles, 
  Cpu, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  RefreshCw, 
  CheckSquare, 
  Square,
  ShieldCheck,
  Zap,
  Award,
  Download,
  Printer,
  FileText,
  FileType,
  FileCode2,
  KeyRound,
  GraduationCap,
  Eye,
  EyeOff,
  Save,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import { PaperGeneratorEngine } from '../dsa/PaperGeneratorEngine';
import { DifficultyBadge, MarksBadge, TypeBadge } from '../components/Badge';

export function GeneratePaper() {
  const { 
    questions, 
    saveGeneratedPaper, 
    setSelectedPaperForPreview, 
    setActiveTab, 
    DSA_TOPICS, 
    SUBJECTS_LIST,
    settings,
    addToast
  } = useApp();

  // Form Configuration (Designed by User)
  const [institutionName, setInstitutionName] = useState(settings.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY');
  const [department, setDepartment] = useState(settings.department || 'Department of Computer Science & Engineering');
  const [subject, setSubject] = useState(settings.defaultSubject || SUBJECTS_LIST[0]);
  const [courseCode, setCourseCode] = useState(settings.defaultCourseCode || 'CS301-DSA');
  const [examTitle, setExamTitle] = useState('End-Semester Examination - Autumn 2026');
  const [durationHours, setDurationHours] = useState(settings.defaultExamDuration || '3.0 Hours');
  const [totalMarks, setTotalMarks] = useState(settings.defaultTotalMarks || 50);
  const [questionCount, setQuestionCount] = useState(settings.defaultQuestionCount || 8);
  const [questionType, setQuestionType] = useState('Mixed');
  const [selectedTopics, setSelectedTopics] = useState(DSA_TOPICS);
  const [sortAlgorithm, setSortAlgorithm] = useState('MergeSort'); // 'MergeSort' or 'QuickSort'

  // Difficulty Distribution (Percentage)
  const [difficultyDist, setDifficultyDist] = useState({
    Easy: 40,
    Medium: 40,
    Hard: 20
  });

  // Custom Topic Distribution
  const [enableCustomTopicDistribution, setEnableCustomTopicDistribution] = useState(false);
  const [topicDistribution, setTopicDistribution] = useState(() => {
    const init = {};
    DSA_TOPICS.forEach(t => { init[t] = 1; });
    return init;
  });

  // Generation Workflow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);
  const [livePipelineLogs, setLivePipelineLogs] = useState([]);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  // In-Page Generated Paper View Controls
  const [activeSetKey, setActiveSetKey] = useState('Set A');
  const [showMetadata, setShowMetadata] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Toggle Topic selection
  const handleToggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length === 1) {
        addToast('Please select at least one topic.', 'warning');
        return;
      }
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSelectAllTopics = () => setSelectedTopics(DSA_TOPICS);
  const handleDeselectAllTopics = () => setSelectedTopics([DSA_TOPICS[0]]);

  // Difficulty slider handler
  const handleDifficultyChange = (key, val) => {
    const num = Math.max(0, Math.min(100, Number(val)));
    const updated = { ...difficultyDist, [key]: num };
    const otherKeys = Object.keys(difficultyDist).filter(k => k !== key);
    const remainder = 100 - num;
    const currentSumOther = otherKeys.reduce((sum, k) => sum + difficultyDist[k], 0);

    if (currentSumOther > 0) {
      otherKeys.forEach(k => {
        updated[k] = Math.round((difficultyDist[k] / currentSumOther) * remainder);
      });
    } else {
      updated[otherKeys[0]] = remainder;
      updated[otherKeys[1]] = 0;
    }
    setDifficultyDist(updated);
  };

  const applyDifficultyPreset = (type) => {
    if (type === 'Balanced') setDifficultyDist({ Easy: 40, Medium: 40, Hard: 20 });
    else if (type === 'Easy') setDifficultyDist({ Easy: 60, Medium: 30, Hard: 10 });
    else if (type === 'Rigorous') setDifficultyDist({ Easy: 20, Medium: 40, Hard: 40 });
  };

  // Run the 10-step DSA Paper Generation Pipeline
  const handleGenerate = () => {
    if (Number(questionCount) <= 0) {
      setErrorNotice('Number of questions must be greater than zero.');
      return;
    }
    if (Number(totalMarks) <= 0) {
      setErrorNotice('The requested marks distribution cannot be satisfied.');
      return;
    }
    if (selectedTopics.length === 0) {
      setErrorNotice('Please select at least one topic.');
      return;
    }

    setErrorNotice(null);
    setIsGenerating(true);
    setCurrentProgressStep(1);
    setLivePipelineLogs([]);

    const config = {
      subject,
      courseCode,
      examTitle,
      institutionName,
      department,
      durationHours,
      totalMarks: Number(totalMarks),
      questionCount: Number(questionCount),
      questionType,
      selectedTopics,
      sortAlgorithm,
      difficultyDistribution: {
        Easy: difficultyDist.Easy / 100,
        Medium: difficultyDist.Medium / 100,
        Hard: difficultyDist.Hard / 100
      },
      enableCustomTopicDistribution,
      topicDistribution,
      randomSeed: Date.now()
    };

    const result = PaperGeneratorEngine.generatePaper(questions, config);

    let step = 1;
    const interval = setInterval(() => {
      if (step <= 10 && result.pipelineLog[step - 1]) {
        setCurrentProgressStep(step);
        setLivePipelineLogs(prev => [...prev, result.pipelineLog[step - 1]]);
        step++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);

        if (result.success) {
          setGeneratedResult(result);
          setSelectedPaperForPreview(result);
          saveGeneratedPaper(result);
          setActiveSetKey('Set A');

          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore
          }
          addToast('Question Paper generated successfully! Displaying below.', 'success');
        } else {
          setErrorNotice(result.error || 'Failed to generate paper with given constraints.');
          addToast(result.error || 'Failed to generate paper', 'error');
        }
      }
    }, 80);
  };

  // Active Questions in Generated Paper
  const activeQuestions = generatedResult 
    ? (generatedResult.paperSets && generatedResult.paperSets[activeSetKey] 
        ? generatedResult.paperSets[activeSetKey].questions 
        : generatedResult.questions)
    : [];

  const totalCalculatedMarks = activeQuestions.reduce((sum, q) => sum + Number(q.marks), 0);

  // Group into Sections
  const partA = activeQuestions.filter(q => Number(q.marks) <= 2);
  const partB = activeQuestions.filter(q => Number(q.marks) > 2 && Number(q.marks) <= 5);
  const partC = activeQuestions.filter(q => Number(q.marks) > 5);

  // Export & Download Actions
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!generatedResult) return;
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const inst = institutionName.toUpperCase();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(inst, 105, 16, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(department, 105, 22, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(examTitle.toUpperCase(), 105, 28, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`SUBJECT: ${subject.toUpperCase()} (${courseCode})`, 15, 36);
      doc.text(`SET: ${activeSetKey}`, 105, 36, { align: 'center' });
      doc.text(`MAX MARKS: ${totalCalculatedMarks}`, 195, 36, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text(`TIME: ${durationHours}`, 15, 41);
      doc.text(`PAPER ID: ${generatedResult.paperId}`, 195, 41, { align: 'right' });
      doc.setLineWidth(0.5);
      doc.line(15, 44, 195, 44);

      let y = 52;
      doc.setFontSize(10);

      const renderSection = (title, list, startNum) => {
        if (list.length === 0) return startNum;
        if (y > 255) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 4, 180, 6, 'F');
        doc.text(title, 17, y);
        y += 7;

        list.forEach((q, idx) => {
          if (y > 265) { doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold');
          doc.text(`Q${startNum + idx}.`, 15, y);
          doc.setFont('helvetica', 'normal');
          const splitText = doc.splitTextToSize(q.text, 150);
          doc.text(splitText, 25, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`[${q.marks}M]`, 195, y, { align: 'right' });
          y += (splitText.length * 5) + 1;

          if (q.questionType === 'MCQ' && q.options && q.options.length > 0) {
            q.options.forEach((opt, oIdx) => {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.setFont('helvetica', 'normal');
              doc.text(`${String.fromCharCode(65 + oIdx)}. ${opt}`, 30, y);
              y += 4.5;
            });
          }
          y += 2;
        });
        y += 3;
        return startNum + list.length;
      };

      let nextQ = 1;
      nextQ = renderSection('PART A: Short Answer / Conceptual Questions (2 Marks Each)', partA, nextQ);
      nextQ = renderSection('PART B: Analytical & Application Problems (5 Marks Each)', partB, nextQ);
      renderSection('PART C: Comprehensive Design Problems (10-15 Marks Each)', partC, nextQ);

      if (y > 260) { doc.addPage(); y = 20; }
      doc.setLineWidth(0.5);
      doc.line(15, y + 4, 195, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Marks: ${totalCalculatedMarks}`, 195, y + 10, { align: 'right' });

      doc.save(`${courseCode}_${activeSetKey}_Question_Paper.pdf`);
      addToast(`PDF (${activeSetKey}) downloaded!`, 'success');
      setShowDownloadMenu(false);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  const handleDownloadWord = () => {
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${subject} Question Paper</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
          .inst { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
          .dept { font-size: 10pt; font-weight: bold; }
          .exam { font-size: 12pt; font-weight: bold; margin-top: 4px; }
          .meta-table { width: 100%; border-bottom: 1px solid #000; margin-bottom: 12px; font-size: 10pt; }
          .section-head { background: #f0f0f0; font-weight: bold; padding: 4px; border-left: 4px solid #000; margin: 12px 0 6px 0; }
          .q-row { margin-bottom: 8px; display: table; width: 100%; }
          .q-num { font-weight: bold; width: 30px; display: table-cell; }
          .q-text { display: table-cell; }
          .q-marks { font-weight: bold; width: 80px; text-align: right; display: table-cell; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="inst">${institutionName}</div>
          <div class="dept">${department}</div>
          <div class="exam">${examTitle}</div>
          <div style="font-weight:bold; margin-top:4px;">QUESTION PAPER — ${activeSetKey}</div>
        </div>
        <table class="meta-table">
          <tr>
            <td><strong>Subject:</strong> ${subject}</td>
            <td><strong>Course Code:</strong> ${courseCode}</td>
            <td align="right"><strong>Max Marks:</strong> ${totalCalculatedMarks}</td>
          </tr>
          <tr>
            <td><strong>Duration:</strong> ${durationHours}</td>
            <td><strong>Paper ID:</strong> ${generatedResult.paperId}</td>
            <td align="right"><strong>Date:</strong> ${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
        <p><strong>Instructions:</strong> Answer all questions. Draw neat diagrams where necessary.</p>
    `;

    let qCount = 1;
    const appendSectionHtml = (title, list) => {
      if (list.length === 0) return;
      content += `<div class="section-head">${title}</div>`;
      list.forEach(q => {
        content += `
          <div class="q-row">
            <span class="q-num">Q${qCount}.</span>
            <span class="q-text">${q.text}</span>
            <span class="q-marks">[${q.marks} Marks]</span>
          </div>
        `;
        if (q.questionType === 'MCQ' && q.options && q.options.length > 0) {
          content += `<div style="margin-left:30px; margin-top:4px;">`;
          q.options.forEach((opt, oIdx) => {
            content += `<div>${String.fromCharCode(65 + oIdx)}. ${opt}</div>`;
          });
          content += `</div>`;
        }
        qCount++;
      });
    };

    appendSectionHtml('PART A: Short / Conceptual Questions (2 Marks Each)', partA);
    appendSectionHtml('PART B: Analytical & Application Problems (5 Marks Each)', partB);
    appendSectionHtml('PART C: Comprehensive Design & Long Problems (10-15 Marks Each)', partC);

    content += `
        <div style="border-top:1px solid #000; margin-top:20px; padding-top:8px; font-weight:bold; text-align:right;">Total Marks: ${totalCalculatedMarks}</div>
      </body></html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${courseCode}_${activeSetKey}_Question_Paper.doc`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    addToast('Word Document (.doc) downloaded successfully!', 'success');
    setShowDownloadMenu(false);
  };

  // =========================================================================
  // VIEW MODE 1: IF GENERATED PAPER EXISTS, DISPLAY IT DIRECTLY ON SCREEN
  // =========================================================================
  if (generatedResult) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">
        {/* Top Control Bar with Back, Set Switchers, Download & Print */}
        <div className="no-print p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-xl">
          {/* Left: Back Button & Set Tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGeneratedResult(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Form / New Paper</span>
            </button>

            {/* Set Switchers */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {['Set A', 'Set B', 'Set C', 'Set D'].map(setName => (
                <button
                  key={setName}
                  onClick={() => setActiveSetKey(setName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSetKey === setName
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {setName}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                showMetadata
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {showMetadata ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showMetadata ? 'Hide Topic Tags' : 'Show Topic Tags'}</span>
            </button>

            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                showAnswerKey
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{showAnswerKey ? 'Show Question Paper' : 'View Scheme of Valuation'}</span>
            </button>
          </div>

          {/* Right: Actions (Download Options, Print, Regenerate) */}
          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
              title="Regenerate with randomized seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>

            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Options ▾</span>
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <FileType className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="block font-bold">Download PDF</span>
                      <span className="text-[10px] text-slate-400 font-normal">Print-ready A4 document</span>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadWord}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="block font-bold">Download Word (.doc)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Editable in MS Word</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Paper</span>
            </button>
          </div>
        </div>

        {/* Algorithm Badge Banner */}
        <div className="no-print p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Algorithm Strategy: <strong className="text-white">{generatedResult.algorithmMethodUsed}</strong></span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">
            ⚡ 10-Step DSA Pipeline Solved in {generatedResult.totalExecutionTimeMs} ms
          </span>
        </div>

        {/* THE QUESTION PAPER DESIGN (Rendered on screen) */}
        {!showAnswerKey ? (
          <div className="printable-paper bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 max-w-4xl mx-auto font-serif relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <GraduationCap className="w-[500px] h-[500px] text-slate-900" />
            </div>

            {/* Academic Header (Designed by User) */}
            <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-sans">
                {institutionName}
              </h2>
              <p className="text-xs text-slate-700 font-sans uppercase tracking-widest font-semibold">
                {department}
              </p>
              <h3 className="text-base sm:text-lg font-bold font-sans mt-2 uppercase tracking-wide text-slate-800">
                {examTitle}
              </h3>
              <div className="pt-2 flex items-center justify-center gap-2 font-sans font-black text-xs text-indigo-900">
                <span className="px-3 py-0.5 rounded border border-indigo-900 bg-indigo-50">QUESTION PAPER — {activeSetKey}</span>
              </div>
            </div>

            {/* Paper Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4 border-b border-slate-400 font-sans text-xs">
              <div>
                <span className="text-slate-600">Course / Subject:</span>{' '}
                <strong className="text-slate-900">{subject}</strong>
              </div>
              <div>
                <span className="text-slate-600">Course Code:</span>{' '}
                <strong className="text-slate-900 font-mono">{courseCode}</strong>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-600">Max Marks:</span>{' '}
                <strong className="text-slate-900 font-mono text-sm">{totalCalculatedMarks}</strong>
              </div>
              <div>
                <span className="text-slate-600">Duration:</span>{' '}
                <strong className="text-slate-900">{durationHours}</strong>
              </div>
              <div>
                <span className="text-slate-600">Paper ID:</span>{' '}
                <strong className="text-slate-900 font-mono">{generatedResult.paperId}</strong>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-600">Date:</span>{' '}
                <strong className="text-slate-900">{new Date(generatedResult.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>

            {/* General Instructions */}
            <div className="py-3 text-[11px] font-sans text-slate-700 border-b border-slate-200">
              <strong>Instructions to Candidates:</strong> Answer all questions. Assume suitable missing data if necessary. Draw clear algorithms and diagrams where required.
            </div>

            {/* QUESTIONS LISTING */}
            <div className="py-6 space-y-6">
              {/* PART A */}
              {partA.length > 0 && (
                <div className="space-y-4">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 text-slate-800">
                    Part A: Short / Conceptual Questions (2 Marks Each)
                  </div>
                  <div className="space-y-4 pl-2">
                    {partA.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-2">
                        <div className="flex items-start justify-between gap-4 text-sm leading-relaxed">
                          <div className="flex-1">
                            <span className="font-bold font-sans mr-2">Q{idx + 1}.</span>
                            <span className="text-slate-900">{q.text}</span>
                          </div>
                          <span className="font-sans font-bold text-xs text-slate-900 shrink-0 font-mono">
                            [{q.marks} Marks]
                          </span>
                        </div>

                        {q.questionType === 'MCQ' && q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pl-6 font-sans text-xs text-slate-800">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx}>
                                <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {showMetadata && (
                          <div className="pl-6 font-sans flex items-center gap-2 text-[10px] text-slate-500">
                            <span>Topic: <strong>{q.topic}</strong> (Unit {q.unit})</span>
                            <span>•</span>
                            <span>Difficulty: <strong>{q.difficulty}</strong></span>
                            <span>•</span>
                            <span>Type: <strong>{q.questionType}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PART B */}
              {partB.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 text-slate-800">
                    Part B: Analytical & Application Problems (5 Marks Each)
                  </div>
                  <div className="space-y-4 pl-2">
                    {partB.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-2">
                        <div className="flex items-start justify-between gap-4 text-sm leading-relaxed">
                          <div className="flex-1">
                            <span className="font-bold font-sans mr-2">Q{partA.length + idx + 1}.</span>
                            <span className="text-slate-900">{q.text}</span>
                          </div>
                          <span className="font-sans font-bold text-xs text-slate-900 shrink-0 font-mono">
                            [{q.marks} Marks]
                          </span>
                        </div>

                        {showMetadata && (
                          <div className="pl-6 font-sans flex items-center gap-2 text-[10px] text-slate-500">
                            <span>Topic: <strong>{q.topic}</strong> (Unit {q.unit})</span>
                            <span>•</span>
                            <span>Difficulty: <strong>{q.difficulty}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PART C */}
              {partC.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 text-slate-800">
                    Part C: Comprehensive Design & Implementation Problems (10-15 Marks Each)
                  </div>
                  <div className="space-y-4 pl-2">
                    {partC.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-2">
                        <div className="flex items-start justify-between gap-4 text-sm leading-relaxed">
                          <div className="flex-1">
                            <span className="font-bold font-sans mr-2">Q{partA.length + partB.length + idx + 1}.</span>
                            <span className="text-slate-900">{q.text}</span>
                          </div>
                          <span className="font-sans font-bold text-xs text-slate-900 shrink-0 font-mono">
                            [{q.marks} Marks]
                          </span>
                        </div>

                        {showMetadata && (
                          <div className="pl-6 font-sans flex items-center gap-2 text-[10px] text-slate-500">
                            <span>Topic: <strong>{q.topic}</strong> (Unit {q.unit})</span>
                            <span>•</span>
                            <span>Difficulty: <strong>{q.difficulty}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Paper Footer */}
            <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans text-xs text-slate-700">
              <div>
                <strong>Total Marks: {totalCalculatedMarks}</strong> (All Sections)
              </div>
              <div className="text-center text-[10px] text-slate-500 italic">
                *** END OF QUESTION PAPER ({activeSetKey}) ***
              </div>
              <div className="sm:text-right text-[10px] text-slate-400">
                Validated by DSA Pipeline
              </div>
            </div>
          </div>
        ) : (
          /* ANSWER KEY / SCHEME OF VALUATION */
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  <span>Scheme of Valuation & Model Answer Key ({activeSetKey})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Faculty evaluation rubric and model solutions</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                Total {totalCalculatedMarks} Marks
              </span>
            </div>

            <div className="space-y-4">
              {activeQuestions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-400 font-mono">Question {idx + 1} ({q.marks} Marks)</span>
                    <span className="text-xs text-slate-400">{q.topic} • Unit {q.unit}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{q.text}</p>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Model Solution / Key Points:</span>
                    <p className="text-slate-200 leading-relaxed">{q.answer || 'Standard proof, correct time complexity deduction and edge-case handling.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: CONFIGURATION FORM (When paper is not yet generated)
  // =========================================================================
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Automated 10-Stage Algorithmic Pipeline</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Generate Question Paper
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Configure syllabus parameters, marks constraints, and difficulty targets. The system executes Dynamic Programming 0/1 Knapsack, Network Flow balancing, and KMP duplicate elimination to synthesize your customized question paper.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Settings (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Institution & Exam Specifications */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>1. Exam & Institution Header Design</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Institution / University</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Exam Title</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Duration</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                >
                  <option value="1.5 Hours">1.5 Hours (Internal Test)</option>
                  <option value="2.0 Hours">2.0 Hours (Mid-Term)</option>
                  <option value="3.0 Hours">3.0 Hours (End-Semester Exam)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Marks & Knapsack DP Constraints */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>2. Marks & Knapsack DP Constraints</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Total Marks Target
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="150"
                    step="5"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">Marks</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Target Question Count
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-purple-400 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">Questions</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Question Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                >
                  <option value="Mixed">Mixed (All Types)</option>
                  <option value="MCQ">MCQ Only</option>
                  <option value="Short Answer">Short Answer Only</option>
                  <option value="Descriptive">Descriptive Only</option>
                </select>
              </div>
            </div>

            {/* Sorting Algorithm for Question Paper sections */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Exam Sections Sorting Algorithm:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSortAlgorithm('MergeSort')}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] ${
                    sortAlgorithm === 'MergeSort'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Merge Sort (Stable)
                </button>
                <button
                  type="button"
                  onClick={() => setSortAlgorithm('QuickSort')}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] ${
                    sortAlgorithm === 'QuickSort'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Quick Sort
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Topics Selection */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>3. Topic & Syllabus Coverage ({selectedTopics.length}/{DSA_TOPICS.length} Selected)</span>
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllTopics}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Select All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleDeselectAllTopics}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DSA_TOPICS.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                const countAvailable = questions.filter(q => q.topic === topic).length;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleToggleTopic(topic)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{topic}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900/60 px-1.5 py-0.5 rounded">
                      {countAvailable}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Difficulty Balance & GENERATE Button */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Difficulty Balance</span>
            </h2>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => applyDifficultyPreset('Balanced')}
                className="py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Balanced (40/40/20)
              </button>
              <button
                type="button"
                onClick={() => applyDifficultyPreset('Easy')}
                className="py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Easy Focus
              </button>
              <button
                type="button"
                onClick={() => applyDifficultyPreset('Rigorous')}
                className="py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Rigorous
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Easy Questions:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-200">{difficultyDist.Easy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={difficultyDist.Easy}
                  onChange={(e) => handleDifficultyChange('Easy', e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Medium Questions:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-200">{difficultyDist.Medium}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={difficultyDist.Medium}
                  onChange={(e) => handleDifficultyChange('Medium', e.target.value)}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Hard Questions:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-200">{difficultyDist.Hard}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={difficultyDist.Hard}
                  onChange={(e) => handleDifficultyChange('Hard', e.target.value)}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 leading-relaxed">
              * The <strong>Network Flow</strong> balancer balances difficulty quotas across selected topics.
            </div>
          </div>

          {/* Multiple Sets Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 uppercase tracking-wider">Multi-Set Generator</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Fisher-Yates</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Generates <strong>Set A, Set B, Set C, Set D</strong> concurrently with unbiased permutations and syllabus parity.
            </p>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Generation Error:</strong>
                <span>{errorNotice}</span>
              </div>
            </div>
          )}

          {/* GENERATE QUESTION PAPER BUTTON */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-indigo-600/40 transition-all transform active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running DSA Pipeline (Step {currentProgressStep}/10)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>GENERATE QUESTION PAPER</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 10-STEP WORKFLOW PROGRESS OVERLAY (When Generating) */}
      {isGenerating && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                <span>Running Question Paper Generation Pipeline...</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Solving multi-constraint Knapsack DP and Network Flow</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {[
              { num: 1, label: 'User Requirements', algo: 'Form Validation' },
              { num: 2, label: 'Retrieve Questions', algo: 'Hash Table / B-Tree' },
              { num: 3, label: 'Duplicate Check', algo: 'KMP & Rabin-Karp' },
              { num: 4, label: 'Topic Constraints', algo: 'B-Tree Range' },
              { num: 5, label: 'Difficulty Constraints', algo: 'Category Quotas' },
              { num: 6, label: 'Randomize Pool', algo: 'Fisher-Yates O(N)' },
              { num: 7, label: 'Marks Optimization', algo: '0/1 Knapsack DP' },
              { num: 8, label: 'Topic Balancing', algo: 'Network Max Flow' },
              { num: 9, label: 'Approximation / Sort', algo: 'Merge / Quick Sort' },
              { num: 10, label: 'Final Paper Set', algo: 'Sets A, B, C, D' }
            ].map(step => {
              const isDone = livePipelineLogs.length >= step.num;
              const isCurrent = currentProgressStep === step.num;

              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500 animate-pulse text-indigo-200'
                        : 'bg-slate-800/30 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold">
                      {isDone ? `✓ Step ${step.num}` : `Step ${step.num}`}
                    </span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="font-bold truncate text-slate-200">{step.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{step.algo}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
