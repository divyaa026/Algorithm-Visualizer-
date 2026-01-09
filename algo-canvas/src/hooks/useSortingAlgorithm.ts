import { useCallback, useRef } from 'react';
import { useAlgorithmStore } from '@/store/algorithmStore';

// Helper to check if sorting should stop
const shouldStop = (stopRef: React.MutableRefObject<boolean>): boolean => {
  return stopRef.current || !useAlgorithmStore.getState().isRunning;
};

// Line numbers for each algorithm's key operations (1-indexed to match code display)
const BUBBLE_LINES = { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6 };
const SELECTION_LINES = { outerLoop: 3, minInit: 4, innerLoop: 5, compare: 6, updateMin: 7, swap: 10 };
const INSERTION_LINES = { outerLoop: 2, keyInit: 3, jInit: 4, whileLoop: 5, shift: 6, insert: 9 };

export const useSortingAlgorithm = () => {
  const {
    array,
    speed,
    algorithm,
    setArray,
    setIsRunning,
    setIsPaused,
    updateElement,
    swapElements,
    incrementComparisons,
    incrementSwaps,
    isPaused,
    setCurrentLine,
    saveStep,
    clearHistory,
  } = useAlgorithmStore();

  const stopRef = useRef(false);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const checkPause = () => {
        if (shouldStop(stopRef)) {
          resolve();
          return;
        }
        if (useAlgorithmStore.getState().isPaused) {
          setTimeout(checkPause, 100);
        } else {
          setTimeout(resolve, ms);
        }
      };
      checkPause();
    });
  }, []);

  const bubbleSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1 && !shouldStop(stopRef); i++) {
      setCurrentLine(BUBBLE_LINES.outerLoop);
      saveStep();
      
      for (let j = 0; j < n - i - 1 && !shouldStop(stopRef); j++) {
        setCurrentLine(BUBBLE_LINES.innerLoop);
        updateElement(j, { state: 'comparing' });
        updateElement(j + 1, { state: 'comparing' });
        incrementComparisons();
        saveStep();
        
        await sleep(speed);
        if (shouldStop(stopRef)) break;

        setCurrentLine(BUBBLE_LINES.compare);
        if (arr[j].value > arr[j + 1].value) {
          setCurrentLine(BUBBLE_LINES.swap);
          updateElement(j, { state: 'swapping' });
          updateElement(j + 1, { state: 'swapping' });
          saveStep();
          await sleep(speed / 2);
          if (shouldStop(stopRef)) break;
          
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapElements(j, j + 1);
          incrementSwaps();
          saveStep();
        }

        updateElement(j, { state: 'unsorted' });
        updateElement(j + 1, { state: 'unsorted' });
      }
      if (!shouldStop(stopRef)) {
        updateElement(n - 1 - i, { state: 'sorted' });
        saveStep();
      }
    }
    
    if (!shouldStop(stopRef)) {
      updateElement(0, { state: 'sorted' });
      setCurrentLine(-1);
      saveStep();
    }
  }, [array, speed, updateElement, incrementComparisons, incrementSwaps, swapElements, sleep, setCurrentLine, saveStep]);

  const selectionSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1 && !shouldStop(stopRef); i++) {
      setCurrentLine(SELECTION_LINES.outerLoop);
      let minIdx = i;
      setCurrentLine(SELECTION_LINES.minInit);
      updateElement(i, { state: 'comparing' });
      saveStep();

      for (let j = i + 1; j < n && !shouldStop(stopRef); j++) {
        setCurrentLine(SELECTION_LINES.innerLoop);
        updateElement(j, { state: 'comparing' });
        incrementComparisons();
        saveStep();
        await sleep(speed);
        if (shouldStop(stopRef)) break;

        setCurrentLine(SELECTION_LINES.compare);
        if (arr[j].value < arr[minIdx].value) {
          setCurrentLine(SELECTION_LINES.updateMin);
          if (minIdx !== i) updateElement(minIdx, { state: 'unsorted' });
          minIdx = j;
          updateElement(minIdx, { state: 'swapping' });
          saveStep();
        } else {
          updateElement(j, { state: 'unsorted' });
        }
      }

      if (!shouldStop(stopRef) && minIdx !== i) {
        setCurrentLine(SELECTION_LINES.swap);
        updateElement(i, { state: 'swapping' });
        updateElement(minIdx, { state: 'swapping' });
        saveStep();
        await sleep(speed);
        if (shouldStop(stopRef)) break;
        
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swapElements(i, minIdx);
        incrementSwaps();
        saveStep();
      }

      if (!shouldStop(stopRef)) {
        updateElement(i, { state: 'sorted' });
        if (minIdx !== i) updateElement(minIdx, { state: 'unsorted' });
        saveStep();
      }
    }
    
    if (!shouldStop(stopRef)) {
      updateElement(n - 1, { state: 'sorted' });
      setCurrentLine(-1);
      saveStep();
    }
  }, [array, speed, updateElement, incrementComparisons, incrementSwaps, swapElements, sleep, setCurrentLine, saveStep]);

  const insertionSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    
    updateElement(0, { state: 'sorted' });
    saveStep();

    for (let i = 1; i < n && !shouldStop(stopRef); i++) {
      setCurrentLine(INSERTION_LINES.outerLoop);
      const key = arr[i];
      setCurrentLine(INSERTION_LINES.keyInit);
      let j = i - 1;
      setCurrentLine(INSERTION_LINES.jInit);
      
      updateElement(i, { state: 'comparing' });
      saveStep();
      await sleep(speed);
      if (shouldStop(stopRef)) break;

      while (j >= 0 && arr[j].value > key.value && !shouldStop(stopRef)) {
        setCurrentLine(INSERTION_LINES.whileLoop);
        updateElement(j, { state: 'comparing' });
        updateElement(j + 1, { state: 'swapping' });
        incrementComparisons();
        saveStep();
        await sleep(speed);
        if (shouldStop(stopRef)) break;

        setCurrentLine(INSERTION_LINES.shift);
        arr[j + 1] = arr[j];
        swapElements(j, j + 1);
        incrementSwaps();
        saveStep();
        
        updateElement(j + 1, { state: 'sorted' });
        j--;
      }

      if (!shouldStop(stopRef)) {
        setCurrentLine(INSERTION_LINES.insert);
        arr[j + 1] = key;
        updateElement(j + 1, { state: 'sorted' });
        saveStep();
      }
    }
    setCurrentLine(-1);
  }, [array, speed, updateElement, incrementComparisons, incrementSwaps, swapElements, sleep, setCurrentLine, saveStep]);

  const startSorting = useCallback(async () => {
    stopRef.current = false;
    clearHistory();
    setIsRunning(true);
    setIsPaused(false);

    try {
      switch (algorithm) {
        case 'bubble':
          await bubbleSort();
          break;
        case 'selection':
          await selectionSort();
          break;
        case 'insertion':
          await insertionSort();
          break;
        default:
          await bubbleSort();
      }
    } finally {
      if (!shouldStop(stopRef)) {
        setIsRunning(false);
      }
    }
  }, [algorithm, bubbleSort, selectionSort, insertionSort, setIsRunning, setIsPaused, clearHistory]);

  const stopSorting = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    
    // Mark all as sorted when manually stopped
    const currentArray = useAlgorithmStore.getState().array;
    currentArray.forEach((_, i) => {
      updateElement(i, { state: 'sorted' });
    });
  }, [setIsRunning, setIsPaused, updateElement]);

  return { startSorting, stopSorting };
};
