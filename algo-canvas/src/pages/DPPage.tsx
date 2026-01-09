import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DPVisualizer } from '@/components/visualization/DPVisualizer';
import { DPControls } from '@/components/controls/DPControls';
import { CodePanel } from '@/components/panels/CodePanel';
import { useDPStore } from '@/store/dpStore';
import { useDPAlgorithm } from '@/hooks/useDPAlgorithm';
import { motion } from 'framer-motion';

const algorithmCode: Record<string, string> = {
  fibonacci: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// Bottom-up approach
function fibonacciDP(n) {
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`,
  knapsack: `function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Don't include item i
      dp[i][w] = dp[i - 1][w];
      
      // Include item i if possible
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }
    }
  }
  
  return dp[n][capacity];
}`,
  lcs: `function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
  lis: `function lis(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}`,
  'edit-distance': `function editDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // delete
          dp[i][j - 1],     // insert
          dp[i - 1][j - 1]  // replace
        );
      }
    }
  }
  
  return dp[m][n];
}`,
  'coin-change': `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  'matrix-chain': `function matrixChainOrder(dims) {
  const n = dims.length - 1;
  const dp = Array(n).fill(null)
    .map(() => Array(n).fill(0));
  
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + 
                     dims[i] * dims[k + 1] * dims[j + 1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  
  return dp[0][n - 1];
}`,
  'subset-sum': `function subsetSum(arr, target) {
  const n = arr.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(target + 1).fill(false));
  
  // Base case: empty sum is always achievable
  for (let i = 0; i <= n; i++) dp[i][0] = true;
  
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      // Don't include arr[i-1]
      dp[i][j] = dp[i - 1][j];
      
      // Include arr[i-1] if possible
      if (arr[i - 1] <= j) {
        dp[i][j] = dp[i][j] || dp[i - 1][j - arr[i - 1]];
      }
    }
  }
  
  return dp[n][target];
}`,
};

export const DPPage = () => {
  const { problem, isRunning, table, currentStep, steps, result, currentLine } = useDPStore();
  const { startAlgorithm, stopAlgorithm } = useDPAlgorithm();

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Dynamic Programming
          </h1>
          <p className="text-muted-foreground">
            Master DP with step-by-step table filling visualization
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Controls */}
          <div className="space-y-4">
            <DPControls />
            
            {/* Progress Panel */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-3">Progress</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{currentStep}</div>
                  <div className="text-muted-foreground text-xs">Step</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{steps.length}</div>
                  <div className="text-muted-foreground text-xs">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {steps.length > 0 ? Math.round((currentStep / steps.length) * 100) : 0}%
                  </div>
                  <div className="text-muted-foreground text-xs">Done</div>
                </div>
              </div>
              
              {result !== null && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Result:</span>{' '}
                    <span className="font-mono text-green-400 font-bold text-lg">
                      {result}
                    </span>
                  </p>
                </div>
              )}
              
              {steps.length > 0 && currentStep > 0 && currentStep <= steps.length && (
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Current Step:</p>
                  <p className="text-sm font-mono">
                    {steps[currentStep - 1]?.explanation}
                  </p>
                  {steps[currentStep - 1]?.formula && (
                    <p className="text-xs text-cyan-400 font-mono mt-1">
                      {steps[currentStep - 1]?.formula}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <DPVisualizer />
            <CodePanel 
              code={algorithmCode[problem] || '// Select a problem'} 
              language="javascript"
              title={`${problem.replace(/-/g, ' ').toUpperCase()} Implementation`}
              highlightLine={currentLine}
            />
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default DPPage;
