/**
 * B-Tree Index implementation for Multi-Key Sorting and Range Searching (Topic, Unit, Marks).
 * Minimum degree t = 3 (each internal node has at least t-1 keys and at most 2t-1 keys).
 * Complexity: Search O(log N), Range Search O(log N + K)
 */
class BTreeNode {
  constructor(isLeaf = true) {
    this.isLeaf = isLeaf;
    this.keys = []; // Array of { key: comparable, data: array of question objects }
    this.children = []; // Array of BTreeNode references
  }
}

export class BTreeIndex {
  constructor(keyExtractor, indexName = 'Generic', t = 3) {
    this.t = t; // Minimum degree
    this.root = new BTreeNode(true);
    this.keyExtractor = keyExtractor; // function(item) -> comparable key
    this.indexName = indexName;
    this.size = 0;
  }

  // Insert a question into the B-Tree
  insert(item) {
    const key = this.keyExtractor(item);
    const root = this.root;

    if (root.keys.length === 2 * this.t - 1) {
      const s = new BTreeNode(false);
      this.root = s;
      s.children.push(root);
      this._splitChild(s, 0, root);
      this._insertNonFull(s, key, item);
    } else {
      this._insertNonFull(root, key, item);
    }
    this.size++;
  }

  _splitChild(parent, index, child) {
    const t = this.t;
    const z = new BTreeNode(child.isLeaf);

    // Give z the last t-1 keys of child
    z.keys = child.keys.splice(t);
    const median = child.keys.pop(); // The t-th key

    // If child is not leaf, give z the last t children of child
    if (!child.isLeaf) {
      z.children = child.children.splice(t);
    }

    // Insert median key into parent at index
    parent.keys.splice(index, 0, median);
    parent.children.splice(index + 1, 0, z);
  }

  _insertNonFull(node, key, item) {
    let i = node.keys.length - 1;

    // Check if key already exists in this node
    const existingKeyIdx = node.keys.findIndex(k => k.key === key);
    if (existingKeyIdx !== -1) {
      node.keys[existingKeyIdx].data.push(item);
      return;
    }

    if (node.isLeaf) {
      // Find location to insert new key
      while (i >= 0 && key < node.keys[i].key) {
        i--;
      }
      node.keys.splice(i + 1, 0, { key, data: [item] });
    } else {
      // Find child to recurse into
      while (i >= 0 && key < node.keys[i].key) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === 2 * this.t - 1) {
        this._splitChild(node, i, node.children[i]);
        if (key > node.keys[i].key) {
          i++;
        } else if (key === node.keys[i].key) {
          node.keys[i].data.push(item);
          return;
        }
      }
      this._insertNonFull(node.children[i], key, item);
    }
  }

  // Exact search O(log N)
  search(key) {
    const startTime = performance.now();
    let steps = 0;

    const _searchNode = (node, k) => {
      if (!node) return [];
      steps++;
      let i = 0;
      while (i < node.keys.length && k > node.keys[i].key) {
        i++;
      }

      if (i < node.keys.length && k === node.keys[i].key) {
        return node.keys[i].data;
      }

      if (node.isLeaf) {
        return [];
      }

      return _searchNode(node.children[i], k);
    };

    const results = _searchNode(this.root, key);
    const endTime = performance.now();

    return {
      results,
      steps,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: `B-Tree Index [${this.indexName}] Search`,
      complexity: 'O(log N)'
    };
  }

  // Range Search O(log N + K) - e.g. marks between 5 and 15
  rangeSearch(minKey, maxKey) {
    const startTime = performance.now();
    const results = [];
    let steps = 0;

    const _traverseRange = (node) => {
      if (!node) return;
      steps++;

      let i = 0;
      while (i < node.keys.length) {
        // Recurse left child if range might fall left
        if (!node.isLeaf && minKey <= node.keys[i].key) {
          _traverseRange(node.children[i]);
        }

        // Include current key if in range
        if (node.keys[i].key >= minKey && node.keys[i].key <= maxKey) {
          results.push(...node.keys[i].data);
        }

        i++;
      }

      // Recurse right-most child if needed
      if (!node.isLeaf && maxKey >= node.keys[node.keys.length - 1].key) {
        _traverseRange(node.children[i]);
      }
    };

    _traverseRange(this.root);
    const endTime = performance.now();

    return {
      results,
      steps,
      executionTimeMs: (endTime - startTime).toFixed(4),
      algorithm: `B-Tree Index [${this.indexName}] Range Query`,
      complexity: 'O(log N + K)'
    };
  }

  // In-order traversal to retrieve all items in sorted order O(N)
  getAllSorted() {
    const results = [];
    const _traverse = (node) => {
      if (!node) return;
      for (let i = 0; i < node.keys.length; i++) {
        if (!node.isLeaf) _traverse(node.children[i]);
        results.push(...node.keys[i].data);
      }
      if (!node.isLeaf) _traverse(node.children[node.keys.length]);
    };
    _traverse(this.root);
    return results;
  }

  // Get B-Tree structure for visualization
  getTreeStructure() {
    const _formatNode = (node, depth = 0) => {
      if (!node) return null;
      return {
        keys: node.keys.map(k => ({ key: k.key, count: k.data.length })),
        isLeaf: node.isLeaf,
        depth,
        children: node.children.map(child => _formatNode(child, depth + 1))
      };
    };
    return _formatNode(this.root, 0);
  }
}
