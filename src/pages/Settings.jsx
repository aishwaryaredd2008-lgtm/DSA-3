import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  School, 
  ShieldAlert,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { settings, setSettings, questions, generatedPapers, resetToFactoryDefaults, addToast } = useApp();

  const [formData, setFormData] = useState(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    addToast('Institution settings saved successfully!', 'success');
  };

  const handleExportDatabase = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      institution: formData.institutionName,
      questionsCount: questions.length,
      papersCount: generatedPapers.length,
      questions,
      generatedPapers,
      settings: formData
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `question_bank_database_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Complete database exported as JSON!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          <span>System & Institution Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure university branding, default examination marks, grading criteria, and database backups.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* University & Department Details */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-400" />
            <span>Institution & Examination Header</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">University / College Name</label>
              <input
                type="text"
                required
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Department Name</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Default Course Code</label>
              <input
                type="text"
                value={formData.defaultCourseCode}
                onChange={(e) => setFormData({ ...formData, defaultCourseCode: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Default Exam Duration</label>
              <input
                type="text"
                value={formData.defaultExamDuration}
                onChange={(e) => setFormData({ ...formData, defaultExamDuration: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Default Generator Presets */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Default Paper Generator Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Default Total Marks</label>
              <input
                type="number"
                value={formData.defaultTotalMarks}
                onChange={(e) => setFormData({ ...formData, defaultTotalMarks: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Default Question Count</label>
              <input
                type="number"
                value={formData.defaultQuestionCount}
                onChange={(e) => setFormData({ ...formData, defaultQuestionCount: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </form>

      {/* Database Management & Factory Reset */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span>Database Management & Backup</span>
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Export the entire question bank, generated papers archive, and system state as JSON, or restore initial sample DSA questions.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportDatabase}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Database (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database to Initial DSA Sample Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Mini Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Reset Database?</h3>
            <p className="text-xs text-slate-400">
              This will restore the 30 initial Data Structures and Algorithms questions and clear all custom generated papers.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToFactoryDefaults();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
