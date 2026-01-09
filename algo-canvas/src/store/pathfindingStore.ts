import { create } from 'zustand';

export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'current';
export type PathfindingAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

interface Cell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  fScore: number;
  gScore: number;
  hScore: number;
  parent: { row: number; col: number } | null;
}

interface PathfindingState {
  grid: Cell[][];
  rows: number;
  cols: number;
  start: { row: number; col: number };
  end: { row: number; col: number };
  algorithm: PathfindingAlgorithm;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  isDrawing: boolean;
  drawMode: 'wall' | 'erase' | 'start' | 'end';
  nodesVisited: number;
  pathLength: number;
  
  // Step history for undo
  stepHistory: Cell[][][];
  currentStepIndex: number;
  currentLine: number;
  
  // Actions
  setAlgorithm: (algo: PathfindingAlgorithm) => void;
  setCurrentLine: (line: number) => void;
  setSpeed: (speed: number) => void;
  setGridSize: (rows: number, cols: number) => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setDrawMode: (mode: 'wall' | 'erase' | 'start' | 'end') => void;
  setIsDrawing: (drawing: boolean) => void;
  
  // Cell operations
  setCellType: (row: number, col: number, type: CellType) => void;
  updateCell: (row: number, col: number, updates: Partial<Cell>) => void;
  setStart: (row: number, col: number) => void;
  setEnd: (row: number, col: number) => void;
  
  // Grid operations
  clearGrid: () => void;
  clearPath: () => void;
  generateMaze: () => void;
  resetGrid: () => void;
  
  // Stats
  incrementNodesVisited: () => void;
  setPathLength: (length: number) => void;
  
  // Step history
  saveStep: () => void;
  stepBack: () => void;
  stepForward: () => void;
  clearHistory: () => void;
  canStepBack: () => boolean;
  canStepForward: () => boolean;
}

const createEmptyGrid = (rows: number, cols: number): Cell[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      type: 'empty' as CellType,
      distance: Infinity,
      fScore: Infinity,
      gScore: Infinity,
      hScore: 0,
      parent: null,
    }))
  );
};

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 40;
const DEFAULT_START = { row: 10, col: 5 };
const DEFAULT_END = { row: 10, col: 35 };

