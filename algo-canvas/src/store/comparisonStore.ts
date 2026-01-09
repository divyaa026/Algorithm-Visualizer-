import { create } from 'zustand';

export type BarState = 'unsorted' | 'comparing' | 'swapping' | 'sorted';
export type AlgorithmType = 'bubble' | 'quick' | 'merge' | 'heap' | 'insertion' | 'selection';

interface ArrayElement {
  value: number;
  state: BarState;
}

interface ComparisonState {
  // Original array (same for both)
  originalArray: number[];
  
  // Left algorithm
  leftAlgorithm: AlgorithmType;
  leftArray: ArrayElement[];
  leftComparisons: number;
  leftSwaps: number;
  leftComplete: boolean;
  leftTime: number;
  
  // Right algorithm
  rightAlgorithm: AlgorithmType;
  rightArray: ArrayElement[];
  rightComparisons: number;
  rightSwaps: number;
  rightComplete: boolean;
  rightTime: number;
  
  // General state
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  arraySize: number;
  winner: 'left' | 'right' | 'tie' | null;
  
  // Actions
  setLeftAlgorithm: (algo: AlgorithmType) => void;
  setRightAlgorithm: (algo: AlgorithmType) => void;
  setSpeed: (speed: number) => void;
  setArraySize: (size: number) => void;
  generateArray: () => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  
  // Left updates
  setLeftArray: (array: ArrayElement[]) => void;
  updateLeftElement: (index: number, element: Partial<ArrayElement>) => void;
  swapLeftElements: (i: number, j: number) => void;
  incrementLeftComparisons: () => void;
  incrementLeftSwaps: () => void;
  setLeftComplete: (complete: boolean, time?: number) => void;
  
  // Right updates
  setRightArray: (array: ArrayElement[]) => void;
  updateRightElement: (index: number, element: Partial<ArrayElement>) => void;
  swapRightElements: (i: number, j: number) => void;
  incrementRightComparisons: () => void;
  incrementRightSwaps: () => void;
  setRightComplete: (complete: boolean, time?: number) => void;
  
  reset: () => void;
}

const generateRandomValues = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
};

const valuesToArrayElements = (values: number[]): ArrayElement[] => {
  return values.map(value => ({ value, state: 'unsorted' as BarState }));
};

export const useComparisonStore = create<ComparisonState>((set, get) => {
  const initialValues = generateRandomValues(30);
  
  return {
    originalArray: initialValues,
    
    leftAlgorithm: 'bubble',
    leftArray: valuesToArrayElements(initialValues),
    leftComparisons: 0,
    leftSwaps: 0,
    leftComplete: false,
    leftTime: 0,
    
    rightAlgorithm: 'quick',
    rightArray: valuesToArrayElements(initialValues),
    rightComparisons: 0,
    rightSwaps: 0,
    rightComplete: false,
    rightTime: 0,
    
    isRunning: false,
    isPaused: false,
    speed: 50,
    arraySize: 30,
    winner: null,
    
    setLeftAlgorithm: (leftAlgorithm) => set({ leftAlgorithm }),
    setRightAlgorithm: (rightAlgorithm) => set({ rightAlgorithm }),
    setSpeed: (speed) => set({ speed }),
    
    setArraySize: (arraySize) => {
      set({ arraySize });
      get().generateArray();
    },
    
    generateArray: () => {
      const { arraySize } = get();
      const values = generateRandomValues(arraySize);
      set({
        originalArray: values,
        leftArray: valuesToArrayElements(values),
        rightArray: valuesToArrayElements(values),
        leftComparisons: 0,
        leftSwaps: 0,
        rightComparisons: 0,
        rightSwaps: 0,
        leftComplete: false,
        rightComplete: false,
        leftTime: 0,
        rightTime: 0,
        isRunning: false,
        isPaused: false,
        winner: null,
      });
    },
    
    setIsRunning: (isRunning) => set({ isRunning }),
    setIsPaused: (isPaused) => set({ isPaused }),
    
    // Left updates
    setLeftArray: (leftArray) => set({ leftArray }),
    
    updateLeftElement: (index, element) => set((state) => ({
      leftArray: state.leftArray.map((el, i) => 
        i === index ? { ...el, ...element } : el
      ),
    })),
    
    swapLeftElements: (i, j) => set((state) => {
      const newArray = [...state.leftArray];
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      return { leftArray: newArray };
    }),
    
    incrementLeftComparisons: () => set((state) => ({ leftComparisons: state.leftComparisons + 1 })),
    incrementLeftSwaps: () => set((state) => ({ leftSwaps: state.leftSwaps + 1 })),
    
    setLeftComplete: (complete, time = 0) => {
      const { rightComplete, leftTime: existingLeftTime, rightTime } = get();
      const leftTime = time || existingLeftTime;
      let winner: 'left' | 'right' | 'tie' | null = null;
      
      if (complete && rightComplete) {
        if (leftTime < rightTime) winner = 'left';
        else if (rightTime < leftTime) winner = 'right';
        else winner = 'tie';
      }
      
      set({ leftComplete: complete, leftTime, winner });
    },
    
    // Right updates
    setRightArray: (rightArray) => set({ rightArray }),
    
    updateRightElement: (index, element) => set((state) => ({
      rightArray: state.rightArray.map((el, i) => 
        i === index ? { ...el, ...element } : el
      ),
    })),
    
    swapRightElements: (i, j) => set((state) => {
      const newArray = [...state.rightArray];
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      return { rightArray: newArray };
    }),
    
    incrementRightComparisons: () => set((state) => ({ rightComparisons: state.rightComparisons + 1 })),
    incrementRightSwaps: () => set((state) => ({ rightSwaps: state.rightSwaps + 1 })),
    
    setRightComplete: (complete, time = 0) => {
      const { leftComplete, leftTime, rightTime: existingRightTime } = get();
      const rightTime = time || existingRightTime;
      let winner: 'left' | 'right' | 'tie' | null = null;
      
      if (complete && leftComplete) {
        if (leftTime < rightTime) winner = 'left';
        else if (rightTime < leftTime) winner = 'right';
        else winner = 'tie';
      }
      
      set({ rightComplete: complete, rightTime, winner });
    },
    
    reset: () => {
      const { originalArray } = get();
      set({
        leftArray: valuesToArrayElements(originalArray),
        rightArray: valuesToArrayElements(originalArray),
        leftComparisons: 0,
        leftSwaps: 0,
        rightComparisons: 0,
        rightSwaps: 0,
        leftComplete: false,
        rightComplete: false,
        leftTime: 0,
        rightTime: 0,
        isRunning: false,
        isPaused: false,
        winner: null,
      });
    },
  };
});
