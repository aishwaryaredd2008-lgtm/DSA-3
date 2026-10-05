import React from 'react';

export function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[difficulty] || styles.Easy}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {difficulty}
    </span>
  );
}

export function MarksBadge({ marks }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
      {marks} Marks
    </span>
  );
}

export function TypeBadge({ type }) {
  const colors = {
    MCQ: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    'Short Answer': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Descriptive: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[type] || 'bg-slate-700 text-slate-300'}`}>
      {type}
    </span>
  );
}

export function AlgorithmBadge({ name, complexity }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-indigo-300 border border-indigo-500/40 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
      <span className="font-semibold">{name}</span>
      {complexity && <span className="text-slate-400 font-normal">({complexity})</span>}
    </span>
  );
}
