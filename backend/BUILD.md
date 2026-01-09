# Build and run instructions

## Prerequisites
- Java 17 or higher
- Maven 3.6+

## Build
```bash
mvn clean install
```

## Run
```bash
mvn spring-boot:run
```

## Test
```bash
mvn test
```

## Package
```bash
mvn clean package
java -jar target/algorithm-visualization-platform-1.0.0.jar
```

## API Endpoints

### Health Check
GET http://localhost:8080/api/v1/health

### Sorting Algorithms
POST http://localhost:8080/api/v1/algorithms/sorting/quick-sort
POST http://localhost:8080/api/v1/algorithms/sorting/merge-sort
POST http://localhost:8080/api/v1/algorithms/sorting/bubble-sort
POST http://localhost:8080/api/v1/algorithms/sorting/insertion-sort

### Graph Algorithms
POST http://localhost:8080/api/v1/algorithms/graph/bfs
POST http://localhost:8080/api/v1/algorithms/graph/dfs
POST http://localhost:8080/api/v1/algorithms/graph/dijkstra
POST http://localhost:8080/api/v1/algorithms/graph/kruskal-mst

### Dynamic Programming
POST http://localhost:8080/api/v1/algorithms/dp/knapsack
POST http://localhost:8080/api/v1/algorithms/dp/lcs
GET http://localhost:8080/api/v1/algorithms/dp/fibonacci/memoized?n=10
GET http://localhost:8080/api/v1/algorithms/dp/fibonacci/tabulated?n=10

## Documentation
Swagger UI: http://localhost:8080/swagger-ui.html
OpenAPI Spec: http://localhost:8080/v3/api-docs
