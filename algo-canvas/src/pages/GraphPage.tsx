import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GraphVisualizer } from '@/components/visualization/GraphVisualizer';
import { GraphControls } from '@/components/controls/GraphControls';
import { CodePanel } from '@/components/panels/CodePanel';
import { useGraphStore } from '@/store/graphStore';
import { useGraphAlgorithm } from '@/hooks/useGraphAlgorithm';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { StepBack, StepForward } from 'lucide-react';

const algorithmCode: Record<string, string> = {
  bfs: `function BFS(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }
  
  return result;
}`,
  dfs: `function DFS(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfsRecursive(node) {
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsRecursive(neighbor);
      }
    }
  }
  
  dfsRecursive(start);
  return result;
}`,
  dijkstra: `function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const pq = new PriorityQueue();
  
  // Initialize distances
  for (const node of graph.nodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    
    for (const [neighbor, weight] of graph[current]) {
      const alt = distances[current] + weight;
      
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
        pq.enqueue(neighbor, alt);
      }
    }
  }
  
  return { distances, previous };
}`,
  'bellman-ford': `function bellmanFord(graph, start) {
  const distances = {};
  const edges = graph.edges;
  
  // Initialize distances
  for (const node of graph.nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  // Relax edges V-1 times
  for (let i = 0; i < graph.nodes.length - 1; i++) {
    for (const [u, v, w] of edges) {
      if (distances[u] + w < distances[v]) {
        distances[v] = distances[u] + w;
      }
    }
  }
  
  // Check for negative cycles
  for (const [u, v, w] of edges) {
    if (distances[u] + w < distances[v]) {
      throw new Error("Negative cycle detected");
    }
  }
  
  return distances;
}`,
  prims: `function primsMST(graph) {
  const mst = [];
  const visited = new Set();
  const pq = new PriorityQueue();
  
  // Start from node 0
  visited.add(0);
  for (const [neighbor, weight] of graph[0]) {
    pq.enqueue([0, neighbor, weight], weight);
  }
  
  while (!pq.isEmpty() && mst.length < n - 1) {
    const [u, v, weight] = pq.dequeue();
    
    if (visited.has(v)) continue;
    
    visited.add(v);
    mst.push([u, v, weight]);
    
    for (const [neighbor, w] of graph[v]) {
      if (!visited.has(neighbor)) {
        pq.enqueue([v, neighbor, w], w);
      }
    }
  }
  
  return mst;
}`,
  kruskals: `function kruskalsMST(graph) {
  const edges = [...graph.edges].sort((a, b) => a[2] - b[2]);
  const parent = {};
  const rank = {};
  const mst = [];
  
  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }
  
  function union(x, y) {
    const px = find(x), py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
    return true;
  }
  
  for (const node of graph.nodes) {
    parent[node] = node;
    rank[node] = 0;
  }
  
  for (const [u, v, w] of edges) {
    if (union(u, v)) {
      mst.push([u, v, w]);
    }
  }
  
  return mst;
}`,
  topological: `function topologicalSort(graph) {
  const inDegree = {};
  const queue = [];
  const result = [];
  
  // Calculate in-degrees
  for (const node of graph.nodes) {
    inDegree[node] = 0;
  }
  for (const [u, v] of graph.edges) {
    inDegree[v]++;
  }
  
  // Add nodes with 0 in-degree
  for (const node of graph.nodes) {
    if (inDegree[node] === 0) {
      queue.push(node);
    }
  }
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  if (result.length !== graph.nodes.length) {
    throw new Error("Graph has a cycle!");
  }
  
  return result;
}`,
  'floyd-warshall': `function floydWarshall(graph) {
  const n = graph.nodes.length;
  const dist = Array(n).fill(null)
    .map(() => Array(n).fill(Infinity));
  
  // Initialize with direct edges
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }
  for (const [u, v, w] of graph.edges) {
    dist[u][v] = w;
  }
  
  // Main algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  
  return dist;
}`,
};

export const GraphPage = () => {
  const { 
    algorithm, 
    isRunning, 
    isPaused,
    nodes, 
    edges, 
    generatePresetGraph, 
    currentLine,
    stepHistory,
    currentStepIndex,
    stepBack,
    stepForward,
    canStepBack,
    canStepForward
  } = useGraphStore();
  const { startAlgorithm, stopAlgorithm } = useGraphAlgorithm();

  // Initialize with a sample graph
  useEffect(() => {
    if (nodes.length === 0) {
      generatePresetGraph('simple');
    }
  }, []);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Graph Algorithms
          </h1>
          <p className="text-muted-foreground">
            Visualize traversal, shortest path, and MST algorithms
          </p>
        </div>

        {/* Visualization & Code Side by Side */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <GraphVisualizer />
            
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
            code={algorithmCode[algorithm] || '// Select an algorithm'} 
            language="javascript"
            title={`${algorithm.toUpperCase()} Implementation`}
            highlightLine={currentLine}
          />
        </div>

        {/* Controls Below */}
        <div className="grid md:grid-cols-2 gap-4">
          <GraphControls />
          
          {/* Graph Stats Panel */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-3">Graph Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{nodes.length}</div>
                <div className="text-muted-foreground">Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{edges.length}</div>
                <div className="text-muted-foreground">Edges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {nodes.filter(n => n.state === 'visited').length}
                </div>
                <div className="text-muted-foreground">Visited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {edges.filter(e => e.state === 'path').length}
                </div>
                <div className="text-muted-foreground">Path Edges</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default GraphPage;
