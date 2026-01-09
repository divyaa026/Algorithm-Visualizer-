package com.algoviz.algorithms.graph;

import com.algoviz.datastructures.Graph;
import com.algoviz.model.graph.GraphResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BFSServiceTest {
    
    @Autowired
    private BFSService bfsService;
    
    @Test
    void testBFSBasic() {
        Graph graph = new Graph(5, false, false);
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);
        graph.addEdge(1, 3);
        graph.addEdge(2, 4);
        
        GraphResult result = bfsService.bfs(graph, 0);
        
        assertNotNull(result);
        assertEquals(5, result.getTraversalOrder().size());
        assertTrue(result.getSteps().size() > 0);
        assertNotNull(result.getMetrics());
    }
    
    @Test
    void testBFSDisconnectedGraph() {
        Graph graph = new Graph(4, false, false);
        graph.addEdge(0, 1);
        graph.addEdge(2, 3);
        
        GraphResult result = bfsService.bfs(graph, 0);
        
        assertNotNull(result);
        assertEquals(2, result.getTraversalOrder().size());
        assertTrue(result.getTraversalOrder().contains(0));
        assertTrue(result.getTraversalOrder().contains(1));
    }
    
    @Test
    void testBFSSingleNode() {
        Graph graph = new Graph(1, false, false);
        
        GraphResult result = bfsService.bfs(graph, 0);
        
        assertNotNull(result);
        assertEquals(1, result.getTraversalOrder().size());
        assertEquals(0, result.getTraversalOrder().get(0));
    }
}
