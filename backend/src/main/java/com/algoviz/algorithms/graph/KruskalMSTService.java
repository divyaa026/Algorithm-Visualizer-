package com.algoviz.algorithms.graph;

import com.algoviz.datastructures.DisjointSet;
import com.algoviz.datastructures.Graph;
import com.algoviz.model.AlgorithmStep;
import com.algoviz.model.ComplexityMetrics;
import com.algoviz.model.graph.Edge;
import com.algoviz.model.graph.GraphResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class KruskalMSTService {
    
    public GraphResult kruskalMST(Graph graph) {
        List<AlgorithmStep> steps = new ArrayList<>();
        List<Edge> mstEdges = new ArrayList<>();
        List<Edge> allEdges = new ArrayList<>(graph.getAllEdges());
        DisjointSet ds = new DisjointSet(graph.getVertices());
        int stepNumber = 0;
        long operations = 0;
        long startTime = System.currentTimeMillis();
        
        // Sort edges by weight
        allEdges.sort(Comparator.comparingInt(Edge::getWeight));
        
        steps.add(createStep(stepNumber++, mstEdges, allEdges, -1, -1, 
                "INITIAL", "Starting Kruskal's MST algorithm. Edges sorted by weight"));
        
        int totalWeight = 0;
        
        for (Edge edge : allEdges) {
            operations++;
            int source = edge.getSource();
            int destination = edge.getDestination();
            
            steps.add(createStep(stepNumber++, mstEdges, allEdges, source, destination, 
                    "CONSIDER", String.format("Considering edge %d -> %d (weight: %d)", 
                            source, destination, edge.getWeight())));
            
            if (!ds.connected(source, destination)) {
                ds.union(source, destination);
                mstEdges.add(edge);
                totalWeight += edge.getWeight();
                
                steps.add(createStep(stepNumber++, mstEdges, allEdges, source, destination, 
                        "ACCEPT", String.format("Edge %d -> %d accepted. Total weight: %d", 
                                source, destination, totalWeight)));
                
                if (mstEdges.size() == graph.getVertices() - 1) {
                    break;
                }
            } else {
                steps.add(createStep(stepNumber++, mstEdges, allEdges, source, destination, 
                        "REJECT", String.format("Edge %d -> %d rejected (would form cycle)", 
                                source, destination)));
            }
        }
        
        steps.add(createStep(stepNumber++, mstEdges, allEdges, -1, -1, 
                "COMPLETE", String.format("MST complete. Total weight: %d", totalWeight)));
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        return GraphResult.builder()
                .steps(steps)
                .resultEdges(mstEdges)
                .metrics(ComplexityMetrics.builder()
                        .timeComplexity("O(E log E)")
                        .spaceComplexity("O(V)")
                        .actualOperations(operations)
                        .executionTimeMs(executionTime)
                        .build())
                .codeSnippet(getCodeSnippet())
                .algorithmName("Kruskal's Minimum Spanning Tree")
                .build();
    }
    
    private AlgorithmStep createStep(int stepNumber, List<Edge> mstEdges, List<Edge> allEdges, 
                                      int source, int destination, 
                                      String operationType, String description) {
        Map<String, Object> highlights = new HashMap<>();
        highlights.put("mstEdges", new ArrayList<>(mstEdges));
        if (source >= 0) highlights.put("source", source);
        if (destination >= 0) highlights.put("destination", destination);
        
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
                public List<Edge> kruskalMST(Graph graph) {
                    List<Edge> mst = new ArrayList<>();
                    List<Edge> edges = graph.getAllEdges();
                    edges.sort(Comparator.comparingInt(Edge::getWeight));
                    
                    DisjointSet ds = new DisjointSet(graph.vertices);
                    
                    for (Edge edge : edges) {
                        if (!ds.connected(edge.source, edge.destination)) {
                            ds.union(edge.source, edge.destination);
                            mst.add(edge);
                            
                            if (mst.size() == graph.vertices - 1) {
                                break;
                            }
                        }
                    }
                    return mst;
                }
                """;
    }
}
