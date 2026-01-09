package com.algoviz.controller;

import com.algoviz.algorithms.sorting.*;
import com.algoviz.model.sorting.SortingRequest;
import com.algoviz.model.sorting.SortingResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/v1/algorithms/sorting")
@RequiredArgsConstructor
@Validated
@Tag(name = "Sorting Algorithms", description = "APIs for sorting algorithm visualization")
@CrossOrigin(origins = "*")
public class SortingController {
    
    private final QuickSortService quickSortService;
    private final MergeSortService mergeSortService;
    private final BubbleSortService bubbleSortService;
    private final InsertionSortService insertionSortService;
    
    @PostMapping("/quick-sort")
    @Operation(summary = "Execute QuickSort", 
               description = "Performs QuickSort on the input array and returns step-by-step visualization")
    public ResponseEntity<SortingResult> quickSort(@Valid @RequestBody SortingRequest request) {
        log.info("QuickSort request received for array: {}", request.getArray());
        SortingResult result = quickSortService.sort(request.getArray());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/merge-sort")
    @Operation(summary = "Execute MergeSort", 
               description = "Performs MergeSort on the input array and returns step-by-step visualization")
    public ResponseEntity<SortingResult> mergeSort(@Valid @RequestBody SortingRequest request) {
        log.info("MergeSort request received for array: {}", request.getArray());
        SortingResult result = mergeSortService.sort(request.getArray());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/bubble-sort")
    @Operation(summary = "Execute BubbleSort", 
               description = "Performs BubbleSort on the input array and returns step-by-step visualization")
    public ResponseEntity<SortingResult> bubbleSort(@Valid @RequestBody SortingRequest request) {
        log.info("BubbleSort request received for array: {}", request.getArray());
        SortingResult result = bubbleSortService.sort(request.getArray());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/insertion-sort")
    @Operation(summary = "Execute InsertionSort", 
               description = "Performs InsertionSort on the input array and returns step-by-step visualization")
    public ResponseEntity<SortingResult> insertionSort(@Valid @RequestBody SortingRequest request) {
        log.info("InsertionSort request received for array: {}", request.getArray());
        SortingResult result = insertionSortService.sort(request.getArray());
        return ResponseEntity.ok(result);
    }
}
