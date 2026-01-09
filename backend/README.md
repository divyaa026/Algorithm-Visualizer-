# Algorithm Visualization Platform - Backend

A comprehensive Spring Boot backend for visualizing algorithms with step-by-step execution tracking, optimized for Amazon SDE role requirements.

## 🚀 Features

- **Sorting Algorithms**: QuickSort, MergeSort, BubbleSort, InsertionSort
- **Graph Algorithms**: BFS, DFS, Dijkstra's Shortest Path, Kruskal's MST
- **Dynamic Programming**: Knapsack (0/1), LCS, Fibonacci (Memoized & Tabulated)
- **Step-by-Step Visualization**: Detailed tracking of algorithm execution
- **Complexity Analysis**: Time and space complexity metrics
- **RESTful API**: Well-documented OpenAPI/Swagger endpoints
- **Performance Monitoring**: Spring Boot Actuator integration
- **Comprehensive Testing**: Unit and integration tests

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/divyaa026/algo-canvas.git
cd algo-canvas/backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### Docker Deployment

Build and run using Docker:
```bash
docker build -t algoviz-backend .
docker run -p 8080:8080 algoviz-backend
```

Or use Docker Compose (from project root):
```bash
docker-compose up
```

## 📚 API Documentation

Once the application is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs

### Key Endpoints

#### Sorting Algorithms
- `POST /api/v1/algorithms/sorting/quick-sort`
- `POST /api/v1/algorithms/sorting/merge-sort`
- `POST /api/v1/algorithms/sorting/bubble-sort`
- `POST /api/v1/algorithms/sorting/insertion-sort`

#### Graph Algorithms
- `POST /api/v1/algorithms/graph/bfs`
- `POST /api/v1/algorithms/graph/dfs`
- `POST /api/v1/algorithms/graph/dijkstra`
- `POST /api/v1/algorithms/graph/kruskal-mst`

#### Dynamic Programming
- `POST /api/v1/algorithms/dp/knapsack`
- `POST /api/v1/algorithms/dp/lcs`
- `GET /api/v1/algorithms/dp/fibonacci/memoized`
- `GET /api/v1/algorithms/dp/fibonacci/tabulated`

#### Health & Monitoring
- `GET /api/v1/health`
- `GET /actuator/health`
- `GET /actuator/metrics`

## 🔧 Configuration

Edit `src/main/resources/application.yml` to customize:
- Server port
- CORS settings
- Logging levels
- Algorithm constraints (max array size, execution time)

## 🧪 Testing

Run all tests:
```bash
mvn test
```

Run with coverage:
```bash
mvn test jacoco:report
```

## 📊 Example Requests

### QuickSort
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/sorting/quick-sort \
  -H "Content-Type: application/json" \
  -d '{
    "array": [5, 2, 8, 1, 9],
    "visualizationSpeed": "NORMAL"
  }'
```

### BFS
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/graph/bfs \
  -H "Content-Type: application/json" \
  -d '{
    "vertices": 5,
    "edges": [
      {"source": 0, "destination": 1},
      {"source": 0, "destination": 2},
      {"source": 1, "destination": 3},
      {"source": 2, "destination": 4}
    ],
    "startVertex": 0,
    "directed": false
  }'
```

### Knapsack
```bash
curl -X POST http://localhost:8080/api/v1/algorithms/dp/knapsack \
  -H "Content-Type: application/json" \
  -d '{
    "weights": [1, 3, 4, 5],
    "values": [1, 4, 5, 7],
    "capacity": 7,
    "type": "ZERO_ONE"
  }'
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/algoviz/
│   │   │   ├── algorithms/
│   │   │   │   ├── sorting/
│   │   │   │   ├── graph/
│   │   │   │   └── dp/
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── service/
│   │   │   ├── config/
│   │   │   ├── datastructures/
│   │   │   └── exception/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/com/algoviz/
├── pom.xml
├── Dockerfile
└── README.md
```

## 🎯 Key Features for SDE Interviews

- **Algorithm Optimization**: Demonstrates understanding of time/space complexity
- **Clean Architecture**: Separation of concerns with controllers, services, models
- **Best Practices**: Exception handling, logging, validation
- **Production Ready**: Docker support, health checks, monitoring
- **Comprehensive Testing**: Unit and integration test coverage
- **API Design**: RESTful principles with OpenAPI documentation

## 🔍 Monitoring & Metrics

Access Spring Boot Actuator endpoints:
- Health: `http://localhost:8080/actuator/health`
- Metrics: `http://localhost:8080/actuator/metrics`
- Prometheus: `http://localhost:8080/actuator/prometheus`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

Algorithm Visualization Team

## 🙏 Acknowledgments

Built for demonstrating algorithm knowledge and full-stack development skills for Amazon SDE roles.
