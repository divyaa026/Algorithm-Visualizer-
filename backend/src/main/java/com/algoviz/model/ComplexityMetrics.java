package com.algoviz.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplexityMetrics {
    private String timeComplexity;
    private String spaceComplexity;
    private long actualOperations;
    private long comparisons;
    private long swaps;
    private long memoryUsedBytes;
    private long executionTimeMs;
}
