import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_QUESTIONS, DSA_TOPICS, SUBJECTS_LIST, UNITS_LIST } from '../data/sampleQuestions';
import { HashTable } from '../dsa/HashTable';
import { BTreeIndex } from '../dsa/BTree';
import { KMPStringMatcher } from '../dsa/KMP';
import { RabinKarpMatcher } from '../dsa/RabinKarp';

const AppContext = createContext();

const STORAGE_KEYS = {
  QUESTIONS: 'aqb_questions_v1',
  PAPERS: 'aqb_papers_v1',
  USER: 'aqb_user_v1',
  SETTINGS: 'aqb_settings_v1'
};

const DEFAULT_SETTINGS = {
  institutionName: 'NATIONAL INSTITUTE OF TECHNOLOGY',
  department: 'Department of Computer Science & Engineering',
  defaultCourseCode: 'CS301-DSA',
  defaultSubject: 'Data Structures and Algorithms',
  defaultExamDuration: '3.0 Hours',
  defaultTotalMarks: 50,
  defaultQuestionCount: 8,
  defaultDifficulty: { Easy: 0.4, Medium: 0.4, Hard: 0.2 },
  enableWatermark: true,
  showBloomTagsInPreview: true
};

export function AppProvider({ children }) {
  // Current logged in user: Admin or Faculty
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : {
      id: 'usr-admin-01',
      name: 'Dr. Sarah Jenkins',
      email: 'admin@univ.edu',
      role: 'Admin',
      avatar: 'SJ'
    };
  });

  // Questions Bank State
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // Generated Papers State
  const [generatedPapers, setGeneratedPapers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAPERS);
    return saved ? JSON.parse(saved) : [];
  });

  // System Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Toasts notification queue
  const [toasts, setToasts] = useState([]);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Currently viewed paper for Preview modal/page
  const [selectedPaperForPreview, setSelectedPaperForPreview] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(generatedPapers));
  }, [generatedPapers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Toast dispatch helper
  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Question Management Actions
  const addQuestion = (newQuestion) => {
    const qWithId = {
      ...newQuestion,
      id: newQuestion.id || `Q-${1000 + questions.length + 1}`,
      createdAt: new Date().toISOString()
    };
    setQuestions(prev => [qWithId, ...prev]);
    addToast(`Question ${qWithId.id} added successfully!`, 'success');
    return qWithId;
  };

  const updateQuestion = (updatedQuestion) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? { ...q, ...updatedQuestion } : q));
    addToast(`Question ${updatedQuestion.id} updated!`, 'success');
  };

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    addToast(`Question ${id} removed from question bank.`, 'info');
  };

  // Save a freshly generated paper
  const saveGeneratedPaper = (paper) => {
    const paperRecord = {
      ...paper,
      id: paper.paperId || `QP-${Date.now().toString(36).toUpperCase()}`,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    };
    setGeneratedPapers(prev => [paperRecord, ...prev]);
    addToast(`Question Paper ${paperRecord.id} saved to archive!`, 'success');
    return paperRecord;
  };

  const deleteGeneratedPaper = (id) => {
    setGeneratedPapers(prev => prev.filter(p => p.id !== id && p.paperId !== id));
    addToast(`Paper ${id} deleted from archive.`, 'info');
  };

  // Reset to factory defaults
  const resetToFactoryDefaults = () => {
    setQuestions(INITIAL_QUESTIONS);
    setGeneratedPapers([]);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.PAPERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    addToast('Database reset to initial academic sample questions.', 'warning');
  };

  // Live DSA Index stats computed on the fly
  const getDsaEngineStats = () => {
    const ht = new HashTable();
    const bTree = new BTreeIndex(q => q.topic, 'TopicIndex');
    questions.forEach(q => {
      ht.insert(q.id, q);
      bTree.insert(q);
    });

    const duplicates = RabinKarpMatcher.scanQuestionBankForDuplicates(questions, 70);

    return {
      totalQuestions: questions.length,
      hashTableStats: ht.getStats(),
      bTreeSize: bTree.size,
      duplicateCount: duplicates.length,
      duplicatePairs: duplicates
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        questions,
        setQuestions,
        generatedPapers,
        settings,
        setSettings,
        toasts,
        addToast,
        removeToast,
        activeTab,
        setActiveTab,
        selectedPaperForPreview,
        setSelectedPaperForPreview,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        saveGeneratedPaper,
        deleteGeneratedPaper,
        resetToFactoryDefaults,
        getDsaEngineStats,
        DSA_TOPICS,
        SUBJECTS_LIST,
        UNITS_LIST
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
