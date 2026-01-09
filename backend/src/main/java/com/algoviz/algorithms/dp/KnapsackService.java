package com.algoviz.algorithms.dp;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.dp.DPResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class KnapsackService {
    
    public DPResult solveZeroOne(List<Integer> weights, List<Integer> values, int capacity) {
        List<AlgorithmStep> steps = new ArrayList<>();
        int n = weights.size();
        int[][] dp = new int[n + 1][capacity + 1];
        int stepNumber = 0;
        long operations = 0;
        long startTime = System.currentTimeMillis();
        
        steps.add(createStep(stepNumber++, dp, -1, -1, -1, 
                "INITIAL", "Starting 0/1 Knapsack algorithm"));
        
        // Build table dp[][] in bottom-up manner
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                operations++;
                
                if (i == 0 || w == 0) {
                    dp[i][w] = 0;
                } else if (weights.get(i - 1) <= w) {
                    int include = values.get(i - 1) + dp[i - 1][w - weights.get(i - 1)];
                    int exclude = dp[i - 1][w];
                    dp[i][w] = Math.max(include, exclude);
                    
                    steps.add(createStep(stepNumber++, dp, i, w, dp[i][w], 
                            "DECISION", String.format("Item %d (w=%d, v=%d): Include(%d) vs Exclude(%d) = %d", 
                                    i - 1, weights.get(i - 1), values.get(i - 1), include, exclude, dp[i][w])));
                } else {
                    dp[i][w] = dp[i - 1][w];
                    
                    steps.add(createStep(stepNumber++, dp, i, w, dp[i][w], 
                            "SKIP", String.format("Item %d (w=%d) too heavy for capacity %d", 
                                    i - 1, weights.get(i - 1), w)));
                }
            }
        }
        
        int maxValue = dp[n][capacity];
        List<Integer> selectedItems = backtrack(dp, weights, values, capacity);
        
        steps.add(createStep(stepNumber++, dp, n, capacity, maxValue, 
                "COMPLETE", String.format("Maximum value: %d, Selected items: %s", 
                        maxValue, selectedItems)));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", maxValue);
        result.put("selectedItems", selectedItems);
        
        return DPResult.builder()
                .result(result)
                .steps(steps)
                .dpTable(dp)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n * W)")
                        .spaceComplexity("O(n * W)")
                        .actualOperations(operations)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("0/1 Knapsack")
                .build();
    }
    
    private List<Integer> backtrack(int[][] dp, List<Integer> weights, List<Integer> values, int capacity) {
        List<Integer> selected = new ArrayList<>();
        int n = weights.size();
        int w = capacity;
        
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i - 1][w]) {
                selected.add(i - 1);
                w -= weights.get(i - 1);
            }
        }
        
        Collections.reverse(selected);
        return selected;
    }
    
    private AlgorithmStep createStep(int stepNumber, int[][] dp, int i, int w, int value, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        if (i >= 0) highlights.put("row", i);
        if (w >= 0) highlights.put("col", w);
        if (value >= 0) highlights.put("value", value);
        
        // Create a copy of relevant portion of dp table for visualization
        int[][] dpCopy = new int[Math.min(dp.length, 10)][Math.min(dp[0].length, 10)];
        for (int r = 0; r < dpCopy.length; r++) {
            System.arraycopy(dp[r], 0, dpCopy[r], 0, dpCopy[0].length);
        }
        highlights.put("dpTable", dpCopy);
        
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
                public int knapsack(int[] weights, int[] values, int capacity) {
                    int n = weights.length;
                    int[][] dp = new int[n + 1][capacity + 1];
                    
                    for (int i = 1; i <= n; i++) {
                        for (int w = 1; w <= capacity; w++) {
                            if (weights[i-1] <= w) {
                                dp[i][w] = Math.max(
                                    values[i-1] + dp[i-1][w - weights[i-1]],
                                    dp[i-1][w]
                                );
                            } else {
                                dp[i][w] = dp[i-1][w];
                            }
                        }
                    }
                    return dp[n][capacity];
                }
                """;
    }
}
