import { useCallback, useRef } from 'react';
import { useDPStore, CellState, DPStep } from '@/store/dpStore';

// Line numbers for DP algorithms (based on code snippets in DPPage.tsx)
const FIB_LINES = { forLoop: 17, compute: 18 };
const KNAPSACK_LINES = { outerLoop: 6, innerLoop: 7, exclude: 9, checkInclude: 12, include: 13 };
const LCS_LINES = { outerLoop: 6, innerLoop: 7, match: 9, noMatch: 11 };
const LIS_LINES = { outerLoop: 5, innerLoop: 6, check: 7, update: 8 };
const EDIT_LINES = { outerLoop: 9, innerLoop: 10, match: 12, noMatch: 14 };
const COIN_LINES = { outerLoop: 5, innerLoop: 6, check: 7, update: 8 };
const SUBSET_LINES = { outerLoop: 9, innerLoop: 10, exclude: 12, include: 15 };

export const useDPAlgorithm = () => {
  const {
    problem,
    speed,
    table,
    fibN,
    knapsackWeights,
    knapsackValues,
    knapsackCapacity,
    lcsString1,
    lcsString2,
    lisArray,
    editStr1,
    editStr2,
    coinDenominations,
    coinAmount,
    subsetArray,
    subsetTarget,
    setIsRunning,
    setIsPaused,
    setTable,
    updateCell,
    setResult,
    setOptimalPath,
    initializeTable,
    setSteps,
    setCurrentStep,
    setCurrentLine,
  } = useDPStore();

  const stopRef = useRef(false);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const checkPause = () => {
        if (stopRef.current) {
          resolve();
          return;
        }
        if (useDPStore.getState().isPaused) {
          setTimeout(checkPause, 100);
        } else {
          setTimeout(resolve, ms);
        }
      };
      checkPause();
    });
  }, []);

  const fibonacci = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();
    
    // Generate steps first
    const steps: DPStep[] = [];
    for (let i = 2; i <= fibN; i++) {
      steps.push({
        row: 0,
        col: i,
        value: 0,
        formula: `dp[${i}] = dp[${i-1}] + dp[${i-2}]`,
        explanation: `Computing F(${i}) = F(${i-1}) + F(${i-2})`,
      });
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);

    const currentTable = useDPStore.getState().table;
    let stepIndex = 0;
    
    for (let i = 2; i <= fibN && !stopRef.current; i++) {
      setCurrentLine(FIB_LINES.forLoop);
      updateCell(0, i, { state: 'computing' as CellState });
      await sleep(speed);

      setCurrentLine(FIB_LINES.compute);
      const val = Number(currentTable[0][i - 1].value) + Number(currentTable[0][i - 2].value);
      currentTable[0][i] = { ...currentTable[0][i], value: val };
      
      // Update step with actual value
      steps[stepIndex] = { ...steps[stepIndex], value: val };
      stepIndex++;
      setCurrentStep(stepIndex);
      
      updateCell(0, i, { value: val, state: 'computed' as CellState });
      await sleep(speed);
    }

    // Highlight the result
    setCurrentLine(-1);
    updateCell(0, fibN, { state: 'optimal' as CellState });
    setResult(currentTable[0][fibN].value as number);
    setIsRunning(false);
  }, [fibN, speed, initializeTable, setIsRunning, updateCell, setResult, setSteps, setCurrentStep, sleep, setCurrentLine]);

  const knapsack = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();

    const n = knapsackWeights.length;
    const W = knapsackCapacity;
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    // Generate steps first
    const steps: DPStep[] = [];
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        steps.push({
          row: i,
          col: w,
          value: 0,
          formula: `dp[${i}][${w}] = max(dp[${i-1}][${w}], dp[${i-1}][${w}-w${i}] + v${i})`,
          explanation: `Item ${i}: weight=${knapsackWeights[i-1]}, value=${knapsackValues[i-1]}, capacity=${w}`,
        });
      }
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);
    let stepIndex = 0;

    for (let i = 1; i <= n && !stopRef.current; i++) {
      setCurrentLine(KNAPSACK_LINES.outerLoop);
      for (let w = 1; w <= W && !stopRef.current; w++) {
        setCurrentLine(KNAPSACK_LINES.innerLoop);
        updateCell(i, w, { state: 'computing' as CellState });
        await sleep(speed / 2);

        setCurrentLine(KNAPSACK_LINES.checkInclude);
        if (knapsackWeights[i - 1] <= w) {
          setCurrentLine(KNAPSACK_LINES.include);
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - knapsackWeights[i - 1]] + knapsackValues[i - 1]
          );
        } else {
          setCurrentLine(KNAPSACK_LINES.exclude);
          dp[i][w] = dp[i - 1][w];
        }

        steps[stepIndex] = { ...steps[stepIndex], value: dp[i][w] };
        stepIndex++;
        setCurrentStep(stepIndex);

        updateCell(i, w, { value: dp[i][w], state: 'computed' as CellState });
        await sleep(speed / 2);
      }
    }

    // Backtrack to find optimal path
    setCurrentLine(-1);
    const path: { row: number; col: number }[] = [];
    let i = n, w = W;
    while (i > 0 && w > 0) {
      if (dp[i][w] !== dp[i - 1][w]) {
        path.push({ row: i, col: w });
        w -= knapsackWeights[i - 1];
      }
      i--;
    }

    for (const cell of path) {
      updateCell(cell.row, cell.col, { state: 'optimal' as CellState });
    }

    setOptimalPath(path);
    setResult(dp[n][W]);
    setIsRunning(false);
  }, [knapsackWeights, knapsackValues, knapsackCapacity, speed, initializeTable, setIsRunning, updateCell, setResult, setOptimalPath, setSteps, setCurrentStep, sleep, setCurrentLine]);

  const lcs = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();

    const m = lcsString1.length;
    const n = lcsString2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // Generate steps first
    const steps: DPStep[] = [];
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        steps.push({
          row: i,
          col: j,
          value: 0,
          formula: lcsString1[i-1] === lcsString2[j-1] 
            ? `dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1` 
            : `dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}])`,
          explanation: `Comparing '${lcsString1[i-1]}' with '${lcsString2[j-1]}'`,
        });
      }
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);
    let stepIndex = 0;

    for (let i = 1; i <= m && !stopRef.current; i++) {
      setCurrentLine(LCS_LINES.outerLoop);
      for (let j = 1; j <= n && !stopRef.current; j++) {
        setCurrentLine(LCS_LINES.innerLoop);
        updateCell(i, j, { state: 'computing' as CellState });
        await sleep(speed / 3);

        if (lcsString1[i - 1] === lcsString2[j - 1]) {
          setCurrentLine(LCS_LINES.match);
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          setCurrentLine(LCS_LINES.noMatch);
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }

        steps[stepIndex] = { ...steps[stepIndex], value: dp[i][j] };
        stepIndex++;
        setCurrentStep(stepIndex);

        updateCell(i, j, { value: dp[i][j], state: 'computed' as CellState });
        await sleep(speed / 3);
      }
    }

    // Backtrack to find LCS
    setCurrentLine(-1);
    const path: { row: number; col: number }[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (lcsString1[i - 1] === lcsString2[j - 1]) {
        path.unshift({ row: i, col: j });
        i--; j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    for (const cell of path) {
      updateCell(cell.row, cell.col, { state: 'optimal' as CellState });
    }

    setOptimalPath(path);
    setResult(dp[m][n]);
    setIsRunning(false);
  }, [lcsString1, lcsString2, speed, initializeTable, setIsRunning, updateCell, setResult, setOptimalPath, setSteps, setCurrentStep, sleep, setCurrentLine]);

  const lis = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();

    const n = lisArray.length;
    const dp: number[] = Array(n).fill(1);

    // Generate steps
    const steps: DPStep[] = [];
    for (let i = 1; i < n; i++) {
      steps.push({
        row: 0,
        col: i,
        value: 0,
        formula: `dp[${i}] = max(dp[${i}], dp[j] + 1) for j < ${i}`,
        explanation: `Finding LIS ending at index ${i} (value: ${lisArray[i]})`,
      });
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);
    let stepIndex = 0;

    for (let i = 1; i < n && !stopRef.current; i++) {
      updateCell(0, i, { state: 'computing' as CellState });
      
      for (let j = 0; j < i && !stopRef.current; j++) {
        updateCell(0, j, { state: 'highlighted' as CellState });
        await sleep(speed / 3);
        
        if (lisArray[i] > lisArray[j]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        
        updateCell(0, j, { state: 'computed' as CellState });
      }

      steps[stepIndex] = { ...steps[stepIndex], value: dp[i] };
      stepIndex++;
      setCurrentStep(stepIndex);

      updateCell(0, i, { value: dp[i], state: 'computed' as CellState });
      await sleep(speed);
    }

    const maxLIS = Math.max(...dp);
    const maxIdx = dp.indexOf(maxLIS);
    updateCell(0, maxIdx, { state: 'optimal' as CellState });

    setResult(maxLIS);
    setIsRunning(false);
  }, [lisArray, speed, initializeTable, setIsRunning, updateCell, setResult, setSteps, setCurrentStep, sleep]);

  const editDistance = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();

    const m = editStr1.length;
    const n = editStr2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => 
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    // Generate steps
    const steps: DPStep[] = [];
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        steps.push({
          row: i,
          col: j,
          value: 0,
          formula: editStr1[i-1] === editStr2[j-1] 
            ? `dp[${i}][${j}] = dp[${i-1}][${j-1}]` 
            : `dp[${i}][${j}] = 1 + min(del, ins, rep)`,
          explanation: `Comparing '${editStr1[i-1]}' with '${editStr2[j-1]}'`,
        });
      }
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);
    let stepIndex = 0;

    for (let i = 1; i <= m && !stopRef.current; i++) {
      for (let j = 1; j <= n && !stopRef.current; j++) {
        updateCell(i, j, { state: 'computing' as CellState });
        await sleep(speed / 3);

        if (editStr1[i - 1] === editStr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }

        steps[stepIndex] = { ...steps[stepIndex], value: dp[i][j] };
        stepIndex++;
        setCurrentStep(stepIndex);

        updateCell(i, j, { value: dp[i][j], state: 'computed' as CellState });
        await sleep(speed / 3);
      }
    }

    // Backtrack
    const path: { row: number; col: number }[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      path.unshift({ row: i, col: j });
      if (i > 0 && j > 0 && editStr1[i - 1] === editStr2[j - 1]) {
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j] && dp[i][j - 1] <= dp[i - 1][j - 1])) {
        j--;
      } else if (i > 0 && (j === 0 || dp[i - 1][j] <= dp[i][j - 1] && dp[i - 1][j] <= dp[i - 1][j - 1])) {
        i--;
      } else {
        i--; j--;
      }
    }

    for (const cell of path) {
      if (cell.row > 0 && cell.col > 0) {
        updateCell(cell.row, cell.col, { state: 'optimal' as CellState });
      }
    }

    setOptimalPath(path);
    setResult(dp[m][n]);
    setIsRunning(false);
  }, [editStr1, editStr2, speed, initializeTable, setIsRunning, updateCell, setResult, setOptimalPath, setSteps, setCurrentStep, sleep]);

  const coinChange = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();

    const dp: number[] = Array(coinAmount + 1).fill(Infinity);
    dp[0] = 0;
    
    // Generate steps
    const steps: DPStep[] = [];
    for (const coin of coinDenominations) {
      for (let i = coin; i <= coinAmount; i++) {
        steps.push({
          row: 0,
          col: i,
          value: 0,
          formula: `dp[${i}] = min(dp[${i}], dp[${i}-${coin}] + 1)`,
          explanation: `Using coin ${coin} for amount ${i}`,
        });
      }
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);
    updateCell(0, 0, { value: 0, state: 'computed' as CellState });
    let stepIndex = 0;

    for (const coin of coinDenominations) {
      for (let i = coin; i <= coinAmount && !stopRef.current; i++) {
        updateCell(0, i, { state: 'computing' as CellState });
        await sleep(speed / 2);

        if (dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
        }

        const displayVal = dp[i] === Infinity ? '∞' : dp[i];
        
        if (stepIndex < steps.length) {
          steps[stepIndex] = { ...steps[stepIndex], value: displayVal };
          stepIndex++;
          setCurrentStep(stepIndex);
        }
        
        updateCell(0, i, { value: displayVal, state: 'computed' as CellState });
        await sleep(speed / 2);
      }
    }

    if (dp[coinAmount] !== Infinity) {
      updateCell(0, coinAmount, { state: 'optimal' as CellState });
    }

    setResult(dp[coinAmount] === Infinity ? -1 : dp[coinAmount]);
    setIsRunning(false);
  }, [coinDenominations, coinAmount, speed, initializeTable, setIsRunning, updateCell, setResult, setSteps, setCurrentStep, sleep]);

  const subsetSum = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    initializeTable();

    const n = subsetArray.length;
    const dp: boolean[][] = Array.from({ length: n + 1 }, () => Array(subsetTarget + 1).fill(false));
    
    for (let i = 0; i <= n; i++) dp[i][0] = true;

    // Generate steps
    const steps: DPStep[] = [];
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= subsetTarget; j++) {
        steps.push({
          row: i,
          col: j,
          value: 'F',
          formula: `dp[${i}][${j}] = dp[${i-1}][${j}] || dp[${i-1}][${j}-arr[${i-1}]]`,
          explanation: `Can we make ${j} using first ${i} elements?`,
        });
      }
    }
    setSteps(steps);
    setCurrentStep(0);
    
    await sleep(speed);
    let stepIndex = 0;

    for (let i = 1; i <= n && !stopRef.current; i++) {
      for (let j = 1; j <= subsetTarget && !stopRef.current; j++) {
        updateCell(i, j, { state: 'computing' as CellState });
        await sleep(speed / 3);

        if (subsetArray[i - 1] <= j) {
          dp[i][j] = dp[i - 1][j] || dp[i - 1][j - subsetArray[i - 1]];
        } else {
          dp[i][j] = dp[i - 1][j];
        }

        steps[stepIndex] = { ...steps[stepIndex], value: dp[i][j] ? 'T' : 'F' };
        stepIndex++;
        setCurrentStep(stepIndex);

        updateCell(i, j, { value: dp[i][j] ? 'T' : 'F', state: 'computed' as CellState });
        await sleep(speed / 3);
      }
    }

    updateCell(n, subsetTarget, { state: 'optimal' as CellState });
    setResult(dp[n][subsetTarget] ? 'Possible' : 'Not Possible');
    setIsRunning(false);
  }, [subsetArray, subsetTarget, speed, initializeTable, setIsRunning, updateCell, setResult, setSteps, setCurrentStep, sleep]);

  const startAlgorithm = useCallback(() => {
    switch (problem) {
      case 'fibonacci': return fibonacci();
      case 'knapsack': return knapsack();
      case 'lcs': return lcs();
      case 'lis': return lis();
      case 'edit-distance': return editDistance();
      case 'coin-change': return coinChange();
      case 'subset-sum': return subsetSum();
      default: return fibonacci();
    }
  }, [problem, fibonacci, knapsack, lcs, lis, editDistance, coinChange, subsetSum]);

  const stopAlgorithm = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  }, [setIsRunning, setIsPaused]);

  return { startAlgorithm, stopAlgorithm };
};
