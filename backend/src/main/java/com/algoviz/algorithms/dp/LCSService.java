package com.algoviz.algorithms.dp;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.dp.DPResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class LCSService {
    
    public DPResult findLCS(String text1, String text2) {
        List<AlgorithmStep> steps = new ArrayList<>();
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        int stepNumber = 0;
        long operations = 0;
        long startTime = System.currentTimeMillis();
        
        steps.add(createStep(stepNumber++, dp, -1, -1, "", 
                "INITIAL", "Starting LCS algorithm"));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                operations++;
                
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    
                    steps.add(createStep(stepNumber++, dp, i, j, "", 
                            "MATCH", String.format("Characters match: '%c' == '%c', dp[%d][%d] = %d", 
                                    text1.charAt(i - 1), text2.charAt(j - 1), i, j, dp[i][j])));
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    
                    steps.add(createStep(stepNumber++, dp, i, j, "", 
                            "NO_MATCH", String.format("Characters differ: '%c' != '%c', dp[%d][%d] = max(%d, %d) = %d", 
                                    text1.charAt(i - 1), text2.charAt(j - 1), i, j, 
                                    dp[i - 1][j], dp[i][j - 1], dp[i][j])));
                }
            }
        }
        
        String lcs = backtrackLCS(dp, text1, text2);
        int lcsLength = dp[m][n];
        
        steps.add(createStep(stepNumber++, dp, m, n, lcs, 
                "COMPLETE", String.format("LCS length: %d, LCS: \"%s\"", lcsLength, lcs)));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        Map<String, Object> result = new HashMap<>();
        result.put("length", lcsLength);
        result.put("lcs", lcs);
        
        return DPResult.builder()
                .result(result)
                .steps(steps)
                .dpTable(dp)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(m * n)")
                        .spaceComplexity("O(m * n)")
                        .actualOperations(operations)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Longest Common Subsequence")
                .build();
    }
    
    private String backtrackLCS(int[][] dp, String text1, String text2) {
        StringBuilder lcs = new StringBuilder();
        int i = text1.length();
        int j = text2.length();
        
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                lcs.insert(0, text1.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs.toString();
    }
    
    private AlgorithmStep createStep(int stepNumber, int[][] dp, int i, int j, String lcs, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        if (i >= 0) highlights.put("row", i);
        if (j >= 0) highlights.put("col", j);
        if (!lcs.isEmpty()) highlights.put("lcs", lcs);
        
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
                public int longestCommonSubsequence(String text1, String text2) {
                    int m = text1.length();
                    int n = text2.length();
                    int[][] dp = new int[m + 1][n + 1];
                    
                    for (int i = 1; i <= m; i++) {
                        for (int j = 1; j <= n; j++) {
                            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                                dp[i][j] = dp[i-1][j-1] + 1;
                            } else {
                                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                            }
                        }
                    }
                    return dp[m][n];
                }
                """;
    }
}
