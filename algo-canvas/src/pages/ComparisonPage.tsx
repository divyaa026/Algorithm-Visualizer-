import { motion } from 'framer-motion';
import { ChevronRight, Play, Pause, RotateCcw, Trophy, Timer, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useComparisonStore, AlgorithmType } from '@/store/comparisonStore';
import { useComparisonAlgorithm } from '@/hooks/useComparisonAlgorithm';
import { cn } from '@/lib/utils';

const algorithms: { value: AlgorithmType; label: string }[] = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
];

const ComparisonVisualizer = ({ side }: { side: 'left' | 'right' }) => {
  const { leftArray, rightArray, leftComplete, rightComplete, winner } = useComparisonStore();
  const array = side === 'left' ? leftArray : rightArray;
  const isComplete = side === 'left' ? leftComplete : rightComplete;
  const isWinner = winner === side;
  const isTie = winner === 'tie';
  
  const maxValue = Math.max(...array.map(el => el.value));

  return (
    <div className={cn(
      "glass-card rounded-xl p-4 relative overflow-hidden transition-all duration-500",
      isWinner && "ring-2 ring-green-500 shadow-lg shadow-green-500/20",
      isTie && isComplete && "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/20"
    )}>
      {isWinner && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-green-500 text-sm font-bold animate-pulse">
          <Trophy className="w-4 h-4" />
          Winner!
        </div>
      )}
      {isTie && isComplete && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-yellow-500 text-sm font-bold">
          Tie!
        </div>
      )}
      <div className="h-48 flex items-end justify-center gap-0.5">
        {array.map((element, index) => (
          <motion.div
            key={index}
            className={cn(
              'rounded-t-sm transition-colors duration-150',
              element.state === 'unsorted' && 'bg-muted-foreground/60',
              element.state === 'comparing' && 'bg-yellow-500',
              element.state === 'swapping' && 'bg-red-500',
              element.state === 'sorted' && 'bg-green-500'
            )}
            style={{
              height: `${(element.value / maxValue) * 100}%`,
              width: `${Math.max(100 / array.length - 1, 2)}%`,
            }}
            initial={{ height: 0 }}
            animate={{ height: `${(element.value / maxValue) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

const AlgorithmStats = ({ side }: { side: 'left' | 'right' }) => {
  const { 
    leftAlgorithm, rightAlgorithm,
    leftComparisons, rightComparisons,
    leftSwaps, rightSwaps,
    leftTime, rightTime,
    leftComplete, rightComplete
  } = useComparisonStore();
  
  const algorithm = side === 'left' ? leftAlgorithm : rightAlgorithm;
  const comparisons = side === 'left' ? leftComparisons : rightComparisons;
  const swaps = side === 'left' ? leftSwaps : rightSwaps;
  const time = side === 'left' ? leftTime : rightTime;
  const complete = side === 'left' ? leftComplete : rightComplete;
  
  const algoName = algorithms.find(a => a.value === algorithm)?.label || algorithm;

  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <h4 className="font-semibold text-center gradient-text">{algoName}</h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">{comparisons}</div>
          <div className="text-xs text-muted-foreground">Comparisons</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-500">{swaps}</div>
          <div className="text-xs text-muted-foreground">Swaps</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">
            {complete ? `${(time / 1000).toFixed(2)}s` : '--'}
          </div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
      </div>
    </div>
  );
};

const ComparisonPage = () => {
  const {
    isRunning,
    isPaused,
    speed,
    arraySize,
    leftAlgorithm,
    rightAlgorithm,
    setLeftAlgorithm,
    setRightAlgorithm,
    setSpeed,
    setArraySize,
    generateArray,
    setIsPaused,
    reset,
  } = useComparisonStore();

  const { startComparison, stopComparison } = useComparisonAlgorithm();

  const handlePlayPause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    } else {
      startComparison();
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/sorting" className="hover:text-foreground transition-colors">
            Sorting
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Algorithm Comparison</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-primary" />
            Algorithm Race
          </h1>
          <p className="text-muted-foreground">
            Watch two sorting algorithms race side-by-side on the same data
          </p>
        </div>

        {/* Algorithm Selectors */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium text-center block">Left Algorithm</label>
            <div className="grid grid-cols-3 gap-2">
              {algorithms.map((algo) => (
                <button
                  key={algo.value}
                  onClick={() => setLeftAlgorithm(algo.value)}
                  disabled={isRunning}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    leftAlgorithm === algo.value
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
                    'disabled:opacity-50'
                  )}
                >
                  {algo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium text-center block">Right Algorithm</label>
            <div className="grid grid-cols-3 gap-2">
              {algorithms.map((algo) => (
                <button
                  key={algo.value}
                  onClick={() => setRightAlgorithm(algo.value)}
                  disabled={isRunning}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    rightAlgorithm === algo.value
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
                    'disabled:opacity-50'
                  )}
                >
                  {algo.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizers */}
        <div className="grid md:grid-cols-2 gap-6">
          <ComparisonVisualizer side="left" />
          <ComparisonVisualizer side="right" />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <AlgorithmStats side="left" />
          <AlgorithmStats side="right" />
        </div>

        {/* Controls */}
        <div className="glass-card rounded-xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                max={500}
                step={5}
                disabled={isRunning && !isPaused}
                className="w-full"
              />
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
                min={10}
                max={100}
                step={5}
                disabled={isRunning}
                className="w-full"
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handlePlayPause}
              className="px-8 bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isRunning && !isPaused ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {isRunning ? 'Resume' : 'Start Race'}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={generateArray}
              disabled={isRunning && !isPaused}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Array
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={reset}
              disabled={isRunning && !isPaused}
            >
              Reset
            </Button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ComparisonPage;
