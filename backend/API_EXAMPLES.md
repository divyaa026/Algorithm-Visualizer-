# API Usage Examples

## Sorting Algorithms

### QuickSort
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/sorting/quick-sort \
  -H "Content-Type: application/json" \
  -d '{
    "array": [64, 34, 25, 12, 22, 11, 90],
    "visualizationSpeed": "NORMAL"
  }'
```

**Response:**
```json
{
  "sortedArray": [11, 12, 22, 25, 34, 64, 90],
  "steps": [
    {
      "stepNumber": 0,
      "description": "Starting QuickSort",
      "currentState": [64, 34, 25, 12, 22, 11, 90],
      "highlights": {},
      "timestamp": 1704326400000,
      "operationType": "INITIAL"
    }
  ],
  "metrics": {
    "timeComplexity": "O(n log n) average, O(n²) worst",
    "spaceComplexity": "O(log n)",
    "actualOperations": 42,
    "comparisons": 28,
    "swaps": 14,
    "executionTimeMs": 5
  },
  "codeSnippet": "...",
  "algorithmName": "QuickSort"
}
```

### MergeSort
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/sorting/merge-sort \
  -H "Content-Type: application/json" \
  -d '{
    "array": [38, 27, 43, 3, 9, 82, 10]
  }'
```

## Graph Algorithms

### BFS (Breadth-First Search)
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/graph/bfs \
  -H "Content-Type: application/json" \
  -d '{
    "vertices": 6,
    "edges": [
      {"source": 0, "destination": 1, "weight": 1},
      {"source": 0, "destination": 2, "weight": 1},
      {"source": 1, "destination": 3, "weight": 1},
      {"source": 2, "destination": 4, "weight": 1},
      {"source": 3, "destination": 5, "weight": 1},
      {"source": 4, "destination": 5, "weight": 1}
    ],
    "startVertex": 0,
    "directed": false,
    "weighted": false
  }'
```

**Response:**
```json
{
  "steps": [...],
  "traversalOrder": [0, 1, 2, 3, 4, 5],
  "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
  },
  "predecessors": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
  },
  "metrics": {
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "actualOperations": 12,
    "executionTimeMs": 3
  },
  "algorithmName": "Breadth-First Search (BFS)"
}
```

### Dijkstra's Algorithm
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/graph/dijkstra \
  -H "Content-Type: application/json" \
  -d '{
    "vertices": 5,
    "edges": [
      {"source": 0, "destination": 1, "weight": 4},
      {"source": 0, "destination": 2, "weight": 1},
      {"source": 2, "destination": 1, "weight": 2},
      {"source": 1, "destination": 3, "weight": 1},
      {"source": 2, "destination": 3, "weight": 5},
      {"source": 3, "destination": 4, "weight": 3}
    ],
    "startVertex": 0,
    "directed": false,
    "weighted": true
  }'
```

### Kruskal's MST
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/graph/kruskal-mst \
  -H "Content-Type: application/json" \
  -d '{
    "vertices": 4,
    "edges": [
      {"source": 0, "destination": 1, "weight": 10},
      {"source": 0, "destination": 2, "weight": 6},
      {"source": 0, "destination": 3, "weight": 5},
      {"source": 1, "destination": 3, "weight": 15},
      {"source": 2, "destination": 3, "weight": 4}
    ],
    "directed": false,
    "weighted": true
  }'
```

## Dynamic Programming

### 0/1 Knapsack
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/dp/knapsack \
  -H "Content-Type: application/json" \
  -d '{
    "weights": [2, 3, 4, 5],
    "values": [3, 4, 5, 6],
    "capacity": 8,
    "type": "ZERO_ONE"
  }'
```

**Response:**
```json
{
  "result": {
    "maxValue": 10,
    "selectedItems": [1, 3]
  },
  "steps": [...],
  "dpTable": [[0, 0, ...], ...],
  "metrics": {
    "timeComplexity": "O(n * W)",
    "spaceComplexity": "O(n * W)",
    "actualOperations": 36,
    "executionTimeMs": 2
  },
  "algorithmName": "0/1 Knapsack"
}
```

### Longest Common Subsequence (LCS)
```bash
curl -X POST "http://localhost:8080/api/v1/algorithms/dp/lcs?text1=ABCDGH&text2=AEDFHR" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "result": {
    "length": 3,
    "lcs": "ADH"
  },
  "steps": [...],
  "dpTable": [[0, 0, ...], ...],
  "metrics": {
    "timeComplexity": "O(m * n)",
    "spaceComplexity": "O(m * n)",
    "actualOperations": 42,
    "executionTimeMs": 1
  },
  "algorithmName": "Longest Common Subsequence"
}
```

### Fibonacci (Memoized)
```bash
curl -X GET "http://localhost:8080/api/v1/algorithms/dp/fibonacci/memoized?n=10"
```

**Response:**
```json
{
  "result": 55,
  "steps": [...],
  "metrics": {
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "actualOperations": 19,
    "executionTimeMs": 0
  },
  "algorithmName": "Fibonacci (Memoized)"
}
```

### Fibonacci (Tabulated)
```bash
curl -X GET "http://localhost:8080/api/v1/algorithms/dp/fibonacci/tabulated?n=10"
```

## Health & Monitoring

### Health Check
```bash
curl http://localhost:8080/api/v1/health
```

**Response:**
```json
{
  "status": "UP",
  "service": "Algorithm Visualization Platform",
  "version": "1.0.0",
  "timestamp": 1704326400000
}
```

### List Available Algorithms
```bash
curl http://localhost:8080/api/v1/health/algorithms
```

**Response:**
```json
{
  "sorting": ["quick-sort", "merge-sort", "bubble-sort", "insertion-sort"],
  "graph": ["bfs", "dfs", "dijkstra", "kruskal-mst"],
  "dynamicProgramming": ["knapsack", "lcs", "fibonacci"]
}
```

### Actuator Health
```bash
curl http://localhost:8080/actuator/health
```

### Metrics
```bash
curl http://localhost:8080/actuator/metrics
```

## Using with Frontend

The frontend (React app) at http://localhost:5173 automatically connects to these endpoints. The backend is configured with CORS to allow requests from the frontend.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK`: Success
- `400 Bad Request`: Invalid input
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "timestamp": "2024-01-03T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid array size",
  "path": "/api/v1/algorithms/sorting/quick-sort"
}
```

## Rate Limiting

Consider implementing rate limiting for production use to prevent abuse.

## Authentication

For production deployment, implement authentication using JWT tokens or OAuth2.
