package com.algoviz.controller;

import com.algoviz.model.sorting.SortingRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SortingControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testQuickSortEndpoint() throws Exception {
        SortingRequest request = new SortingRequest();
        request.setArray(Arrays.asList(5, 2, 8, 1, 9));
        request.setVisualizationSpeed("NORMAL");
        
        mockMvc.perform(post("/api/v1/algorithms/sorting/quick-sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sortedArray").isArray())
                .andExpect(jsonPath("$.steps").isArray())
                .andExpect(jsonPath("$.metrics").exists())
                .andExpect(jsonPath("$.algorithmName").value("QuickSort"));
    }
    
    @Test
    void testBubbleSortEndpoint() throws Exception {
        SortingRequest request = new SortingRequest();
        request.setArray(Arrays.asList(3, 1, 4, 1, 5));
        
        mockMvc.perform(post("/api/v1/algorithms/sorting/bubble-sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sortedArray").isArray())
                .andExpect(jsonPath("$.algorithmName").value("BubbleSort"));
    }
}
