import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAlgorithmStore, AlgorithmType } from '@/store/algorithmStore';
import { useSortingAlgorithm } from '@/hooks/useSortingAlgorithm';

const algorithms: { value: AlgorithmType; label: string }[] = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
];

export const AlgorithmControls = () => {
  const {
    isRunning,
    isPaused,
    speed,
    arraySize,
    algorithm,
    setSpeed,
    setArraySize,
    setAlgorithm,
    generateArray,
    setIsPaused,
  } = useAlgorithmStore();

  const { startSorting, stopSorting } = useSortingAlgorithm();

  const handlePlayPause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    } else {
      startSorting();
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-lg">Controls</h3>

      {/* Algorithm Selector */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">Algorithm</label>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => setAlgorithm(algo.value)}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                algorithm === algo.value
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              } disabled:opacity-50`}
            >
              {algo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="text-sm text-muted-foreground">Speed</label>
          <span className="text-sm font-mono text-primary">{speed}ms</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={([value]) => setSpeed(value)}
          min={5}
          max={1000}
          step={5}
          disabled={isRunning && !isPaused}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>

      {/* Array Size */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="text-sm text-muted-foreground">Array Size</label>
          <span className="text-sm font-mono text-primary">{arraySize}</span>
        </div>
        <Slider
          value={[arraySize]}
          onValueChange={([value]) => setArraySize(value)}
          min={5}
          max={100}
          step={5}
          disabled={isRunning}
          className="w-full"
        />
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2">
        <Button
          onClick={handlePlayPause}
          className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
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
          size="icon"
          onClick={generateArray}
          disabled={isRunning && !isPaused}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={stopSorting}
          disabled={!isRunning}
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>


    </div>
  );
};
