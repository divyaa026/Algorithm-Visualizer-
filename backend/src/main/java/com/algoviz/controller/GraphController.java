package com.algoviz.controller;

import com.algoviz.algorithms.graph.*;
import com.algoviz.datastructures.Graph;
import com.algoviz.model.graph.Edge;
import com.algoviz.model.graph.GraphRequest;
import com.algoviz.model.graph.GraphResult;
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
@RequestMapping("/api/v1/algorithms/graph")
@RequiredArgsConstructor
@Validated
@Tag(name = "Graph Algorithms", description = "APIs for graph algorithm visualization")
@CrossOrigin(origins = "*")
public class GraphController {
    
    private final BFSService bfsService;
    private final DFSService dfsService;
    private final DijkstraService dijkstraService;
    private final KruskalMSTService kruskalMSTService;
    
    @PostMapping("/bfs")
    @Operation(summary = "Execute BFS", 
               description = "Performs Breadth-First Search on the input graph")
    public ResponseEntity<GraphResult> bfs(@Valid @RequestBody GraphRequest request) {
        log.info("BFS request received for graph with {} vertices", request.getVertices());
        Graph graph = buildGraph(request);
        GraphResult result = bfsService.bfs(graph, request.getStartVertex());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/dfs")
    @Operation(summary = "Execute DFS", 
               description = "Performs Depth-First Search on the input graph")
    public ResponseEntity<GraphResult> dfs(@Valid @RequestBody GraphRequest request) {
        log.info("DFS request received for graph with {} vertices", request.getVertices());
        Graph graph = buildGraph(request);
        GraphResult result = dfsService.dfs(graph, request.getStartVertex());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/dijkstra")
    @Operation(summary = "Execute Dijkstra's Algorithm", 
               description = "Finds shortest paths from start vertex using Dijkstra's algorithm")
    public ResponseEntity<GraphResult> dijkstra(@Valid @RequestBody GraphRequest request) {
        log.info("Dijkstra request received for graph with {} vertices", request.getVertices());
        Graph graph = buildGraph(request);
        GraphResult result = dijkstraService.dijkstra(graph, request.getStartVertex());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/kruskal-mst")
    @Operation(summary = "Execute Kruskal's MST", 
               description = "Finds Minimum Spanning Tree using Kruskal's algorithm")
    public ResponseEntity<GraphResult> kruskalMST(@Valid @RequestBody GraphRequest request) {
        log.info("Kruskal MST request received for graph with {} vertices", request.getVertices());
        Graph graph = buildGraph(request);
        GraphResult result = kruskalMSTService.kruskalMST(graph);
        return ResponseEntity.ok(result);
    }
    
    private Graph buildGraph(GraphRequest request) {
        Graph graph = new Graph(
            request.getVertices(), 
            request.isDirected(), 
            request.isWeighted()
        );
        
        if (request.getEdges() != null) {
            for (Edge edge : request.getEdges()) {
                graph.addEdge(edge.getSource(), edge.getDestination(), edge.getWeight());
            }
        }
        
        if (request.getAdjacencyList() != null) {
            for (var entry : request.getAdjacencyList().entrySet()) {
                int source = entry.getKey();
                for (int dest : entry.getValue()) {
                    graph.addEdge(source, dest, 1);
                }
            }
        }
        
        return graph;
    }
}
