# Quick Reference Card

## 🚀 Start Commands

### Backend
```bash
cd backend
mvn spring-boot:run
```
**Or use:** `backend/start.bat` (Windows) or `backend/start.sh` (Linux/Mac)

### Frontend
```bash
cd algo-canvas
npm run dev
```

### Both (Docker)
```bash
docker-compose up
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Health Check | http://localhost:8080/api/v1/health |
| Frontend | http://localhost:5173 |
| Actuator | http://localhost:8080/actuator |

## 📡 API Endpoints Quick Reference

### Sorting
- POST `/api/v1/algorithms/sorting/quick-sort`
- POST `/api/v1/algorithms/sorting/merge-sort`
- POST `/api/v1/algorithms/sorting/bubble-sort`
- POST `/api/v1/algorithms/sorting/insertion-sort`

### Graph
- POST `/api/v1/algorithms/graph/bfs`
- POST `/api/v1/algorithms/graph/dfs`
- POST `/api/v1/algorithms/graph/dijkstra`
- POST `/api/v1/algorithms/graph/kruskal-mst`

### Dynamic Programming
- POST `/api/v1/algorithms/dp/knapsack`
- POST `/api/v1/algorithms/dp/lcs?text1=ABC&text2=AC`
- GET `/api/v1/algorithms/dp/fibonacci/memoized?n=10`
- GET `/api/v1/algorithms/dp/fibonacci/tabulated?n=10`

## 💻 Common Commands

### Maven
```bash
mvn clean install          # Build project
mvn test                   # Run tests
mvn spring-boot:run        # Start application
mvn package                # Create JAR file
```

### Docker
```bash
docker build -t algoviz .              # Build image
docker run -p 8080:8080 algoviz        # Run container
docker-compose up                       # Start all services
docker-compose down                     # Stop all services
```

### Testing APIs
```bash
# Health check
curl http://localhost:8080/api/v1/health

# QuickSort
curl -X POST http://localhost:8080/api/v1/algorithms/sorting/quick-sort \
  -H "Content-Type: application/json" \
  -d '{"array": [5,2,8,1,9]}'

# BFS
curl -X POST http://localhost:8080/api/v1/algorithms/graph/bfs \
  -H "Content-Type: application/json" \
  -d '{"vertices":5,"edges":[{"source":0,"destination":1}],"startVertex":0,"directed":false}'
```

## 📊 Request/Response Examples

### Sorting Request
```json
{
  "array": [5, 2, 8, 1, 9],
  "visualizationSpeed": "NORMAL"
}
```

### Sorting Response
```json
{
  "sortedArray": [1, 2, 5, 8, 9],
  "steps": [...],
  "metrics": {
    "timeComplexity": "O(n log n)",
    "comparisons": 15,
    "swaps": 8
  },
  "algorithmName": "QuickSort"
}
```

### Graph Request
```json
{
  "vertices": 5,
  "edges": [
    {"source": 0, "destination": 1, "weight": 1},
    {"source": 1, "destination": 2, "weight": 1}
  ],
  "startVertex": 0,
  "directed": false,
  "weighted": false
}
```

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=QuickSortServiceTest

# Run with coverage
mvn test jacoco:report
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Change port in `application.yml` or kill process |
| Maven build fails | Run `mvn clean install -U` |
| CORS errors | Check `CorsConfig.java` |
| Tests failing | Run `mvn clean install -DskipTests` |
| Cannot connect | Verify backend is running on 8080 |

## 📝 File Locations

| Component | Path |
|-----------|------|
| Main Application | `backend/src/main/java/com/algoviz/AlgorithmVisualizationApplication.java` |
| Controllers | `backend/src/main/java/com/algoviz/controller/` |
| Algorithms | `backend/src/main/java/com/algoviz/algorithms/` |
| Models | `backend/src/main/java/com/algoviz/model/` |
| Config | `backend/src/main/java/com/algoviz/config/` |
| Tests | `backend/src/test/java/com/algoviz/` |
| Application Config | `backend/src/main/resources/application.yml` |

## 🔧 Configuration

Edit `backend/src/main/resources/application.yml`:
```yaml
server:
  port: 8080          # Change server port

cors:
  allowed-origins: http://localhost:5173  # Update CORS

logging:
  level:
    com.algoviz: DEBUG    # Change log level
```

## 📚 Documentation Files

- `README.md` - Main documentation
- `backend/README.md` - Backend documentation
- `backend/API_EXAMPLES.md` - API usage examples
- `backend/BUILD.md` - Build instructions
- `DEVELOPMENT.md` - Development guide
- `SETUP_COMPLETE.md` - Setup summary

## 🎯 For Interviews

**Key talking points:**
- Implemented 11 different algorithms
- Step-by-step visualization with state tracking
- RESTful API with OpenAPI documentation
- Custom data structures (Graph, MinHeap, DisjointSet)
- Comprehensive testing (unit + integration)
- Production-ready (Docker, monitoring, CI/CD)
- Clean architecture (MVC pattern, separation of concerns)

## 📞 Quick Help

```bash
# Check versions
java -version       # Should be 17+
mvn -version        # Should be 3.6+
node -version       # Should be 18+

# View logs
tail -f backend/logs/application.log

# Check running processes
# Windows
netstat -ano | findstr :8080
# Linux/Mac
lsof -i :8080
```

---

**Keep this reference handy while developing! 📌**
