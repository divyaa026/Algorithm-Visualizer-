package com.algoviz.model.dp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnapsackRequest {
    private List<Integer> weights;
    private List<Integer> values;
    private int capacity;
    private String type; // ZERO_ONE or FRACTIONAL
}
