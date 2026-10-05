/**
 * Knuth-Morris-Pratt (KMP) String Matching Algorithm
 * Computes Longest Prefix Suffix (LPS) array for O(M + N) deterministic substring search.
 * Used for fast exact phrase matching and duplicate detection.
 */
export class KMPStringMatcher {
  // Compute LPS (Longest Proper Prefix which is also Suffix) Array
  static computeLPSArray(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let len = 0; // length of previous longest prefix suffix
    let i = 1;

    while (i < m) {
      if (pattern[i].toLowerCase() === pattern[len].toLowerCase()) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }

  // Search pattern in text using KMP
  static search(text, pattern) {
    const startTime = performance.now();
    const textNorm = text.toLowerCase();
    const patNorm = pattern.toLowerCase();
    const n = textNorm.length;
    const m = patNorm.length;

    if (m === 0) return { matches: [0], comparisons: 0, executionTimeMs: '0.0000', lps: [] };

    const lps = this.computeLPSArray(patNorm);
    const matches = [];
    let i = 0; // index for text
    let j = 0; // index for pattern
    let comparisons = 0;
    const stepsLog = [];

    while (i < n) {
      comparisons++;
      if (patNorm[j] === textNorm[i]) {
        i++;
        j++;
      }

      if (j === m) {
        matches.push(i - j);
        stepsLog.push({ index: i - j, match: text.substring(i - j, i) });
        j = lps[j - 1];
      } else if (i < n && patNorm[j] !== textNorm[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }

    const endTime = performance.now();
    return {
      found: matches.length > 0,
      matches,
      matchCount: matches.length,
      comparisons,
      executionTimeMs: (endTime - startTime).toFixed(4),
      lps,
      stepsLog,
      algorithm: 'Knuth-Morris-Pratt (KMP) Substring Matcher',
      complexity: 'O(N + M) Time, O(M) Space'
    };
  }

  // Check question similarity using sliding n-gram KMP window
  static checkSimilarity(queryText, targetText, nGramSize = 4) {
    const qWords = queryText.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 0);
    const tWords = targetText.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 0);

    if (qWords.length === 0 || tWords.length === 0) return { similarity: 0, matchedTokens: [] };

    // Exact full match check
    if (queryText.trim().toLowerCase() === targetText.trim().toLowerCase()) {
      return {
        similarity: 100,
        exactMatch: true,
        matchedTokens: qWords,
        algorithm: 'KMP Exact Match'
      };
    }

    // N-gram sliding window search using KMP
    let matchedGrams = 0;
    const totalGrams = Math.max(1, qWords.length - nGramSize + 1);
    const targetJoined = ' ' + tWords.join(' ') + ' ';
    const matchedTokens = [];

    for (let i = 0; i <= qWords.length - nGramSize; i++) {
      const gram = qWords.slice(i, i + nGramSize).join(' ');
      const searchRes = this.search(targetJoined, gram);
      if (searchRes.found) {
        matchedGrams++;
        matchedTokens.push(gram);
      }
    }

    // Jaccard word overlap as auxiliary
    const setQ = new Set(qWords);
    const setT = new Set(tWords);
    let commonWords = 0;
    for (const w of setQ) {
      if (setT.has(w)) commonWords++;
    }
    const jaccard = (commonWords / (setQ.size + setT.size - commonWords)) * 100;
    const kmpGramScore = (matchedGrams / totalGrams) * 100;

    const combinedScore = Math.round(Math.max(kmpGramScore, (jaccard * 0.4 + kmpGramScore * 0.6)));

    return {
      similarity: Math.min(100, combinedScore),
      isDuplicate: combinedScore >= 70,
      matchedTokens: matchedTokens.slice(0, 5),
      jaccardScore: jaccard.toFixed(1),
      kmpGramScore: kmpGramScore.toFixed(1),
      algorithm: 'KMP + N-Gram String Matching'
    };
  }
}
