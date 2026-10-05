-- ====================================================================
-- AUTOMATED QUESTION BANK GENERATING SYSTEM
-- Database Schema: MySQL Relational 3NF Architecture
-- ====================================================================

CREATE DATABASE IF NOT EXISTS aqb_system_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aqb_system_db;

-- 1. Users Table (Admin, Faculty/Teacher)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Faculty/Teacher') NOT NULL DEFAULT 'Faculty/Teacher',
    department VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(36) PRIMARY KEY,
    subject_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    unit INT NOT NULL CHECK (unit BETWEEN 1 AND 5),
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_subject_unit (subject_id, unit)
);

-- 4. Questions Table (Core Bank)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    question_text TEXT NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,
    unit INT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    marks INT NOT NULL CHECK (marks > 0),
    question_type ENUM('MCQ', 'Short Answer', 'Descriptive') NOT NULL,
    answer TEXT,
    bloom_level VARCHAR(50) DEFAULT 'Understand',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    INDEX idx_topic_marks (topic_id, marks),
    INDEX idx_difficulty (difficulty)
);

-- 5. MCQ Options Table
CREATE TABLE IF NOT EXISTS question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id VARCHAR(36) NOT NULL,
    option_label VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D'
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 6. Generated Papers Table
CREATE TABLE IF NOT EXISTS generated_papers (
    id VARCHAR(36) PRIMARY KEY,
    subject_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    exam_title VARCHAR(200) NOT NULL,
    total_marks INT NOT NULL,
    question_count INT NOT NULL,
    duration_hours VARCHAR(20) DEFAULT '3.0 Hours',
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 7. Paper Questions Junction Table (Supports Sets A, B, C, D)
CREATE TABLE IF NOT EXISTS paper_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    set_name VARCHAR(10) DEFAULT 'Set A',
    question_number INT NOT NULL,
    section_name VARCHAR(50) NOT NULL, -- 'Part A', 'Part B', 'Part C'
    FOREIGN KEY (paper_id) REFERENCES generated_papers(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY uq_paper_set_qnum (paper_id, set_name, question_number)
);
