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
public class DFSService {
    
    private List<AlgorithmStep> steps;
    private List<Integer> traversalOrder;
    private boolean[] visited;
    private int stepNumber;
    private long operations;
    private Stack<Integer> stack;
    
    public GraphResult dfs(Graph graph, int startVertex) {
        steps = new ArrayList<>();
        traversalOrder = new ArrayList<>();
        visited = new boolean[graph.getVertices()];
        stack = new Stack<>();
        stepNumber = 0;
        operations = 0;
        long startTime = System.currentTimeMillis();
        
        steps.add(createStep(visited, stack, startVertex, -1, 
                "INITIAL", String.format("Starting DFS from vertex %d", startVertex)));
        
        dfsRecursive(graph, startVertex);
        
        steps.add(createStep(visited, stack, -1, -1, 
                "COMPLETE", "DFS traversal complete"));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return GraphResult.builder()
                .steps(steps)
                .traversalOrder(traversalOrder)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(V + E)")
                        .spaceComplexity("O(V)")
                        .actualOperations(operations)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Depth-First Search (DFS)")
                .build();
    }
    
    private void dfsRecursive(Graph graph, int vertex) {
        visited[vertex] = true;
        traversalOrder.add(vertex);
        stack.push(vertex);
        operations++;
        
        steps.add(createStep(visited, stack, vertex, -1, 
                "VISIT", String.format("Visiting vertex %d", vertex)));
        
        for (int neighbor : graph.getNeighborVertices(vertex)) {
            operations++;
            
            if (!visited[neighbor]) {
                steps.add(createStep(visited, stack, vertex, neighbor, 
                        "EXPLORE", String.format("Exploring edge %d -> %d", vertex, neighbor)));
                dfsRecursive(graph, neighbor);
            } else {
                steps.add(createStep(visited, stack, vertex, neighbor, 
                        "ALREADY_VISITED", String.format("Vertex %d already visited", neighbor)));
            }
        }
        
        stack.pop();
        steps.add(createStep(visited, stack, vertex, -1, 
                "BACKTRACK", String.format("Backtracking from vertex %d", vertex)));
    }
    
    private AlgorithmStep createStep(boolean[] visited, Stack<Integer> stack, 
                                      int current, int neighbor, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        List<Boolean> visitedList = new ArrayList<>();
        for (boolean b : visited) {
            visitedList.add(b);
        }
        highlights.put("visited", visitedList);
        highlights.put("stack", new ArrayList<>(stack));
        highlights.put("traversalOrder", new ArrayList<>(traversalOrder));
        if (current >= 0) highlights.put("current", current);
        if (neighbor >= 0) highlights.put("neighbor", neighbor);
        
        return AlgorithmStep.builder()
                .stepNumber(stepNumber++)
                .description(description)
                .currentState(highlights)
                .highlights(highlights)
                .timestamp(System.currentTimeMillis())
                .operationType(operationType)
                .build();
    }
    
    private String getCodeSnippet() {
        return """
                public void dfs(Graph graph, int vertex) {
                    boolean[] visited = new boolean[graph.vertices];
                    dfsRecursive(graph, vertex, visited);
                }
                
                private void dfsRecursive(Graph graph, int vertex, boolean[] visited) {
                    visited[vertex] = true;
                    System.out.println(vertex);
                    
                    for (int neighbor : graph.getNeighbors(vertex)) {
                        if (!visited[neighbor]) {
                            dfsRecursive(graph, neighbor, visited);
                        }
                    }
                }
                """;
    }
}
