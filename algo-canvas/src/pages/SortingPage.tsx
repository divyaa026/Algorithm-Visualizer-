import { motion } from 'framer-motion';
import { ChevronRight, StepBack, StepForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArrayVisualizer } from '@/components/visualization/ArrayVisualizer';
import { AlgorithmControls } from '@/components/controls/AlgorithmControls';
import { StatsPanel } from '@/components/panels/StatsPanel';
import { CodePanel } from '@/components/panels/CodePanel';
import { useAlgorithmStore } from '@/store/algorithmStore';
import { Button } from '@/components/ui/button';

const algorithmNames: Record<string, string> = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
};

const SortingPage = () => {
  const { algorithm, stepHistory, currentStepIndex, stepBack, stepForward, canStepBack, canStepForward, isRunning, isPaused } = useAlgorithmStore();

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Sorting Algorithms</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">{algorithmNames[algorithm]}</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Sorting Visualization</h1>
          <p className="text-muted-foreground text-sm">
            Watch sorting algorithms in action with step-by-step visual animations
          </p>
        </div>

        {/* Main Content - Visualization with Step Controls and Code */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Visualization + Step Controls */}
          <div className="space-y-3">
            <ArrayVisualizer />
            {/* Step Controls - Below Visualization */}
            {stepHistory.length > 0 && (
              <div className="glass-card rounded-xl p-3 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stepBack}
                  disabled={!canStepBack() || (isRunning && !isPaused)}
                  className="flex-1"
                >
                  <StepBack className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Step {currentStepIndex + 1} / {stepHistory.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stepForward}
                  disabled={!canStepForward() || (isRunning && !isPaused)}
                  className="flex-1"
                >
                  Forward
                  <StepForward className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
          <CodePanel />
        </div>

        {/* Controls & Stats Below */}
        <div className="grid md:grid-cols-2 gap-4">
          <AlgorithmControls />
          <StatsPanel />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default SortingPage;
