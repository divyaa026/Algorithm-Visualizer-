import { create } from 'zustand';

export type BarState = 'unsorted' | 'comparing' | 'swapping' | 'sorted';
export type AlgorithmType = 'bubble' | 'quick' | 'merge' | 'heap' | 'insertion' | 'selection';

interface ArrayElement {
  value: number;
  state: BarState;
}

interface StepSnapshot {
  array: ArrayElement[];
  comparisons: number;
  swaps: number;
  currentLine: number;
}

interface AlgorithmState {
  array: ArrayElement[];
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  arraySize: number;
  algorithm: AlgorithmType;
  comparisons: number;
  swaps: number;
  
  // Step history for undo
  stepHistory: StepSnapshot[];
  currentStepIndex: number;
  currentLine: number;
  
  // Actions
  setArray: (array: ArrayElement[]) => void;
  generateArray: () => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  setArraySize: (size: number) => void;
  setAlgorithm: (algo: AlgorithmType) => void;
  incrementComparisons: () => void;
  incrementSwaps: () => void;
  resetStats: () => void;
  updateElement: (index: number, element: Partial<ArrayElement>) => void;
  swapElements: (i: number, j: number) => void;
  
  // Step history actions
  setCurrentLine: (line: number) => void;
  saveStep: () => void;
  stepBack: () => void;
  stepForward: () => void;
  clearHistory: () => void;
  canStepBack: () => boolean;
  canStepForward: () => boolean;
}

const generateRandomArray = (size: number): ArrayElement[] => {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 90) + 10,
    state: 'unsorted' as BarState,
  }));
};

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  array: generateRandomArray(30),
  isRunning: false,
  isPaused: false,
  speed: 50,
  arraySize: 30,
  algorithm: 'bubble',
  comparisons: 0,
  swaps: 0,
  
  // Step history
  stepHistory: [],
  currentStepIndex: -1,
  currentLine: -1,

  setArray: (array) => set({ array }),
  
  generateArray: () => {
    const { arraySize } = get();
    set({ 
      array: generateRandomArray(arraySize),
      comparisons: 0,
      swaps: 0,
      isRunning: false,
      isPaused: false,
      stepHistory: [],
      currentStepIndex: -1,
      currentLine: -1,
    });
  },
  
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setSpeed: (speed) => set({ speed }),
  
  setArraySize: (arraySize) => {
    set({ arraySize });
    get().generateArray();
  },
  
  setAlgorithm: (algorithm) => {
    const { array } = get();
    // Reset all elements to unsorted state when changing algorithm
    set({ 
      algorithm,
      isRunning: false,
      isPaused: false,
      comparisons: 0,
      swaps: 0,
      array: array.map(el => ({ ...el, state: 'unsorted' as BarState })),
      stepHistory: [],
      currentStepIndex: -1,
      currentLine: -1,
    });
  },
  incrementComparisons: () => set((state) => ({ comparisons: state.comparisons + 1 })),
  incrementSwaps: () => set((state) => ({ swaps: state.swaps + 1 })),
  
  resetStats: () => set({ comparisons: 0, swaps: 0 }),
  
  updateElement: (index, element) => set((state) => ({
    array: state.array.map((el, i) => 
      i === index ? { ...el, ...element } : el
    ),
  })),
  
  swapElements: (i, j) => set((state) => {
    const newArray = [...state.array];
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    return { array: newArray };
  }),
  
  // Step history actions
  setCurrentLine: (currentLine) => set({ currentLine }),
  
  saveStep: () => {
    const { array, comparisons, swaps, currentLine, stepHistory, currentStepIndex } = get();
    const snapshot: StepSnapshot = {
      array: array.map(el => ({ ...el })),
      comparisons,
      swaps,
      currentLine,
    };
    // Remove any forward history if we're in the middle
    const newHistory = stepHistory.slice(0, currentStepIndex + 1);
    newHistory.push(snapshot);
    // Keep only last 500 steps to prevent memory issues
    if (newHistory.length > 500) {
      newHistory.shift();
    }
    set({ 
      stepHistory: newHistory, 
      currentStepIndex: newHistory.length - 1 
    });
  },
  
  stepBack: () => {
    const { stepHistory, currentStepIndex } = get();
    if (currentStepIndex > 0) {
      const prevStep = stepHistory[currentStepIndex - 1];
      set({
        array: prevStep.array.map(el => ({ ...el })),
        comparisons: prevStep.comparisons,
        swaps: prevStep.swaps,
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
        array: nextStep.array.map(el => ({ ...el })),
        comparisons: nextStep.comparisons,
        swaps: nextStep.swaps,
        currentLine: nextStep.currentLine,
        currentStepIndex: currentStepIndex + 1,
      });
    }
  },
  
  clearHistory: () => set({ stepHistory: [], currentStepIndex: -1, currentLine: -1 }),
  
  canStepBack: () => get().currentStepIndex > 0,
  canStepForward: () => get().currentStepIndex < get().stepHistory.length - 1,
}));
