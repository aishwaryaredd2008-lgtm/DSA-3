import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Bell, 
  UserCheck, 
  Cpu, 
  ShieldAlert, 
  Layers, 
  FileText,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar({ onOpenSearch }) {
  const { currentUser, setCurrentUser, getDsaEngineStats, setActiveTab, activeTab } = useApp();
  const stats = getDsaEngineStats();

  const handleToggleRole = () => {
    if (currentUser.role === 'Admin') {
      setCurrentUser({
        id: 'usr-fac-02',
        name: 'Prof. Alan Turing',
        email: 'faculty@univ.edu',
        role: 'Faculty/Teacher',
        avatar: 'AT'
      });
    } else {
      setCurrentUser({
        id: 'usr-admin-01',
        name: 'Dr. Sarah Jenkins',
        email: 'admin@univ.edu',
        role: 'Admin',
        avatar: 'SJ'
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80">
      {/* Search Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all shadow-inner group"
        >
          <Search className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Search questions by ID (Hash Table), Topic (B-Tree), Keyword (KMP)...</span>
          <span className="sm:hidden">Quick Search...</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">⌘K</span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* DSA Status Indicator */}
        <button
          onClick={() => setActiveTab('visualizer')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 transition-colors text-xs font-medium"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
          <span>DSA Engine: Active (O(1) Hash / O(log N) B-Tree)</span>
        </button>

        {/* Duplicate Scanner status */}
        {stats.duplicateCount > 0 && (
          <button
            onClick={() => setActiveTab('duplicates')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 transition-colors text-xs font-medium"
            title={`${stats.duplicateCount} Duplicate pairs detected via KMP & Rabin-Karp`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{stats.duplicateCount} Duplicates</span>
          </button>
        )}

        {/* Role Switcher Pill */}
        <button
          onClick={handleToggleRole}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          title="Click to switch role (Admin <-> Faculty)"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {currentUser.avatar}
          </div>
          <div className="text-left hidden sm:block">
            <div className="leading-tight font-semibold text-slate-100">{currentUser.name}</div>
            <div className="text-[10px] text-indigo-400 font-mono">{currentUser.role}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
