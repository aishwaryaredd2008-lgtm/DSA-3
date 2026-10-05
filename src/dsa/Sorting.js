/**
 * Merge Sort & Quick Sort Algorithms for Question Bank Organization
 * Supports sorting by Marks, Difficulty, Topic, Question ID, and Unit.
 * Tracks comparison counts, swaps, recursion depth, and execution time.
 */

// Difficulty order mapping for numerical comparison
const DIFFICULTY_WEIGHTS = {
  'Easy': 1,
  'Medium': 2,
  'Hard': 3
};

export class SortingAlgorithms {
  // Extract key value for comparison based on criteria
  static _getValue(item, key) {
    if (key === 'difficulty') {
      return DIFFICULTY_WEIGHTS[item.difficulty] || 2;
    }
    if (key === 'marks' || key === 'unit') {
      return Number(item[key]) || 0;
    }
    return String(item[key] || '').toLowerCase();
  }

  // MERGE SORT: Stable, O(N log N) Time, O(N) Space
  static mergeSort(array, sortKey = 'marks', ascending = true) {
    const startTime = performance.now();
    let comparisons = 0;
    let recursiveCalls = 0;
    const items = [...array];

    function merge(left, right) {
      const result = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
        comparisons++;
        const valL = SortingAlgorithms._getValue(left[i], sortKey);
        const valR = SortingAlgorithms._getValue(right[j], sortKey);

        const condition = ascending ? valL <= valR : valL >= valR;
        if (condition) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }

      while (i < left.length) {
        result.push(left[i]);
        i++;
      }
      while (j < right.length) {
        result.push(right[j]);
        j++;
      }

      return result;
    }

    function divide(arr) {
      recursiveCalls++;
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = divide(arr.slice(0, mid));
      const right = divide(arr.slice(mid));

      return merge(left, right);
    }

    const sorted = divide(items);
    const endTime = performance.now();

    return {
      sorted,
      comparisons,
      recursiveCalls,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Merge Sort',
      complexity: 'O(N log N) Best/Avg/Worst',
      isStable: true
    };
  }

  // QUICK SORT: In-place partition, O(N log N) Avg Time, O(log N) Space
  static quickSort(array, sortKey = 'marks', ascending = true) {
    const startTime = performance.now();
    let comparisons = 0;
    let swaps = 0;
    let recursiveCalls = 0;
    const items = [...array];

    function partition(arr, low, high) {
      const pivotVal = SortingAlgorithms._getValue(arr[high], sortKey);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        const currentVal = SortingAlgorithms._getValue(arr[j], sortKey);
        const condition = ascending ? currentVal <= pivotVal : currentVal >= pivotVal;

        if (condition) {
          i++;
          // Swap arr[i] and arr[j]
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          swaps++;
        }
      }

      // Swap arr[i + 1] and arr[high] (pivot)
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      swaps++;

      return i + 1;
    }

    function sort(arr, low, high) {
      recursiveCalls++;
      if (low < high) {
        const pi = partition(arr, low, high);
        sort(arr, low, pi - 1);
        sort(arr, pi + 1, high);
      }
    }

    if (items.length > 1) {
      sort(items, 0, items.length - 1);
    }

    const endTime = performance.now();

    return {
      sorted: items,
      comparisons,
      swaps,
      recursiveCalls,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Quick Sort (Lomuto Partition)',
      complexity: 'O(N log N) Avg, O(N²) Worst',
      isStable: false
    };
  }

  // Benchmark both Merge Sort and Quick Sort side-by-side
  static benchmarkSorts(array, sortKey = 'marks') {
    const mergeRes = this.mergeSort(array, sortKey, true);
    const quickRes = this.quickSort(array, sortKey, true);
    return {
      mergeSort: mergeRes,
      quickSort: quickRes,
      faster: parseFloat(mergeRes.executionTimeMs) < parseFloat(quickRes.executionTimeMs) ? 'Merge Sort' : 'Quick Sort'
    };
  }
}
