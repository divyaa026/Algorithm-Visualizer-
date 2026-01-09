import { useDataStructuresStore, TreeNode, ListNode, HashEntry } from '@/store/dataStructuresStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState, useCallback } from 'react';

// Tree Visualizer Component
export const TreeVisualizer = () => {
  const { treeRoot, structureType } = useDataStructuresStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 350 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [nodePositionOverrides, setNodePositionOverrides] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 32; // account for padding
        setDimensions({
          width: Math.max(400, width),
          height: 350,
        });
      }
    };
    
    updateDimensions();
    
    // Use ResizeObserver to detect container size changes (including sidebar toggle)
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  const getNodeColor = (highlight: string) => {
    switch (highlight) {
      case 'active': return 'fill-yellow-500 stroke-yellow-400';
      case 'comparing': return 'fill-orange-500 stroke-orange-400';
      case 'found': return 'fill-green-500 stroke-green-400';
      case 'inserting': return 'fill-purple-500 stroke-purple-400';
      case 'deleting': return 'fill-red-500 stroke-red-400';
      case 'traversing': return 'fill-cyan-500 stroke-cyan-400';
      default: return 'fill-blue-500 stroke-blue-400';
    }
  };

  // Calculate tree depth to determine required height
  const getTreeDepth = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };

  const treeDepth = getTreeDepth(treeRoot);
  const requiredHeight = Math.max(350, treeDepth * 70 + 60); // 70px per level + padding

  const calculatePositions = (node: TreeNode | null, x: number, y: number, level: number, positions: Map<string, { x: number; y: number }>, spacing: number) => {
    if (!node) return;
    // Use override position if available, otherwise use calculated position
    const override = nodePositionOverrides.get(node.id);
    const finalX = override?.x ?? x;
    const finalY = override?.y ?? y;
    positions.set(node.id, { x: finalX, y: finalY });
    const nextSpacing = spacing / 2;
    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 70, level + 1, positions, nextSpacing);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 70, level + 1, positions, nextSpacing);
    }
  };

  // Mouse handlers for dragging
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingNode(nodeId);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setNodePositionOverrides(prev => {
        const newMap = new Map(prev);
        newMap.set(draggingNode, {
          x: Math.max(30, Math.min(dimensions.width - 30, x)),
          y: Math.max(30, Math.min(requiredHeight - 30, y))
        });
        return newMap;
      });
    }
  }, [draggingNode, dimensions, requiredHeight]);

  const handleMouseUp = () => setDraggingNode(null);

  const positions = new Map<string, { x: number; y: number }>();
  if (treeRoot) {
    calculatePositions(treeRoot, dimensions.width / 2, 40, 0, positions, dimensions.width / 4);
  }

  const renderNode = (node: TreeNode | null): JSX.Element[] => {
    if (!node) return [];
    const pos = positions.get(node.id);
    if (!pos) return [];
    
    const elements: JSX.Element[] = [];
    
    // Draw edges first
    if (node.left) {
      const leftPos = positions.get(node.left.id);
      if (leftPos) {
        elements.push(
          <line
            key={`edge-${node.id}-${node.left.id}`}
            x1={pos.x}
            y1={pos.y}
            x2={leftPos.x}
            y2={leftPos.y}
            className="stroke-slate-500"
            strokeWidth={2}
          />
        );
      }
    }
    if (node.right) {
      const rightPos = positions.get(node.right.id);
      if (rightPos) {
        elements.push(
          <line
            key={`edge-${node.id}-${node.right.id}`}
            x1={pos.x}
            y1={pos.y}
            x2={rightPos.x}
            y2={rightPos.y}
            className="stroke-slate-500"
            strokeWidth={2}
          />
        );
      }
    }

    // Draw node
    elements.push(
      <g 
        key={`node-${node.id}`}
        onMouseDown={(e) => handleMouseDown(node.id, e)}
        style={{ cursor: 'grab' }}
      >
        <motion.circle
          cx={pos.x}
          cy={pos.y}
          r={25}
          className={cn('stroke-2', getNodeColor(node.highlight), draggingNode === node.id && 'stroke-white stroke-[3]')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
        <text
          x={pos.x}
          y={pos.y + 5}
          textAnchor="middle"
          className="fill-white text-sm font-bold pointer-events-none"
        >
          {node.value}
        </text>
        {structureType === 'avl' && node.height !== undefined && (
          <text
            x={pos.x}
            y={pos.y - 32}
            textAnchor="middle"
            className="fill-yellow-400 text-xs pointer-events-none"
          >
            h={node.height}
          </text>
        )}
      </g>
    );

    // Recursively render children
    elements.push(...renderNode(node.left));
    elements.push(...renderNode(node.right));
    
    return elements;
  };

  return (
    <div ref={containerRef} className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h3 className="font-semibold">
          {structureType === 'binary-tree' && 'Binary Tree'}
          {structureType === 'bst' && 'Binary Search Tree'}
          {structureType === 'avl' && 'AVL Tree'}
          {structureType === 'heap' && 'Heap (Tree View)'}
        </h3>
        <span className="text-xs text-muted-foreground">Drag to move nodes</span>
      </div>
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[500px]">
        <svg
          ref={svgRef}
          width="100%"
          height={requiredHeight}
          viewBox={`0 0 ${dimensions.width} ${requiredHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="bg-slate-900/50 rounded-lg min-w-[300px] cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {treeRoot ? renderNode(treeRoot) : (
            <text x={dimensions.width / 2} y={requiredHeight / 2} textAnchor="middle" className="fill-muted-foreground">
              Empty tree - Add some nodes!
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

// Linked List Visualizer
export const LinkedListVisualizer = () => {
  const { listHead, listNodes } = useDataStructuresStore();

  const getNodes = (): ListNode[] => {
    const nodes: ListNode[] = [];
    let currentId = listHead;
    while (currentId) {
      const node = listNodes.get(currentId);
      if (node) {
        nodes.push(node);
        currentId = node.next;
      } else {
        break;
      }
    }
    return nodes;
  };

  const nodes = getNodes();

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <h3 className="font-semibold mb-4">Linked List</h3>
      <div className="flex items-center gap-2 overflow-x-auto pb-4 min-h-[100px]">
        {nodes.length === 0 ? (
          <p className="text-muted-foreground">Empty list - Add some nodes!</p>
        ) : (
          nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center">
              <motion.div
                className={cn(
                  'flex flex-col items-center justify-center min-w-[60px] h-16 rounded-lg border-2',
                  node.highlight === 'active'
                    ? 'bg-yellow-500/80 border-yellow-400 text-black'
                    : node.highlight === 'found'
                    ? 'bg-green-500/80 border-green-400'
                    : 'bg-blue-500/60 border-blue-400'
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <span className="font-mono font-bold">{node.value}</span>
                <span className="text-xs opacity-60">idx: {idx}</span>
              </motion.div>
              {node.next && (
                <div className="flex items-center px-2">
                  <div className="w-8 h-0.5 bg-slate-500" />
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-slate-500" />
                </div>
              )}
            </div>
          ))
        )}
        {nodes.length > 0 && (
          <div className="flex items-center px-2">
            <div className="w-8 h-0.5 bg-slate-500" />
            <span className="text-sm text-muted-foreground ml-2">null</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Stack Visualizer
export const StackVisualizer = () => {
  const { stackQueue, structureType } = useDataStructuresStore();

  if (structureType !== 'stack') return null;

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <h3 className="font-semibold mb-4">Stack (LIFO)</h3>
      <div className="flex flex-col-reverse items-center gap-2 min-h-[200px]">
        {stackQueue.length === 0 ? (
          <p className="text-muted-foreground">Empty stack - Push some elements!</p>
        ) : (
          stackQueue.map((value, idx) => (
            <motion.div
              key={`${idx}-${value}`}
              className={cn(
                'w-32 h-12 flex items-center justify-center rounded border-2',
                idx === stackQueue.length - 1
                  ? 'bg-green-500/80 border-green-400'
                  : 'bg-blue-500/60 border-blue-400'
              )}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <span className="font-mono font-bold">{value}</span>
              {idx === stackQueue.length - 1 && (
                <span className="ml-2 text-xs bg-black/30 px-2 py-0.5 rounded">TOP</span>
              )}
            </motion.div>
          ))
        )}
      </div>
      <div className="w-32 mx-auto h-2 bg-slate-600 rounded-b-lg mt-2" />
    </div>
  );
};

// Queue Visualizer
export const QueueVisualizer = () => {
  const { stackQueue, structureType } = useDataStructuresStore();

  if (structureType !== 'queue') return null;

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <h3 className="font-semibold mb-4">Queue (FIFO)</h3>
      <div className="flex items-center gap-2 overflow-x-auto pb-4 min-h-[80px]">
        <div className="text-sm text-muted-foreground mr-2">Front →</div>
        {stackQueue.length === 0 ? (
          <p className="text-muted-foreground">Empty queue - Enqueue some elements!</p>
        ) : (
          stackQueue.map((value, idx) => (
            <motion.div
              key={`${idx}-${value}`}
              className={cn(
                'min-w-[60px] h-14 flex items-center justify-center rounded border-2',
                idx === 0
                  ? 'bg-green-500/80 border-green-400'
                  : idx === stackQueue.length - 1
                    ? 'bg-purple-500/80 border-purple-400'
                    : 'bg-blue-500/60 border-blue-400'
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <span className="font-mono font-bold">{value}</span>
            </motion.div>
          ))
        )}
        <div className="text-sm text-muted-foreground ml-2">← Rear</div>
      </div>
    </div>
  );
};

// Heap Visualizer (Array view)
export const HeapArrayVisualizer = () => {
  const { heapArray } = useDataStructuresStore();

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <h3 className="font-semibold mb-4">Heap (Array View)</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {heapArray.length === 0 ? (
          <p className="text-muted-foreground">Empty heap - Insert some elements!</p>
        ) : (
          heapArray.map((value, idx) => (
            <motion.div
              key={`${idx}-${value}`}
              className={cn(
                'w-14 h-14 flex flex-col items-center justify-center rounded-lg border-2',
                idx === 0
                  ? 'bg-green-500/80 border-green-400'
                  : 'bg-blue-500/60 border-blue-400'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-xs text-muted-foreground">[{idx}]</span>
              <span className="font-mono font-bold">{value}</span>
            </motion.div>
          ))
        )}
      </div>
      {heapArray.length > 0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Parent of i: ⌊(i-1)/2⌋ | Left child: 2i+1 | Right child: 2i+2</p>
        </div>
      )}
    </div>
  );
};

// Hash Table Visualizer
export const HashTableVisualizer = () => {
  const { hashTable, hashTableSize } = useDataStructuresStore();

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <h3 className="font-semibold mb-4">Hash Table</h3>
      <div className="space-y-2">
        {Array.from({ length: hashTableSize }).map((_, idx) => {
          const entry = hashTable[idx];
          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-12 h-10 flex items-center justify-center bg-slate-700 rounded text-sm font-mono">
                [{idx}]
              </div>
              <div className="w-8 h-0.5 bg-slate-500" />
              <div className="flex-1 flex items-center gap-2 overflow-x-auto">
                {!entry ? (
                  <span className="text-sm text-muted-foreground italic">empty</span>
                ) : (
                  <motion.div
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded border-2',
                      entry.highlight === 'active'
                        ? 'bg-yellow-500/80 border-yellow-400'
                        : entry.highlight === 'found'
                        ? 'bg-green-500/80 border-green-400'
                        : 'bg-blue-500/60 border-blue-400'
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="font-mono text-sm">{entry.key}:</span>
                    <span className="font-bold">{entry.value}</span>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Hash function: hash(key) % {hashTableSize}</p>
      </div>
    </div>
  );
};

// Main DataStructuresVisualizer component that selects the appropriate visualization
export const DataStructuresVisualizer = () => {
  const { structureType } = useDataStructuresStore();

  switch (structureType) {
    case 'binary-tree':
    case 'bst':
    case 'avl':
      return <TreeVisualizer />;
    case 'heap':
      return (
        <div className="space-y-4">
          <TreeVisualizer />
          <HeapArrayVisualizer />
        </div>
      );
    case 'linked-list':
      return <LinkedListVisualizer />;
    case 'stack':
      return <StackVisualizer />;
    case 'queue':
      return <QueueVisualizer />;
    case 'hash-table':
      return <HashTableVisualizer />;
    default:
      return <TreeVisualizer />;
  }
};