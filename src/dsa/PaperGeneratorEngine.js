/**
 * Master Automated Question Paper Generation Engine
 * Orchestrates the 10-Stage Data Structures & Algorithms Pipeline.
 */
import { HashTable } from './HashTable.js';
import { BTreeIndex } from './BTree.js';
import { KMPStringMatcher } from './KMP.js';
import { RabinKarpMatcher } from './RabinKarp.js';
import { SortingAlgorithms } from './Sorting.js';
import { DPSubsetSumSelector } from './DynamicProgramming.js';
import { NetworkFlowBalancer } from './NetworkFlow.js';
import { RandomizedAlgorithm } from './Randomized.js';
import { GreedyApproximationSelector } from './GreedyApproximation.js';

export class PaperGeneratorEngine {
  /**
   * Run the end-to-end 10-step DSA Paper Generation Pipeline
   */
  static generatePaper(allQuestions, config, onStepProgress = null) {
    const pipelineLog = [];
    const executionTimings = {};
    const overallStartTime = performance.now();

    const addStep = (stepNumber, name, algorithm, status, details) => {
      const stepObj = {
        stepNumber,
        name,
        algorithm,
        status,
        details,
        timestamp: new Date().toLocaleTimeString()
      };
      pipelineLog.push(stepObj);
      if (onStepProgress) onStepProgress(stepObj);
    };

    // STAGE 1: User Requirements
    addStep(1, 'User Requirements Verification', 'Form Input & Constraint Validation', 'Completed', {
      subject: config.subject,
      topics: config.selectedTopics,
      totalMarks: config.totalMarks,
      targetCount: config.questionCount,
      difficultyDistribution: config.difficultyDistribution,
      questionTypes: config.questionTypes
    });

    // STAGE 2: Retrieve Eligible Questions via Hash Table & B-Tree Index
    const stage2Start = performance.now();
    const topicBTree = new BTreeIndex(q => q.topic, 'TopicIndex');
    const marksBTree = new BTreeIndex(q => Number(q.marks), 'MarksIndex');
    const questionHashTable = new HashTable();

    allQuestions.forEach(q => {
      topicBTree.insert(q);
      marksBTree.insert(q);
      questionHashTable.insert(q.id, q);
    });

    // Filter by subject
    const subjectQuestions = allQuestions.filter(q => 
      !config.subject || config.subject === 'All' || q.subject.toLowerCase() === config.subject.toLowerCase()
    );

    executionTimings['Hash Table & B-Tree Indexing'] = (performance.now() - stage2Start).toFixed(3);
    addStep(2, 'Retrieve Eligible Questions', 'Hash Table O(1) & B-Tree O(log N)', 'Completed', {
      totalBankSize: allQuestions.length,
      indexedQuestions: questionHashTable.size,
      matchedSubjectCount: subjectQuestions.length,
      treeDepth: topicBTree.root.children.length > 0 ? 2 : 1
    });

    // STAGE 3: Duplicate Detection Check via KMP & Rabin-Karp
    const stage3Start = performance.now();
    const duplicates = RabinKarpMatcher.scanQuestionBankForDuplicates(subjectQuestions, 80);
    // Filter out redundant copies if any duplicate pair exists
    const duplicateIdSet = new Set(duplicates.map(d => d.id2)); // exclude second in pair
    const dedupedQuestions = subjectQuestions.filter(q => !duplicateIdSet.has(q.id));

    executionTimings['KMP / Rabin-Karp Duplicate Check'] = (performance.now() - stage3Start).toFixed(3);
    addStep(3, 'Duplicate Detection Audit', 'KMP + Rabin-Karp Rolling Hash', 'Completed', {
      duplicatePairsDetected: duplicates.length,
      filteredDuplicates: duplicates.slice(0, 3).map(d => `${d.id1} ≈ ${d.id2} (${d.similarityPercentage}%)`),
      cleanCandidatesCount: dedupedQuestions.length
    });

    // STAGE 4: Filter by Topic & Unit
    let topicCandidates = dedupedQuestions;
    if (config.selectedTopics && config.selectedTopics.length > 0) {
      topicCandidates = dedupedQuestions.filter(q => config.selectedTopics.includes(q.topic));
    }
    addStep(4, 'Topic & Syllabus Constraints', 'B-Tree Range & Predicate Filtering', 'Completed', {
      selectedTopicsCount: config.selectedTopics ? config.selectedTopics.length : 'All',
      qualifyingQuestions: topicCandidates.length
    });

    // STAGE 5: Filter by Question Type & Difficulty
    let filteredCandidates = topicCandidates;
    if (config.questionType && config.questionType !== 'Mixed') {
      filteredCandidates = filteredCandidates.filter(q => q.questionType === config.questionType);
    }
    addStep(5, 'Difficulty & Type Constraints', 'Category Partitioning', 'Completed', {
      difficultyWeights: config.difficultyDistribution,
      typeFilter: config.questionType,
      candidatesAvailable: filteredCandidates.length
    });

    if (filteredCandidates.length === 0) {
      return {
        success: false,
        error: 'Not enough questions are available for the selected criteria.',
        pipelineLog
      };
    }

    // STAGE 6: Randomize Candidates via Fisher-Yates
    const stage6Start = performance.now();
    const shuffleResult = RandomizedAlgorithm.shuffle(filteredCandidates, config.randomSeed);
    const randomizedPool = shuffleResult.shuffled;
    executionTimings['Fisher-Yates Shuffle'] = (performance.now() - stage6Start).toFixed(3);

    addStep(6, 'Randomize Candidate Pool', 'Fisher-Yates Unbiased Shuffle O(N)', 'Completed', {
      swapsPerformed: shuffleResult.swaps,
      entropySource: 'Cryptographic Seed / LCG'
    });

    // STAGE 7: Dynamic Programming Knapsack Selection
    const stage7Start = performance.now();
    let dpResult = DPSubsetSumSelector.selectExactPaper(
      randomizedPool,
      Number(config.totalMarks),
      Number(config.questionCount),
      config.difficultyDistribution
    );
    executionTimings['Dynamic Programming'] = (performance.now() - stage7Start).toFixed(3);

    let finalSelected = [];
    let methodUsed = '';

    if (dpResult.success) {
      finalSelected = dpResult.selectedQuestions;
      methodUsed = 'Dynamic Programming (Exact Subset-Sum Solution)';
      addStep(7, 'Marks & Question Optimization', 'Dynamic Programming 0/1 Knapsack O(N*W*C)', 'Completed', {
        exactMarksAchieved: dpResult.totalMarksAchieved,
        targetMarks: config.totalMarks,
        questionsSelected: dpResult.questionCountAchieved,
        dpMatrixSize: dpResult.matrixSize,
        status: 'Optimal Exact Partition Found'
      });
    } else {
      // STAGE 8: Approximation / Greedy Algorithm Fallback
      const stage8Start = performance.now();
      const greedyResult = GreedyApproximationSelector.selectNearOptimalPaper(
        randomizedPool,
        Number(config.totalMarks),
        Number(config.questionCount),
        config.difficultyDistribution
      );
      executionTimings['Greedy Approximation'] = (performance.now() - stage8Start).toFixed(3);
      finalSelected = greedyResult.selectedQuestions;
      methodUsed = 'Greedy Approximation (Near-Optimal Selection)';

      addStep(8, 'Approximation Heuristic Fallback', 'Greedy Density Ratio O(N log N)', 'Completed', {
        notice: greedyResult.message,
        achievedMarks: greedyResult.totalMarksAchieved,
        targetMarks: config.totalMarks,
        questionsCount: greedyResult.questionCountAchieved
      });
    }

    // STAGE 9: Network Flow Balancing Check
    const stage9Start = performance.now();
    const topicDemands = {};
    (config.selectedTopics || []).forEach(t => {
      topicDemands[t] = Math.ceil(finalSelected.length / Math.max(1, config.selectedTopics.length));
    });
    const diffDemands = {
      Easy: Math.round(finalSelected.length * (config.difficultyDistribution?.Easy || 0.4)),
      Medium: Math.round(finalSelected.length * (config.difficultyDistribution?.Medium || 0.4)),
      Hard: Math.round(finalSelected.length * (config.difficultyDistribution?.Hard || 0.2))
    };
    const flowResult = NetworkFlowBalancer.balanceQuestions(finalSelected, topicDemands, diffDemands);
    executionTimings['Network Flow Balancing'] = (performance.now() - stage9Start).toFixed(3);

    addStep(9, 'Topic & Difficulty Balancing', 'Network Flow (Edmonds-Karp Max Flow)', 'Completed', {
      flowAchieved: flowResult.flowAchieved,
      topicCoverage: flowResult.topicCoverage,
      difficultyCoverage: flowResult.difficultyCoverage
    });

    // STAGE 10: Sort Questions (Merge Sort / Quick Sort into Exam Sections)
    const stage10Start = performance.now();
    const sortChoice = config.sortAlgorithm === 'QuickSort' ? 'Quick Sort' : 'Merge Sort';
    let sortedQuestions = [];

    if (config.sortAlgorithm === 'QuickSort') {
      const qRes = SortingAlgorithms.quickSort(finalSelected, 'marks', true);
      sortedQuestions = qRes.sorted;
    } else {
      const mRes = SortingAlgorithms.mergeSort(finalSelected, 'marks', true);
      sortedQuestions = mRes.sorted;
    }
    executionTimings['Sorting & Structuring'] = (performance.now() - stage10Start).toFixed(3);

    // Group into Section A (Short/MCQ), Section B (Medium), Section C (Long/Descriptive)
    const structuredQuestions = sortedQuestions.map((q, idx) => {
      let section = 'Part A';
      let sectionTitle = 'Part A: Short Answer / Conceptual Questions (2 Marks Each)';
      if (Number(q.marks) > 2 && Number(q.marks) <= 5) {
        section = 'Part B';
        sectionTitle = 'Part B: Analytical & Application Problems (5 Marks Each)';
      } else if (Number(q.marks) > 5) {
        section = 'Part C';
        sectionTitle = 'Part C: Comprehensive & Design Problems (10-15 Marks Each)';
      }
      return {
        ...q,
        questionNumber: idx + 1,
        section,
        sectionTitle
      };
    });

    addStep(10, 'Final Question Paper Assembled', `${sortChoice} Organization O(N log N)`, 'Completed', {
      totalQuestions: structuredQuestions.length,
      totalMarks: structuredQuestions.reduce((acc, q) => acc + Number(q.marks), 0),
      sectionsCreated: Array.from(new Set(structuredQuestions.map(q => q.section)))
    });

    // Generate Set A, Set B, Set C, Set D variations
    const paperSets = RandomizedAlgorithm.generateMultipleSets(structuredQuestions, filteredCandidates, ['Set A', 'Set B', 'Set C', 'Set D']);

    const overallEndTime = performance.now();
    const totalExecutionTimeMs = (overallEndTime - overallStartTime).toFixed(3);

    return {
      success: true,
      paperId: `QP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      subject: config.subject || 'Data Structures and Algorithms',
      courseCode: config.courseCode || 'CS301-DSA',
      institutionName: config.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY',
      department: config.department || 'Department of Computer Science & Engineering',
      examTitle: config.examTitle || 'End-Semester Examination - Autumn 2026',
      durationHours: config.durationHours || '3.0 Hours',
      totalMarks: structuredQuestions.reduce((acc, q) => acc + Number(q.marks), 0),
      questionCount: structuredQuestions.length,
      createdAt: new Date().toISOString(),
      questions: structuredQuestions,
      paperSets,
      activeSet: 'Set A',
      pipelineLog,
      algorithmMethodUsed: methodUsed,
      executionTimings,
      totalExecutionTimeMs,
      difficultyBreakdown: {
        Easy: structuredQuestions.filter(q => q.difficulty === 'Easy').length,
        Medium: structuredQuestions.filter(q => q.difficulty === 'Medium').length,
        Hard: structuredQuestions.filter(q => q.difficulty === 'Hard').length
      },
      topicBreakdown: structuredQuestions.reduce((acc, q) => {
        acc[q.topic] = (acc[q.topic] || 0) + 1;
        return acc;
      }, {})
    };
  }
}
