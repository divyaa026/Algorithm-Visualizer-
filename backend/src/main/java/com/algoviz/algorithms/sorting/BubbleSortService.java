package com.algoviz.algorithms.sorting;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.sorting.SortingResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class BubbleSortService {
    
    public SortingResult sort(List<Integer> inputArray) {
        int[] array = inputArray.stream().mapToInt(Integer::intValue).toArray();
        List<AlgorithmStep> steps = new ArrayList<>();
        int stepNumber = 0;
        long comparisons = 0;
        long swaps = 0;
        long startTime = System.currentTimeMillis();
        
        int n = array.length;
        
        steps.add(createStep(stepNumber++, array, -1, -1, "INITIAL", "Starting BubbleSort"));
        
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                comparisons++;
                steps.add(createStep(stepNumber++, array, j, j + 1, "COMPARING", 
                        String.format("Comparing arr[%d]=%d with arr[%d]=%d", j, array[j], j + 1, array[j + 1])));
                
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    swaps++;
                    swapped = true;
                    
                    steps.add(createStep(stepNumber++, array, j, j + 1, "SWAPPED", 
                            String.format("Swapped arr[%d]=%d with arr[%d]=%d", j, array[j + 1], j + 1, array[j])));
                }
            }
            
            steps.add(createStep(stepNumber++, array, n - i - 1, -1, "PASS_COMPLETE", 
                    String.format("Pass %d complete. Element %d is in final position", i + 1, array[n - i - 1])));
            
            if (!swapped) {
                break;
            }
        }
        
        steps.add(createStep(stepNumber++, array, -1, -1, "COMPLETE", "Array is sorted"));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return SortingResult.builder()
                .sortedArray(Arrays.stream(array).boxed().toList())
                .steps(steps)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n²)")
                        .spaceComplexity("O(1)")
                        .actualOperations(comparisons + swaps)
                        .comparisons(comparisons)
                        .swaps(swaps)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("BubbleSort")
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
                public void bubbleSort(int[] arr) {
                    int n = arr.length;
                    for (int i = 0; i < n - 1; i++) {
                        boolean swapped = false;
                        for (int j = 0; j < n - i - 1; j++) {
                            if (arr[j] > arr[j + 1]) {
                                int temp = arr[j];
                                arr[j] = arr[j + 1];
                                arr[j + 1] = temp;
                                swapped = true;
                            }
                        }
                        if (!swapped) break;
                    }
                }
                """;
    }
}
