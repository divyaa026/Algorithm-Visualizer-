package com.algoviz.model.dp;

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
public class DPResult {
    private Object result;
    private List<AlgorithmStep> steps;
    private int[][] dpTable;
    private ComplexityMetrics metrics;
    private String codeSnippet;
    private String algorithmName;
}
