import { create } from 'zustand';

export type NodeState = 'unvisited' | 'visiting' | 'visited' | 'path' | 'start' | 'end';
export type EdgeState = 'unvisited' | 'visiting' | 'visited' | 'path';
export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'bellman-ford' | 'prims' | 'kruskals' | 'topological' | 'floyd-warshall';

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  state: NodeState;
  distance?: number;
  parent?: string | null;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  state: EdgeState;
  directed?: boolean;
}

interface StepSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visitedOrder: string[];
  pathNodes: string[];
  currentLine: number;
}

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  algorithm: GraphAlgorithm;
  isDirected: boolean;
  isWeighted: boolean;
  startNode: string | null;
  endNode: string | null;
  visitedOrder: string[];
  pathNodes: string[];
  currentStep: number;
  totalSteps: number;
  
  // Step history
  stepHistory: StepSnapshot[];
  currentStepIndex: number;
  currentLine: number;
  
  // Actions
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  addNode: (x: number, y: number) => void;
  removeNode: (id: string) => void;
  addEdge: (source: string, target: string, weight?: number) => void;
  removeEdge: (id: string) => void;
  updateNode: (id: string, updates: Partial<GraphNode>) => void;
  updateEdge: (id: string, updates: Partial<GraphEdge>) => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  setAlgorithm: (algo: GraphAlgorithm) => void;
  setIsDirected: (directed: boolean) => void;
  setIsWeighted: (weighted: boolean) => void;
  setStartNode: (id: string | null) => void;
  setEndNode: (id: string | null) => void;
  setVisitedOrder: (order: string[]) => void;
  setPathNodes: (path: string[]) => void;
  resetGraph: () => void;
  resetVisualization: () => void;
  generateRandomGraph: (nodeCount?: number) => void;
  generatePresetGraph: (preset: string) => void;
  
  // Step history actions
  setCurrentLine: (line: number) => void;
  saveStep: () => void;
  stepBack: () => void;
  stepForward: () => void;
  clearHistory: () => void;
  canStepBack: () => boolean;
  canStepForward: () => boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    { id: 'A', x: 100, y: 150, label: 'A', state: 'unvisited' },
    { id: 'B', x: 250, y: 80, label: 'B', state: 'unvisited' },
    { id: 'C', x: 250, y: 220, label: 'C', state: 'unvisited' },
    { id: 'D', x: 400, y: 80, label: 'D', state: 'unvisited' },
    { id: 'E', x: 400, y: 220, label: 'E', state: 'unvisited' },
    { id: 'F', x: 550, y: 150, label: 'F', state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { id: 'e1', source: 'A', target: 'B', weight: 4, state: 'unvisited' },
    { id: 'e2', source: 'A', target: 'C', weight: 2, state: 'unvisited' },
    { id: 'e3', source: 'B', target: 'C', weight: 1, state: 'unvisited' },
    { id: 'e4', source: 'B', target: 'D', weight: 5, state: 'unvisited' },
    { id: 'e5', source: 'C', target: 'E', weight: 3, state: 'unvisited' },
    { id: 'e6', source: 'D', target: 'E', weight: 1, state: 'unvisited' },
    { id: 'e7', source: 'D', target: 'F', weight: 3, state: 'unvisited' },
    { id: 'e8', source: 'E', target: 'F', weight: 2, state: 'unvisited' },
  ];

  return { nodes, edges };
};

