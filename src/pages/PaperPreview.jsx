import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Save, 
  RotateCcw, 
  FileText, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  KeyRound,
  GraduationCap,
  Award,
  FileType,
  FileCode2,
  FileCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import { DifficultyBadge, MarksBadge, TypeBadge } from '../components/Badge';

export function PaperPreview() {
  const { 
    selectedPaperForPreview, 
    setSelectedPaperForPreview, 
    saveGeneratedPaper, 
    setActiveTab, 
    settings,
    addToast
  } = useApp();

  const paper = selectedPaperForPreview;

  // View state
  const [activeSetKey, setActiveSetKey] = useState('Set A');
  const [showMetadata, setShowMetadata] = useState(false); // Hide topic/difficulty for clean student exam print
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  if (!paper) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4">
        <FileText className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-lg font-bold text-white">No Question Paper Selected</h2>
        <p className="text-xs text-slate-400">Generate a new paper or select one from the Generated Papers archive.</p>
        <button
          onClick={() => setActiveTab('generate')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          Go to Paper Generator →
        </button>
      </div>
    );
  }

  // Active question set
  const activeQuestions = paper.paperSets && paper.paperSets[activeSetKey] 
    ? paper.paperSets[activeSetKey].questions 
    : paper.questions || [];

  const totalCalculatedMarks = activeQuestions.reduce((sum, q) => sum + Number(q.marks), 0);

  // Group into Sections
  const partA = activeQuestions.filter(q => Number(q.marks) <= 2);
  const partB = activeQuestions.filter(q => Number(q.marks) > 2 && Number(q.marks) <= 5);
  const partC = activeQuestions.filter(q => Number(q.marks) > 5);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // 1. PDF Download Handler
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const instName = paper.institutionName || settings.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY';
      const deptName = paper.department || settings.department || 'Department of Computer Science & Engineering';

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(instName.toUpperCase(), 105, 16, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(deptName, 105, 22, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(paper.examTitle || 'END-SEMESTER EXAMINATION 2026', 105, 28, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`SUBJECT: ${paper.subject.toUpperCase()} (${paper.courseCode || 'CS301-DSA'})`, 15, 36);
      doc.text(`SET: ${activeSetKey}`, 105, 36, { align: 'center' });
      doc.text(`MAX MARKS: ${totalCalculatedMarks}`, 195, 36, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.text(`TIME: ${paper.durationHours || '3.0 Hours'}`, 15, 41);
      doc.text(`PAPER ID: ${paper.paperId || paper.id}`, 195, 41, { align: 'right' });

      doc.setLineWidth(0.5);
      doc.line(15, 44, 195, 44);

      // Section Questions
      let y = 52;
      doc.setFontSize(10);

      const renderSection = (title, questionsList, startNum) => {
        if (questionsList.length === 0) return startNum;

        if (y > 255) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 4, 180, 6, 'F');
        doc.text(title, 17, y);
        y += 7;

        questionsList.forEach((q, idx) => {
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
        return startNum + questionsList.length;
      };

      let nextQ = 1;
      nextQ = renderSection('PART A: Short Answer / Conceptual Questions (2 Marks Each)', partA, nextQ);
      nextQ = renderSection('PART B: Analytical & Application Problems (5 Marks Each)', partB, nextQ);
      renderSection('PART C: Comprehensive Design Problems (10-15 Marks Each)', partC, nextQ);

      // Footer
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setLineWidth(0.5);
      doc.line(15, y + 4, 195, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Marks: ${totalCalculatedMarks}`, 195, y + 10, { align: 'right' });
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('Generated via Automated Question Bank System • Powered by DSA Optimization Pipeline', 105, y + 10, { align: 'center' });

      doc.save(`${(paper.courseCode || 'DSA').replace(/\s+/g, '_')}_${activeSetKey.replace(/\s+/g, '_')}_Exam_Paper.pdf`);
      addToast(`PDF Question Paper (${activeSetKey}) downloaded!`, 'success');
      setShowDownloadMenu(false);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  // 2. Word / DOCX Format Download Handler
  const handleDownloadWord = () => {
    const instName = paper.institutionName || settings.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY';
    const deptName = paper.department || settings.department || 'Department of Computer Science & Engineering';

    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${paper.subject} Question Paper</title>
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
          .options { margin-left: 30px; margin-top: 4px; }
          .footer { border-top: 1px solid #000; margin-top: 20px; padding-top: 8px; font-size: 10pt; font-weight: bold; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="inst">${instName}</div>
          <div class="dept">${deptName}</div>
          <div class="exam">${paper.examTitle || 'END-SEMESTER EXAMINATION 2026'}</div>
          <div style="font-weight:bold; margin-top:4px;">QUESTION PAPER — ${activeSetKey}</div>
        </div>

        <table class="meta-table">
          <tr>
            <td><strong>Subject:</strong> ${paper.subject}</td>
            <td><strong>Course Code:</strong> ${paper.courseCode || 'CS301-DSA'}</td>
            <td align="right"><strong>Max Marks:</strong> ${totalCalculatedMarks}</td>
          </tr>
          <tr>
            <td><strong>Duration:</strong> ${paper.durationHours || '3.0 Hours'}</td>
            <td><strong>Paper ID:</strong> ${paper.paperId || paper.id}</td>
            <td align="right"><strong>Date:</strong> ${new Date(paper.createdAt).toLocaleDateString()}</td>
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
          content += `<div class="options">`;
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
        <div class="footer">Total Marks: ${totalCalculatedMarks} (All Sections)</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${(paper.courseCode || 'DSA').replace(/\s+/g, '_')}_${activeSetKey.replace(/\s+/g, '_')}_Question_Paper.doc`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    addToast(`Word Document (.doc) downloaded successfully!`, 'success');
    setShowDownloadMenu(false);
  };

  // 3. Plain Text / Markdown Format Download
  const handleDownloadText = () => {
    let textContent = `============================================================\n`;
    textContent += `${(paper.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY').toUpperCase()}\n`;
    textContent += `${(paper.department || 'Department of Computer Science & Engineering')}\n`;
    textContent += `${paper.examTitle || 'END-SEMESTER EXAMINATION 2026'}\n`;
    textContent += `QUESTION PAPER: ${activeSetKey}\n`;
    textContent += `============================================================\n`;
    textContent += `Subject: ${paper.subject} (${paper.courseCode || 'CS301-DSA'})\n`;
    textContent += `Duration: ${paper.durationHours || '3.0 Hours'} | Max Marks: ${totalCalculatedMarks}\n`;
    textContent += `Paper ID: ${paper.paperId || paper.id}\n`;
    textContent += `------------------------------------------------------------\n\n`;

    activeQuestions.forEach((q, idx) => {
      textContent += `Q${idx + 1}. ${q.text}  [${q.marks} Marks]\n`;
      if (q.questionType === 'MCQ' && q.options && q.options.length > 0) {
        q.options.forEach((opt, oIdx) => {
          textContent += `   ${String.fromCharCode(65 + oIdx)}. ${opt}\n`;
        });
      }
      textContent += `\n`;
    });

    textContent += `============================================================\n`;
    textContent += `Total Marks: ${totalCalculatedMarks}\n`;
    textContent += `Generated by Automated Question Bank System (DSA Engine)\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(paper.courseCode || 'DSA')}_${activeSetKey}_Question_Paper.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Plain Text (.txt) Question Paper downloaded!', 'success');
    setShowDownloadMenu(false);
  };

  // 4. Download Answer Key & Scheme of Valuation
  const handleDownloadAnswerKey = () => {
    let content = `============================================================\n`;
    content += `SCHEME OF VALUATION & MODEL ANSWER KEY (${activeSetKey})\n`;
    content += `Subject: ${paper.subject} (${paper.courseCode || 'CS301-DSA'})\n`;
    content += `Total Marks: ${totalCalculatedMarks}\n`;
    content += `============================================================\n\n`;

    activeQuestions.forEach((q, idx) => {
      content += `[Q${idx + 1}] (${q.marks} Marks) [Topic: ${q.topic}, Unit ${q.unit}]\n`;
      content += `Question: ${q.text}\n`;
      content += `Solution Key / Marking Scheme:\n${q.answer || 'Standard proof and algorithm diagram.'}\n\n`;
      content += `------------------------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(paper.courseCode || 'DSA')}_${activeSetKey}_Answer_Key.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Answer Key & Marking Scheme downloaded!', 'success');
    setShowDownloadMenu(false);
  };

  const handleSaveToArchive = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveGeneratedPaper(paper);
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Control Bar (Hidden during Print) */}
      <div className="no-print p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back & Set Selectors */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('generate')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Generator"
          >
            <ArrowLeft className="w-4 h-4" />
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
            <span>{showMetadata ? 'Hide Topic Tags' : 'Show Tags'}</span>
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
            <span>{showAnswerKey ? 'Show Question Paper' : 'View Answer Key'}</span>
          </button>
        </div>

        {/* Right: Actions (Save, Download Options, Print) */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleSaveToArchive}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>Save Paper</span>
          </button>

          {/* Download Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Options ▾</span>
            </button>

            {/* Dropdown Menu */}
            {showDownloadMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <FileType className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="block">Download PDF Document</span>
                    <span className="text-[10px] text-slate-400 font-normal">Print-ready A4 PDF</span>
                  </div>
                </button>

                <button
                  onClick={handleDownloadWord}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="block">Download Word (.doc)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Editable in MS Word</span>
                  </div>
                </button>

                <button
                  onClick={handleDownloadText}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="block">Download Text / Markdown</span>
                    <span className="text-[10px] text-slate-400 font-normal">Raw plain text format</span>
                  </div>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={handleDownloadAnswerKey}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="block">Download Answer Key</span>
                    <span className="text-[10px] text-slate-400 font-normal">Valuation & solutions</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Direct Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* QUESTION PAPER PREVIEW CARD (Optimized for Screen & Print) */}
      {!showAnswerKey ? (
        <div className="printable-paper bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 max-w-4xl mx-auto font-serif relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <GraduationCap className="w-[500px] h-[500px] text-slate-900" />
          </div>

          {/* Academic Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-sans">
              {paper.institutionName || settings.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY'}
            </h2>
            <p className="text-xs text-slate-700 font-sans uppercase tracking-widest font-semibold">
              {paper.department || settings.department || 'Department of Computer Science & Engineering'}
            </p>
            <h3 className="text-base sm:text-lg font-bold font-sans mt-2 uppercase tracking-wide text-slate-800">
              {paper.examTitle || 'END-SEMESTER EXAMINATION 2026'}
            </h3>
            <div className="pt-2 flex items-center justify-center gap-2 font-sans font-black text-xs text-indigo-900">
              <span className="px-3 py-0.5 rounded border border-indigo-900 bg-indigo-50">QUESTION PAPER — {activeSetKey}</span>
            </div>
          </div>

          {/* Paper Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4 border-b border-slate-400 font-sans text-xs">
            <div>
              <span className="text-slate-600">Course / Subject:</span>{' '}
              <strong className="text-slate-900">{paper.subject}</strong>
            </div>
            <div>
              <span className="text-slate-600">Course Code:</span>{' '}
              <strong className="text-slate-900 font-mono">{paper.courseCode || 'CS301-DSA'}</strong>
            </div>
            <div className="sm:text-right">
              <span className="text-slate-600">Max Marks:</span>{' '}
              <strong className="text-slate-900 font-mono text-sm">{totalCalculatedMarks}</strong>
            </div>
            <div>
              <span className="text-slate-600">Duration:</span>{' '}
              <strong className="text-slate-900">{paper.durationHours || '3.0 Hours'}</strong>
            </div>
            <div>
              <span className="text-slate-600">Paper ID:</span>{' '}
              <strong className="text-slate-900 font-mono">{paper.paperId || paper.id}</strong>
            </div>
            <div className="sm:text-right">
              <span className="text-slate-600">Date:</span>{' '}
              <strong className="text-slate-900">{new Date(paper.createdAt).toLocaleDateString()}</strong>
            </div>
          </div>

          {/* General Instructions */}
          <div className="py-3 text-[11px] font-sans text-slate-700 border-b border-slate-200">
            <strong>Instructions to Candidates:</strong> Answer all questions. Assume suitable missing data if necessary. Draw clear algorithms/diagrams where required.
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

                      {/* MCQ Options if any */}
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
              Validated by DSA Generator
            </div>
          </div>
        </div>
      ) : (
        /* ANSWER KEY & VALUATION SCHEME VIEW */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <span>Scheme of Valuation & Model Answer Key ({activeSetKey})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Faculty evaluation rubric and model answers</p>
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
