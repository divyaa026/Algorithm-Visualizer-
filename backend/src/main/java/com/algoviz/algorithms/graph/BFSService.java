package com.algoviz.algorithms.graph;

import com.algoviz.datastructures.Graph;
import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.graph.GraphResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class BFSService {
    
    public GraphResult bfs(Graph graph, int startVertex) {
        List<AlgorithmStep> steps = new ArrayList<>();
        List<Integer> traversalOrder = new ArrayList<>();
        boolean[] visited = new boolean[graph.getVertices()];
        Queue<Integer> queue = new LinkedList<>();
        Map<Integer, Integer> distances = new HashMap<>();
        Map<Integer, Integer> predecessors = new HashMap<>();
        int stepNumber = 0;
        long operations = 0;
        long startTime = System.currentTimeMillis();
        
        // Initialize
        for (int i = 0; i < graph.getVertices(); i++) {
            distances.put(i, Integer.MAX_VALUE);
            predecessors.put(i, -1);
        }
        
        visited[startVertex] = true;
        queue.add(startVertex);
        distances.put(startVertex, 0);
        
        steps.add(createStep(stepNumber++, visited, queue, new ArrayList<>(), startVertex, -1, 
                "INITIAL", String.format("Starting BFS from vertex %d", startVertex)));
        
        while (!queue.isEmpty()) {
            int current = queue.poll();
            traversalOrder.add(current);
            operations++;
            
            steps.add(createStep(stepNumber++, visited, queue, traversalOrder, current, -1, 
                    "DEQUEUE", String.format("Processing vertex %d", current)));
            
            for (int neighbor : graph.getNeighborVertices(current)) {
                operations++;
                
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.add(neighbor);
                    distances.put(neighbor, distances.get(current) + 1);
                    predecessors.put(neighbor, current);
                    
                    steps.add(createStep(stepNumber++, visited, queue, traversalOrder, current, neighbor, 
                            "VISIT", String.format("Discovered vertex %d from %d (distance: %d)", 
                                    neighbor, current, distances.get(neighbor))));
                } else {
                    steps.add(createStep(stepNumber++, visited, queue, traversalOrder, current, neighbor, 
                            "ALREADY_VISITED", String.format("Vertex %d already visited", neighbor)));
                }
            }
        }
        
        steps.add(createStep(stepNumber++, visited, queue, traversalOrder, -1, -1, 
                "COMPLETE", "BFS traversal complete"));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return GraphResult.builder()
                .steps(steps)
                .traversalOrder(traversalOrder)
                .distances(distances)
                .predecessors(predecessors)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(V + E)")
                        .spaceComplexity("O(V)")
                        .actualOperations(operations)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Breadth-First Search (BFS)")
                .build();
    }
    
    private AlgorithmStep createStep(int stepNumber, boolean[] visited, Queue<Integer> queue, 
                                      List<Integer> traversalOrder, int current, int neighbor, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        List<Boolean> visitedList = new ArrayList<>();
        for (boolean b : visited) {
            visitedList.add(b);
        }
        highlights.put("visited", visitedList);
        highlights.put("queue", new ArrayList<>(queue));
        highlights.put("traversalOrder", new ArrayList<>(traversalOrder));
        if (current >= 0) highlights.put("current", current);
        if (neighbor >= 0) highlights.put("neighbor", neighbor);
        
        return AlgorithmStep.builder()
                .stepNumber(stepNumber)
                .description(description)
                .currentState(highlights)
                .highlights(highlights)
                .timestamp(System.currentTimeMillis())
                .operationType(operationType)
                .build();
    }
    
    private String getCodeSnippet() {
        return """
                public void bfs(Graph graph, int start) {
                    boolean[] visited = new boolean[graph.vertices];
                    Queue<Integer> queue = new LinkedList<>();
                    
                    visited[start] = true;
                    queue.add(start);
                    
                    while (!queue.isEmpty()) {
                        int current = queue.poll();
                        System.out.println(current);
                        
                        for (int neighbor : graph.getNeighbors(current)) {
                            if (!visited[neighbor]) {
                                visited[neighbor] = true;
                                queue.add(neighbor);
                            }
                        }
                    }
                }
                """;
    }
}
