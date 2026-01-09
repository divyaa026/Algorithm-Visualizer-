package com.algoviz.model.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Edge {
    private int source;
    private int destination;
    private int weight;
    
    public Edge(int source, int destination) {
        this.source = source;
        this.destination = destination;
        this.weight = 1;
    }
}
