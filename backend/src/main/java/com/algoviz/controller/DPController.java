package com.algoviz.controller;

import com.algoviz.algorithms.dp.*;
import com.algoviz.model.dp.DPResult;
import com.algoviz.model.dp.KnapsackRequest;
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
@RequestMapping("/api/v1/algorithms/dp")
@RequiredArgsConstructor
@Validated
@Tag(name = "Dynamic Programming", description = "APIs for dynamic programming algorithm visualization")
@CrossOrigin(origins = "*")
public class DPController {
    
    private final KnapsackService knapsackService;
    private final LCSService lcsService;
    private final FibonacciService fibonacciService;
    
    @PostMapping("/knapsack")
    @Operation(summary = "Solve 0/1 Knapsack", 
               description = "Solves the 0/1 Knapsack problem using dynamic programming")
    public ResponseEntity<DPResult> knapsack(@Valid @RequestBody KnapsackRequest request) {
        log.info("Knapsack request received for capacity: {}", request.getCapacity());
        DPResult result = knapsackService.solveZeroOne(
            request.getWeights(), 
            request.getValues(), 
            request.getCapacity()
        );
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/lcs")
    @Operation(summary = "Find Longest Common Subsequence", 
               description = "Finds the longest common subsequence between two strings")
    public ResponseEntity<DPResult> lcs(@RequestParam String text1, @RequestParam String text2) {
        log.info("LCS request received for texts: '{}' and '{}'", text1, text2);
        DPResult result = lcsService.findLCS(text1, text2);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/fibonacci/memoized")
    @Operation(summary = "Calculate Fibonacci (Memoized)", 
               description = "Calculates Fibonacci number using memoization")
    public ResponseEntity<DPResult> fibonacciMemoized(@RequestParam int n) {
        log.info("Fibonacci (memoized) request received for n: {}", n);
        DPResult result = fibonacciService.fibonacciMemoized(n);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/fibonacci/tabulated")
    @Operation(summary = "Calculate Fibonacci (Tabulated)", 
               description = "Calculates Fibonacci number using tabulation")
    public ResponseEntity<DPResult> fibonacciTabulated(@RequestParam int n) {
        log.info("Fibonacci (tabulated) request received for n: {}", n);
        DPResult result = fibonacciService.fibonacciTabulated(n);
        return ResponseEntity.ok(result);
    }
}