export const usePathfindingStore = create<PathfindingState>((set, get) => {
  const initialGrid = createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS);
  initialGrid[DEFAULT_START.row][DEFAULT_START.col].type = 'start';
  initialGrid[DEFAULT_END.row][DEFAULT_END.col].type = 'end';

  return {
    grid: initialGrid,
    rows: DEFAULT_ROWS,
    cols: DEFAULT_COLS,
    start: DEFAULT_START,
    end: DEFAULT_END,
    algorithm: 'bfs',
    isRunning: false,
    isPaused: false,
    speed: 20,
    isDrawing: false,
    drawMode: 'wall',
    nodesVisited: 0,
    pathLength: 0,
    stepHistory: [],
    currentStepIndex: -1,
    currentLine: -1,
    
    setAlgorithm: (algorithm) => set({ algorithm }),
    setCurrentLine: (line) => set({ currentLine: line }),
    setSpeed: (speed) => set({ speed }),
    
    setGridSize: (rows, cols) => {
      const grid = createEmptyGrid(rows, cols);
      const start = { row: Math.floor(rows / 2), col: Math.floor(cols / 6) };
      const end = { row: Math.floor(rows / 2), col: cols - Math.floor(cols / 6) };
      grid[start.row][start.col].type = 'start';
      grid[end.row][end.col].type = 'end';
      set({ grid, rows, cols, start, end, stepHistory: [], currentStepIndex: -1 });
    },
    
    setIsRunning: (isRunning) => set({ isRunning }),
    setIsPaused: (isPaused) => set({ isPaused }),
    setDrawMode: (drawMode) => set({ drawMode }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    
    setCellType: (row, col, type) => {
      const { grid, start, end } = get();
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;
      if ((row === start.row && col === start.col) || (row === end.row && col === end.col)) {
        if (type !== 'start' && type !== 'end') return;
      }
      
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].type = type;
      set({ grid: newGrid });
    },
    
    updateCell: (row, col, updates) => {
      const { grid } = get();
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = { ...newGrid[row][col], ...updates };
      set({ grid: newGrid });
    },
    
    setStart: (row, col) => {
      const { grid, start, end } = get();
      if (row === end.row && col === end.col) return;
      
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[start.row][start.col].type = 'empty';
      newGrid[row][col].type = 'start';
      set({ grid: newGrid, start: { row, col } });
    },
    
    setEnd: (row, col) => {
      const { grid, start, end } = get();
      if (row === start.row && col === start.col) return;
      
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[end.row][end.col].type = 'empty';
      newGrid[row][col].type = 'end';
      set({ grid: newGrid, end: { row, col } });
    },
    
    clearGrid: () => {
      const { rows, cols } = get();
      const grid = createEmptyGrid(rows, cols);
      const start = { row: Math.floor(rows / 2), col: Math.floor(cols / 6) };
      const end = { row: Math.floor(rows / 2), col: cols - Math.floor(cols / 6) };
      grid[start.row][start.col].type = 'start';
      grid[end.row][end.col].type = 'end';
      set({ 
        grid, start, end, 
        nodesVisited: 0, pathLength: 0,
        stepHistory: [], currentStepIndex: -1,
        isRunning: false, isPaused: false
      });
    },
    
    clearPath: () => {
      const { grid } = get();
      const newGrid = grid.map(row =>
        row.map(cell => ({
          ...cell,
          type: cell.type === 'visited' || cell.type === 'path' || cell.type === 'current' 
            ? 'empty' as CellType 
            : cell.type,
          distance: Infinity,
          fScore: Infinity,
          gScore: Infinity,
          hScore: 0,
          parent: null,
        }))
      );
      set({ 
        grid: newGrid, 
        nodesVisited: 0, pathLength: 0,
        stepHistory: [], currentStepIndex: -1 
      });
    },
    
    generateMaze: () => {
      const { rows, cols, start, end } = get();
      const grid = createEmptyGrid(rows, cols);
      
      // Simple random maze generation
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if ((row === start.row && col === start.col) || (row === end.row && col === end.col)) {
            continue;
          }
          if (Math.random() < 0.3) {
            grid[row][col].type = 'wall';
          }
        }
      }
      
      grid[start.row][start.col].type = 'start';
      grid[end.row][end.col].type = 'end';
      set({ grid, nodesVisited: 0, pathLength: 0, stepHistory: [], currentStepIndex: -1 });
    },
    
    resetGrid: () => {
      get().clearGrid();
    },
    
    incrementNodesVisited: () => set((state) => ({ nodesVisited: state.nodesVisited + 1 })),
    setPathLength: (pathLength) => set({ pathLength }),
    
    // Step history
    saveStep: () => {
      const { grid, stepHistory, currentStepIndex } = get();
      const snapshot = grid.map(row => row.map(cell => ({ ...cell })));
      const newHistory = stepHistory.slice(0, currentStepIndex + 1);
      newHistory.push(snapshot);
      if (newHistory.length > 500) newHistory.shift();
      set({ stepHistory: newHistory, currentStepIndex: newHistory.length - 1 });
    },
    
    stepBack: () => {
      const { stepHistory, currentStepIndex } = get();
      if (currentStepIndex > 0) {
        const prevGrid = stepHistory[currentStepIndex - 1].map(row => row.map(cell => ({ ...cell })));
        set({ grid: prevGrid, currentStepIndex: currentStepIndex - 1 });
      }
    },
    
    stepForward: () => {
      const { stepHistory, currentStepIndex } = get();
      if (currentStepIndex < stepHistory.length - 1) {
        const nextGrid = stepHistory[currentStepIndex + 1].map(row => row.map(cell => ({ ...cell })));
        set({ grid: nextGrid, currentStepIndex: currentStepIndex + 1 });
      }
    },
    
    clearHistory: () => set({ stepHistory: [], currentStepIndex: -1 }),
    canStepBack: () => get().currentStepIndex > 0,
    canStepForward: () => get().currentStepIndex < get().stepHistory.length - 1,
  };
});
