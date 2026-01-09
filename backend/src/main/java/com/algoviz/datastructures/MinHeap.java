package com.algoviz.datastructures;

import java.util.ArrayList;
import java.util.List;

public class MinHeap<T extends Comparable<T>> {
    private final List<T> heap;
    
    public MinHeap() {
        this.heap = new ArrayList<>();
    }
    
    public void insert(T element) {
        heap.add(element);
        heapifyUp(heap.size() - 1);
    }
    
    public T extractMin() {
        if (heap.isEmpty()) {
            throw new IllegalStateException("Heap is empty");
        }
        
        T min = heap.get(0);
        T last = heap.remove(heap.size() - 1);
        
        if (!heap.isEmpty()) {
            heap.set(0, last);
            heapifyDown(0);
        }
        
        return min;
    }
    
    public T peek() {
        if (heap.isEmpty()) {
            throw new IllegalStateException("Heap is empty");
        }
        return heap.get(0);
    }
    
    public boolean isEmpty() {
        return heap.isEmpty();
    }
    
    public int size() {
        return heap.size();
    }
    
    private void heapifyUp(int index) {
        while (index > 0) {
            int parentIndex = (index - 1) / 2;
            if (heap.get(index).compareTo(heap.get(parentIndex)) >= 0) {
                break;
            }
            swap(index, parentIndex);
            index = parentIndex;
        }
    }
    
    private void heapifyDown(int index) {
        while (true) {
            int leftChild = 2 * index + 1;
            int rightChild = 2 * index + 2;
            int smallest = index;
            
            if (leftChild < heap.size() && 
                heap.get(leftChild).compareTo(heap.get(smallest)) < 0) {
                smallest = leftChild;
            }
            
            if (rightChild < heap.size() && 
                heap.get(rightChild).compareTo(heap.get(smallest)) < 0) {
                smallest = rightChild;
            }
            
            if (smallest == index) {
                break;
            }
            
            swap(index, smallest);
            index = smallest;
        }
    }
    
    private void swap(int i, int j) {
        T temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
    
    public List<T> toList() {
        return new ArrayList<>(heap);
    }
}
