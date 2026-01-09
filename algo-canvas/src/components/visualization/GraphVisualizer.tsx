import React, { useCallback, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGraphStore, GraphNode, GraphEdge } from '@/store/graphStore';
import { cn } from '@/lib/utils';

const getNodeColor = (state: string, isStart: boolean, isEnd: boolean): string => {
  if (isStart) return 'bg-green-500 border-green-400';
  if (isEnd) return 'bg-red-500 border-red-400';
  
  switch (state) {
    case 'visiting': return 'bg-yellow-500 border-yellow-400 animate-pulse';
    case 'visited': return 'bg-blue-500 border-blue-400';
    case 'path': return 'bg-purple-500 border-purple-400';
    case 'comparing': return 'bg-orange-400 border-orange-300';
    default: return 'bg-slate-600 border-slate-500';
  }
};

const getEdgeColor = (state: string): string => {
  switch (state) {
    case 'visiting': return 'stroke-yellow-500';
    case 'visited': return 'stroke-blue-400';
    case 'path': return 'stroke-purple-500';
    default: return 'stroke-slate-500';
  }
};

export const GraphVisualizer = () => {
  const { nodes, edges, isWeighted, isDirected, startNode, endNode, setStartNode, setEndNode, updateNode } = useGraphStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });

  // Calculate the required SVG dimensions based on node positions
  const svgBounds = React.useMemo(() => {
    if (nodes.length === 0) return { width: dimensions.width, height: dimensions.height };
    
    const padding = 50;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    
    return {
      width: Math.max(dimensions.width, maxX),
      height: Math.max(dimensions.height, maxY),
    };
  }, [nodes, dimensions]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 32; // account for padding
        setDimensions({
          width: Math.max(400, width),
          height: 500,
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

  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setEndNode(endNode === nodeId ? null : nodeId);
    } else if (e.ctrlKey || e.metaKey) {
      setStartNode(startNode === nodeId ? null : nodeId);
    }
  };

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
      setDraggingNode(nodeId);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = svgBounds.width / rect.width;
      const scaleY = svgBounds.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      updateNode(draggingNode, { x: Math.max(30, x), y: Math.max(30, Math.min(svgBounds.height - 30, y)) });
    }
  }, [draggingNode, updateNode, svgBounds]);

  const handleMouseUp = () => setDraggingNode(null);

  const getEdgePath = (edge: GraphEdge): { x1: number; y1: number; x2: number; y2: number } | null => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const radius = 20;
    
    return {
      x1: sourceNode.x + (dx / len) * radius,
      y1: sourceNode.y + (dy / len) * radius,
      x2: targetNode.x - (dx / len) * radius,
      y2: targetNode.y - (dy / len) * radius,
    };
  };

  return (
    <div ref={containerRef} className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h3 className="font-semibold">Graph Visualization</h3>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500" /> Start (Ctrl+Click)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500" /> End (Shift+Click)
          </span>
          <span>Drag to move nodes</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto overflow-y-hidden rounded-lg">
        <svg
          ref={svgRef}
          width={svgBounds.width}
          height={svgBounds.height}
          viewBox={`0 0 ${svgBounds.width} ${svgBounds.height}`}
          preserveAspectRatio="xMinYMin meet"
          className="bg-slate-900/50 rounded-lg cursor-crosshair"
          style={{ minWidth: `${svgBounds.width}px` }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-slate-400" />
          </marker>
          <marker
            id="arrowhead-path"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-purple-500" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge) => {
          const path = getEdgePath(edge);
          if (!path) return null;
          
          const midX = (path.x1 + path.x2) / 2;
          const midY = (path.y1 + path.y2) / 2;

          return (
            <g key={edge.id}>
              <motion.line
                x1={path.x1}
                y1={path.y1}
                x2={path.x2}
                y2={path.y2}
                className={cn(getEdgeColor(edge.state), 'transition-all duration-300')}
                strokeWidth={edge.state === 'path' ? 4 : 2}
                markerEnd={isDirected ? (edge.state === 'path' ? 'url(#arrowhead-path)' : 'url(#arrowhead)') : undefined}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              {isWeighted && (
                <g>
                  <rect
                    x={midX - 12}
                    y={midY - 10}
                    width={24}
                    height={20}
                    rx={4}
                    fill="rgba(0,0,0,0.7)"
                    className="stroke-slate-600"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    className="fill-white text-xs font-mono"
                  >
                    {edge.weight}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            style={{ cursor: draggingNode === node.id ? 'grabbing' : 'grab' }}
            onMouseDown={(e) => handleMouseDown(node.id, e)}
            onClick={(e) => handleNodeClick(node.id, e)}
          >
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={20}
              className={cn(
                'stroke-2 transition-colors duration-300',
                getNodeColor(node.state, node.id === startNode, node.id === endNode).replace('bg-', 'fill-').replace('border-', 'stroke-')
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="fill-white text-sm font-bold pointer-events-none select-none"
            >
              {node.label}
            </text>
            {node.distance !== undefined && (
              <text
                x={node.x}
                y={node.y - 30}
                textAnchor="middle"
                className="fill-yellow-400 text-xs font-mono"
              >
                d={node.distance === Infinity ? '∞' : node.distance}
              </text>
            )}
          </g>
        ))}
      </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-600" /> Unvisited
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" /> Visiting
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" /> Visited
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500" /> Path/MST
        </div>
      </div>
    </div>
  );
};
