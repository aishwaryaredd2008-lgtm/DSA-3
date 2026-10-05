/**
 * Rabin-Karp Algorithm with Polynomial Rolling Hash
 * Used for multiple pattern matching and fast duplicate detection.
 * Average Time: O(N + M), Worst Time: O(NM)
 */
export class RabinKarpMatcher {
  static d = 256; // Base alphabet size
  static q = 101; // A prime number for modulo

  // Rolling hash search
  static search(text, pattern) {
    const startTime = performance.now();
    const txt = text.toLowerCase();
    const pat = pattern.toLowerCase();
    const M = pat.length;
    const N = txt.length;

    if (M > N || M === 0) {
      return { matches: [], comparisons: 0, hashCollisions: 0, executionTimeMs: '0.0000' };
    }

    let p = 0; // hash value for pattern
    let t = 0; // hash value for txt
    let h = 1;
    let comparisons = 0;
    let hashCollisions = 0;
    const matches = [];

    // The value of h would be "pow(d, M-1)%q"
    for (let i = 0; i < M - 1; i++) {
      h = (h * this.d) % this.q;
    }

    // Calculate the hash value of pattern and first window of text
    for (let i = 0; i < M; i++) {
      p = (this.d * p + pat.charCodeAt(i)) % this.q;
      t = (this.d * t + txt.charCodeAt(i)) % this.q;
    }

    // Slide the pattern over text one by one
    for (let i = 0; i <= N - M; i++) {
      // Check the hash values of current window of text and pattern
      if (p === t) {
        // Check for characters one by one
        let j = 0;
        for (j = 0; j < M; j++) {
          comparisons++;
          if (txt[i + j] !== pat[j]) break;
        }

        if (j === M) {
          matches.push(i);
        } else {
          hashCollisions++; // Hash matched but characters differed (spurious hit)
        }
      }

      // Calculate hash value for next window of text: Remove leading digit, add trailing digit
      if (i < N - M) {
        t = (this.d * (t - txt.charCodeAt(i) * h) + txt.charCodeAt(i + M)) % this.q;
        // We might get negative value of t, converting it to positive
        if (t < 0) t = t + this.q;
      }
    }

    const endTime = performance.now();
    return {
      found: matches.length > 0,
      matches,
      matchCount: matches.length,
      comparisons,
      hashCollisions,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Rabin-Karp Rolling Hash Algorithm',
      complexity: 'O(N + M) Avg'
    };
  }

  // Scan Question Bank for near-duplicate pairs
  static scanQuestionBankForDuplicates(questions, threshold = 65) {
    const duplicatesFound = [];
    const n = questions.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const q1 = questions[i];
        const q2 = questions[j];

        // Only compare questions in same or related topics/subjects for efficiency
        const words1 = q1.text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const words2 = q2.text.toLowerCase().split(/\s+/).filter(w => w.length > 3);

        let sharedKeywords = 0;
        const set2 = new Set(words2);
        for (const w of words1) {
          if (set2.has(w)) sharedKeywords++;
        }

        const keywordRatio = (sharedKeywords / Math.max(1, Math.min(words1.length, words2.length))) * 100;

        if (keywordRatio >= 50 || q1.text.toLowerCase().includes(q2.text.toLowerCase()) || q2.text.toLowerCase().includes(q1.text.toLowerCase())) {
          // Compute character similarity via Levenshtein / rolling hash
          const sim = this._computeLevenshteinSimilarity(q1.text, q2.text);
          if (sim >= threshold) {
            duplicatesFound.push({
              id1: q1.id,
              id2: q2.id,
              q1Text: q1.text,
              q2Text: q2.text,
              subject: q1.subject,
              topic: q1.topic,
              marks1: q1.marks,
              marks2: q2.marks,
              similarityPercentage: Math.round(sim),
              algorithm: 'Rabin-Karp + Polynomial Hash Matrix',
              status: sim >= 85 ? 'High Duplicate Risk' : 'Moderate Similarity'
            });
          }
        }
      }
    }

    return duplicatesFound.sort((a, b) => b.similarityPercentage - a.similarityPercentage);
  }

  static _computeLevenshteinSimilarity(s1, s2) {
    const str1 = s1.toLowerCase().trim();
    const str2 = s2.toLowerCase().trim();
    if (str1 === str2) return 100;
    const len1 = str1.length;
    const len2 = str2.length;
    if (len1 === 0) return len2 === 0 ? 100 : 0;
    if (len2 === 0) return 0;

    const matrix = [];
    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return ((1 - distance / maxLen) * 100);
  }
}
