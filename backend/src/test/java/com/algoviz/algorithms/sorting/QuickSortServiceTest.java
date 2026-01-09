package com.algoviz.algorithms.sorting;

import com.algoviz.model.sorting.SortingResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QuickSortServiceTest {
    
    @Autowired
    private QuickSortService quickSortService;
    
    @Test
    void testQuickSortBasic() {
        List<Integer> input = Arrays.asList(5, 2, 8, 1, 9);
        SortingResult result = quickSortService.sort(input);
        
        assertNotNull(result);
        assertEquals(Arrays.asList(1, 2, 5, 8, 9), result.getSortedArray());
        assertTrue(result.getSteps().size() > 0);
        assertNotNull(result.getMetrics());
    }
    
    @Test
    void testQuickSortAlreadySorted() {
        List<Integer> input = Arrays.asList(1, 2, 3, 4, 5);
        SortingResult result = quickSortService.sort(input);
        
        assertNotNull(result);
        assertEquals(Arrays.asList(1, 2, 3, 4, 5), result.getSortedArray());
    }
    
    @Test
    void testQuickSortReverseSorted() {
        List<Integer> input = Arrays.asList(5, 4, 3, 2, 1);
        SortingResult result = quickSortService.sort(input);
        
        assertNotNull(result);
        assertEquals(Arrays.asList(1, 2, 3, 4, 5), result.getSortedArray());
    }
    
    @Test
    void testQuickSortSingleElement() {
        List<Integer> input = Arrays.asList(42);
        SortingResult result = quickSortService.sort(input);
        
        assertNotNull(result);
        assertEquals(Arrays.asList(42), result.getSortedArray());
    }
    
    @Test
    void testQuickSortDuplicates() {
        List<Integer> input = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6, 5);
        SortingResult result = quickSortService.sort(input);
        
        assertNotNull(result);
        assertEquals(Arrays.asList(1, 1, 2, 3, 4, 5, 5, 6, 9), result.getSortedArray());
    }
}
