import { useCallback, useRef } from 'react';
import { useGraphStore, NodeState, EdgeState } from '@/store/graphStore';

// Line numbers for each algorithm's key operations
const BFS_LINES = { whileLoop: 7, dequeue: 8, checkVisited: 10, addVisited: 11, iterateNeighbors: 14, pushQueue: 16 };
const DFS_LINES = { addVisited: 4, iterateNeighbors: 7, recursiveCall: 9 };
const DIJKSTRA_LINES = { whileLoop: 12, dequeue: 13, iterateNeighbors: 15, checkDistance: 18, updateDistance: 19, enqueue: 21 };

export const useGraphAlgorithm = () => {
  const {
    nodes,
    edges,
    speed,
    algorithm,
    isDirected,
    startNode,
    endNode,
    setIsRunning,
    setIsPaused,
    updateNode,
    updateEdge,
    setVisitedOrder,
    setPathNodes,
    setCurrentLine,
  } = useGraphStore();

  const stopRef = useRef(false);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const checkPause = () => {
        if (stopRef.current) {
          resolve();
          return;
        }
        if (useGraphStore.getState().isPaused) {
          setTimeout(checkPause, 100);
        } else {
          setTimeout(resolve, ms);
        }
      };
      checkPause();
    });
  }, []);

  const getAdjacencyList = useCallback(() => {
    const adj: Map<string, { node: string; edge: string; weight: number }[]> = new Map();
    nodes.forEach((n) => adj.set(n.id, []));

    edges.forEach((e) => {
      adj.get(e.source)?.push({ node: e.target, edge: e.id, weight: e.weight });
      if (!isDirected) {
        adj.get(e.target)?.push({ node: e.source, edge: e.id, weight: e.weight });
      }
    });

    return adj;
  }, [nodes, edges, isDirected]);

  const resetNodes = useCallback(() => {
    nodes.forEach((n) => updateNode(n.id, { state: 'unvisited' as NodeState, distance: undefined, parent: null }));
    edges.forEach((e) => updateEdge(e.id, { state: 'unvisited' as EdgeState }));
  }, [nodes, edges, updateNode, updateEdge]);

  const highlightPath = useCallback(async (parent: Map<string, string | null>, end: string) => {
    const path: string[] = [];
    let current: string | null = end;

    while (current) {
      path.unshift(current);
      current = parent.get(current) || null;
    }

    setPathNodes(path);

    // Get fresh state from store
    const currentEdges = useGraphStore.getState().edges;
    const currentNodes = useGraphStore.getState().nodes;
    const currentStartNode = useGraphStore.getState().startNode;
    const currentIsDirected = useGraphStore.getState().isDirected;

    // Reset all edges to unvisited first
    currentEdges.forEach((e) => updateEdge(e.id, { state: 'unvisited' as EdgeState }));
    
    // Reset all nodes except start and end to unvisited
    currentNodes.forEach((n) => {
      if (n.id !== currentStartNode && n.id !== end) {
        updateNode(n.id, { state: 'unvisited' as NodeState });
      }
    });

    // Small delay before showing the path
    await sleep(speed / 2);

    // Now highlight only the final path
    for (let i = 0; i < path.length && !stopRef.current; i++) {
      // Keep start as green, end as red, others as path (purple)
      if (path[i] === currentStartNode) {
        // Keep start node green but we'll still show it's part of path
      } else if (path[i] === end) {
        updateNode(path[i], { state: 'end' as NodeState });
      } else {
        updateNode(path[i], { state: 'path' as NodeState });
      }
      
      if (i > 0) {
        // Get fresh edges from store for finding the edge
        const latestEdges = useGraphStore.getState().edges;
        const edge = latestEdges.find(
          (e) => 
            (e.source === path[i - 1] && e.target === path[i]) ||
            (!currentIsDirected && e.source === path[i] && e.target === path[i - 1])
        );
        if (edge) {
          updateEdge(edge.id, { state: 'path' as EdgeState });
        }
      }
      
      await sleep(speed / 2);
    }
  }, [setPathNodes, updateNode, updateEdge, sleep, speed]);

  const bfs = useCallback(async () => {
    if (!startNode) return;
    
    stopRef.current = false;
    setIsRunning(true);
    resetNodes();

    const adj = getAdjacencyList();
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const parent = new Map<string, string | null>();
    const order: string[] = [];

    parent.set(startNode, null);
    updateNode(startNode, { state: 'start' as NodeState });
    await sleep(speed);

    while (queue.length > 0 && !stopRef.current) {
      setCurrentLine(BFS_LINES.whileLoop);
      const current = queue.shift()!;
      setCurrentLine(BFS_LINES.dequeue);
      
      if (visited.has(current)) continue;
      setCurrentLine(BFS_LINES.checkVisited);
      visited.add(current);
      setCurrentLine(BFS_LINES.addVisited);
      order.push(current);
      
      updateNode(current, { state: 'visiting' as NodeState });
      setVisitedOrder([...order]);
      await sleep(speed);

      if (current === endNode) {
        updateNode(current, { state: 'end' as NodeState });
        setCurrentLine(-1);
        await highlightPath(parent, endNode);
        break;
      }

      setCurrentLine(BFS_LINES.iterateNeighbors);
      for (const neighbor of adj.get(current) || []) {
        if (!visited.has(neighbor.node)) {
          updateEdge(neighbor.edge, { state: 'visiting' as EdgeState });
          updateNode(neighbor.node, { state: 'comparing' as NodeState });
          await sleep(speed / 2);

          if (!parent.has(neighbor.node)) {
            parent.set(neighbor.node, current);
            setCurrentLine(BFS_LINES.pushQueue);
            queue.push(neighbor.node);
          }

          updateEdge(neighbor.edge, { state: 'visited' as EdgeState });
        }
      }

      if (current !== endNode && current !== startNode) {
        updateNode(current, { state: 'visited' as NodeState });
      }
    }

    setCurrentLine(-1);
    setIsRunning(false);
  }, [startNode, endNode, speed, getAdjacencyList, resetNodes, setIsRunning, updateNode, updateEdge, setVisitedOrder, highlightPath, sleep, setCurrentLine]);

  const dfs = useCallback(async () => {
    if (!startNode) return;
    
    stopRef.current = false;
    setIsRunning(true);
    resetNodes();

    const adj = getAdjacencyList();
    const visited = new Set<string>();
    const stack: string[] = [startNode];
    const parent = new Map<string, string | null>();
    const order: string[] = [];

    parent.set(startNode, null);
    updateNode(startNode, { state: 'start' as NodeState });
    await sleep(speed);

    while (stack.length > 0 && !stopRef.current) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      setCurrentLine(DFS_LINES.addVisited);
      visited.add(current);
      order.push(current);
      
      updateNode(current, { state: 'visiting' as NodeState });
      setVisitedOrder([...order]);
      await sleep(speed);

      if (current === endNode) {
        updateNode(current, { state: 'end' as NodeState });
        setCurrentLine(-1);
        await highlightPath(parent, endNode);
        break;
      }

      setCurrentLine(DFS_LINES.iterateNeighbors);
      const neighbors = adj.get(current) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor.node)) {
          updateEdge(neighbor.edge, { state: 'visiting' as EdgeState });
          await sleep(speed / 3);

          if (!parent.has(neighbor.node)) {
            parent.set(neighbor.node, current);
            setCurrentLine(DFS_LINES.recursiveCall);
            stack.push(neighbor.node);
          }

          updateEdge(neighbor.edge, { state: 'visited' as EdgeState });
        }
      }

      if (current !== endNode && current !== startNode) {
        updateNode(current, { state: 'visited' as NodeState });
      }
    }

    setCurrentLine(-1);
    setIsRunning(false);
  }, [startNode, endNode, speed, getAdjacencyList, resetNodes, setIsRunning, updateNode, updateEdge, setVisitedOrder, highlightPath, sleep, setCurrentLine]);

  const dijkstra = useCallback(async () => {
    if (!startNode) return;
    
    stopRef.current = false;
    setIsRunning(true);
    resetNodes();

    const adj = getAdjacencyList();
    const distances = new Map<string, number>();
    const parent = new Map<string, string | null>();
    const visited = new Set<string>();
    const order: string[] = [];

    nodes.forEach((n) => distances.set(n.id, Infinity));
    distances.set(startNode, 0);
    parent.set(startNode, null);

    updateNode(startNode, { state: 'start' as NodeState, distance: 0 });
    await sleep(speed);

    while (!stopRef.current) {
      setCurrentLine(DIJKSTRA_LINES.whileLoop);
      // Find minimum distance unvisited node
      let minNode: string | null = null;
      let minDist = Infinity;

      for (const [nodeId, dist] of distances) {
        if (!visited.has(nodeId) && dist < minDist) {
          minDist = dist;
          minNode = nodeId;
        }
      }

      if (!minNode || minDist === Infinity) break;

      setCurrentLine(DIJKSTRA_LINES.dequeue);
      visited.add(minNode);
      order.push(minNode);
      setVisitedOrder([...order]);

      updateNode(minNode, { state: 'visiting' as NodeState, distance: minDist });
      await sleep(speed);

      if (minNode === endNode) {
        updateNode(minNode, { state: 'end' as NodeState });
        setCurrentLine(-1);
        await highlightPath(parent, endNode);
        break;
      }

      setCurrentLine(DIJKSTRA_LINES.iterateNeighbors);
      for (const neighbor of adj.get(minNode) || []) {
        if (!visited.has(neighbor.node)) {
          const newDist = minDist + neighbor.weight;
          
          updateEdge(neighbor.edge, { state: 'visiting' as EdgeState });
          updateNode(neighbor.node, { state: 'comparing' as NodeState });
          setCurrentLine(DIJKSTRA_LINES.checkDistance);
          await sleep(speed / 2);

          if (newDist < (distances.get(neighbor.node) || Infinity)) {
            setCurrentLine(DIJKSTRA_LINES.updateDistance);
            distances.set(neighbor.node, newDist);
            parent.set(neighbor.node, minNode);
            updateNode(neighbor.node, { distance: newDist });
          }

          updateEdge(neighbor.edge, { state: 'visited' as EdgeState });
          if (neighbor.node !== endNode) {
            updateNode(neighbor.node, { state: 'unvisited' as NodeState });
          }
        }
      }

      if (minNode !== startNode && minNode !== endNode) {
        updateNode(minNode, { state: 'visited' as NodeState });
      }
    }

    setCurrentLine(-1);
    setIsRunning(false);
  }, [startNode, endNode, speed, nodes, getAdjacencyList, resetNodes, setIsRunning, updateNode, updateEdge, setVisitedOrder, highlightPath, sleep, setCurrentLine]);

  const prims = useCallback(async () => {
    if (!startNode) return;
    
    stopRef.current = false;
    setIsRunning(true);
    resetNodes();

    const adj = getAdjacencyList();
    const inMST = new Set<string>();
    const mstEdges: string[] = [];

    inMST.add(startNode);
    updateNode(startNode, { state: 'path' as NodeState });
    await sleep(speed);

    while (inMST.size < nodes.length && !stopRef.current) {
      let minEdge: { from: string; to: string; edgeId: string; weight: number } | null = null;
      let minWeight = Infinity;

      for (const nodeId of inMST) {
        for (const neighbor of adj.get(nodeId) || []) {
          if (!inMST.has(neighbor.node) && neighbor.weight < minWeight) {
            minWeight = neighbor.weight;
            minEdge = { from: nodeId, to: neighbor.node, edgeId: neighbor.edge, weight: neighbor.weight };
          }
        }
      }

      if (!minEdge) break;

      updateEdge(minEdge.edgeId, { state: 'visiting' as EdgeState });
      updateNode(minEdge.to, { state: 'visiting' as NodeState });
      await sleep(speed);

      inMST.add(minEdge.to);
      mstEdges.push(minEdge.edgeId);

      updateEdge(minEdge.edgeId, { state: 'path' as EdgeState });
      updateNode(minEdge.to, { state: 'path' as NodeState });
      await sleep(speed);
    }

    setPathNodes(Array.from(inMST));
    setIsRunning(false);
  }, [startNode, speed, nodes, getAdjacencyList, resetNodes, setIsRunning, updateNode, updateEdge, setPathNodes, sleep]);

  const kruskals = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    resetNodes();

    // Union-Find
    const parent = new Map<string, string>();
    const rank = new Map<string, number>();
    nodes.forEach((n) => {
      parent.set(n.id, n.id);
      rank.set(n.id, 0);
    });

    const find = (x: string): string => {
      if (parent.get(x) !== x) {
        parent.set(x, find(parent.get(x)!));
      }
      return parent.get(x)!;
    };

    const union = (x: string, y: string): boolean => {
      const rootX = find(x);
      const rootY = find(y);
      if (rootX === rootY) return false;

      if ((rank.get(rootX) || 0) < (rank.get(rootY) || 0)) {
        parent.set(rootX, rootY);
      } else if ((rank.get(rootX) || 0) > (rank.get(rootY) || 0)) {
        parent.set(rootY, rootX);
      } else {
        parent.set(rootY, rootX);
        rank.set(rootX, (rank.get(rootX) || 0) + 1);
      }
      return true;
    };

    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const mstNodes = new Set<string>();

    for (const edge of sortedEdges) {
      if (stopRef.current) break;

      updateEdge(edge.id, { state: 'visiting' as EdgeState });
      updateNode(edge.source, { state: 'comparing' as NodeState });
      updateNode(edge.target, { state: 'comparing' as NodeState });
      await sleep(speed);

      if (union(edge.source, edge.target)) {
        updateEdge(edge.id, { state: 'path' as EdgeState });
        updateNode(edge.source, { state: 'path' as NodeState });
        updateNode(edge.target, { state: 'path' as NodeState });
        mstNodes.add(edge.source);
        mstNodes.add(edge.target);
      } else {
        updateEdge(edge.id, { state: 'visited' as EdgeState });
        if (!mstNodes.has(edge.source)) updateNode(edge.source, { state: 'unvisited' as NodeState });
        if (!mstNodes.has(edge.target)) updateNode(edge.target, { state: 'unvisited' as NodeState });
      }
      await sleep(speed);
    }

    setPathNodes(Array.from(mstNodes));
    setIsRunning(false);
  }, [speed, nodes, edges, resetNodes, setIsRunning, updateNode, updateEdge, setPathNodes, sleep]);

  const topologicalSort = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    resetNodes();

    const adj = getAdjacencyList();
    const visited = new Set<string>();
    const result: string[] = [];

    const dfsVisit = async (nodeId: string): Promise<void> => {
      if (stopRef.current || visited.has(nodeId)) return;
      visited.add(nodeId);

      updateNode(nodeId, { state: 'visiting' as NodeState });
      await sleep(speed);

      for (const neighbor of adj.get(nodeId) || []) {
        if (!visited.has(neighbor.node)) {
          updateEdge(neighbor.edge, { state: 'visiting' as EdgeState });
          await sleep(speed / 2);
          await dfsVisit(neighbor.node);
          updateEdge(neighbor.edge, { state: 'visited' as EdgeState });
        }
      }

      result.unshift(nodeId);
      updateNode(nodeId, { state: 'path' as NodeState });
      setVisitedOrder([...result]);
      await sleep(speed);
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        await dfsVisit(node.id);
      }
    }

    setPathNodes(result);
    setIsRunning(false);
  }, [speed, nodes, getAdjacencyList, resetNodes, setIsRunning, updateNode, updateEdge, setVisitedOrder, setPathNodes, sleep]);

  const startAlgorithm = useCallback(() => {
    switch (algorithm) {
      case 'bfs': return bfs();
      case 'dfs': return dfs();
      case 'dijkstra': return dijkstra();
      case 'prims': return prims();
      case 'kruskals': return kruskals();
      case 'topological': return topologicalSort();
      default: return bfs();
    }
  }, [algorithm, bfs, dfs, dijkstra, prims, kruskals, topologicalSort]);

  const stopAlgorithm = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  }, [setIsRunning, setIsPaused]);

  return { startAlgorithm, stopAlgorithm };
};
