import { useGraphStore, GraphAlgorithm } from '@/store/graphStore';
import { useGraphAlgorithm } from '@/hooks/useGraphAlgorithm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Shuffle, StepForward } from 'lucide-react';

const algorithms: { value: GraphAlgorithm; label: string; description: string }[] = [
  { value: 'bfs', label: 'Breadth-First Search', description: 'Explores nodes level by level' },
  { value: 'dfs', label: 'Depth-First Search', description: 'Explores as far as possible before backtracking' },
  { value: 'dijkstra', label: "Dijkstra's Algorithm", description: 'Finds shortest path in weighted graphs' },
  { value: 'bellman-ford', label: 'Bellman-Ford', description: 'Handles negative weights' },
  { value: 'prims', label: "Prim's MST", description: 'Minimum Spanning Tree using greedy' },
  { value: 'kruskals', label: "Kruskal's MST", description: 'MST using union-find' },
  { value: 'topological', label: 'Topological Sort', description: 'Linear ordering of vertices' },
  { value: 'floyd-warshall', label: 'Floyd-Warshall', description: 'All pairs shortest paths' },
];

const graphPresets = [
  { value: 'simple', label: 'Simple Graph (6 nodes)' },
  { value: 'complex', label: 'Complex Graph (10 nodes)' },
  { value: 'tree', label: 'Binary Tree' },
  { value: 'grid', label: 'Grid Graph' },
  { value: 'dag', label: 'DAG (Topological)' },
];

export const GraphControls = () => {
  const {
    algorithm,
    setAlgorithm,
    isRunning,
    speed,
    setSpeed,
    isWeighted,
    setIsWeighted,
    isDirected,
    setIsDirected,
    generatePresetGraph,
    resetVisualization,
    startNode,
  } = useGraphStore();

  const { startAlgorithm, stopAlgorithm } = useGraphAlgorithm();

  const selectedAlgo = algorithms.find((a) => a.value === algorithm);

  const handlePlay = () => {
    if (isRunning) {
      stopAlgorithm();
    } else {
      if (!startNode) {
        alert('Please select a start node (Ctrl+Click on a node)');
        return;
      }
      startAlgorithm();
    }
  };

  const handleReset = () => {
    stopAlgorithm();
    resetVisualization();
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Algorithm</Label>
        <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as GraphAlgorithm)}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-700">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {algorithms.map((algo) => (
              <SelectItem key={algo.value} value={algo.value} className="focus:bg-slate-700">
                {algo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAlgo && (
          <p className="text-xs text-muted-foreground">{selectedAlgo.description}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Graph Preset</Label>
        <Select onValueChange={(v) => generatePresetGraph(v)}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-700">
            <SelectValue placeholder="Select preset graph" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {graphPresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value} className="focus:bg-slate-700">
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Animation Speed: {speed}ms</Label>
        <Slider
          value={[speed]}
          onValueChange={([v]) => setSpeed(v)}
          min={50}
          max={2000}
          step={50}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Switch id="weighted" checked={isWeighted} onCheckedChange={setIsWeighted} />
          <Label htmlFor="weighted" className="text-sm">Weighted</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="directed" checked={isDirected} onCheckedChange={setIsDirected} />
          <Label htmlFor="directed" className="text-sm">Directed</Label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handlePlay}
          variant={isRunning ? 'destructive' : 'default'}
          className="flex-1 min-w-[80px] flex items-center justify-center gap-2"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Stop' : 'Start'}
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1 min-w-[80px] flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-700 space-y-2">
        <h4 className="text-sm font-medium">Time Complexity</h4>
        <div className="text-xs text-muted-foreground font-mono">
          {algorithm === 'bfs' && 'O(V + E)'}
          {algorithm === 'dfs' && 'O(V + E)'}
          {algorithm === 'dijkstra' && 'O((V + E) log V)'}
          {algorithm === 'bellman-ford' && 'O(V × E)'}
          {algorithm === 'prims' && 'O(E log V)'}
          {algorithm === 'kruskals' && 'O(E log E)'}
          {algorithm === 'topological' && 'O(V + E)'}
          {algorithm === 'floyd-warshall' && 'O(V³)'}
        </div>
        <h4 className="text-sm font-medium mt-2">Space Complexity</h4>
        <div className="text-xs text-muted-foreground font-mono">
          {algorithm === 'floyd-warshall' ? 'O(V²)' : 'O(V)'}
        </div>
      </div>
    </div>
  );
};
