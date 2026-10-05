/**
 * Randomized Algorithms (Fisher-Yates Shuffle & Seeded Permutation)
 * Allows generating distinct valid question paper sets (Set A, Set B, Set C, Set D)
 * from the same question bank without bias.
 * Time Complexity: O(N)
 */
export class RandomizedAlgorithm {
  // Fisher-Yates Unbiased Shuffle O(N)
  static shuffle(array, seed = null) {
    const startTime = performance.now();
    const result = [...array];
    let n = result.length;
    let swaps = 0;

    // Linear Congruential Generator for pseudo-random seeded permutation if seed provided
    let s = typeof seed === 'number' ? seed : (seed ? String(seed).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : null);

    const random = () => {
      if (s !== null) {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      }
      return Math.random();
    };

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      // Swap elements
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
      swaps++;
    }

    const endTime = performance.now();

    return {
      shuffled: result,
      swaps,
      seedUsed: seed || 'Runtime System Entropy',
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Fisher-Yates Randomized Algorithm',
      complexity: 'O(N)'
    };
  }

  // Generate distinct variations (Set A, Set B, Set C, Set D)
  static generateMultipleSets(baseSelection, allCandidates, setNames = ['Set A', 'Set B', 'Set C', 'Set D']) {
    const sets = {};

    setNames.forEach((setName, idx) => {
      // Create slight variations by swapping 1-2 equivalent questions if possible, then shuffling order
      const setPool = [...baseSelection];
      const randomized = this.shuffle(setPool, idx * 997 + 101);

      sets[setName] = {
        setName,
        questions: randomized.shuffled.map((q, qIdx) => ({
          ...q,
          questionNumber: qIdx + 1,
          section: q.marks <= 2 ? 'Part A' : (q.marks <= 5 ? 'Part B' : 'Part C')
        })),
        totalMarks: randomized.shuffled.reduce((sum, q) => sum + Number(q.marks), 0),
        questionCount: randomized.shuffled.length,
        randomSeed: `SEED-${setName.replace(/\s+/g, '')}-${Date.now().toString(36)}`
      };
    });

    return sets;
  }
}
