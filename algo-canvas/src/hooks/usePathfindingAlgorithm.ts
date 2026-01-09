import { useCallback, useRef } from 'react';
import { usePathfindingStore, CellType } from '@/store/pathfindingStore';

interface Position {
  row: number;
  col: number;
}

// Line numbers for pathfinding algorithms
const BFS_LINES = { whileLoop: 6, dequeue: 7, checkEnd: 9, iterateNeighbors: 13, checkVisited: 14, addToQueue: 17 };
const DFS_LINES = { whileLoop: 6, pop: 7, checkEnd: 9, checkVisited: 12, addVisited: 13, iterateNeighbors: 15, pushStack: 18 };
const DIJKSTRA_LINES = { whileLoop: 9, dequeue: 10, checkEnd: 12, iterateNeighbors: 16, checkDistance: 19, updateDistance: 20 };
const ASTAR_LINES = { whileLoop: 11, dequeue: 12, checkEnd: 14, iterateNeighbors: 18, calcG: 20, calcH: 21, updateScore: 23 };

export const usePathfindingAlgorithm = () => {
  const {
    grid,
    start,
    end,
    speed,
    algorithm,
    setIsRunning,
    setIsPaused,
    updateCell,
    setCellType,
    incrementNodesVisited,
    setPathLength,
    saveStep,
    clearHistory,
    setCurrentLine,
  } = usePathfindingStore();

  const stopRef = useRef(false);

  const shouldStop = (): boolean => {
    return stopRef.current || !usePathfindingStore.getState().isRunning;
  };

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const checkPause = () => {
        if (shouldStop()) {
          resolve();
          return;
        }
        if (usePathfindingStore.getState().isPaused) {
          setTimeout(checkPause, 100);
        } else {
          setTimeout(resolve, ms);
        }
      };
      checkPause();
    });
  }, []);

  const getNeighbors = (row: number, col: number): Position[] => {
    const { grid } = usePathfindingStore.getState();
    const rows = grid.length;
    const cols = grid[0].length;
    const neighbors: Position[] = [];
    
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // 4-directional
    ];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (grid[newRow][newCol].type !== 'wall') {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }
    
    return neighbors;
  };

  const reconstructPath = async (endPos: Position) => {
    const { grid, start } = usePathfindingStore.getState();
    const path: Position[] = [];
    let current: Position | null = endPos;
    
    while (current && !(current.row === start.row && current.col === start.col)) {
      path.unshift(current);
      current = grid[current.row][current.col].parent;
    }
    
    // Animate path
    for (const pos of path) {
      if (shouldStop()) break;
      if (!(pos.row === end.row && pos.col === end.col)) {
        setCellType(pos.row, pos.col, 'path');
        saveStep();
        await sleep(speed / 2);
      }
    }
    
    setPathLength(path.length);
  };

  const bfs = useCallback(async () => {
    const { grid, start, end } = usePathfindingStore.getState();
    const queue: Position[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.row},${start.col}`);
    
    while (queue.length > 0 && !shouldStop()) {
      setCurrentLine(BFS_LINES.whileLoop);
      const current = queue.shift()!;
      setCurrentLine(BFS_LINES.dequeue);
      
      setCurrentLine(BFS_LINES.checkEnd);
      if (current.row === end.row && current.col === end.col) {
        setCurrentLine(-1);
        await reconstructPath(current);
        return true;
      }
      
      if (!(current.row === start.row && current.col === start.col)) {
        setCellType(current.row, current.col, 'visited');
        incrementNodesVisited();
        saveStep();
      }
      
      await sleep(speed);
      if (shouldStop()) break;
      
      setCurrentLine(BFS_LINES.iterateNeighbors);
      const neighbors = getNeighbors(current.row, current.col);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        setCurrentLine(BFS_LINES.checkVisited);
        if (!visited.has(key)) {
          visited.add(key);
          updateCell(neighbor.row, neighbor.col, { parent: current });
          setCurrentLine(BFS_LINES.addToQueue);
          queue.push(neighbor);
          
          if (!(neighbor.row === end.row && neighbor.col === end.col)) {
            setCellType(neighbor.row, neighbor.col, 'current');
          }
        }
      }
    }
    
    setCurrentLine(-1);
    return false;
  }, [speed, setCellType, updateCell, incrementNodesVisited, saveStep, sleep, setCurrentLine]);

  const dfs = useCallback(async () => {
    const { start, end } = usePathfindingStore.getState();
    const stack: Position[] = [start];
    const visited = new Set<string>();
    
    while (stack.length > 0 && !shouldStop()) {
      setCurrentLine(DFS_LINES.whileLoop);
      const current = stack.pop()!;
      setCurrentLine(DFS_LINES.pop);
      const key = `${current.row},${current.col}`;
      
      setCurrentLine(DFS_LINES.checkVisited);
      if (visited.has(key)) continue;
      setCurrentLine(DFS_LINES.addVisited);
      visited.add(key);
      
      setCurrentLine(DFS_LINES.checkEnd);
      if (current.row === end.row && current.col === end.col) {
        setCurrentLine(-1);
        await reconstructPath(current);
        return true;
      }
      
      if (!(current.row === start.row && current.col === start.col)) {
        setCellType(current.row, current.col, 'visited');
        incrementNodesVisited();
        saveStep();
      }
      
      await sleep(speed);
      if (shouldStop()) break;
      
      setCurrentLine(DFS_LINES.iterateNeighbors);
      const neighbors = getNeighbors(current.row, current.col);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey)) {
          updateCell(neighbor.row, neighbor.col, { parent: current });
          setCurrentLine(DFS_LINES.pushStack);
          stack.push(neighbor);
          
          if (!(neighbor.row === end.row && neighbor.col === end.col)) {
            setCellType(neighbor.row, neighbor.col, 'current');
          }
        }
      }
    }
    
    setCurrentLine(-1);
    return false;
  }, [speed, setCellType, updateCell, incrementNodesVisited, saveStep, sleep, setCurrentLine]);

  const dijkstra = useCallback(async () => {
    const { grid, start, end } = usePathfindingStore.getState();
    const distances: Map<string, number> = new Map();
    const visited = new Set<string>();
    const pq: { pos: Position; dist: number }[] = [];
    
    // Initialize
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        distances.set(`${row},${col}`, Infinity);
      }
    }
    distances.set(`${start.row},${start.col}`, 0);
    pq.push({ pos: start, dist: 0 });
    
    while (pq.length > 0 && !shouldStop()) {
      setCurrentLine(DIJKSTRA_LINES.whileLoop);
      // Sort by distance (simple priority queue)
      pq.sort((a, b) => a.dist - b.dist);
      const { pos: current, dist } = pq.shift()!;
      setCurrentLine(DIJKSTRA_LINES.dequeue);
      const key = `${current.row},${current.col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      setCurrentLine(DIJKSTRA_LINES.checkEnd);
      if (current.row === end.row && current.col === end.col) {
        setCurrentLine(-1);
        await reconstructPath(current);
        return true;
      }
      
      if (!(current.row === start.row && current.col === start.col)) {
        setCellType(current.row, current.col, 'visited');
        incrementNodesVisited();
        saveStep();
      }
      
      await sleep(speed);
      if (shouldStop()) break;
      
      setCurrentLine(DIJKSTRA_LINES.iterateNeighbors);
      const neighbors = getNeighbors(current.row, current.col);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey)) {
          const newDist = dist + 1;
          const oldDist = distances.get(neighborKey) || Infinity;
          
          setCurrentLine(DIJKSTRA_LINES.checkDistance);
          if (newDist < oldDist) {
            setCurrentLine(DIJKSTRA_LINES.updateDistance);
            distances.set(neighborKey, newDist);
            updateCell(neighbor.row, neighbor.col, { parent: current, distance: newDist });
            pq.push({ pos: neighbor, dist: newDist });
            
            if (!(neighbor.row === end.row && neighbor.col === end.col)) {
              setCellType(neighbor.row, neighbor.col, 'current');
            }
          }
        }
      }
    }
    
    setCurrentLine(-1);
    return false;
  }, [speed, setCellType, updateCell, incrementNodesVisited, saveStep, sleep, setCurrentLine]);

  const heuristic = (a: Position, b: Position): number => {
    // Manhattan distance
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  };

  const astar = useCallback(async () => {
    const { grid, start, end } = usePathfindingStore.getState();
    const openSet: { pos: Position; fScore: number }[] = [];
    const visited = new Set<string>();
    const gScores: Map<string, number> = new Map();
    
    // Initialize
    gScores.set(`${start.row},${start.col}`, 0);
    openSet.push({ pos: start, fScore: heuristic(start, end) });
    
    while (openSet.length > 0 && !shouldStop()) {
      setCurrentLine(ASTAR_LINES.whileLoop);
      // Sort by fScore
      openSet.sort((a, b) => a.fScore - b.fScore);
      const { pos: current } = openSet.shift()!;
      setCurrentLine(ASTAR_LINES.dequeue);
      const key = `${current.row},${current.col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      setCurrentLine(ASTAR_LINES.checkEnd);
      if (current.row === end.row && current.col === end.col) {
        setCurrentLine(-1);
        await reconstructPath(current);
        return true;
      }
      
      if (!(current.row === start.row && current.col === start.col)) {
        setCellType(current.row, current.col, 'visited');
        incrementNodesVisited();
        saveStep();
      }
      
      await sleep(speed);
      if (shouldStop()) break;
      
      const currentGScore = gScores.get(key) || Infinity;
      setCurrentLine(ASTAR_LINES.iterateNeighbors);
      const neighbors = getNeighbors(current.row, current.col);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (visited.has(neighborKey)) continue;
        
        setCurrentLine(ASTAR_LINES.calcG);
        const tentativeGScore = currentGScore + 1;
        const neighborGScore = gScores.get(neighborKey) || Infinity;
        
        if (tentativeGScore < neighborGScore) {
          gScores.set(neighborKey, tentativeGScore);
          setCurrentLine(ASTAR_LINES.calcH);
          const fScore = tentativeGScore + heuristic(neighbor, end);
          setCurrentLine(ASTAR_LINES.updateScore);
          updateCell(neighbor.row, neighbor.col, { 
            parent: current, 
            gScore: tentativeGScore,
            hScore: heuristic(neighbor, end),
            fScore 
          });
          openSet.push({ pos: neighbor, fScore });
          
          if (!(neighbor.row === end.row && neighbor.col === end.col)) {
            setCellType(neighbor.row, neighbor.col, 'current');
          }
        }
      }
    }
    
    setCurrentLine(-1);
    return false;
  }, [speed, setCellType, updateCell, incrementNodesVisited, saveStep, sleep, setCurrentLine]);

  const startPathfinding = useCallback(async () => {
    stopRef.current = false;
    clearHistory();
    setIsRunning(true);
    setIsPaused(false);

    let found = false;
    try {
      switch (algorithm) {
        case 'bfs':
          found = await bfs();
          break;
        case 'dfs':
          found = await dfs();
          break;
        case 'dijkstra':
          found = await dijkstra();
          break;
        case 'astar':
          found = await astar();
          break;
      }
    } finally {
      if (!shouldStop()) {
        setIsRunning(false);
      }
    }
    
    return found;
  }, [algorithm, bfs, dfs, dijkstra, astar, setIsRunning, setIsPaused, clearHistory]);

  const stopPathfinding = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  }, [setIsRunning, setIsPaused]);

  return { startPathfinding, stopPathfinding };
};
