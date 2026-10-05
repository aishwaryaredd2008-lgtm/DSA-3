/**
 * Custom Hash Table implementation with Separate Chaining for O(1) average lookup
 * Demonstrates DSA Methodology in Automated Question Bank System.
 */
export class HashTable {
  constructor(initialCapacity = 64) {
    this.capacity = initialCapacity;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.loadFactorThreshold = 0.75;
    this.collisions = 0;
    this.operationsLog = [];
  }

  // Polynomial Rolling Hash function for string and numeric keys
  _hash(key) {
    const strKey = String(key);
    let hash = 0;
    const prime = 31;
    for (let i = 0; i < strKey.length; i++) {
      hash = (hash * prime + strKey.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hash);
  }

  // Rehash when load factor exceeds threshold
  _rehash() {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;
    this.collisions = 0;

    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.insert(key, value, false);
      }
    }
  }

  // Insert key-value pair O(1)
  insert(key, value, log = true) {
    if (this.size / this.capacity >= this.loadFactorThreshold) {
      this._rehash();
    }

    const index = this._hash(key);
    const bucket = this.buckets[index];

    // Check if key already exists in bucket
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        if (log) {
          this.operationsLog.push({
            op: 'UPDATE',
            key,
            bucketIndex: index,
            time: Date.now(),
            complexity: 'O(1)'
          });
        }
        return index;
      }
    }

    if (bucket.length > 0) {
      this.collisions++;
    }

    bucket.push([key, value]);
    this.size++;

    if (log) {
      this.operationsLog.push({
        op: 'INSERT',
        key,
        bucketIndex: index,
        chainLength: bucket.length,
        time: Date.now(),
        complexity: 'O(1)'
      });
    }

    return index;
  }

  // Search by key O(1)
  search(key) {
    const startTime = performance.now();
    const index = this._hash(key);
    const bucket = this.buckets[index];
    let comparisons = 0;

    for (let i = 0; i < bucket.length; i++) {
      comparisons++;
      if (bucket[i][0] === key) {
        const endTime = performance.now();
        return {
          found: true,
          value: bucket[i][1],
          bucketIndex: index,
          chainDepth: i,
          comparisons,
          executionTimeMs: (endTime - startTime).toFixed(4),
          algorithm: 'Hash Table Direct Key Lookup',
          complexity: 'O(1) Avg / O(N) Worst'
        };
      }
    }

    const endTime = performance.now();
    return {
      found: false,
      value: null,
      bucketIndex: index,
      comparisons,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: 'Hash Table Direct Key Lookup',
      complexity: 'O(1) Avg'
    };
  }

  // Delete key
  delete(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        this.operationsLog.push({
          op: 'DELETE',
          key,
          bucketIndex: index,
          time: Date.now()
        });
        return true;
      }
    }
    return false;
  }

  // Get all values
  values() {
    const items = [];
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        items.push(value);
      }
    }
    return items;
  }

  // Stats for visualizer and analytics
  getStats() {
    return {
      capacity: this.capacity,
      size: this.size,
      loadFactor: (this.size / this.capacity).toFixed(3),
      collisions: this.collisions,
      nonEmptyBuckets: this.buckets.filter(b => b.length > 0).length,
      maxChainLength: Math.max(0, ...this.buckets.map(b => b.length)),
      recentOperations: this.operationsLog.slice(-10)
    };
  }
}
