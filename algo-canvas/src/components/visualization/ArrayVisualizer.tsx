import { motion } from 'framer-motion';
import { useAlgorithmStore, BarState } from '@/store/algorithmStore';
import { cn } from '@/lib/utils';

const getBarClass = (state: BarState): string => {
  switch (state) {
    case 'comparing':
      return 'bar-comparing';
    case 'swapping':
      return 'bar-swapping';
    case 'sorted':
      return 'bar-sorted';
    default:
      return 'bar-unsorted';
  }
};

export const ArrayVisualizer = () => {
  const { array } = useAlgorithmStore();
  const maxValue = Math.max(...array.map(el => el.value));

  return (
    <div className="glass-card rounded-xl p-6 h-[400px] flex items-end justify-center gap-1">
      {array.map((element, index) => {
        const heightPercent = (element.value / maxValue) * 100;
        return (
          <motion.div
            key={index}
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: `${heightPercent}%`,
              opacity: 1,
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: index * 0.01,
            }}
            className={cn(
              'rounded-t-md transition-colors duration-150',
              getBarClass(element.state)
            )}
            style={{
              width: `${Math.max(100 / array.length - 0.5, 2)}%`,
              minWidth: '4px',
            }}
          />
        );
      })}
    </div>
  );
};
