package com.algoviz.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlgorithmStep {
    private int stepNumber;
    private String description;
    private Object currentState;
    private Map<String, Object> highlights;
    private long timestamp;
    private ComplexityMetrics metrics;
    private String operationType;
}