export const useGraphStore = create<GraphState>((set, get) => ({
  ...createDefaultGraph(),
  isRunning: false,
  isPaused: false,
  speed: 500,
  algorithm: 'bfs',
  isDirected: false,
  isWeighted: true,
  startNode: 'A',
  endNode: 'F',
  visitedOrder: [],
  pathNodes: [],
  currentStep: 0,
  totalSteps: 0,
  
  // Step history
  stepHistory: [],
  currentStepIndex: -1,
  currentLine: -1,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (x, y) => {
    const { nodes } = get();
    const label = String.fromCharCode(65 + nodes.length);
    const newNode: GraphNode = {
      id: generateId(),
      x,
      y,
      label,
      state: 'unvisited',
    };
    set({ nodes: [...nodes, newNode] });
  },

  removeNode: (id) => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.filter((n) => n.id !== id),
      edges: edges.filter((e) => e.source !== id && e.target !== id),
    });
  },

  addEdge: (source, target, weight = 1) => {
    const { edges } = get();
    const newEdge: GraphEdge = {
      id: generateId(),
      source,
      target,
      weight,
      state: 'unvisited',
    };
    set({ edges: [...edges, newEdge] });
  },

  removeEdge: (id) => {
    const { edges } = get();
    set({ edges: edges.filter((e) => e.id !== id) });
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  },

  updateEdge: (id, updates) => {
    set((state) => ({
      edges: state.edges.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setSpeed: (speed) => set({ speed }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setIsDirected: (isDirected) => set({ isDirected }),
  setIsWeighted: (isWeighted) => set({ isWeighted }),
  setStartNode: (startNode) => set({ startNode }),
  setEndNode: (endNode) => set({ endNode }),
  setVisitedOrder: (visitedOrder) => set({ visitedOrder }),
  setPathNodes: (pathNodes) => set({ pathNodes }),

  resetGraph: () => {
    const defaultGraph = createDefaultGraph();
    set({
      ...defaultGraph,
      isRunning: false,
      isPaused: false,
      visitedOrder: [],
      pathNodes: [],
      currentStep: 0,
      totalSteps: 0,
      startNode: 'A',
      endNode: 'F',
    });
  },

  resetVisualization: () => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({ ...n, state: 'unvisited' as NodeState, distance: undefined, parent: null })),
      edges: state.edges.map((e) => ({ ...e, state: 'unvisited' as EdgeState })),
      visitedOrder: [],
      pathNodes: [],
      currentStep: 0,
      isRunning: false,
      isPaused: false,
    }));
  },

  generateRandomGraph: (nodeCount = 8) => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    
    // Generate nodes in a circle layout
    const centerX = 350;
    const centerY = 200;
    const radius = 150;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      nodes.push({
        id: String.fromCharCode(65 + i),
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        label: String.fromCharCode(65 + i),
        state: 'unvisited',
      });
    }
    
    // Generate random edges
    for (let i = 0; i < nodeCount; i++) {
      const numEdges = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numEdges; j++) {
        const targetIdx = (i + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
        const source = nodes[i].id;
        const target = nodes[targetIdx].id;
        
        if (!edges.find((e) => (e.source === source && e.target === target) || (e.source === target && e.target === source))) {
          edges.push({
            id: generateId(),
            source,
            target,
            weight: Math.floor(Math.random() * 9) + 1,
            state: 'unvisited',
          });
        }
      }
    }
    
    set({ nodes, edges, startNode: nodes[0]?.id || null, endNode: nodes[nodes.length - 1]?.id || null });
  },

  generatePresetGraph: (preset) => {
    let nodes: GraphNode[] = [];
    let edges: GraphEdge[] = [];

    switch (preset) {
      case 'simple':
        // Simple 6-node graph
        nodes = [
          { id: 'A', x: 100, y: 150, label: 'A', state: 'unvisited' },
          { id: 'B', x: 250, y: 80, label: 'B', state: 'unvisited' },
          { id: 'C', x: 250, y: 220, label: 'C', state: 'unvisited' },
          { id: 'D', x: 400, y: 80, label: 'D', state: 'unvisited' },
          { id: 'E', x: 400, y: 220, label: 'E', state: 'unvisited' },
          { id: 'F', x: 550, y: 150, label: 'F', state: 'unvisited' },
        ];
        edges = [
          { id: 'e1', source: 'A', target: 'B', weight: 4, state: 'unvisited' },
          { id: 'e2', source: 'A', target: 'C', weight: 2, state: 'unvisited' },
          { id: 'e3', source: 'B', target: 'C', weight: 1, state: 'unvisited' },
          { id: 'e4', source: 'B', target: 'D', weight: 5, state: 'unvisited' },
          { id: 'e5', source: 'C', target: 'E', weight: 3, state: 'unvisited' },
          { id: 'e6', source: 'D', target: 'E', weight: 1, state: 'unvisited' },
          { id: 'e7', source: 'D', target: 'F', weight: 3, state: 'unvisited' },
          { id: 'e8', source: 'E', target: 'F', weight: 2, state: 'unvisited' },
        ];
        break;
      case 'complex':
        // Complex 10-node graph
        nodes = [
          { id: 'A', x: 100, y: 200, label: 'A', state: 'unvisited' },
          { id: 'B', x: 200, y: 100, label: 'B', state: 'unvisited' },
          { id: 'C', x: 200, y: 300, label: 'C', state: 'unvisited' },
          { id: 'D', x: 320, y: 50, label: 'D', state: 'unvisited' },
          { id: 'E', x: 320, y: 180, label: 'E', state: 'unvisited' },
          { id: 'F', x: 320, y: 310, label: 'F', state: 'unvisited' },
          { id: 'G', x: 440, y: 100, label: 'G', state: 'unvisited' },
          { id: 'H', x: 440, y: 250, label: 'H', state: 'unvisited' },
          { id: 'I', x: 560, y: 180, label: 'I', state: 'unvisited' },
          { id: 'J', x: 650, y: 180, label: 'J', state: 'unvisited' },
        ];
        edges = [
          { id: 'e1', source: 'A', target: 'B', weight: 3, state: 'unvisited' },
          { id: 'e2', source: 'A', target: 'C', weight: 5, state: 'unvisited' },
          { id: 'e3', source: 'B', target: 'D', weight: 2, state: 'unvisited' },
          { id: 'e4', source: 'B', target: 'E', weight: 4, state: 'unvisited' },
          { id: 'e5', source: 'C', target: 'E', weight: 1, state: 'unvisited' },
          { id: 'e6', source: 'C', target: 'F', weight: 6, state: 'unvisited' },
          { id: 'e7', source: 'D', target: 'G', weight: 3, state: 'unvisited' },
          { id: 'e8', source: 'E', target: 'G', weight: 2, state: 'unvisited' },
          { id: 'e9', source: 'E', target: 'H', weight: 5, state: 'unvisited' },
          { id: 'e10', source: 'F', target: 'H', weight: 4, state: 'unvisited' },
          { id: 'e11', source: 'G', target: 'I', weight: 3, state: 'unvisited' },
          { id: 'e12', source: 'H', target: 'I', weight: 2, state: 'unvisited' },
          { id: 'e13', source: 'I', target: 'J', weight: 1, state: 'unvisited' },
          { id: 'e14', source: 'D', target: 'E', weight: 7, state: 'unvisited' },
          { id: 'e15', source: 'G', target: 'H', weight: 4, state: 'unvisited' },
        ];
        break;
      case 'tree':
        nodes = [
          { id: 'A', x: 350, y: 50, label: 'A', state: 'unvisited' },
          { id: 'B', x: 200, y: 150, label: 'B', state: 'unvisited' },
          { id: 'C', x: 500, y: 150, label: 'C', state: 'unvisited' },
          { id: 'D', x: 125, y: 250, label: 'D', state: 'unvisited' },
          { id: 'E', x: 275, y: 250, label: 'E', state: 'unvisited' },
          { id: 'F', x: 425, y: 250, label: 'F', state: 'unvisited' },
          { id: 'G', x: 575, y: 250, label: 'G', state: 'unvisited' },
        ];
        edges = [
          { id: 'e1', source: 'A', target: 'B', weight: 3, state: 'unvisited' },
          { id: 'e2', source: 'A', target: 'C', weight: 2, state: 'unvisited' },
          { id: 'e3', source: 'B', target: 'D', weight: 4, state: 'unvisited' },
          { id: 'e4', source: 'B', target: 'E', weight: 1, state: 'unvisited' },
          { id: 'e5', source: 'C', target: 'F', weight: 5, state: 'unvisited' },
          { id: 'e6', source: 'C', target: 'G', weight: 3, state: 'unvisited' },
        ];
        break;
      case 'grid':
        // 3x3 Grid graph
        const gridSize = 3;
        const spacing = 150;
        const startX = 200;
        const startY = 80;
        
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const idx = row * gridSize + col;
            nodes.push({
              id: String.fromCharCode(65 + idx),
              x: startX + col * spacing,
              y: startY + row * spacing,
              label: String.fromCharCode(65 + idx),
              state: 'unvisited',
            });
          }
        }
        
        // Horizontal edges
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize - 1; col++) {
            const idx = row * gridSize + col;
            edges.push({
              id: `eh${idx}`,
              source: String.fromCharCode(65 + idx),
              target: String.fromCharCode(65 + idx + 1),
              weight: Math.floor(Math.random() * 5) + 1,
              state: 'unvisited',
            });
          }
        }
        
        // Vertical edges
        for (let row = 0; row < gridSize - 1; row++) {
          for (let col = 0; col < gridSize; col++) {
            const idx = row * gridSize + col;
            edges.push({
              id: `ev${idx}`,
              source: String.fromCharCode(65 + idx),
              target: String.fromCharCode(65 + idx + gridSize),
              weight: Math.floor(Math.random() * 5) + 1,
              state: 'unvisited',
            });
          }
        }
        break;
      case 'dag':
        nodes = [
          { id: 'A', x: 100, y: 200, label: 'A', state: 'unvisited' },
          { id: 'B', x: 220, y: 100, label: 'B', state: 'unvisited' },
          { id: 'C', x: 220, y: 300, label: 'C', state: 'unvisited' },
          { id: 'D', x: 380, y: 100, label: 'D', state: 'unvisited' },
          { id: 'E', x: 380, y: 200, label: 'E', state: 'unvisited' },
          { id: 'F', x: 380, y: 300, label: 'F', state: 'unvisited' },
          { id: 'G', x: 540, y: 200, label: 'G', state: 'unvisited' },
        ];
        edges = [
          { id: 'e1', source: 'A', target: 'B', weight: 2, state: 'unvisited', directed: true },
          { id: 'e2', source: 'A', target: 'C', weight: 3, state: 'unvisited', directed: true },
          { id: 'e3', source: 'B', target: 'D', weight: 1, state: 'unvisited', directed: true },
          { id: 'e4', source: 'B', target: 'E', weight: 4, state: 'unvisited', directed: true },
          { id: 'e5', source: 'C', target: 'E', weight: 2, state: 'unvisited', directed: true },
          { id: 'e6', source: 'C', target: 'F', weight: 5, state: 'unvisited', directed: true },
          { id: 'e7', source: 'D', target: 'G', weight: 3, state: 'unvisited', directed: true },
          { id: 'e8', source: 'E', target: 'G', weight: 1, state: 'unvisited', directed: true },
          { id: 'e9', source: 'F', target: 'G', weight: 2, state: 'unvisited', directed: true },
        ];
        // DAG should be directed
        set({ isDirected: true });
        break;
      default:
        return;
    }

    set({ 
      nodes, 
      edges, 
      startNode: nodes[0]?.id || null, 
      endNode: nodes[nodes.length - 1]?.id || null,
      visitedOrder: [],
      pathNodes: [],
      isRunning: false,
      isPaused: false,
      stepHistory: [],
      currentStepIndex: -1,
      currentLine: -1,
    });
  },
  
  // Step history actions
  setCurrentLine: (currentLine) => set({ currentLine }),
  
  saveStep: () => {
    const { nodes, edges, visitedOrder, pathNodes, currentLine, stepHistory, currentStepIndex } = get();
    const snapshot: StepSnapshot = {
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
      visitedOrder: [...visitedOrder],
      pathNodes: [...pathNodes],
      currentLine,
    };
    const newHistory = stepHistory.slice(0, currentStepIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > 500) newHistory.shift();
    set({ stepHistory: newHistory, currentStepIndex: newHistory.length - 1 });
  },
  
  stepBack: () => {
    const { stepHistory, currentStepIndex } = get();
    if (currentStepIndex > 0) {
      const prevStep = stepHistory[currentStepIndex - 1];
      set({
        nodes: prevStep.nodes.map(n => ({ ...n })),
        edges: prevStep.edges.map(e => ({ ...e })),
        visitedOrder: [...prevStep.visitedOrder],
        pathNodes: [...prevStep.pathNodes],
        currentLine: prevStep.currentLine,
        currentStepIndex: currentStepIndex - 1,
      });
    }
  },
  
  stepForward: () => {
    const { stepHistory, currentStepIndex } = get();
    if (currentStepIndex < stepHistory.length - 1) {
      const nextStep = stepHistory[currentStepIndex + 1];
      set({
        nodes: nextStep.nodes.map(n => ({ ...n })),
        edges: nextStep.edges.map(e => ({ ...e })),
        visitedOrder: [...nextStep.visitedOrder],
        pathNodes: [...nextStep.pathNodes],
        currentLine: nextStep.currentLine,
        currentStepIndex: currentStepIndex + 1,
      });
    }
  },
  
  clearHistory: () => set({ stepHistory: [], currentStepIndex: -1, currentLine: -1 }),
  
  canStepBack: () => get().currentStepIndex > 0,
  canStepForward: () => get().currentStepIndex < get().stepHistory.length - 1,
}));
