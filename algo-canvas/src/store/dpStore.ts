import { create } from 'zustand';

export type DPProblem = 'fibonacci' | 'knapsack' | 'lcs' | 'lis' | 'edit-distance' | 'coin-change' | 'matrix-chain' | 'subset-sum';
export type CellState = 'empty' | 'computing' | 'computed' | 'optimal' | 'highlighted';

export interface DPCell {
  value: number | string;
  state: CellState;
  row: number;
  col: number;
}

export interface DPStep {
  row: number;
  col: number;
  value: number | string;
  formula: string;
  explanation: string;
  highlightCells?: { row: number; col: number }[];
}

interface DPState {
  problem: DPProblem;
  table: DPCell[][];
  steps: DPStep[];
  currentStep: number;
  currentLine: number;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  
  // Problem-specific inputs
  fibN: number;
  knapsackWeights: number[];
  knapsackValues: number[];
  knapsackCapacity: number;
  lcsString1: string;
  lcsString2: string;
  lisArray: number[];
  editStr1: string;
  editStr2: string;
  coinDenominations: number[];
  coinAmount: number;
  matrixDimensions: number[];
  subsetArray: number[];
  subsetTarget: number;
  
  // Result
  result: number | string | null;
  optimalPath: { row: number; col: number }[];
  
  // Actions
  setProblem: (problem: DPProblem) => void;
  setCurrentLine: (line: number) => void;
  setTable: (table: DPCell[][]) => void;
  setSteps: (steps: DPStep[]) => void;
  setCurrentStep: (step: number) => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  updateCell: (row: number, col: number, updates: Partial<DPCell>) => void;
  setFibN: (n: number) => void;
  setKnapsackInputs: (weights: number[], values: number[], capacity: number) => void;
  setLCSInputs: (str1: string, str2: string) => void;
  setLISArray: (arr: number[]) => void;
  setEditInputs: (str1: string, str2: string) => void;
  setCoinInputs: (denominations: number[], amount: number) => void;
  setMatrixDimensions: (dimensions: number[]) => void;
  setSubsetInputs: (arr: number[], target: number) => void;
  setResult: (result: number | string | null) => void;
  setOptimalPath: (path: { row: number; col: number }[]) => void;
  resetVisualization: () => void;
  initializeTable: () => void;
}

const createEmptyTable = (rows: number, cols: number): DPCell[][] => {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => ({
      value: 0,
      state: 'empty' as CellState,
      row: i,
      col: j,
    }))
  );
};

