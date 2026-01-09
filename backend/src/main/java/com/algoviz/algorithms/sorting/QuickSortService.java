package com.algoviz.algorithms.sorting;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.sorting.SortingResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class QuickSortService {
    
    private List<AlgorithmStep> steps;
    private int stepNumber;
    private long comparisons;
    private long swaps;
    private long startTime;
    
    public SortingResult sort(List<Integer> inputArray) {
        int[] array = inputArray.stream().mapToInt(Integer::intValue).toArray();
        steps = new ArrayList<>();
        stepNumber = 0;
        comparisons = 0;
        swaps = 0;
        startTime = System.currentTimeMillis();
        
        addStep(array, -1, -1, "INITIAL", "Starting QuickSort");
        quickSort(array, 0, array.length - 1);
        addStep(array, -1, -1, "COMPLETE", "Array is sorted");
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return SortingResult.builder()
                .sortedArray(Arrays.stream(array).boxed().toList())
                .steps(steps)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n log n) average, O(n²) worst")
                        .spaceComplexity("O(log n)")
                        .actualOperations(comparisons + swaps)
                        .comparisons(comparisons)
                        .swaps(swaps)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("QuickSort")
                .build();
    }
    
    private void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        addStep(arr, high, -1, "PIVOT_SELECTED", 
                String.format("Selected pivot: %d at index %d", pivot, high));
        
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            comparisons++;
            addStep(arr, j, high, "COMPARING", 
                    String.format("Comparing arr[%d]=%d with pivot=%d", j, arr[j], pivot));
            
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
                swaps++;
                addStep(arr, i, j, "SWAPPED", 
                        String.format("Swapped arr[%d]=%d with arr[%d]=%d", i, arr[i], j, arr[j]));
            }
        }
        
        swap(arr, i + 1, high);
        swaps++;
        addStep(arr, i + 1, high, "PARTITION_COMPLETE", 
                String.format("Pivot placed at correct position: %d", i + 1));
        
        return i + 1;
    }
    
    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    private void addStep(int[] array, int index1, int index2, String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        if (index1 >= 0) highlights.put("index1", index1);
        if (index2 >= 0) highlights.put("index2", index2);
        
        steps.add(AlgorithmStep.builder()
                .stepNumber(stepNumber++)
                .description(description)
                .currentState(Arrays.stream(array).boxed().toList())
                .highlights(highlights)
                .timestamp(System.currentTimeMillis())
                .operationType(operationType)
                .build());
    }
    
    private String getCodeSnippet() {
        return """
                public void quickSort(int[] arr, int low, int high) {
                    if (low < high) {
                        int pi = partition(arr, low, high);
                        quickSort(arr, low, pi - 1);
                        quickSort(arr, pi + 1, high);
                    }
                }
                
                private int partition(int[] arr, int low, int high) {
                    int pivot = arr[high];
                    int i = low - 1;
                    for (int j = low; j < high; j++) {
                        if (arr[j] < pivot) {
                            i++;
                            swap(arr, i, j);
                        }
                    }
                    swap(arr, i + 1, high);
                    return i + 1;
                }
                """;
    }
}
