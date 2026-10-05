import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { QuestionBank } from './pages/QuestionBank';
import { AddQuestion } from './pages/AddQuestion';
import { SearchModule } from './pages/SearchModule';
import { GeneratePaper } from './pages/GeneratePaper';
import { PaperPreview } from './pages/PaperPreview';
import { GeneratedPapers } from './pages/GeneratedPapers';
import { DuplicateDetection } from './pages/DuplicateDetection';
import { Analytics } from './pages/Analytics';
import { DsaVisualizer } from './pages/DsaVisualizer';
import { Settings } from './pages/Settings';
import { AboutProject } from './pages/AboutProject';

function MainApp() {
  const { activeTab, toasts, removeToast } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for seamless presentation/demo

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'generate':
        return <GeneratePaper />;
      case 'questions':
        return <QuestionBank />;
      case 'add-question':
        return <AddQuestion />;
      case 'search':
        return <SearchModule />;
      case 'preview':
        return <PaperPreview />;
      case 'papers':
        return <GeneratedPapers />;
      case 'duplicates':
        return <DuplicateDetection />;
      case 'analytics':
        return <Analytics />;
      case 'visualizer':
        return <DsaVisualizer />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <AboutProject />;
      case 'login':
        return <Login onLoginSuccess={() => {}} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
