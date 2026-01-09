import { useDPStore, DPCell } from '@/store/dpStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const getCellColor = (state: string): string => {
  switch (state) {
    case 'computing': return 'bg-yellow-500/80 text-black animate-pulse';
    case 'computed': return 'bg-blue-500/60 text-white';
    case 'optimal': return 'bg-green-500/80 text-white';
    case 'highlighted': return 'bg-purple-500/80 text-white';
    default: return 'bg-slate-700/50 text-slate-300';
  }
};

// Empty state placeholder
const EmptyState = () => (
  <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
    <div className="text-4xl mb-3">📊</div>
    <h3 className="text-base font-semibold mb-1">No Visualization Yet</h3>
    <p className="text-muted-foreground text-center text-xs">
      Click "Start" to visualize the algorithm
    </p>
  </div>
);

interface DPTableProps {
  table: DPCell[][];
  rowLabels?: string[];
  colLabels?: string[];
  highlightCell?: { row: number; col: number } | null;
}

export const DPTable = ({ table, rowLabels, colLabels, highlightCell }: DPTableProps) => {
  if (table.length === 0) return <div className="text-muted-foreground text-center py-8">No data to display</div>;

  return (
    <div className="glass-card rounded-xl p-4 w-full overflow-hidden">
      <h3 className="font-semibold mb-4">DP Table</h3>
      
      <div className="w-full overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              {rowLabels && <th className="p-2 text-xs text-muted-foreground"></th>}
              {(colLabels || table[0])?.map((_, colIdx) => (
                <th key={colIdx} className="p-2 text-xs text-muted-foreground font-mono min-w-[40px]">
                  {colLabels ? colLabels[colIdx] : colIdx}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {rowLabels && (
                  <td className="p-2 text-xs text-muted-foreground font-mono">
                    {rowLabels[rowIdx]}
                  </td>
                )}
                {row.map((cell, colIdx) => {
                  const isHighlight = highlightCell?.row === rowIdx && highlightCell?.col === colIdx;
                  
                  return (
                    <td key={colIdx} className="p-0">
                      <motion.div
                        className={cn(
                          'w-10 h-10 flex items-center justify-center text-xs font-mono border border-slate-600 transition-all',
                          getCellColor(cell.state),
                          isHighlight && 'ring-2 ring-yellow-400 scale-110 z-10'
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: isHighlight ? 1.1 : 1,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {typeof cell.value === 'number' 
                          ? (cell.value === Infinity ? '∞' : cell.value === -Infinity ? '-∞' : cell.value)
                          : cell.value
                        }
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-slate-700" /> Empty
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-yellow-500" /> Computing
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-500" /> Computed
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-purple-500" /> Highlighted
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-500" /> Optimal
        </div>
      </div>
    </div>
  );
};

// Fibonacci-specific visualization
export const FibonacciVisualization = () => {
  const { table, currentStep } = useDPStore();
  
  if (!table || table.length === 0) return <EmptyState />;

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="font-semibold mb-4">Fibonacci Sequence</h3>
      <div className="flex flex-wrap gap-2">
        {table[0]?.map((cell, idx) => (
          <motion.div
            key={idx}
            className={cn(
              'w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2',
              getCellColor(cell.state)
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <span className="text-xs text-muted-foreground">F({idx})</span>
            <span className="font-mono font-bold">{cell.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Knapsack visualization
export const KnapsackVisualization = () => {
  const { table, knapsackWeights, knapsackValues, knapsackCapacity, optimalPath } = useDPStore();
  
  if (!table || table.length === 0) return <EmptyState />;

  const rowLabels = ['0', ...knapsackWeights.map((w, i) => `Item ${i + 1} (w=${w}, v=${knapsackValues[i]})`)];
  const colLabels = Array.from({ length: knapsackCapacity + 1 }, (_, i) => `W=${i}`);
  const highlightCell = optimalPath.length > 0 ? optimalPath[optimalPath.length - 1] : null;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold mb-4">Items</h3>
        <div className="flex flex-wrap gap-3">
          {knapsackWeights.map((weight, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600"
            >
              <div className="text-sm font-medium">Item {idx + 1}</div>
              <div className="text-xs text-muted-foreground">
                Weight: {weight} | Value: {knapsackValues[idx]}
              </div>
            </div>
          ))}
        </div>
      </div>
      <DPTable 
        table={table} 
        rowLabels={rowLabels} 
        colLabels={colLabels}
        highlightCell={highlightCell}
      />
    </div>
  );
};

// LCS visualization
export const LCSVisualization = () => {
  const { table, lcsString1, lcsString2, optimalPath } = useDPStore();
  
  if (!table || table.length === 0) return <EmptyState />;

  const rowLabels = ['ε', ...lcsString1.split('')];
  const colLabels = ['ε', ...lcsString2.split('')];
  const highlightCell = optimalPath.length > 0 ? optimalPath[optimalPath.length - 1] : null;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 flex gap-8">
        <div>
          <h4 className="text-sm font-medium mb-2">String 1</h4>
          <div className="flex gap-1">
            {lcsString1.split('').map((char, idx) => (
              <span key={idx} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded font-mono">
                {char}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">String 2</h4>
          <div className="flex gap-1">
            {lcsString2.split('').map((char, idx) => (
              <span key={idx} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded font-mono">
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
      <DPTable 
        table={table} 
        rowLabels={rowLabels} 
        colLabels={colLabels}
        highlightCell={highlightCell}
      />
    </div>
  );
};

// Edit Distance visualization  
export const EditDistanceVisualization = () => {
  const { table, editStr1, editStr2, optimalPath } = useDPStore();
  
  if (!table || table.length === 0) return <EmptyState />;

  const rowLabels = ['ε', ...editStr1.split('')];
  const colLabels = ['ε', ...editStr2.split('')];
  const highlightCell = optimalPath.length > 0 ? optimalPath[optimalPath.length - 1] : null;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 flex gap-8">
        <div>
          <h4 className="text-sm font-medium mb-2">Source</h4>
          <div className="flex gap-1">
            {editStr1.split('').map((char, idx) => (
              <span key={idx} className="w-8 h-8 flex items-center justify-center bg-blue-500/30 rounded font-mono border border-blue-500">
                {char}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Target</h4>
          <div className="flex gap-1">
            {editStr2.split('').map((char, idx) => (
              <span key={idx} className="w-8 h-8 flex items-center justify-center bg-green-500/30 rounded font-mono border border-green-500">
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
      <DPTable 
        table={table} 
        rowLabels={rowLabels} 
        colLabels={colLabels}
        highlightCell={highlightCell}
      />
    </div>
  );
};

// Coin Change visualization
export const CoinChangeVisualization = () => {
  const { table, coinDenominations, coinAmount, optimalPath } = useDPStore();
  
  if (!table || table.length === 0) return <EmptyState />;

  const colLabels = Array.from({ length: coinAmount + 1 }, (_, i) => `${i}`);
  const highlightCell = optimalPath.length > 0 ? optimalPath[optimalPath.length - 1] : null;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold mb-4">Available Coins</h3>
        <div className="flex flex-wrap gap-3">
          {coinDenominations.map((coin, idx) => (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/30 border-2 border-yellow-500 font-mono font-bold"
            >
              {coin}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Target Amount: {coinAmount}</p>
      </div>
      <DPTable 
        table={table} 
        colLabels={colLabels}
        highlightCell={highlightCell}
      />
    </div>
  );
};

// Generic DP Table for other problems
export const GenericDPVisualization = () => {
  const { table, optimalPath } = useDPStore();
  
  if (!table || table.length === 0) return <EmptyState />;

  const highlightCell = optimalPath.length > 0 ? optimalPath[optimalPath.length - 1] : null;

  return <DPTable table={table} highlightCell={highlightCell} />;
};

// Main DPVisualizer component that selects the appropriate visualization
export const DPVisualizer = () => {
  const { problem, table } = useDPStore();

  // Show empty state when there's no table data
  if (!table || table.length === 0) {
    return <EmptyState />;
  }

  switch (problem) {
    case 'fibonacci':
      return <FibonacciVisualization />;
    case 'knapsack':
      return <KnapsackVisualization />;
    case 'lcs':
      return <LCSVisualization />;
    case 'edit-distance':
      return <EditDistanceVisualization />;
    case 'coin-change':
      return <CoinChangeVisualization />;
    default:
      return <GenericDPVisualization />;
  }
};