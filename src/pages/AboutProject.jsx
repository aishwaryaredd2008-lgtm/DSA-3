import React, { useState } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Database, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Server, 
  FileCode, 
  Network, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function AboutProject() {
  const [activeCodeTab, setActiveCodeTab] = useState('spring-controller');

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/70 via-purple-900/50 to-slate-900 border border-indigo-500/20 p-8 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Project Presentation Ready</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Automated Question Bank Generating System
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          A full-stack, algorithmically rigorous academic examination management and balanced question-paper generation system built upon core Data Structures and Algorithms principles.
        </p>
      </div>

      {/* Objectives & Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Project Objectives</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Automate Paper Generation:</strong> Reduce manual faculty exam-setting time by over 95%.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Constraint Satisfaction:</strong> Exact marks target and question counts satisfied via Dynamic Programming (0/1 Knapsack).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Duplicate Detection:</strong> Detect exact and semantic question clones using KMP LPS string matching and Rabin-Karp polynomial rolling hashes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Balanced Syllabus Coverage:</strong> Max-flow bipartite balancing across units and difficulty quotas.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Multi-Set Diversity:</strong> Seeded Fisher-Yates permutations to generate Sets A, B, C, D with zero bias.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Target Applications</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 font-semibold text-slate-200">
              🏫 Universities & Colleges
              <p className="text-[11px] font-normal text-slate-400 mt-1">Mid-term and end-semester automated exam paper synthesis.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 font-semibold text-slate-200">
              🎓 Autonomous Institutes
              <p className="text-[11px] font-normal text-slate-400 mt-1">Syllabus-aligned question banking and difficulty audits.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 font-semibold text-slate-200">
              💻 Online Test Portals
              <p className="text-[11px] font-normal text-slate-400 mt-1">Real-time randomized mock tests with answer keys.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 font-semibold text-slate-200">
              🏆 Certification Bodies
              <p className="text-[11px] font-normal text-slate-400 mt-1">Multi-set generation with equal difficulty balance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* DSA Methodology Architecture */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Data Structures & Algorithms Implementation Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Summary of algorithms practically implemented in the system:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-indigo-300">1. Hash Table O(1)</span>
            <p className="text-slate-400 text-[11px]">Polynomial rolling hash for instant O(1) Question ID lookups.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-purple-300">2. B-Tree Index O(log N)</span>
            <p className="text-slate-400 text-[11px]">Multiway range tree (degree t=3) for topic, unit, and marks range searches.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-emerald-300">3. KMP Algorithm O(N+M)</span>
            <p className="text-slate-400 text-[11px]">LPS preprocessing for linear duplicate substring matching.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-amber-300">4. Rabin-Karp O(N+M)</span>
            <p className="text-slate-400 text-[11px]">Rolling polynomial hash matrix for question bank-wide plagiarism scan.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-rose-300">5. Merge & Quick Sort</span>
            <p className="text-slate-400 text-[11px]">Divide-and-conquer sorting for Part A/B/C exam section structuring.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-sky-300">6. 0/1 Knapsack DP</span>
            <p className="text-slate-400 text-[11px]">Exact constraint satisfaction for Total Marks & Question Count.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-teal-300">7. Network Max Flow</span>
            <p className="text-slate-400 text-[11px]">Edmonds-Karp bipartite balancing across syllabus units and difficulty quotas.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-orange-300">8. Fisher-Yates O(N)</span>
            <p className="text-slate-400 text-[11px]">Unbiased pseudo-random permutation generator for Paper Sets A, B, C, D.</p>
          </div>
        </div>
      </div>

      {/* Database Schema & REST API Reference */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Database Architecture (MySQL) & REST API Contracts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Normalized 3NF relational schema and Spring Boot endpoint design.
          </p>
        </div>

        {/* Code tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs">
          <button
            onClick={() => setActiveCodeTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeCodeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            MySQL Schema (schema.sql)
          </button>
          <button
            onClick={() => setActiveCodeTab('api')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeCodeTab === 'api' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            REST API Contracts
          </button>
          <button
            onClick={() => setActiveCodeTab('spring-controller')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeCodeTab === 'spring-controller' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Java Spring Boot Controller
          </button>
          <button
            onClick={() => setActiveCodeTab('spring-dp')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeCodeTab === 'spring-dp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Java DSA Generator Engine
          </button>
        </div>

        {/* Code Display */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto max-h-96 custom-scrollbar">
          {activeCodeTab === 'schema' && (
            <pre className="text-emerald-400 leading-relaxed">{`-- MySQL Schema for Automated Question Bank Generating System

CREATE DATABASE IF NOT EXISTS aqb_system_db;
USE aqb_system_db;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Faculty/Teacher') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE topics (
    id VARCHAR(36) PRIMARY KEY,
    subject_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    unit INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id VARCHAR(36) PRIMARY KEY,
    question_text TEXT NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,
    unit INT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    marks INT NOT NULL,
    question_type ENUM('MCQ', 'Short Answer', 'Descriptive') NOT NULL,
    answer TEXT,
    bloom_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_topic (topic_id),
    INDEX idx_marks (marks),
    INDEX idx_difficulty (difficulty)
);

CREATE TABLE generated_papers (
    id VARCHAR(36) PRIMARY KEY,
    subject_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    exam_title VARCHAR(200) NOT NULL,
    total_marks INT NOT NULL,
    question_count INT NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paper_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    set_name VARCHAR(10) DEFAULT 'Set A',
    question_number INT NOT NULL,
    section_name VARCHAR(50),
    FOREIGN KEY (paper_id) REFERENCES generated_papers(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);`}</pre>
          )}

          {activeCodeTab === 'api' && (
            <pre className="text-cyan-400 leading-relaxed">{`# REST API Endpoints Specification

# --- QUESTION BANK MANAGEMENT ---
POST   /api/questions                 # Add new question (with KMP duplicate check)
GET    /api/questions                 # Get all questions (supports Merge/Quick sort)
GET    /api/questions/{id}            # Fast O(1) Hash Table lookup by Question ID
PUT    /api/questions/{id}            # Update existing question
DELETE /api/questions/{id}            # Delete question from bank

# --- SEARCH & INDEXING ---
GET    /api/questions/search?q={term} # KMP phrase matching / B-Tree range search
POST   /api/questions/check-duplicate # KMP & Rabin-Karp duplicate detection

# --- QUESTION PAPER GENERATION (10-STEP DSA ENGINE) ---
POST   /api/papers/generate           # Run 0/1 Knapsack DP + Network Flow Balancer
GET    /api/papers                    # List all generated papers
GET    /api/papers/{id}               # Get paper by ID with Sets A, B, C, D
DELETE /api/papers/{id}               # Delete paper from archive

# --- SYSTEM TELEMETRY ---
GET    /api/analytics                 # DSA benchmark stats & syllabus balance`}</pre>
          )}

          {activeCodeTab === 'spring-controller' && (
            <pre className="text-indigo-300 leading-relaxed">{`package com.aqb.controller;

import com.aqb.dto.PaperGenerationRequest;
import com.aqb.dto.PaperResponse;
import com.aqb.model.Question;
import com.aqb.service.DsaPaperGeneratorService;
import com.aqb.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuestionBankController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private DsaPaperGeneratorService dsaPaperGeneratorService;

    @GetMapping("/questions/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
        // Fast O(1) Hash Table Lookup
        return ResponseEntity.ok(questionService.findByIdHashTable(id));
    }

    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@RequestBody Question question) {
        // Step 1: KMP Duplicate Detection
        boolean isDuplicate = questionService.checkKmpDuplicate(question.getQuestionText());
        if (isDuplicate) {
            return ResponseEntity.status(409).body("Warning: A similar question already exists in the question bank.");
        }
        return ResponseEntity.ok(questionService.save(question));
    }

    @PostMapping("/papers/generate")
    public ResponseEntity<PaperResponse> generateQuestionPaper(@RequestBody PaperGenerationRequest request) {
        // Execute 10-Step DSA Pipeline (Knapsack DP + Network Flow + Fisher-Yates)
        PaperResponse generatedPaper = dsaPaperGeneratorService.executeDsaPipeline(request);
        return ResponseEntity.ok(generatedPaper);
    }
}`}</pre>
          )}

          {activeCodeTab === 'spring-dp' && (
            <pre className="text-amber-300 leading-relaxed">{`package com.aqb.dsa;

import com.aqb.model.Question;
import java.util.*;

/**
 * 0/1 Knapsack Dynamic Programming Subset-Sum Solver
 * Time Complexity: O(N * TargetMarks * QuestionCount)
 */
public class DpPaperGenerator {

    public static List<Question> solveExactSubsetSum(List<Question> pool, int targetMarks, int targetCount) {
        int n = pool.size();
        int maxItems = Math.min(n, targetCount + 2);
        
        // DP Table: dp[weight][count]
        Double[][] dp = new Double[targetMarks + 1][maxItems + 1];
        int[][][] parent = new int[targetMarks + 1][maxItems + 1][2]; // [prevW, prevC]
        int[][] itemUsed = new int[targetMarks + 1][maxItems + 1];

        dp[0][0] = 0.0;
        itemUsed[0][0] = -1;

        for (int i = 0; i < n; i++) {
            Question q = pool.get(i);
            int m = q.getMarks();
            double score = q.getDifficulty().equals("Hard") ? 1.5 : 1.0;

            for (int w = targetMarks; w >= m; w--) {
                for (int c = maxItems; c >= 1; c--) {
                    if (dp[w - m][c - 1] != null) {
                        double newScore = dp[w - m][c - 1] + score;
                        if (dp[w][c] == null || newScore > dp[w][c]) {
                            dp[w][c] = newScore;
                            parent[w][c][0] = w - m;
                            parent[w][c][1] = c - 1;
                            itemUsed[w][c] = i;
                        }
                    }
                }
            }
        }

        // Backtrack to extract chosen questions
        List<Question> selected = new ArrayList<>();
        if (dp[targetMarks][targetCount] != null) {
            int curW = targetMarks;
            int curC = targetCount;
            while (curW > 0 && curC > 0 && itemUsed[curW][curC] != -1) {
                selected.add(pool.get(itemUsed[curW][curC]));
                int prevW = parent[curW][curC][0];
                int prevC = parent[curW][curC][1];
                curW = prevW;
                curC = prevC;
            }
        }
        return selected;
    }
}`}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
