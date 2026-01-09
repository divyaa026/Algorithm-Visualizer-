import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataStructuresVisualizer } from '@/components/visualization/DataStructuresVisualizer';
import { DataStructuresControls } from '@/components/controls/DataStructuresControls';
import { CodePanel } from '@/components/panels/CodePanel';
import { useDataStructuresStore } from '@/store/dataStructuresStore';
import { motion } from 'framer-motion';

const structureCode: Record<string, string> = {
  'binary-tree': `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) {
      this.root = node;
      return;
    }
    
    const queue = [this.root];
    while (queue.length) {
      const current = queue.shift();
      if (!current.left) {
        current.left = node;
        return;
      }
      if (!current.right) {
        current.right = node;
        return;
      }
      queue.push(current.left, current.right);
    }
  }
  
  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.value);
      this.inorder(node.right, result);
    }
    return result;
  }
}`,
  bst: `class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) {
      this.root = node;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return;
        }
        current = current.right;
      }
    }
  }
  
  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }
}`,
  avl: `class AVLTree {
  getHeight(node) {
    return node ? node.height : 0;
  }
  
  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }
  
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    
    return x;
  }
  
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    
    return y;
  }
  
  insert(node, value) {
    if (!node) return new TreeNode(value);
    
    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else {
      node.right = this.insert(node.right, value);
    }
    
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    
    const balance = this.getBalance(node);
    
    // LL
    if (balance > 1 && value < node.left.value) return this.rotateRight(node);
    // RR
    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
    // LR
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    // RL
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    
    return node;
  }
}`,
  heap: `class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i) { return 2 * i + 1; }
  right(i) { return 2 * i + 2; }
  
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }
  
  heapifyUp(i) {
    while (i > 0 && this.heap[this.parent(i)] > this.heap[i]) {
      [this.heap[this.parent(i)], this.heap[i]] = 
        [this.heap[i], this.heap[this.parent(i)]];
      i = this.parent(i);
    }
  }
  
  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }
  
  heapifyDown(i) {
    let smallest = i;
    const left = this.left(i);
    const right = this.right(i);
    
    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
      smallest = right;
    }
    
    if (smallest !== i) {
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      this.heapifyDown(smallest);
    }
  }
}`,
  'linked-list': `class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  
  insertAtHead(value) {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.size++;
  }
  
  insertAtTail(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }
  
  delete(value) {
    if (!this.head) return;
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }
    if (current.next) {
      current.next = current.next.next;
      this.size--;
    }
  }
  
  search(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }
}`,
  stack: `class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

// Example usage
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.pop());  // 30 (LIFO)
console.log(stack.peek()); // 20`,
  queue: `class Queue {
  constructor() {
    this.items = [];
    this.front = 0;
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items[this.front++];
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.front];
  }
  
  isEmpty() {
    return this.front >= this.items.length;
  }
  
  size() {
    return this.items.length - this.front;
  }
}

// Example usage
const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.dequeue()); // 10 (FIFO)
console.log(queue.peek());    // 20`,
  'hash-table': `class HashTable {
  constructor(size = 53) {
    this.size = size;
    this.buckets = new Array(size).fill(null).map(() => []);
  }
  
  hash(key) {
    let hash = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      hash = (hash * PRIME + value) % this.size;
    }
    return hash;
  }
  
  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }
    bucket.push([key, value]);
  }
  
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (const pair of bucket) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }
  
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}`,
};

export const DataStructuresPage = () => {
  const { 
    structureType, 
    treeRoot, 
    listHead, 
    listNodes,
    stackQueue, 
    heapArray, 
    hashTable,
    generateRandomTree 
  } = useDataStructuresStore();

  // Generate sample data on first load
  useEffect(() => {
    if (!treeRoot && stackQueue.length === 0) {
      generateRandomTree(7);
    }
  }, []);

  const getStructureStats = () => {
    switch (structureType) {
      case 'binary-tree':
      case 'bst':
      case 'avl':
        const countNodes = (node: any): number => {
          if (!node) return 0;
          return 1 + countNodes(node.left) + countNodes(node.right);
        };
        const getHeight = (node: any): number => {
          if (!node) return 0;
          return 1 + Math.max(getHeight(node.left), getHeight(node.right));
        };
        return {
          count: countNodes(treeRoot),
          height: getHeight(treeRoot),
          type: structureType === 'avl' ? 'Balanced' : 'May be unbalanced'
        };
      case 'linked-list':
        return { count: listNodes.size, type: 'Singly Linked' };
      case 'stack':
        return { count: stackQueue.length, type: 'LIFO' };
      case 'queue':
        return { count: stackQueue.length, type: 'FIFO' };
      case 'heap':
        return { count: heapArray.length, type: 'Complete Binary Tree' };
      case 'hash-table':
        return { count: hashTable.filter(h => h !== null).length, type: 'Chaining' };
      default:
        return { count: 0, type: '' };
    }
  };

  const stats = getStructureStats();

  const getStructureTitle = () => {
    switch (structureType) {
      case 'binary-tree': return 'Binary Tree';
      case 'bst': return 'Binary Search Tree';
      case 'avl': return 'AVL Tree';
      case 'heap': return 'Heap';
      case 'linked-list': return 'Linked List';
      case 'stack': return 'Stack';
      case 'queue': return 'Queue';
      case 'hash-table': return 'Hash Table';
      default: return 'Data Structure';
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Data Structures
          </h1>
          <p className="text-muted-foreground">
            Explore trees, linked lists, stacks, queues, heaps, and hash tables
          </p>
        </div>

        {/* Visualization & Code Side by Side */}
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <DataStructuresVisualizer />
          <CodePanel 
            code={structureCode[structureType] || '// Select a data structure'} 
            language="javascript"
            title={`${getStructureTitle()} Implementation`}
          />
        </div>

        {/* Controls Below */}
        <div className="grid md:grid-cols-2 gap-4">
          <DataStructuresControls />
          
          {/* Info Panel */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-3">{getStructureTitle()} Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.count}</div>
                <div className="text-muted-foreground">
                  {structureType === 'hash-table' ? 'Entries' : 'Elements'}
                </div>
              </div>
              {'height' in stats && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.height}</div>
                  <div className="text-muted-foreground">Height</div>
                </div>
              )}
              <div className="text-center col-span-2">
                <div className="text-lg font-bold text-green-400">{stats.type}</div>
                <div className="text-muted-foreground">Type</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default DataStructuresPage;
