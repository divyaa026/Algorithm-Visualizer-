package com.algoviz.algorithms.sorting;

import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.sorting.SortingResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class MergeSortService {
    
    private List<AlgorithmStep> steps;
    private int stepNumber;
    private long comparisons;
    private long merges;
    private long startTime;
    
    public SortingResult sort(List<Integer> inputArray) {
        int[] array = inputArray.stream().mapToInt(Integer::intValue).toArray();
        steps = new ArrayList<>();
        stepNumber = 0;
        comparisons = 0;
        merges = 0;
        startTime = System.currentTimeMillis();
        
        addStep(array, -1, -1, "INITIAL", "Starting MergeSort");
        mergeSort(array, 0, array.length - 1);
        addStep(array, -1, -1, "COMPLETE", "Array is sorted");
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return SortingResult.builder()
                .sortedArray(Arrays.stream(array).boxed().toList())
                .steps(steps)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(n log n)")
                        .spaceComplexity("O(n)")
                        .actualOperations(comparisons + merges)
                        .comparisons(comparisons)
                        .swaps(merges)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("MergeSort")
                .build();
    }
    
    private void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            addStep(arr, left, right, "DIVIDE", 
                    String.format("Dividing array: [%d...%d] at mid=%d", left, right, mid));
            
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
    
    private void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] leftArray = new int[n1];
        int[] rightArray = new int[n2];
        
        System.arraycopy(arr, left, leftArray, 0, n1);
        System.arraycopy(arr, mid + 1, rightArray, 0, n2);
        
        addStep(arr, left, right, "MERGING", 
                String.format("Merging subarrays [%d...%d] and [%d...%d]", 
                        left, mid, mid + 1, right));
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            comparisons++;
            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            merges++;
            addStep(arr, k, -1, "MERGE_STEP", 
                    String.format("Placed %d at position %d", arr[k], k));
            k++;
        }
        
        while (i < n1) {
            arr[k] = leftArray[i];
            i++;
            k++;
            merges++;
        }
        
        while (j < n2) {
            arr[k] = rightArray[j];
            j++;
            k++;
            merges++;
        }
        
        addStep(arr, left, right, "MERGE_COMPLETE", 
                String.format("Merged [%d...%d]", left, right));
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
                public void mergeSort(int[] arr, int left, int right) {
                    if (left < right) {
                        int mid = left + (right - left) / 2;
                        mergeSort(arr, left, mid);
                        mergeSort(arr, mid + 1, right);
                        merge(arr, left, mid, right);
                    }
                }
                
                private void merge(int[] arr, int left, int mid, int right) {
                    int n1 = mid - left + 1;
                    int n2 = right - mid;
                    int[] L = new int[n1];
                    int[] R = new int[n2];
                    
                    System.arraycopy(arr, left, L, 0, n1);
                    System.arraycopy(arr, mid + 1, R, 0, n2);
                    
                    int i = 0, j = 0, k = left;
                    while (i < n1 && j < n2) {
                        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
                    }
                    while (i < n1) arr[k++] = L[i++];
                    while (j < n2) arr[k++] = R[j++];
                }
                """;
    }
}
