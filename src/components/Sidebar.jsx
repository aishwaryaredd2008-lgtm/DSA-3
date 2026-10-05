import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  PlusCircle, 
  FileCog, 
  Search, 
  Files, 
  ShieldAlert, 
  BarChart3, 
  Cpu, 
  Settings as SettingsIcon, 
  Info,
  Sparkles,
  BookOpenCheck,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { activeTab, setActiveTab, generatedPapers, getDsaEngineStats } = useApp();
  const stats = getDsaEngineStats();

  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate Paper', icon: FileCog, badge: 'DSA Engine', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'questions', label: 'Question Bank', icon: Database },
    { id: 'add-question', label: 'Add Question', icon: PlusCircle },
    { id: 'search', label: 'Search & Lookup', icon: Search },
    { id: 'papers', label: 'Generated Papers', icon: Files, count: generatedPapers.length },
    { id: 'duplicates', label: 'Duplicate Detection', icon: ShieldAlert, count: stats.duplicateCount, alert: stats.duplicateCount > 0 },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'visualizer', label: 'DSA Algorithms', icon: Cpu, badge: 'Live Trace', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'about', label: 'About Project', icon: Info }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              AQB System
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-indigo-500/20 text-indigo-400 font-mono font-medium">DSA</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Question Bank Generator</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>

        {navItems.slice(0, 4).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Operations & DSA
        </div>

        {navItems.slice(4, 9).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.alert ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-300'}`}>
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          System & Specs
        </div>

        {navItems.slice(9).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Banner */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">DSA Pipeline</span>
            <span className="text-emerald-400 font-mono">Ready</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hash Table O(1) • B-Tree Index • KMP String • 0/1 Knapsack DP
          </p>
        </div>
      </div>
    </aside>
  );
}
