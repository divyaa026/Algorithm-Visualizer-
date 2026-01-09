package com.algoviz.model.sorting;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortingResult {
    private List<Integer> sortedArray;
    private List<AlgorithmStep> steps;
    private ComplexityMetrics metrics;
    private String codeSnippet;
    private String algorithmName;
}
