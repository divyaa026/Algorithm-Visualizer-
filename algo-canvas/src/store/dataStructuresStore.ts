import { create } from 'zustand';

export type DataStructureType = 'binary-tree' | 'bst' | 'avl' | 'heap' | 'linked-list' | 'stack' | 'queue' | 'hash-table';
export type NodeHighlight = 'none' | 'active' | 'comparing' | 'found' | 'inserting' | 'deleting' | 'traversing';

// Tree Node
export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  highlight: NodeHighlight;
  height?: number; // For AVL
}

// Linked List Node
export interface ListNode {
  id: string;
  value: number;
  next: string | null;
  prev: string | null; // For doubly linked list
  highlight: NodeHighlight;
}

// Hash Table Entry
export interface HashEntry {
  key: string;
  value: number;
  highlight: NodeHighlight;
}

interface DataStructuresState {
  structureType: DataStructureType;
  
  // Tree state
  treeRoot: TreeNode | null;
  treeArray: (number | null)[];
  
  // Linked List state
  listHead: string | null;
  listNodes: Map<string, ListNode>;
  isDoublyLinked: boolean;
  
  // Stack/Queue state
  stackQueue: number[];
  
  // Heap state
  heapArray: number[];
  isMaxHeap: boolean;
  
  // Hash Table state
  hashTable: (HashEntry | null)[];
  hashTableSize: number;
  
  // General state
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  traversalOrder: number[];
  currentStep: number;
  operationHistory: string[];
  
  // Actions
  setStructureType: (type: DataStructureType) => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  
  // Tree operations
  setTreeRoot: (root: TreeNode | null) => void;
  insertToTree: (value: number) => void;
  deleteFromTree: (value: number) => void;
  searchInTree: (value: number) => Promise<TreeNode | null>;
  clearTree: () => void;
  generateRandomTree: (count?: number) => void;
  
  // Linked List operations
  insertAtHead: (value: number) => void;
  insertAtTail: (value: number) => void;
  insertAtPosition: (value: number, position: number) => void;
  deleteFromHead: () => void;
  deleteFromTail: () => void;
  deleteByValue: (value: number) => void;
  clearList: () => void;
  generateRandomList: (count?: number) => void;
  setIsDoublyLinked: (isDoubly: boolean) => void;
  
  // Stack/Queue operations
  push: (value: number) => void;
  pop: () => number | undefined;
  enqueue: (value: number) => void;
  dequeue: () => number | undefined;
  peek: () => number | undefined;
  clearStackQueue: () => void;
  
  // Heap operations
  insertToHeap: (value: number) => void;
  extractFromHeap: () => number | undefined;
  heapify: (arr: number[]) => void;
  setIsMaxHeap: (isMax: boolean) => void;
  clearHeap: () => void;
  generateRandomHeap: (count?: number) => void;
  
  // Hash Table operations
  hashInsert: (key: string, value: number) => void;
  hashDelete: (key: string) => void;
  hashSearch: (key: string) => HashEntry | null;
  clearHashTable: () => void;
  
  // Traversal
  setTraversalOrder: (order: number[]) => void;
  addToHistory: (operation: string) => void;
  resetVisualization: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultBST = (): TreeNode => {
  const root: TreeNode = { id: '1', value: 50, left: null, right: null, highlight: 'none' };
  root.left = { id: '2', value: 30, left: null, right: null, highlight: 'none' };
  root.right = { id: '3', value: 70, left: null, right: null, highlight: 'none' };
  root.left.left = { id: '4', value: 20, left: null, right: null, highlight: 'none' };
  root.left.right = { id: '5', value: 40, left: null, right: null, highlight: 'none' };
  root.right.left = { id: '6', value: 60, left: null, right: null, highlight: 'none' };
  root.right.right = { id: '7', value: 80, left: null, right: null, highlight: 'none' };
  return root;
};

const insertBST = (root: TreeNode | null, value: number): TreeNode => {
  if (!root) {
    return { id: generateId(), value, left: null, right: null, highlight: 'none' };
  }
  if (value < root.value) {
    root.left = insertBST(root.left, value);
  } else if (value > root.value) {
    root.right = insertBST(root.right, value);
  }
  return root;
};

const findMin = (node: TreeNode): TreeNode => {
  while (node.left) node = node.left;
  return node;
};

const deleteBST = (root: TreeNode | null, value: number): TreeNode | null => {
  if (!root) return null;
  
  if (value < root.value) {
    root.left = deleteBST(root.left, value);
  } else if (value > root.value) {
    root.right = deleteBST(root.right, value);
  } else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    
    const minNode = findMin(root.right);
    root.value = minNode.value;
    root.right = deleteBST(root.right, minNode.value);
  }
  return root;
};

