package com.algoviz.model.sorting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortingRequest {
    private List<Integer> array;
    private String visualizationSpeed; // SLOW, NORMAL, FAST
}
