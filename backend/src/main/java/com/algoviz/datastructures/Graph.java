package com.algoviz.datastructures;

import com.algoviz.model.graph.Edge;
import lombok.Getter;

import java.util.*;

@Getter
public class Graph {
    private final int vertices;
    private final List<List<Edge>> adjacencyList;
    private final int[][] adjacencyMatrix;
    private final boolean directed;
    private final boolean weighted;
    
    public Graph(int vertices, boolean directed, boolean weighted) {
        this.vertices = vertices;
        this.directed = directed;
        this.weighted = weighted;
        this.adjacencyList = new ArrayList<>();
        this.adjacencyMatrix = new int[vertices][vertices];
        
        for (int i = 0; i < vertices; i++) {
            adjacencyList.add(new ArrayList<>());
            Arrays.fill(adjacencyMatrix[i], Integer.MAX_VALUE);
            adjacencyMatrix[i][i] = 0;
        }
    }
    
    public void addEdge(int source, int destination, int weight) {
        if (source >= vertices || destination >= vertices || source < 0 || destination < 0) {
            throw new IllegalArgumentException("Invalid vertex");
        }
        
        adjacencyList.get(source).add(new Edge(source, destination, weight));
        adjacencyMatrix[source][destination] = weight;
        
        if (!directed) {
            adjacencyList.get(destination).add(new Edge(destination, source, weight));
            adjacencyMatrix[destination][source] = weight;
        }
    }
    
    public void addEdge(int source, int destination) {
        addEdge(source, destination, 1);
    }
    
    public List<Edge> getNeighbors(int vertex) {
        if (vertex < 0 || vertex >= vertices) {
            throw new IllegalArgumentException("Invalid vertex");
        }
        return adjacencyList.get(vertex);
    }
    
    public List<Integer> getNeighborVertices(int vertex) {
        return getNeighbors(vertex).stream()
                .map(Edge::getDestination)
                .toList();
    }
    
    public int getEdgeWeight(int source, int destination) {
        return adjacencyMatrix[source][destination];
    }
    
    public boolean hasEdge(int source, int destination) {
        return adjacencyMatrix[source][destination] != Integer.MAX_VALUE;
    }
    
    public List<Edge> getAllEdges() {
        List<Edge> edges = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            edges.addAll(adjacencyList.get(i));
        }
        return edges;
    }
}
