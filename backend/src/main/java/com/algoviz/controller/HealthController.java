package com.algoviz.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "Health check and system information APIs")
@CrossOrigin(origins = "*")
public class HealthController {
    
    @GetMapping
    @Operation(summary = "Health Check", description = "Check if the API is running")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Algorithm Visualization Platform");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/algorithms")
    @Operation(summary = "List Available Algorithms", 
               description = "Returns a list of all available algorithms")
    public ResponseEntity<Map<String, Object>> listAlgorithms() {
        Map<String, Object> algorithms = new HashMap<>();
        
        algorithms.put("sorting", new String[]{
            "quick-sort", "merge-sort", "bubble-sort", "insertion-sort"
        });
        
        algorithms.put("graph", new String[]{
            "bfs", "dfs", "dijkstra", "kruskal-mst"
        });
        
        algorithms.put("dynamicProgramming", new String[]{
            "knapsack", "lcs", "fibonacci"
        });
        
        return ResponseEntity.ok(algorithms);
    }
}
