import { motion } from 'framer-motion';
import { ChevronRight, Play, Pause, RotateCcw, Trash2, Grid, Shuffle, StepBack, StepForward, Map, Target, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CodePanel } from '@/components/panels/CodePanel';
import { usePathfindingStore, PathfindingAlgorithm, CellType } from '@/store/pathfindingStore';
import { usePathfindingAlgorithm } from '@/hooks/usePathfindingAlgorithm';
import { cn } from '@/lib/utils';
import { useCallback, useRef } from 'react';

const algorithmCode: Record<PathfindingAlgorithm, string> = {
  bfs: `function BFS(grid, start, end) {
  const queue = [start];
  const visited = new Set();
  const parent = new Map();
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === end) {
      return reconstructPath(parent, end);
    }
    
    for (const neighbor of getNeighbors(current)) {
      if (!visited.has(neighbor) && !isWall(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
  dfs: `function DFS(grid, start, end) {
  const stack = [start];
  const visited = new Set();
  const parent = new Map();
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (current === end) {
      return reconstructPath(parent, end);
    }
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    for (const neighbor of getNeighbors(current)) {
      if (!visited.has(neighbor) && !isWall(neighbor)) {
        parent.set(neighbor, current);
        stack.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
  dijkstra: `function dijkstra(grid, start, end) {
  const distances = new Map();
  const parent = new Map();
  const pq = new PriorityQueue();
  
  distances.set(start, 0);
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    
    if (current === end) {
      return reconstructPath(parent, end);
    }
    
    for (const neighbor of getNeighbors(current)) {
      const newDist = distances.get(current) + 1;
      
      if (newDist < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, newDist);
        parent.set(neighbor, current);
        pq.enqueue(neighbor, newDist);
      }
    }
  }
  
  return null;
}`,
  astar: `function aStar(grid, start, end) {
  const openSet = new PriorityQueue();
  const gScore = new Map();
  const fScore = new Map();
  const parent = new Map();
  
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, end));
  openSet.enqueue(start, fScore.get(start));
  
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    
    if (current === end) {
      return reconstructPath(parent, end);
    }
    
    for (const neighbor of getNeighbors(current)) {
      const tentativeG = gScore.get(current) + 1;
      
      if (tentativeG < (gScore.get(neighbor) ?? Infinity)) {
        parent.set(neighbor, current);
        gScore.set(neighbor, tentativeG);
        fScore.set(neighbor, tentativeG + heuristic(neighbor, end));
        openSet.enqueue(neighbor, fScore.get(neighbor));
      }
    }
  }
  
  return null;
}

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}`,
};

const algorithms: { value: PathfindingAlgorithm; label: string; description: string }[] = [
  { value: 'bfs', label: 'BFS', description: 'Breadth-First Search - Guarantees shortest path' },
  { value: 'dfs', label: 'DFS', description: 'Depth-First Search - Not optimal but fast' },
  { value: 'dijkstra', label: "Dijkstra's", description: "Dijkstra's Algorithm - Weighted shortest path" },
  { value: 'astar', label: 'A*', description: 'A* Search - Heuristic-based optimal pathfinding' },
];

const getCellColor = (type: CellType): string => {
  switch (type) {
    case 'start':
      return 'bg-green-500';
    case 'end':
      return 'bg-red-500';
    case 'wall':
      return 'bg-slate-700';
    case 'visited':
      return 'bg-blue-400/60';
    case 'path':
      return 'bg-yellow-400';
    case 'current':
      return 'bg-purple-400/80';
    default:
      return 'bg-slate-800/50 hover:bg-slate-700/50';
  }
};

const PathfindingGrid = () => {
  const { 
    grid, 
    isDrawing, 
    drawMode, 
    setIsDrawing, 
    setCellType, 
    setStart, 
    setEnd,
    isRunning,
    start,
    end,
  } = usePathfindingStore();
  
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellInteraction = useCallback((row: number, col: number) => {
    if (isRunning) return;
    
    const cell = grid[row][col];
    if (cell.type === 'start' || cell.type === 'end') return;
    
    switch (drawMode) {
      case 'wall':
        setCellType(row, col, 'wall');
        break;
      case 'erase':
        setCellType(row, col, 'empty');
        break;
      case 'start':
        setStart(row, col);
        break;
      case 'end':
        setEnd(row, col);
        break;
    }
  }, [isRunning, drawMode, grid, setCellType, setStart, setEnd]);

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    setIsDrawing(true);
    handleCellInteraction(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDrawing || isRunning) return;
    handleCellInteraction(row, col);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div 
      ref={gridRef}
      className="glass-card rounded-xl p-4 overflow-hidden flex flex-col h-[600px]"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="grid gap-[1px] flex-1"
        style={{ 
          gridTemplateColumns: `repeat(${grid[0]?.length || 40}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${grid.length || 20}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={cn(
                'rounded-[2px] transition-colors duration-100 cursor-pointer border border-slate-700/30 min-h-0',
                getCellColor(cell.type),
                cell.type === 'start' && 'flex items-center justify-center',
                cell.type === 'end' && 'flex items-center justify-center',
              )}
              onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
              onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
            >
              {cell.type === 'start' && <Flag className="w-3 h-3 text-white" />}
              {cell.type === 'end' && <Target className="w-3 h-3 text-white" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PathfindingPage = () => {
  const {
    algorithm,
    isRunning,
    isPaused,
    speed,
    drawMode,
    nodesVisited,
    pathLength,
    stepHistory,
    currentStepIndex,
    setAlgorithm,
    setSpeed,
    setDrawMode,
    setIsPaused,
    clearGrid,
    clearPath,
    generateMaze,
    stepBack,
    stepForward,
    canStepBack,
    canStepForward,
    currentLine,
  } = usePathfindingStore();

  const { startPathfinding, stopPathfinding } = usePathfindingAlgorithm();

  const handlePlayPause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    } else {
      clearPath();
      startPathfinding();
    }
  };

  const selectedAlgo = algorithms.find(a => a.value === algorithm);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Pathfinding</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Map className="w-8 h-8 text-primary" />
            Pathfinding Visualization
          </h1>
          <p className="text-muted-foreground">
            Draw walls, place start/end points, and watch pathfinding algorithms find the shortest path
          </p>
        </div>

        {/* Visualization & Code Side by Side */}
        <div className="grid lg:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col gap-3 min-h-[600px]">
            <PathfindingGrid />
            
            {/* Step Controls */}
            {stepHistory.length > 0 && (
              <div className="glass-card rounded-xl p-3 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stepBack}
                  disabled={!canStepBack() || (isRunning && !isPaused)}
                  className="flex items-center gap-2"
                >
                  <StepBack className="w-4 h-4" />
                  Back
                </Button>
                <span className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1} / {stepHistory.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stepForward}
                  disabled={!canStepForward() || (isRunning && !isPaused)}
                  className="flex items-center gap-2"
                >
                  Forward
                  <StepForward className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <CodePanel 
            code={algorithmCode[algorithm]} 
            language="javascript"
            title={`${selectedAlgo?.label || algorithm.toUpperCase()} Implementation`}
            highlightLine={currentLine}
          />
        </div>

        {/* Controls Below */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Algorithm Selector */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium">Algorithm</label>
            <div className="space-y-2">
              {algorithms.map((algo) => (
                <button
                  key={algo.value}
                  onClick={() => setAlgorithm(algo.value)}
                  disabled={isRunning}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-left transition-all',
                    algorithm === algo.value
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
                    'disabled:opacity-50'
                  )}
                >
                  <div className="font-medium">{algo.label}</div>
                  <div className="text-xs opacity-80">{algo.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Draw Mode */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium">Draw Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDrawMode('wall')}
                disabled={isRunning}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  drawMode === 'wall'
                    ? 'bg-slate-700 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                🧱 Wall
              </button>
              <button
                onClick={() => setDrawMode('erase')}
                disabled={isRunning}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  drawMode === 'erase'
                    ? 'bg-slate-700 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                🧹 Erase
              </button>
              <button
                onClick={() => setDrawMode('start')}
                disabled={isRunning}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  drawMode === 'start'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                🚩 Start
              </button>
              <button
                onClick={() => setDrawMode('end')}
                disabled={isRunning}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  drawMode === 'end'
                    ? 'bg-red-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                🎯 End
              </button>
            </div>
            
            {/* Speed Control */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground">Speed</label>
                <span className="text-sm font-mono text-primary">{speed}ms</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([value]) => setSpeed(value)}
                min={5}
                max={200}
                step={5}
                disabled={isRunning && !isPaused}
                className="w-full"
              />
            </div>
          </div>

          {/* Stats & Playback */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium">Statistics</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-xl font-bold text-blue-400">{nodesVisited}</div>
                <div className="text-xs text-muted-foreground">Visited</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-xl font-bold text-yellow-400">{pathLength}</div>
                <div className="text-xs text-muted-foreground">Path</div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                onClick={handlePlayPause}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                {isRunning && !isPaused ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Resume' : 'Start'}
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={stopPathfinding}
                disabled={!isRunning}
              >
                Stop
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearPath}
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearGrid}
                disabled={isRunning}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateMaze}
                disabled={isRunning}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium">Legend</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>End</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-700 rounded"></div>
                <span>Wall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400/60 rounded"></div>
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400/80 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Path</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default PathfindingPage;
