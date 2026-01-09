import { motion } from 'framer-motion';
import { BarChart2, Repeat, Clock, Zap } from 'lucide-react';
import { useAlgorithmStore } from '@/store/algorithmStore';

const algorithmComplexity: Record<string, { time: string; space: string }> = {
  bubble: { time: 'O(n²)', space: 'O(1)' },
  selection: { time: 'O(n²)', space: 'O(1)' },
  insertion: { time: 'O(n²)', space: 'O(1)' },
  merge: { time: 'O(n log n)', space: 'O(n)' },
  quick: { time: 'O(n log n)', space: 'O(log n)' },
  heap: { time: 'O(n log n)', space: 'O(1)' },
};

export const StatsPanel = () => {
  const { comparisons, swaps, algorithm, isRunning } = useAlgorithmStore();
  const complexity = algorithmComplexity[algorithm];

  const stats = [
    {
      icon: BarChart2,
      label: 'Comparisons',
      value: comparisons.toLocaleString(),
      color: 'text-primary',
    },
    {
      icon: Repeat,
      label: 'Swaps',
      value: swaps.toLocaleString(),
      color: 'text-secondary',
    },
    {
      icon: Clock,
      label: 'Time Complexity',
      value: complexity?.time || 'N/A',
      color: 'text-warning',
    },
    {
      icon: Zap,
      label: 'Space Complexity',
      value: complexity?.space || 'N/A',
      color: 'text-success',
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Statistics</h3>
        {isRunning && (
          <span className="flex items-center gap-2 text-sm text-success">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Running
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-muted/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <motion.span
              key={stat.value}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-xl font-mono font-bold ${stat.color}`}
            >
              {stat.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
