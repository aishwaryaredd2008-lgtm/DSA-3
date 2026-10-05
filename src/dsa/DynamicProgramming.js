/**
 * Dynamic Programming (DP) Question Paper Selection Algorithm
 * Solves Multi-Constraint Subset Sum / 0-1 Knapsack problem to select
 * an exact combination of questions satisfying Total Marks and Question Count.
 * Complexity: O(N * TotalMarks * QuestionCount)
 */
export class DPSubsetSumSelector {
  /**
   * Selects questions that exactly sum to `targetMarks` with approximately `targetCount` questions.
   * Also scores candidates based on topic fit and difficulty balance.
   */
  static selectExactPaper(candidatePool, targetMarks, targetCount, difficultyWeights = { Easy: 0.4, Medium: 0.4, Hard: 0.2 }) {
    const startTime = performance.now();
    const n = candidatePool.length;

    if (n === 0 || targetMarks <= 0) {
      return {
        success: false,
        selectedQuestions: [],
        totalMarksAchieved: 0,
        matrixSize: '0x0',
        executionTimeMs: '0.0000',
        algorithm: 'Dynamic Programming (Knapsack DP Matrix)',
        message: 'Insufficient candidates or invalid target marks'
      };
    }

    // dp[w][c] stores the best subset score for achieving marks `w` with `c` items
    // and parent pointers for backtracking.
    const maxItems = Math.min(n, targetCount + 2); // allowance of +/- items if needed
    
    // DP Table: dp[weight][count] = { score, itemIdx, prevW, prevC }
    const dp = Array.from({ length: targetMarks + 1 }, () => 
      Array.from({ length: maxItems + 1 }, () => null)
    );

    // Base case: 0 marks with 0 items has score 0
    dp[0][0] = { score: 0, itemIdx: -1, prevW: -1, prevC: -1 };

    // Calculate quality score for each candidate question
    const itemScores = candidatePool.map(q => {
      const diffWeight = difficultyWeights[q.difficulty] || 0.33;
      // Bloom taxonomy / quality score
      return 10 * diffWeight + (q.marks >= 5 ? 5 : 2);
    });

    let dpCellUpdates = 0;

    // Fill DP table item by item (0/1 Knapsack iteration)
    for (let i = 0; i < n; i++) {
      const q = candidatePool[i];
      const m = Number(q.marks);
      const qScore = itemScores[i];

      // Traverse in reverse to prevent using the same question multiple times
      for (let w = targetMarks; w >= m; w--) {
        for (let c = maxItems; c >= 1; c--) {
          if (dp[w - m][c - 1] !== null) {
            const newScore = dp[w - m][c - 1].score + qScore;
            dpCellUpdates++;

            if (dp[w][c] === null || newScore > dp[w][c].score) {
              dp[w][c] = {
                score: newScore,
                itemIdx: i,
                prevW: w - m,
                prevC: c - 1
              };
            }
          }
        }
      }
    }

    // Search for exact match at targetMarks with count == targetCount
    let bestFinalState = null;
    let bestCount = -1;

    // Prefer exact count
    if (dp[targetMarks][targetCount] !== null) {
      bestFinalState = dp[targetMarks][targetCount];
      bestCount = targetCount;
    } else {
      // Find closest count at exact targetMarks
      for (let offset = 1; offset <= 3; offset++) {
        const c1 = targetCount - offset;
        const c2 = targetCount + offset;
        if (c1 >= 1 && dp[targetMarks][c1] !== null) {
          bestFinalState = dp[targetMarks][c1];
          bestCount = c1;
          break;
        }
        if (c2 <= maxItems && dp[targetMarks][c2] !== null) {
          bestFinalState = dp[targetMarks][c2];
          bestCount = c2;
          break;
        }
      }
    }

    // Backtrack to extract selected questions
    const selected = [];
    if (bestFinalState) {
      let curW = targetMarks;
      let curC = bestCount;

      while (curW > 0 && curC > 0 && dp[curW][curC] && dp[curW][curC].itemIdx !== -1) {
        const state = dp[curW][curC];
        selected.push(candidatePool[state.itemIdx]);
        curW = state.prevW;
        curC = state.prevC;
      }
    }

    const endTime = performance.now();
    const achievedMarks = selected.reduce((sum, q) => sum + Number(q.marks), 0);
    const isExact = achievedMarks === targetMarks;

    return {
      success: isExact && selected.length > 0,
      isExact,
      selectedQuestions: selected.reverse(),
      totalMarksAchieved: achievedMarks,
      questionCountAchieved: selected.length,
      targetMarks,
      targetCount,
      dpCellUpdates,
      matrixSize: `${targetMarks + 1} x ${maxItems + 1}`,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Dynamic Programming (0/1 Knapsack Subset-Sum)',
      complexity: `O(N * W * C) = O(${n} * ${targetMarks} * ${targetCount})`
    };
  }
}
