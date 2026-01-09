import { useDPStore, DPProblem } from '@/store/dpStore';
import { useDPAlgorithm } from '@/hooks/useDPAlgorithm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, StepForward } from 'lucide-react';

const problems: { value: DPProblem; label: string; description: string }[] = [
  { value: 'fibonacci', label: 'Fibonacci Sequence', description: 'Classic memoization example' },
  { value: 'knapsack', label: '0/1 Knapsack', description: 'Maximize value with weight constraint' },
  { value: 'lcs', label: 'Longest Common Subsequence', description: 'Find longest matching subsequence' },
  { value: 'lis', label: 'Longest Increasing Subsequence', description: 'Find longest increasing order' },
  { value: 'edit-distance', label: 'Edit Distance', description: 'Min operations to transform string' },
  { value: 'coin-change', label: 'Coin Change', description: 'Min coins to make amount' },
  { value: 'matrix-chain', label: 'Matrix Chain Multiplication', description: 'Optimal multiplication order' },
  { value: 'subset-sum', label: 'Subset Sum', description: 'Check if subset with sum exists' },
];

export const DPControls = () => {
  const {
    problem,
    setProblem,
    isRunning,
    speed,
    setSpeed,
    fibN,
    setFibN,
    knapsackWeights,
    knapsackValues,
    knapsackCapacity,
    setKnapsackInputs,
    lcsString1,
    lcsString2,
    setLCSInputs,
    lisArray,
    setLISArray,
    editStr1,
    editStr2,
    setEditInputs,
    coinDenominations,
    coinAmount,
    setCoinInputs,
    matrixDimensions,
    setMatrixDimensions,
    subsetArray,
    subsetTarget,
    setSubsetInputs,
    resetVisualization,
    initializeTable,
  } = useDPStore();

  const { startAlgorithm, stopAlgorithm } = useDPAlgorithm();

  const selectedProblem = problems.find((p) => p.value === problem);

  const handlePlay = () => {
    if (isRunning) {
      stopAlgorithm();
    } else {
      initializeTable();
      startAlgorithm();
    }
  };

  const handleReset = () => {
    stopAlgorithm();
    resetVisualization();
  };

  const renderInputs = () => {
    switch (problem) {
      case 'fibonacci':
        return (
          <div className="space-y-2">
            <Label>N (Fibonacci number to compute)</Label>
            <Input
              type="number"
              value={fibN}
              onChange={(e) => setFibN(parseInt(e.target.value) || 10)}
              min={1}
              max={30}
              className="bg-slate-800 border-slate-700"
            />
          </div>
        );
      
      case 'knapsack':
        return (
          <div className="space-y-3">
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={knapsackCapacity}
                onChange={(e) => setKnapsackInputs(knapsackWeights, knapsackValues, parseInt(e.target.value) || 10)}
                min={1}
                max={20}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label>Weights (comma separated)</Label>
              <Input
                type="text"
                value={knapsackWeights.join(', ')}
                onChange={(e) => {
                  const weights = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                  if (weights.length > 0) setKnapsackInputs(weights, knapsackValues, knapsackCapacity);
                }}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label>Values (comma separated)</Label>
              <Input
                type="text"
                value={knapsackValues.join(', ')}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                  if (values.length > 0) setKnapsackInputs(knapsackWeights, values, knapsackCapacity);
                }}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>
        );
      
      case 'lcs':
        return (
          <div className="space-y-3">
            <div>
              <Label>String 1</Label>
              <Input
                type="text"
                value={lcsString1}
                onChange={(e) => setLCSInputs(e.target.value, lcsString2)}
                className="bg-slate-800 border-slate-700 font-mono"
              />
            </div>
            <div>
              <Label>String 2</Label>
              <Input
                type="text"
                value={lcsString2}
                onChange={(e) => setLCSInputs(lcsString1, e.target.value)}
                className="bg-slate-800 border-slate-700 font-mono"
              />
            </div>
          </div>
        );
        
      case 'edit-distance':
        return (
          <div className="space-y-3">
            <div>
              <Label>Source String</Label>
              <Input
                type="text"
                value={editStr1}
                onChange={(e) => setEditInputs(e.target.value, editStr2)}
                className="bg-slate-800 border-slate-700 font-mono"
              />
            </div>
            <div>
              <Label>Target String</Label>
              <Input
                type="text"
                value={editStr2}
                onChange={(e) => setEditInputs(editStr1, e.target.value)}
                className="bg-slate-800 border-slate-700 font-mono"
              />
            </div>
          </div>
        );
      
      case 'lis':
        return (
          <div className="space-y-2">
            <Label>Array (comma separated)</Label>
            <Input
              type="text"
              value={lisArray.join(', ')}
              onChange={(e) => {
                const array = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (array.length > 0) setLISArray(array);
              }}
              className="bg-slate-800 border-slate-700 font-mono"
            />
          </div>
        );
      
      case 'coin-change':
        return (
          <div className="space-y-3">
            <div>
              <Label>Coins (comma separated)</Label>
              <Input
                type="text"
                value={coinDenominations.join(', ')}
                onChange={(e) => {
                  const coins = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                  if (coins.length > 0) setCoinInputs(coins, coinAmount);
                }}
                className="bg-slate-800 border-slate-700 font-mono"
              />
            </div>
            <div>
              <Label>Target Amount</Label>
              <Input
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinInputs(coinDenominations, parseInt(e.target.value) || 11)}
                min={1}
                max={50}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>
        );
      
      case 'subset-sum':
        return (
          <div className="space-y-3">
            <div>
              <Label>Array (comma separated)</Label>
              <Input
                type="text"
                value={subsetArray.join(', ')}
                onChange={(e) => {
                  const array = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                  if (array.length > 0) setSubsetInputs(array, subsetTarget);
                }}
                className="bg-slate-800 border-slate-700 font-mono"
              />
            </div>
            <div>
              <Label>Target Sum</Label>
              <Input
                type="number"
                value={subsetTarget}
                onChange={(e) => setSubsetInputs(subsetArray, parseInt(e.target.value) || 9)}
                min={1}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>
        );
      
      case 'matrix-chain':
        return (
          <div className="space-y-2">
            <Label>Matrix Dimensions (comma separated)</Label>
            <Input
              type="text"
              value={matrixDimensions.join(', ')}
              onChange={(e) => {
                const dimensions = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (dimensions.length > 1) setMatrixDimensions(dimensions);
              }}
              className="bg-slate-800 border-slate-700 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Represents matrices: M1({matrixDimensions[0]}×{matrixDimensions[1]}), M2({matrixDimensions[1]}×{matrixDimensions[2]}), ...
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Problem Type</Label>
        <Select value={problem} onValueChange={(v) => setProblem(v as DPProblem)}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-700">
            <SelectValue placeholder="Select problem" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {problems.map((p) => (
              <SelectItem key={p.value} value={p.value} className="focus:bg-slate-700">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedProblem && (
          <p className="text-xs text-muted-foreground">{selectedProblem.description}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Input Configuration</Label>
        {renderInputs()}
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
          {problem === 'fibonacci' && 'O(n) with memoization'}
          {problem === 'knapsack' && 'O(n × W)'}
          {problem === 'lcs' && 'O(m × n)'}
          {problem === 'lis' && 'O(n²) or O(n log n)'}
          {problem === 'edit-distance' && 'O(m × n)'}
          {problem === 'coin-change' && 'O(n × amount)'}
          {problem === 'matrix-chain' && 'O(n³)'}
          {problem === 'subset-sum' && 'O(n × sum)'}
        </div>
        <h4 className="text-sm font-medium mt-2">Space Complexity</h4>
        <div className="text-xs text-muted-foreground font-mono">
          {problem === 'fibonacci' && 'O(n)'}
          {problem === 'knapsack' && 'O(n × W) or O(W) optimized'}
          {problem === 'lcs' && 'O(m × n)'}
          {problem === 'lis' && 'O(n)'}
          {problem === 'edit-distance' && 'O(m × n)'}
          {problem === 'coin-change' && 'O(amount)'}
          {problem === 'matrix-chain' && 'O(n²)'}
          {problem === 'subset-sum' && 'O(n × sum)'}
        </div>
      </div>
    </div>
  );
};
