import { useCallback, useRef } from 'react';
import { useComparisonStore, AlgorithmType } from '@/store/comparisonStore';

export const useComparisonAlgorithm = () => {
  const {
    speed,
    leftAlgorithm,
    rightAlgorithm,
    leftArray,
    rightArray,
    setIsRunning,
    setIsPaused,
    updateLeftElement,
    updateRightElement,
    swapLeftElements,
    swapRightElements,
    incrementLeftComparisons,
    incrementRightComparisons,
    incrementLeftSwaps,
    incrementRightSwaps,
    setLeftComplete,
    setRightComplete,
  } = useComparisonStore();

  const stopRef = useRef(false);
  const leftStartTime = useRef(0);
  const rightStartTime = useRef(0);

  const shouldStop = (): boolean => {
    return stopRef.current || !useComparisonStore.getState().isRunning;
  };

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const checkPause = () => {
        if (shouldStop()) {
          resolve();
          return;
        }
        if (useComparisonStore.getState().isPaused) {
          setTimeout(checkPause, 100);
        } else {
          setTimeout(resolve, ms);
        }
      };
      checkPause();
    });
  }, []);

  // Generic sorting algorithms for left side
  const bubbleSortLeft = useCallback(async () => {
    const arr = [...leftArray];
    const n = arr.length;

    for (let i = 0; i < n - 1 && !shouldStop(); i++) {
      for (let j = 0; j < n - i - 1 && !shouldStop(); j++) {
        updateLeftElement(j, { state: 'comparing' });
        updateLeftElement(j + 1, { state: 'comparing' });
        incrementLeftComparisons();
        
        await sleep(speed);
        if (shouldStop()) break;

        if (arr[j].value > arr[j + 1].value) {
          updateLeftElement(j, { state: 'swapping' });
          updateLeftElement(j + 1, { state: 'swapping' });
          await sleep(speed / 2);
          if (shouldStop()) break;
          
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapLeftElements(j, j + 1);
          incrementLeftSwaps();
        }

        updateLeftElement(j, { state: 'unsorted' });
        updateLeftElement(j + 1, { state: 'unsorted' });
      }
      if (!shouldStop()) {
        updateLeftElement(n - 1 - i, { state: 'sorted' });
      }
    }
    
    if (!shouldStop()) {
      updateLeftElement(0, { state: 'sorted' });
    }
  }, [leftArray, speed, updateLeftElement, incrementLeftComparisons, incrementLeftSwaps, swapLeftElements, sleep]);

  const selectionSortLeft = useCallback(async () => {
    const arr = [...leftArray];
    const n = arr.length;

    for (let i = 0; i < n - 1 && !shouldStop(); i++) {
      let minIdx = i;
      updateLeftElement(i, { state: 'comparing' });

      for (let j = i + 1; j < n && !shouldStop(); j++) {
        updateLeftElement(j, { state: 'comparing' });
        incrementLeftComparisons();
        await sleep(speed);
        if (shouldStop()) break;

        if (arr[j].value < arr[minIdx].value) {
          if (minIdx !== i) updateLeftElement(minIdx, { state: 'unsorted' });
          minIdx = j;
          updateLeftElement(minIdx, { state: 'swapping' });
        } else {
          updateLeftElement(j, { state: 'unsorted' });
        }
      }

      if (!shouldStop() && minIdx !== i) {
        updateLeftElement(i, { state: 'swapping' });
        updateLeftElement(minIdx, { state: 'swapping' });
        await sleep(speed);
        if (shouldStop()) break;
        
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swapLeftElements(i, minIdx);
        incrementLeftSwaps();
      }

      if (!shouldStop()) {
        updateLeftElement(i, { state: 'sorted' });
        if (minIdx !== i) updateLeftElement(minIdx, { state: 'unsorted' });
      }
    }
    
    if (!shouldStop()) {
      updateLeftElement(n - 1, { state: 'sorted' });
    }
  }, [leftArray, speed, updateLeftElement, incrementLeftComparisons, incrementLeftSwaps, swapLeftElements, sleep]);

  const insertionSortLeft = useCallback(async () => {
    const arr = [...leftArray];
    const n = arr.length;
    
    updateLeftElement(0, { state: 'sorted' });

    for (let i = 1; i < n && !shouldStop(); i++) {
      const key = arr[i];
      let j = i - 1;
      
      updateLeftElement(i, { state: 'comparing' });
      await sleep(speed);
      if (shouldStop()) break;

      while (j >= 0 && arr[j].value > key.value && !shouldStop()) {
        updateLeftElement(j, { state: 'comparing' });
        updateLeftElement(j + 1, { state: 'swapping' });
        incrementLeftComparisons();
        await sleep(speed);
        if (shouldStop()) break;

        arr[j + 1] = arr[j];
        swapLeftElements(j, j + 1);
        incrementLeftSwaps();
        
        updateLeftElement(j + 1, { state: 'sorted' });
        j--;
      }

      if (!shouldStop()) {
        arr[j + 1] = key;
        updateLeftElement(j + 1, { state: 'sorted' });
      }
    }
  }, [leftArray, speed, updateLeftElement, incrementLeftComparisons, incrementLeftSwaps, swapLeftElements, sleep]);

  // Generic sorting algorithms for right side
  const bubbleSortRight = useCallback(async () => {
    const arr = [...rightArray];
    const n = arr.length;

    for (let i = 0; i < n - 1 && !shouldStop(); i++) {
      for (let j = 0; j < n - i - 1 && !shouldStop(); j++) {
        updateRightElement(j, { state: 'comparing' });
        updateRightElement(j + 1, { state: 'comparing' });
        incrementRightComparisons();
        
        await sleep(speed);
        if (shouldStop()) break;

        if (arr[j].value > arr[j + 1].value) {
          updateRightElement(j, { state: 'swapping' });
          updateRightElement(j + 1, { state: 'swapping' });
          await sleep(speed / 2);
          if (shouldStop()) break;
          
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapRightElements(j, j + 1);
          incrementRightSwaps();
        }

        updateRightElement(j, { state: 'unsorted' });
        updateRightElement(j + 1, { state: 'unsorted' });
      }
      if (!shouldStop()) {
        updateRightElement(n - 1 - i, { state: 'sorted' });
      }
    }
    
    if (!shouldStop()) {
      updateRightElement(0, { state: 'sorted' });
    }
  }, [rightArray, speed, updateRightElement, incrementRightComparisons, incrementRightSwaps, swapRightElements, sleep]);

  const selectionSortRight = useCallback(async () => {
    const arr = [...rightArray];
    const n = arr.length;

    for (let i = 0; i < n - 1 && !shouldStop(); i++) {
      let minIdx = i;
      updateRightElement(i, { state: 'comparing' });

      for (let j = i + 1; j < n && !shouldStop(); j++) {
        updateRightElement(j, { state: 'comparing' });
        incrementRightComparisons();
        await sleep(speed);
        if (shouldStop()) break;

        if (arr[j].value < arr[minIdx].value) {
          if (minIdx !== i) updateRightElement(minIdx, { state: 'unsorted' });
          minIdx = j;
          updateRightElement(minIdx, { state: 'swapping' });
        } else {
          updateRightElement(j, { state: 'unsorted' });
        }
      }

      if (!shouldStop() && minIdx !== i) {
        updateRightElement(i, { state: 'swapping' });
        updateRightElement(minIdx, { state: 'swapping' });
        await sleep(speed);
        if (shouldStop()) break;
        
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swapRightElements(i, minIdx);
        incrementRightSwaps();
      }

      if (!shouldStop()) {
        updateRightElement(i, { state: 'sorted' });
        if (minIdx !== i) updateRightElement(minIdx, { state: 'unsorted' });
      }
    }
    
    if (!shouldStop()) {
      updateRightElement(n - 1, { state: 'sorted' });
    }
  }, [rightArray, speed, updateRightElement, incrementRightComparisons, incrementRightSwaps, swapRightElements, sleep]);

  const insertionSortRight = useCallback(async () => {
    const arr = [...rightArray];
    const n = arr.length;
    
    updateRightElement(0, { state: 'sorted' });

    for (let i = 1; i < n && !shouldStop(); i++) {
      const key = arr[i];
      let j = i - 1;
      
      updateRightElement(i, { state: 'comparing' });
      await sleep(speed);
      if (shouldStop()) break;

      while (j >= 0 && arr[j].value > key.value && !shouldStop()) {
        updateRightElement(j, { state: 'comparing' });
        updateRightElement(j + 1, { state: 'swapping' });
        incrementRightComparisons();
        await sleep(speed);
        if (shouldStop()) break;

        arr[j + 1] = arr[j];
        swapRightElements(j, j + 1);
        incrementRightSwaps();
        
        updateRightElement(j + 1, { state: 'sorted' });
        j--;
      }

      if (!shouldStop()) {
        arr[j + 1] = key;
        updateRightElement(j + 1, { state: 'sorted' });
      }
    }
  }, [rightArray, speed, updateRightElement, incrementRightComparisons, incrementRightSwaps, swapRightElements, sleep]);

  const runAlgorithm = async (algo: AlgorithmType, side: 'left' | 'right') => {
    const startTime = Date.now();
    
    if (side === 'left') {
      leftStartTime.current = startTime;
      switch (algo) {
        case 'bubble':
          await bubbleSortLeft();
          break;
        case 'selection':
          await selectionSortLeft();
          break;
        case 'insertion':
          await insertionSortLeft();
          break;
        default:
          await bubbleSortLeft();
      }
      if (!shouldStop()) {
        setLeftComplete(true, Date.now() - leftStartTime.current);
      }
    } else {
      rightStartTime.current = startTime;
      switch (algo) {
        case 'bubble':
          await bubbleSortRight();
          break;
        case 'selection':
          await selectionSortRight();
          break;
        case 'insertion':
          await insertionSortRight();
          break;
        default:
          await bubbleSortRight();
      }
      if (!shouldStop()) {
        setRightComplete(true, Date.now() - rightStartTime.current);
      }
    }
  };

  const startComparison = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    setIsPaused(false);

    // Run both algorithms in parallel
    await Promise.all([
      runAlgorithm(leftAlgorithm, 'left'),
      runAlgorithm(rightAlgorithm, 'right'),
    ]);

    if (!shouldStop()) {
      setIsRunning(false);
    }
  }, [leftAlgorithm, rightAlgorithm, setIsRunning, setIsPaused, bubbleSortLeft, bubbleSortRight, selectionSortLeft, selectionSortRight, insertionSortLeft, insertionSortRight, setLeftComplete, setRightComplete]);

  const stopComparison = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  }, [setIsRunning, setIsPaused]);

  return { startComparison, stopComparison };
};
