import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, User, Sparkles, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Login({ onLoginSuccess }) {
  const { setCurrentUser, addToast } = useApp();
  const [email, setEmail] = useState('admin@univ.edu');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userObj = {
        id: role === 'Admin' ? 'usr-admin-01' : 'usr-fac-02',
        name: role === 'Admin' ? 'Dr. Sarah Jenkins' : 'Prof. Alan Turing',
        email: email,
        role: role,
        avatar: role === 'Admin' ? 'SJ' : 'AT'
      };
      setCurrentUser(userObj);
      addToast(`Welcome back, ${userObj.name}! Logged in as ${role}.`, 'success');
      if (onLoginSuccess) onLoginSuccess();
    }, 600);
  };

  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'Admin') {
      setEmail('admin@univ.edu');
      setPassword('admin123');
    } else {
      setEmail('faculty@univ.edu');
      setPassword('faculty123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-600/25 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Automated Question Bank
          </h2>
          <p className="text-xs text-indigo-400 font-mono mt-1 font-medium">
            DSA Engine • Academic Question Paper Generator
          </p>
        </div>

        {/* Quick Demo Login selector */}
        <div className="mb-6 p-1.5 bg-slate-800/80 rounded-xl flex gap-1 border border-slate-700/60">
          <button
            type="button"
            onClick={() => handleQuickFill('Admin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'Admin' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin Portal
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('Faculty/Teacher')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'Faculty/Teacher' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Faculty Portal
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 text-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 text-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 mr-2 bg-slate-800"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Automated Academic Exam Setting • Spring Boot / React / DSA Engine
          </p>
        </div>
      </div>

      {/* Forgot Password Mini-Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-400 mb-4">
              Demo passwords for testing:
              <br />• Admin: <code className="text-indigo-400">admin123</code>
              <br />• Faculty: <code className="text-indigo-400">faculty123</code>
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
