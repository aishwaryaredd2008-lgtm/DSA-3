/**
 * Greedy / Approximation Algorithm for Question Selection
 * Used as a fast heuristic fallback when exact Dynamic Programming Subset-Sum
 * cannot find an exact partition under tight user constraints.
 * Complexity: O(N log N) due to sorting by value-to-cost density ratio.
 */
export class GreedyApproximationSelector {
  static selectNearOptimalPaper(candidatePool, targetMarks, targetCount, difficultyWeights = { Easy: 0.4, Medium: 0.4, Hard: 0.2 }) {
    const startTime = performance.now();
    
    // Compute heuristic score: higher score for matching desired difficulty & topic balance
    const scoredCandidates = candidatePool.map(q => {
      const weight = difficultyWeights[q.difficulty] || 0.33;
      const density = (10 * weight) / Math.max(1, Number(q.marks));
      return {
        ...q,
        densityScore: density
      };
    });

    // Sort descending by density score
    scoredCandidates.sort((a, b) => b.densityScore - a.densityScore);

    const selected = [];
    let currentMarks = 0;
    const steps = [];

    // First pass: greedy pick without exceeding targetMarks
    for (const q of scoredCandidates) {
      const m = Number(q.marks);
      if (currentMarks + m <= targetMarks) {
        selected.push(q);
        currentMarks += m;
        steps.push({
          action: 'PICK',
          questionId: q.id,
          marks: m,
          runningTotal: currentMarks,
          status: 'Included under target'
        });
      }
      if (currentMarks === targetMarks && selected.length >= targetCount) {
        break;
      }
    }

    // Second pass: if still under targetMarks, pick the closest question to reach or slightly exceed
    if (currentMarks < targetMarks) {
      const remaining = scoredCandidates.filter(q => !selected.some(sq => sq.id === q.id));
      if (remaining.length > 0) {
        // Sort remaining by proximity to difference
        const diff = targetMarks - currentMarks;
        remaining.sort((a, b) => Math.abs(Number(a.marks) - diff) - Math.abs(Number(b.marks) - diff));
        selected.push(remaining[0]);
        currentMarks += Number(remaining[0].marks);
        steps.push({
          action: 'APPROXIMATE_FILL',
          questionId: remaining[0].id,
          marks: Number(remaining[0].marks),
          runningTotal: currentMarks,
          status: 'Approximation adjustment'
        });
      }
    }

    const endTime = performance.now();

    return {
      success: selected.length > 0,
      isExact: currentMarks === targetMarks,
      isApproximation: true,
      selectedQuestions: selected,
      totalMarksAchieved: currentMarks,
      questionCountAchieved: selected.length,
      targetMarks,
      targetCount,
      approximationSteps: steps,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Greedy Heuristic Approximation (Value-Density Ratio)',
      complexity: 'O(N log N)',
      message: 'Exact DP solution unavailable. Generated a near-optimal paper using Approximation/Greedy selection.'
    };
  }
}
