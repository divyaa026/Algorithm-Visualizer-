package com.algoviz.model.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphRequest {
    private int vertices;
    private List<Edge> edges;
    private Map<Integer, List<Integer>> adjacencyList;
    private int startVertex;
    private Integer endVertex;
    private boolean directed;
    private boolean weighted;
}
