package com.algoviz.algorithms;

import com.algoviz.model.AlgorithmStep;

import java.util.List;

public interface Algorithm<T, R> {
    R execute(T input);
    List<AlgorithmStep> getSteps();
    String getComplexityAnalysis();
    String getCodeSnippet();
}
