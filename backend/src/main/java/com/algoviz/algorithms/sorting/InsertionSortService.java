package com.algoviz.algorithms.sorting;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.sorting.SortingResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class InsertionSortService {
    
    public SortingResult sort(List<Integer> inputArray) {
        int[] array = inputArray.stream().mapToInt(Integer::intValue).toArray();
        List<AlgorithmStep> steps = new ArrayList<>();
        int stepNumber = 0;
        long comparisons = 0;
        long shifts = 0;
        long startTime = System.currentTimeMillis();
        
        steps.add(createStep(stepNumber++, array, -1, -1, "INITIAL", "Starting InsertionSort"));
        
        for (int i = 1; i < array.length; i++) {
            int key = array[i];
            steps.add(createStep(stepNumber++, array, i, -1, "KEY_SELECTED", 
                    String.format("Selected key=%d at index %d", key, i)));
            
            int j = i - 1;
            
            while (j >= 0 && array[j] > key) {
                comparisons++;
                steps.add(createStep(stepNumber++, array, j, j + 1, "COMPARING", 
                        String.format("Comparing arr[%d]=%d with key=%d", j, array[j], key)));
                
                array[j + 1] = array[j];
                shifts++;
                steps.add(createStep(stepNumber++, array, j + 1, -1, "SHIFTING", 
                        String.format("Shifted arr[%d]=%d to position %d", j, array[j + 1], j + 1)));
                j--;
            }
            
            array[j + 1] = key;
            steps.add(createStep(stepNumber++, array, j + 1, -1, "INSERTED", 
                    String.format("Inserted key=%d at position %d", key, j + 1)));
        }
        
        steps.add(createStep(stepNumber++, array, -1, -1, "COMPLETE", "Array is sorted"));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return SortingResult.builder()
                .sortedArray(Arrays.stream(array).boxed().toList())
                .steps(steps)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n²) worst, O(n) best")
                        .spaceComplexity("O(1)")
                        .actualOperations(comparisons + shifts)
                        .comparisons(comparisons)
                        .swaps(shifts)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("InsertionSort")
                .build();
    }
    
    private AlgorithmStep createStep(int stepNumber, int[] array, int index1, int index2, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        if (index1 >= 0) highlights.put("index1", index1);
        if (index2 >= 0) highlights.put("index2", index2);
        
        return AlgorithmStep.builder()
                .stepNumber(stepNumber)
                .description(description)
                .currentState(Arrays.stream(array).boxed().toList())
                .highlights(highlights)
                .timestamp(System.currentTimeMillis())
                .operationType(operationType)
                .build();
    }
    
    private String getCodeSnippet() {
        return """
                public void insertionSort(int[] arr) {
                    for (int i = 1; i < arr.length; i++) {
                        int key = arr[i];
                        int j = i - 1;
                        
                        while (j >= 0 && arr[j] > key) {
                            arr[j + 1] = arr[j];
                            j--;
                        }
                        arr[j + 1] = key;
                    }
                }
                """;
    }
}