export const useDPStore = create<DPState>((set, get) => ({
  problem: 'fibonacci',
  table: createEmptyTable(1, 10),
  steps: [],
  currentStep: 0,
  isRunning: false,
  isPaused: false,
  speed: 300,
  
  fibN: 10,
  knapsackWeights: [2, 3, 4, 5],
  knapsackValues: [3, 4, 5, 6],
  knapsackCapacity: 8,
  lcsString1: 'ABCDGH',
  lcsString2: 'AEDFHR',
  lisArray: [10, 22, 9, 33, 21, 50, 41, 60],
  editStr1: 'sunday',
  editStr2: 'saturday',
  coinDenominations: [1, 2, 5, 10],
  coinAmount: 11,
  matrixDimensions: [10, 20, 30, 40, 30],
  subsetArray: [3, 34, 4, 12, 5, 2],
  subsetTarget: 9,
  
  result: null,
  optimalPath: [],
  currentLine: -1,
  
  setProblem: (problem) => set({ problem }),
  setCurrentLine: (line) => set({ currentLine: line }),
  setTable: (table) => set({ table }),
  setSteps: (steps) => set({ steps }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setSpeed: (speed) => set({ speed }),
  
  updateCell: (row, col, updates) => {
    set((state) => ({
      table: state.table.map((r, i) =>
        i === row
          ? r.map((c, j) => (j === col ? { ...c, ...updates } : c))
          : r
      ),
    }));
  },
  
  setFibN: (fibN) => set({ fibN }),
  setKnapsackInputs: (weights, values, capacity) =>
    set({ knapsackWeights: weights, knapsackValues: values, knapsackCapacity: capacity }),
  setLCSInputs: (str1, str2) => set({ lcsString1: str1, lcsString2: str2 }),
  setLISArray: (arr) => set({ lisArray: arr }),
  setEditInputs: (str1, str2) => set({ editStr1: str1, editStr2: str2 }),
  setCoinInputs: (denominations, amount) =>
    set({ coinDenominations: denominations, coinAmount: amount }),
  setMatrixDimensions: (dimensions) => set({ matrixDimensions: dimensions }),
  setSubsetInputs: (arr, target) => set({ subsetArray: arr, subsetTarget: target }),
  setResult: (result) => set({ result }),
  setOptimalPath: (optimalPath) => set({ optimalPath }),
  
  resetVisualization: () => {
    set({
      steps: [],
      currentStep: 0,
      isRunning: false,
      isPaused: false,
      result: null,
      optimalPath: [],
    });
    get().initializeTable();
  },
  
  initializeTable: () => {
    const { problem, fibN, knapsackWeights, knapsackCapacity, lcsString1, lcsString2, 
            lisArray, editStr1, editStr2, coinDenominations, coinAmount,
            matrixDimensions, subsetArray, subsetTarget } = get();
    
    let table: DPCell[][];
    
    switch (problem) {
      case 'fibonacci':
        table = [Array.from({ length: fibN + 1 }, (_, i) => ({
          value: i <= 1 ? i : '',
          state: i <= 1 ? 'computed' as CellState : 'empty' as CellState,
          row: 0,
          col: i,
        }))];
        break;
        
      case 'knapsack':
        const n = knapsackWeights.length;
        table = createEmptyTable(n + 1, knapsackCapacity + 1);
        // Initialize first row and column to 0
        for (let i = 0; i <= n; i++) table[i][0] = { ...table[i][0], value: 0, state: 'computed' };
        for (let j = 0; j <= knapsackCapacity; j++) table[0][j] = { ...table[0][j], value: 0, state: 'computed' };
        break;
        
      case 'lcs':
        table = createEmptyTable(lcsString1.length + 1, lcsString2.length + 1);
        for (let i = 0; i <= lcsString1.length; i++) table[i][0] = { ...table[i][0], value: 0, state: 'computed' };
        for (let j = 0; j <= lcsString2.length; j++) table[0][j] = { ...table[0][j], value: 0, state: 'computed' };
        break;
        
      case 'lis':
        table = [Array.from({ length: lisArray.length }, (_, i) => ({
          value: 1,
          state: 'empty' as CellState,
          row: 0,
          col: i,
        }))];
        break;
        
      case 'edit-distance':
        table = createEmptyTable(editStr1.length + 1, editStr2.length + 1);
        for (let i = 0; i <= editStr1.length; i++) table[i][0] = { ...table[i][0], value: i, state: 'computed' };
        for (let j = 0; j <= editStr2.length; j++) table[0][j] = { ...table[0][j], value: j, state: 'computed' };
        break;
        
      case 'coin-change':
        table = [Array.from({ length: coinAmount + 1 }, (_, i) => ({
          value: i === 0 ? 0 : Infinity,
          state: i === 0 ? 'computed' as CellState : 'empty' as CellState,
          row: 0,
          col: i,
        }))];
        break;
        
      case 'matrix-chain':
        const matrices = matrixDimensions.length - 1;
        table = createEmptyTable(matrices, matrices);
        for (let i = 0; i < matrices; i++) table[i][i] = { ...table[i][i], value: 0, state: 'computed' };
        break;
        
      case 'subset-sum':
        table = createEmptyTable(subsetArray.length + 1, subsetTarget + 1);
        for (let i = 0; i <= subsetArray.length; i++) table[i][0] = { ...table[i][0], value: 'T', state: 'computed' };
        for (let j = 1; j <= subsetTarget; j++) table[0][j] = { ...table[0][j], value: 'F', state: 'computed' };
        break;
        
      default:
        table = createEmptyTable(5, 5);
    }
    
    set({ table });
  },
}));
