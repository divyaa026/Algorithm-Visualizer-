package com.algoviz.model.graph;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphResult {
    private List<AlgorithmStep> steps;
    private List<Integer> traversalOrder;
    private Map<Integer, Integer> distances;
    private Map<Integer, Integer> predecessors;
    private List<Edge> resultEdges;
    private ComplexityMetrics metrics;
    private String codeSnippet;
    private String algorithmName;
}
