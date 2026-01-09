import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAlgorithmStore, AlgorithmType } from '@/store/algorithmStore';
import { cn } from '@/lib/utils';

const codeSnippets: Record<AlgorithmType, string> = {
  bubble: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  selection: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
  insertion: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  merge: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    result.push(left[0] <= right[0] 
      ? left.shift() 
      : right.shift());
  }
  return [...result, ...left, ...right];
}`,
  quick: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  heap: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
};

export const CodePanel = ({ 
  code: propCode, 
  language = 'javascript', 
  title: propTitle,
  highlightLine: propHighlightLine,
}: { 
  code?: string; 
  language?: string;
  title?: string;
  highlightLine?: number;
} = {}) => {
  const { algorithm, currentLine } = useAlgorithmStore();
  const [copied, setCopied] = useState(false);

  const code = propCode || codeSnippets[algorithm];
  const title = propTitle || `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort`;
  const activeLineNumber = propHighlightLine ?? currentLine;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">{title}</span>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <pre className="p-0 text-xs">
          <code className="font-mono leading-relaxed block">
            {lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  'flex px-4 py-0.5 transition-all duration-200',
                  activeLineNumber === index + 1 && 'bg-primary/20 border-l-2 border-primary'
                )}
              >
                <span className="w-8 text-muted-foreground/50 select-none text-right pr-4 flex-shrink-0">
                  {index + 1}
                </span>
                <span className={cn(
                  'whitespace-pre',
                  activeLineNumber === index + 1 ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {line || ' '}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
