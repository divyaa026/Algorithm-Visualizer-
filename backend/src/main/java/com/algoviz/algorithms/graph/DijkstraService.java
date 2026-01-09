package com.algoviz.algorithms.graph;

import com.algoviz.datastructures.Graph;
import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.graph.GraphResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class DijkstraService {
    
    @Data
    @AllArgsConstructor
    private static class Node implements Comparable<Node> {
        int vertex;
        int distance;
        
        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }
    
    public GraphResult dijkstra(Graph graph, int startVertex) {
        List<AlgorithmStep> steps = new ArrayList<>();
        int vertices = graph.getVertices();
        int[] distances = new int[vertices];
        int[] predecessors = new int[vertices];
        boolean[] visited = new boolean[vertices];
        PriorityQueue<Node> pq = new PriorityQueue<>();
        int stepNumber = 0;
        long operations = 0;
        long startTime = System.currentTimeMillis();
        
        // Initialize
        Arrays.fill(distances, Integer.MAX_VALUE);
        Arrays.fill(predecessors, -1);
        distances[startVertex] = 0;
        pq.offer(new Node(startVertex, 0));
        
        steps.add(createStep(stepNumber++, distances, visited, pq, startVertex, -1, 
                "INITIAL", String.format("Starting Dijkstra's algorithm from vertex %d", startVertex)));
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;
            operations++;
            
            if (visited[u]) {
                continue;
            }
            
            visited[u] = true;
            steps.add(createStep(stepNumber++, distances, visited, pq, u, -1, 
                    "VISIT", String.format("Visiting vertex %d with distance %d", u, distances[u])));
            
            for (var edge : graph.getNeighbors(u)) {
                int v = edge.getDestination();
                int weight = edge.getWeight();
                operations++;
                
                if (!visited[v] && distances[u] != Integer.MAX_VALUE) {
                    int newDist = distances[u] + weight;
                    
                    if (newDist < distances[v]) {
                        distances[v] = newDist;
                        predecessors[v] = u;
                        pq.offer(new Node(v, newDist));
                        
                        steps.add(createStep(stepNumber++, distances, visited, pq, u, v, 
                                "RELAX", String.format("Relaxed edge %d -> %d, new distance: %d", 
                                        u, v, newDist)));
                    } else {
                        steps.add(createStep(stepNumber++, distances, visited, pq, u, v, 
                                "NO_IMPROVEMENT", String.format("No improvement for edge %d -> %d", u, v)));
                    }
                }
            }
        }
        
        steps.add(createStep(stepNumber++, distances, visited, pq, -1, -1, 
                "COMPLETE", "Dijkstra's algorithm complete"));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        Map<Integer, Integer> distanceMap = new HashMap<>();
        Map<Integer, Integer> predecessorMap = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            distanceMap.put(i, distances[i]);
            predecessorMap.put(i, predecessors[i]);
        }
        
        return GraphResult.builder()
                .steps(steps)
                .distances(distanceMap)
                .predecessors(predecessorMap)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O((V + E) log V)")
                        .spaceComplexity("O(V)")
                        .actualOperations(operations)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Dijkstra's Shortest Path")
                .build();
    }
    
    private AlgorithmStep createStep(int stepNumber, int[] distances, boolean[] visited, 
                                      PriorityQueue<Node> pq, int current, int neighbor, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        highlights.put("distances", Arrays.stream(distances).boxed().toList());
        List<Boolean> visitedList = new ArrayList<>();
        for (boolean b : visited) {
            visitedList.add(b);
        }
        highlights.put("visited", visitedList);
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
                public int[] dijkstra(Graph graph, int start) {
                    int[] dist = new int[graph.vertices];
                    boolean[] visited = new boolean[graph.vertices];
                    PriorityQueue<Node> pq = new PriorityQueue<>();
                    
                    Arrays.fill(dist, Integer.MAX_VALUE);
                    dist[start] = 0;
                    pq.offer(new Node(start, 0));
                    
                    while (!pq.isEmpty()) {
                        Node current = pq.poll();
                        int u = current.vertex;
                        
                        if (visited[u]) continue;
                        visited[u] = true;
                        
                        for (Edge edge : graph.getNeighbors(u)) {
                            int v = edge.destination;
                            int weight = edge.weight;
                            
                            if (!visited[v] && dist[u] + weight < dist[v]) {
                                dist[v] = dist[u] + weight;
                                pq.offer(new Node(v, dist[v]));
                            }
                        }
                    }
                    return dist;
                }
                """;
    }
}
