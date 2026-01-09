package com.algoviz.algorithms.dp;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.dp.DPResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class FibonacciService {
    
    public DPResult fibonacciMemoized(int n) {
        List<AlgorithmStep> steps = new ArrayList<>();
        Map<Integer, Long> memo = new HashMap<>();
        int stepNumber = 0;
        long startTime = System.currentTimeMillis();
        
        steps.add(createStep(stepNumber++, memo, n, -1, 
                "INITIAL", String.format("Computing Fibonacci(%d) using memoization", n)));
        
        long result = fibMemo(n, memo, steps, stepNumber);
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return DPResult.builder()
                .result(result)
                .steps(steps)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n)")
                        .spaceComplexity("O(n)")
                        .actualOperations((long) steps.size())
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Fibonacci (Memoized)")
                .build();
    }
    
    private long fibMemo(int n, Map<Integer, Long> memo, List<AlgorithmStep> steps, int stepNumber) {
        if (n <= 1) {
            steps.add(createStep(stepNumber++, memo, n, n, 
                    "BASE_CASE", String.format("Base case: fib(%d) = %d", n, n)));
            return n;
        }
        
        if (memo.containsKey(n)) {
            steps.add(createStep(stepNumber++, memo, n, memo.get(n), 
                    "CACHE_HIT", String.format("Found in cache: fib(%d) = %d", n, memo.get(n))));
            return memo.get(n);
        }
        
        steps.add(createStep(stepNumber++, memo, n, -1, 
                "COMPUTE", String.format("Computing fib(%d) = fib(%d) + fib(%d)", n, n - 1, n - 2)));
        
        long result = fibMemo(n - 1, memo, steps, stepNumber) + fibMemo(n - 2, memo, steps, stepNumber);
        memo.put(n, result);
        
        steps.add(createStep(stepNumber++, memo, n, result, 
                "MEMOIZE", String.format("Stored in cache: fib(%d) = %d", n, result)));
        
        return result;
    }
    
    public DPResult fibonacciTabulated(int n) {
        List<AlgorithmStep> steps = new ArrayList<>();
        int stepNumber = 0;
        long startTime = System.currentTimeMillis();
        
        if (n <= 1) {
            return DPResult.builder()
                    .result((long) n)
                    .steps(steps)
                    .metrics(ComplexityMetrics.builder()
                            .timeComplexity("O(1)")
                            .spaceComplexity("O(1)")
                            .actualOperations(1L)
                            .executionTimeMs(0L)
                            .build())
                    .codeSnippet(getCodeSnippet())
                    .algorithmName("Fibonacci (Tabulated)")
                    .build();
        }
        
        long[] dp = new long[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        
        steps.add(createStep(stepNumber++, dp, 0, 0, 
                "INITIAL", "Initialize dp[0] = 0, dp[1] = 1"));
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
            
            steps.add(createStep(stepNumber++, dp, i, dp[i], 
                    "COMPUTE", String.format("dp[%d] = dp[%d] + dp[%d] = %d + %d = %d", 
                            i, i - 1, i - 2, dp[i - 1], dp[i - 2], dp[i])));
        }
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return DPResult.builder()
                .result(dp[n])
                .steps(steps)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n)")
                        .spaceComplexity("O(n)")
                        .actualOperations((long) n)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Fibonacci (Tabulated)")
                .build();
    }
    
    private AlgorithmStep createStep(int stepNumber, Object state, int n, long value, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        highlights.put("n", n);
        if (value >= 0) highlights.put("value", value);
        
        if (state instanceof Map) {
            highlights.put("memo", new HashMap<>((Map<?, ?>) state));
        } else if (state instanceof long[]) {
            highlights.put("dp", Arrays.stream((long[]) state).boxed().toList());
        }
        
        return AlgorithmStep.builder()
                .stepNumber(stepNumber)
                .description(description)
                .currentState(highlights)
                .highlights(highlights)
                .timestamp(System.currentTimeMillis())
                .operationType(operationType)
                .build();
    }
    
    private String getCodeSnippet() {
        return """
                // Memoized approach
                public long fibMemoized(int n, Map<Integer, Long> memo) {
                    if (n <= 1) return n;
                    if (memo.containsKey(n)) return memo.get(n);
                    
                    long result = fibMemoized(n-1, memo) + fibMemoized(n-2, memo);
                    memo.put(n, result);
                    return result;
                }
                
                // Tabulated approach
                public long fibTabulated(int n) {
                    if (n <= 1) return n;
                    long[] dp = new long[n + 1];
                    dp[0] = 0;
                    dp[1] = 1;
                    
                    for (int i = 2; i <= n; i++) {
                        dp[i] = dp[i-1] + dp[i-2];
                    }
                    return dp[n];
                }
                """;
    }
}
