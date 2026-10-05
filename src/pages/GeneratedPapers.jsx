import React, { useState } from 'react';
import { 
  Files, 
  Eye, 
  Trash2, 
  Printer, 
  Download, 
  RotateCcw, 
  Plus, 
  Search, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import { MarksBadge } from '../components/Badge';
import { Modal } from '../components/Modal';

export function GeneratedPapers() {
  const { 
    generatedPapers, 
    deleteGeneratedPaper, 
    setSelectedPaperForPreview, 
    setActiveTab, 
    settings,
    addToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredPapers = generatedPapers.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.id || p.paperId || '').toLowerCase().includes(term) ||
      (p.subject || '').toLowerCase().includes(term) ||
      (p.examTitle || '').toLowerCase().includes(term)
    );
  });

  const handleOpenPreview = (paper) => {
    setSelectedPaperForPreview(paper);
    setActiveTab('preview');
  };

  const handleQuickDownloadPDF = (paper) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const instName = paper.institutionName || settings.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY';
      const deptName = paper.department || settings.department || 'Department of Computer Science & Engineering';
      const questionsList = paper.questions || [];
      const totalMarks = questionsList.reduce((sum, q) => sum + Number(q.marks), 0);

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
      doc.text(`SUBJECT: ${paper.subject.toUpperCase()} (${paper.courseCode || 'CS301-DSA'})`, 15, 36);
      doc.text(`MAX MARKS: ${totalMarks}`, 195, 36, { align: 'right' });
      doc.setLineWidth(0.5);
      doc.line(15, 42, 195, 42);

      let y = 50;
      doc.setFontSize(10);
      questionsList.forEach((q, idx) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text(`Q${idx + 1}.`, 15, y);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(q.text, 150);
        doc.text(splitText, 25, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`[${q.marks}M]`, 195, y, { align: 'right' });
        y += (splitText.length * 5) + 3;
      });

      doc.setLineWidth(0.5);
      doc.line(15, y + 4, 195, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Marks: ${totalMarks}`, 195, y + 10, { align: 'right' });

      doc.save(`${(paper.courseCode || 'DSA').replace(/\s+/g, '_')}_Question_Paper.pdf`);
      addToast(`PDF for ${paper.paperId || paper.id} downloaded!`, 'success');
    } catch (e) {
      console.error(e);
      handleOpenPreview(paper);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Files className="w-6 h-6 text-indigo-400" />
            <span>Generated Question Papers Repository</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-medium">
              {generatedPapers.length} Saved
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, view, reprint and export previously generated exam paper sets (Sets A, B, C, D).
          </p>
        </div>

        <button
          onClick={() => setActiveTab('generate')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Paper</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search paper by ID, subject, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-slate-200">{filteredPapers.length}</strong> of {generatedPapers.length} papers
        </div>
      </div>

      {/* Papers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/75 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Paper ID</th>
                <th className="p-4 min-w-[200px]">Subject & Title</th>
                <th className="p-4">Total Marks</th>
                <th className="p-4">Questions</th>
                <th className="p-4">Sets Available</th>
                <th className="p-4">Date Created</th>
                <th className="p-4">Created By</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredPapers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No question papers in archive.</p>
                    <p className="text-xs text-slate-500 mt-1">Use the Generate Paper module to create balanced question papers.</p>
                  </td>
                </tr>
              ) : (
                filteredPapers.map((paper) => {
                  const paperId = paper.paperId || paper.id;
                  return (
                    <tr key={paperId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-400">
                        {paperId}
                      </td>
                      <td className="p-4 text-slate-200">
                        <div className="font-bold text-white">{paper.subject}</div>
                        <div className="text-[11px] text-slate-400">{paper.examTitle || 'End-Semester Examination'}</div>
                      </td>
                      <td className="p-4">
                        <MarksBadge marks={paper.totalMarks} />
                      </td>
                      <td className="p-4 font-mono">
                        {paper.questionCount} Questions
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
                          Sets A, B, C, D
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(paper.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-300">
                        {paper.createdBy || 'Dr. Sarah Jenkins'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenPreview(paper)}
                            title="Preview & Format Sets"
                            className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickDownloadPDF(paper)}
                            title="Direct Download PDF"
                            className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenPreview(paper)}
                            title="Print Paper"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(paperId)}
                            title="Delete Paper"
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Paper Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete paper <strong className="text-indigo-400 font-mono">{deleteConfirmId}</strong> from the archives?
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
                deleteGeneratedPaper(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-500 shadow-md"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