const searchBST = (root: TreeNode | null, value: number): TreeNode | null => {
  if (!root || root.value === value) return root;
  if (value < root.value) return searchBST(root.left, value);
  return searchBST(root.right, value);
};

// Helper to deep clone tree with all highlights reset
const cloneTreeWithHighlights = (node: TreeNode | null, highlightId?: string, highlightType?: NodeHighlight): TreeNode | null => {
  if (!node) return null;
  return {
    ...node,
    highlight: node.id === highlightId ? (highlightType || 'none') : 'none',
    left: cloneTreeWithHighlights(node.left, highlightId, highlightType),
    right: cloneTreeWithHighlights(node.right, highlightId, highlightType),
  };
};

// Helper to reset all highlights in tree
const resetTreeHighlights = (node: TreeNode | null): TreeNode | null => {
  if (!node) return null;
  return {
    ...node,
    highlight: 'none',
    left: resetTreeHighlights(node.left),
    right: resetTreeHighlights(node.right),
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useDataStructuresStore = create<DataStructuresState>((set, get) => ({
  structureType: 'bst',
  
  treeRoot: createDefaultBST(),
  treeArray: [],
  
  listHead: null,
  listNodes: new Map(),
  isDoublyLinked: false,
  
  stackQueue: [],
  
  heapArray: [50, 30, 70, 20, 40, 60, 80],
  isMaxHeap: true,
  
  hashTable: Array(11).fill(null),
  hashTableSize: 11,
  
  isRunning: false,
  isPaused: false,
  speed: 500,
  traversalOrder: [],
  currentStep: 0,
  operationHistory: [],
  
  setStructureType: (structureType) => {
    const { treeRoot } = get();
    const resetTree = treeRoot ? resetTreeHighlights(treeRoot) : null;
    set({ structureType, treeRoot: resetTree });
  },
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setSpeed: (speed) => set({ speed }),
  
  // Tree operations
  setTreeRoot: (treeRoot) => set({ treeRoot }),
  
  insertToTree: (value) => {
    const { treeRoot } = get();
    const newRoot = insertBST(treeRoot, value);
    set({ treeRoot: newRoot });
    get().addToHistory(`Inserted ${value}`);
  },
  
  deleteFromTree: (value) => {
    const { treeRoot } = get();
    const newRoot = deleteBST(treeRoot, value);
    set({ treeRoot: newRoot });
    get().addToHistory(`Deleted ${value}`);
  },
  
  searchInTree: async (value) => {
    const { treeRoot, speed } = get();
    if (!treeRoot) return null;
    
    // Reset highlights before starting new search
    const resetTree = resetTreeHighlights(treeRoot);
    set({ treeRoot: resetTree, isRunning: true });
    
    let current: TreeNode | null = treeRoot;
    let foundNode: TreeNode | null = null;
    
    // Get fresh reference after reset
    const freshRoot = get().treeRoot;
    
    while (current) {
      // Highlight current node as 'comparing'
      const highlightedTree = cloneTreeWithHighlights(freshRoot, current.id, 'comparing');
      set({ treeRoot: highlightedTree });
      
      await delay(speed);
      
      if (current.value === value) {
        // Found! Highlight as 'found' and keep it highlighted
        const foundTree = cloneTreeWithHighlights(freshRoot, current.id, 'found');
        set({ treeRoot: foundTree, isRunning: false });
        foundNode = current;
        get().addToHistory(`Found ${value}`);
        return foundNode;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    // Not found - reset highlights
    const finalResetTree = resetTreeHighlights(freshRoot);
    set({ treeRoot: finalResetTree, isRunning: false });
    get().addToHistory(`${value} not found`);
    
    return null;
  },
  
  clearTree: () => set({ treeRoot: null, traversalOrder: [] }),
  
  generateRandomTree: (count = 7) => {
    let root: TreeNode | null = null;
    const values = new Set<number>();
    while (values.size < count) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    for (const val of values) {
      root = insertBST(root, val);
    }
    set({ treeRoot: root, traversalOrder: [] });
    get().addToHistory(`Generated random BST with ${count} nodes`);
  },
  
  // Linked List operations
  insertAtHead: (value) => {
    const { listHead, listNodes, isDoublyLinked } = get();
    const newId = generateId();
    const newNode: ListNode = {
      id: newId,
      value,
      next: listHead,
      prev: null,
      highlight: 'none',
    };
    
    const newNodes = new Map(listNodes);
    if (listHead && isDoublyLinked) {
      const headNode = newNodes.get(listHead)!;
      newNodes.set(listHead, { ...headNode, prev: newId });
    }
    newNodes.set(newId, newNode);
    
    set({ listHead: newId, listNodes: newNodes });
    get().addToHistory(`Inserted ${value} at head`);
  },
  
  insertAtTail: (value) => {
    const { listHead, listNodes, isDoublyLinked } = get();
    const newId = generateId();
    const newNodes = new Map(listNodes);
    
    if (!listHead) {
      newNodes.set(newId, { id: newId, value, next: null, prev: null, highlight: 'none' });
      set({ listHead: newId, listNodes: newNodes });
    } else {
      let current = listHead;
      while (newNodes.get(current)!.next) {
        current = newNodes.get(current)!.next!;
      }
      const tailNode = newNodes.get(current)!;
      newNodes.set(current, { ...tailNode, next: newId });
      newNodes.set(newId, { 
        id: newId, 
        value, 
        next: null, 
        prev: isDoublyLinked ? current : null,
        highlight: 'none' 
      });
      set({ listNodes: newNodes });
    }
    get().addToHistory(`Inserted ${value} at tail`);
  },
  
  insertAtPosition: (value, position) => {
    const { listHead, listNodes, isDoublyLinked } = get();
    if (position === 0) {
      get().insertAtHead(value);
      return;
    }
    
    const newNodes = new Map(listNodes);
    let current = listHead;
    let index = 0;
    
    while (current && index < position - 1) {
      current = newNodes.get(current)!.next;
      index++;
    }
    
    if (!current) {
      get().insertAtTail(value);
      return;
    }
    
    const newId = generateId();
    const currentNode = newNodes.get(current)!;
    const newNode: ListNode = {
      id: newId,
      value,
      next: currentNode.next,
      prev: isDoublyLinked ? current : null,
      highlight: 'none',
    };
    
    if (currentNode.next && isDoublyLinked) {
      const nextNode = newNodes.get(currentNode.next)!;
      newNodes.set(currentNode.next, { ...nextNode, prev: newId });
    }
    
    newNodes.set(current, { ...currentNode, next: newId });
    newNodes.set(newId, newNode);
    set({ listNodes: newNodes });
    get().addToHistory(`Inserted ${value} at position ${position}`);
  },
  
  deleteFromHead: () => {
    const { listHead, listNodes, isDoublyLinked } = get();
    if (!listHead) return;
    
    const newNodes = new Map(listNodes);
    const headNode = newNodes.get(listHead)!;
    const newHead = headNode.next;
    
    newNodes.delete(listHead);
    if (newHead && isDoublyLinked) {
      const newHeadNode = newNodes.get(newHead)!;
      newNodes.set(newHead, { ...newHeadNode, prev: null });
    }
    
    set({ listHead: newHead, listNodes: newNodes });
    get().addToHistory(`Deleted from head: ${headNode.value}`);
  },
  
  deleteFromTail: () => {
    const { listHead, listNodes } = get();
    if (!listHead) return;
    
    const newNodes = new Map(listNodes);
    
    if (!newNodes.get(listHead)!.next) {
      const val = newNodes.get(listHead)!.value;
      newNodes.delete(listHead);
      set({ listHead: null, listNodes: newNodes });
      get().addToHistory(`Deleted from tail: ${val}`);
      return;
    }
    
    let current = listHead;
    while (newNodes.get(newNodes.get(current)!.next!)?.next) {
      current = newNodes.get(current)!.next!;
    }
    
    const tailId = newNodes.get(current)!.next!;
    const tailVal = newNodes.get(tailId)!.value;
    newNodes.delete(tailId);
    newNodes.set(current, { ...newNodes.get(current)!, next: null });
    
    set({ listNodes: newNodes });
    get().addToHistory(`Deleted from tail: ${tailVal}`);
  },
  
  deleteByValue: (value) => {
    const { listHead, listNodes, isDoublyLinked } = get();
    if (!listHead) return;
    
    const newNodes = new Map(listNodes);
    
    if (newNodes.get(listHead)!.value === value) {
      get().deleteFromHead();
      return;
    }
    
    let current = listHead;
    while (newNodes.get(current)?.next) {
      const nextId = newNodes.get(current)!.next!;
      if (newNodes.get(nextId)!.value === value) {
        const nodeToDelete = newNodes.get(nextId)!;
        const afterId = nodeToDelete.next;
        
        newNodes.set(current, { ...newNodes.get(current)!, next: afterId });
        if (afterId && isDoublyLinked) {
          newNodes.set(afterId, { ...newNodes.get(afterId)!, prev: current });
        }
        newNodes.delete(nextId);
        set({ listNodes: newNodes });
        get().addToHistory(`Deleted node with value ${value}`);
        return;
      }
      current = nextId;
    }
  },
  
  clearList: () => set({ listHead: null, listNodes: new Map() }),
  
  generateRandomList: (count = 5) => {
    set({ listHead: null, listNodes: new Map() });
    for (let i = 0; i < count; i++) {
      get().insertAtTail(Math.floor(Math.random() * 100) + 1);
    }
    get().addToHistory(`Generated random list with ${count} nodes`);
  },
  
  setIsDoublyLinked: (isDoublyLinked) => set({ isDoublyLinked }),
  
  // Stack/Queue operations
  push: (value) => {
    set((state) => ({ stackQueue: [...state.stackQueue, value] }));
    get().addToHistory(`Push: ${value}`);
  },
  
  pop: () => {
    const { stackQueue } = get();
    if (stackQueue.length === 0) return undefined;
    const val = stackQueue[stackQueue.length - 1];
    set({ stackQueue: stackQueue.slice(0, -1) });
    get().addToHistory(`Pop: ${val}`);
    return val;
  },
  
  enqueue: (value) => {
    set((state) => ({ stackQueue: [...state.stackQueue, value] }));
    get().addToHistory(`Enqueue: ${value}`);
  },
  
  dequeue: () => {
    const { stackQueue } = get();
    if (stackQueue.length === 0) return undefined;
    const val = stackQueue[0];
    set({ stackQueue: stackQueue.slice(1) });
    get().addToHistory(`Dequeue: ${val}`);
    return val;
  },
  
  peek: () => {
    const { stackQueue, structureType } = get();
    if (stackQueue.length === 0) return undefined;
    return structureType === 'stack' ? stackQueue[stackQueue.length - 1] : stackQueue[0];
  },
  
  clearStackQueue: () => set({ stackQueue: [] }),
  
  // Heap operations
  insertToHeap: (value) => {
    const { heapArray, isMaxHeap } = get();
    const newHeap = [...heapArray, value];
    
    // Bubble up
    let i = newHeap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      const shouldSwap = isMaxHeap 
        ? newHeap[i] > newHeap[parent]
        : newHeap[i] < newHeap[parent];
      
      if (shouldSwap) {
        [newHeap[i], newHeap[parent]] = [newHeap[parent], newHeap[i]];
        i = parent;
      } else break;
    }
    
    set({ heapArray: newHeap });
    get().addToHistory(`Inserted ${value} to heap`);
  },
  
  extractFromHeap: () => {
    const { heapArray, isMaxHeap } = get();
    if (heapArray.length === 0) return undefined;
    
    const extracted = heapArray[0];
    const newHeap = [...heapArray];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    
    // Heapify down
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let target = i;
      
      if (left < newHeap.length) {
        const compare = isMaxHeap 
          ? newHeap[left] > newHeap[target]
          : newHeap[left] < newHeap[target];
        if (compare) target = left;
      }
      
      if (right < newHeap.length) {
        const compare = isMaxHeap 
          ? newHeap[right] > newHeap[target]
          : newHeap[right] < newHeap[target];
        if (compare) target = right;
      }
      
      if (target !== i) {
        [newHeap[i], newHeap[target]] = [newHeap[target], newHeap[i]];
        i = target;
      } else break;
    }
    
    set({ heapArray: newHeap });
    get().addToHistory(`Extracted ${extracted} from heap`);
    return extracted;
  },
  
  heapify: (arr) => {
    const { isMaxHeap } = get();
    const newHeap = [...arr];
    
    for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
      let current = i;
      while (true) {
        const left = 2 * current + 1;
        const right = 2 * current + 2;
        let target = current;
        
        if (left < newHeap.length) {
          const compare = isMaxHeap 
            ? newHeap[left] > newHeap[target]
            : newHeap[left] < newHeap[target];
          if (compare) target = left;
        }
        
        if (right < newHeap.length) {
          const compare = isMaxHeap 
            ? newHeap[right] > newHeap[target]
            : newHeap[right] < newHeap[target];
          if (compare) target = right;
        }
        
        if (target !== current) {
          [newHeap[current], newHeap[target]] = [newHeap[target], newHeap[current]];
          current = target;
        } else break;
      }
    }
    
    set({ heapArray: newHeap });
    get().addToHistory(`Heapified array`);
  },
  
  setIsMaxHeap: (isMaxHeap) => {
    set({ isMaxHeap });
    const { heapArray } = get();
    get().heapify(heapArray);
  },
  
  clearHeap: () => set({ heapArray: [] }),
  
  generateRandomHeap: (count = 7) => {
    const arr = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
    get().heapify(arr);
    get().addToHistory(`Generated random heap with ${count} elements`);
  },
  
  // Hash Table operations
  hashInsert: (key, value) => {
    const { hashTable, hashTableSize } = get();
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % hashTableSize;
    
    const newTable = [...hashTable];
    let index = hash;
    let attempts = 0;
    
    while (newTable[index] !== null && newTable[index]!.key !== key && attempts < hashTableSize) {
      index = (index + 1) % hashTableSize;
      attempts++;
    }
    
    if (attempts < hashTableSize) {
      newTable[index] = { key, value, highlight: 'none' };
      set({ hashTable: newTable });
      get().addToHistory(`Inserted (${key}, ${value}) at index ${index}`);
    }
  },
  
  hashDelete: (key) => {
    const { hashTable, hashTableSize } = get();
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % hashTableSize;
    
    const newTable = [...hashTable];
    let index = hash;
    let attempts = 0;
    
    while (newTable[index] !== null && attempts < hashTableSize) {
      if (newTable[index]!.key === key) {
        newTable[index] = null;
        set({ hashTable: newTable });
        get().addToHistory(`Deleted key "${key}" from index ${index}`);
        return;
      }
      index = (index + 1) % hashTableSize;
      attempts++;
    }
  },
  
  hashSearch: (key) => {
    const { hashTable, hashTableSize } = get();
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % hashTableSize;
    
    let index = hash;
    let attempts = 0;
    
    while (hashTable[index] !== null && attempts < hashTableSize) {
      if (hashTable[index]!.key === key) {
        return hashTable[index];
      }
      index = (index + 1) % hashTableSize;
      attempts++;
    }
    return null;
  },
  
  clearHashTable: () => set({ hashTable: Array(get().hashTableSize).fill(null) }),
  
  setTraversalOrder: (traversalOrder) => set({ traversalOrder }),
  addToHistory: (operation) => set((state) => ({ 
    operationHistory: [...state.operationHistory.slice(-9), operation] 
  })),
  resetVisualization: () => {
    const { treeRoot } = get();
    const resetTree = treeRoot ? resetTreeHighlights(treeRoot) : null;
    set({ traversalOrder: [], currentStep: 0, isRunning: false, isPaused: false, treeRoot: resetTree });
  },
}));
