# Development Guide

## Getting Started

### Backend Setup

1. **Prerequisites**
   - Java 17 or higher
   - Maven 3.6+
   - IDE (IntelliJ IDEA or Eclipse recommended)

2. **Import Project**
   - Open the `backend` folder in your IDE
   - Wait for Maven to download dependencies
   - Ensure JDK 17 is configured

3. **Run Application**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   
   Or run `AlgorithmVisualizationApplication.java` from your IDE

4. **Verify**
   - Open http://localhost:8080/api/v1/health
   - Open http://localhost:8080/swagger-ui.html

### Frontend Setup

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Install Dependencies**
   ```bash
   cd algo-canvas
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Verify**
   - Open http://localhost:5173

## Project Architecture

### Backend Structure

```
com.algoviz/
├── algorithms/              # Algorithm implementations
│   ├── sorting/            # Sorting algorithms
│   ├── graph/              # Graph algorithms
│   └── dp/                 # Dynamic programming
├── controller/             # REST API endpoints
├── model/                  # Data transfer objects
├── service/                # Business logic (if needed)
├── config/                 # Configuration classes
├── datastructures/         # Custom data structures
└── exception/              # Exception handlers
```

### Adding a New Algorithm

1. **Create Algorithm Service** (e.g., `HeapSortService.java`)
   ```java
   @Service
   public class HeapSortService {
       public SortingResult sort(List<Integer> array) {
           // Implementation
       }
   }
   ```

2. **Add Controller Endpoint**
   ```java
   @PostMapping("/heap-sort")
   public ResponseEntity<SortingResult> heapSort(@RequestBody SortingRequest request) {
       return ResponseEntity.ok(heapSortService.sort(request.getArray()));
   }
   ```

3. **Create Tests**
   ```java
   @SpringBootTest
   class HeapSortServiceTest {
       @Test
       void testHeapSort() {
           // Test implementation
       }
   }
   ```

4. **Update Documentation**
   - Add endpoint to README.md
   - Add example to API_EXAMPLES.md

### Frontend Structure

```
src/
├── components/             # React components
│   ├── visualization/     # Visualization components
│   ├── controls/          # Control panels
│   ├── layout/            # Layout components
│   └── ui/                # Shadcn UI components
├── pages/                 # Page components
├── hooks/                 # Custom React hooks
├── store/                 # State management
└── lib/                   # Utilities
```

## Code Style Guidelines

### Java
- Follow Google Java Style Guide
- Use Lombok for boilerplate reduction
- Write descriptive variable names
- Add JavaDoc for public methods
- Keep methods under 50 lines

### TypeScript/React
- Use functional components with hooks
- Follow React best practices
- Use TypeScript strictly
- Extract reusable logic to custom hooks

## Testing Strategy

### Backend Testing

1. **Unit Tests**
   - Test individual algorithm implementations
   - Test data structure operations
   - Mock external dependencies

2. **Integration Tests**
   - Test REST endpoints
   - Test request/response flows
   - Use MockMvc for controller tests

3. **Run Tests**
   ```bash
   mvn test
   ```

### Frontend Testing

1. **Component Tests**
   - Test component rendering
   - Test user interactions
   - Test state changes

2. **Run Tests**
   ```bash
   npm test
   ```

## Debugging

### Backend Debugging

1. **Enable Debug Logging**
   Update `application.yml`:
   ```yaml
   logging:
     level:
       com.algoviz: DEBUG
   ```

2. **Use IDE Debugger**
   - Set breakpoints in your IDE
   - Run in debug mode
   - Step through code execution

3. **Check Actuator Endpoints**
   - http://localhost:8080/actuator/health
   - http://localhost:8080/actuator/metrics

### Frontend Debugging

1. **Browser DevTools**
   - Use React DevTools extension
   - Check console for errors
   - Inspect network requests

2. **Debug State**
   - Use React DevTools to inspect state
   - Add console.log statements
   - Use debugger statements

## Performance Optimization

### Backend

1. **Enable Caching**
   - Already configured in CacheConfig.java
   - Add @Cacheable annotations where needed

2. **Optimize Algorithms**
   - Use appropriate data structures
   - Minimize unnecessary operations
   - Consider space-time tradeoffs

3. **Monitor Performance**
   - Use Spring Boot Actuator metrics
   - Profile with JProfiler or VisualVM

### Frontend

1. **Optimize Rendering**
   - Use React.memo for expensive components
   - Implement useMemo and useCallback
   - Avoid unnecessary re-renders

2. **Code Splitting**
   - Use lazy loading for routes
   - Split large bundles

## Deployment

### Local Docker Deployment

```bash
docker-compose up --build
```

### Production Deployment

1. **Backend**
   ```bash
   cd backend
   mvn clean package
   java -jar target/algorithm-visualization-platform-1.0.0.jar
   ```

2. **Frontend**
   ```bash
   cd algo-canvas
   npm run build
   # Serve dist/ folder with nginx or similar
   ```

3. **Docker**
   ```bash
   docker build -t algoviz-backend backend/
   docker build -t algoviz-frontend algo-canvas/
   docker-compose -f docker-compose.prod.yml up
   ```

## Common Issues

### Backend

1. **Port 8080 already in use**
   - Change port in application.yml
   - Or kill process using port 8080

2. **Maven dependencies not resolving**
   - Run `mvn clean install -U`
   - Check internet connection
   - Clear Maven cache: `~/.m2/repository`

3. **Tests failing**
   - Ensure test database is configured
   - Check application-test.yml
   - Run with `-DskipTests` to skip tests

### Frontend

1. **Cannot connect to backend**
   - Ensure backend is running on port 8080
   - Check CORS configuration
   - Verify API endpoint URLs

2. **Dependencies not installing**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Use `npm ci` for clean install

## Best Practices

### Code Quality
- Write clean, readable code
- Follow SOLID principles
- Use meaningful names
- Add comments for complex logic
- Keep functions small and focused

### Version Control
- Write descriptive commit messages
- Create feature branches
- Use pull requests for code review
- Keep commits atomic

### Documentation
- Update README when adding features
- Document API changes
- Add inline comments for complex code
- Maintain changelog

### Security
- Validate all inputs
- Handle errors gracefully
- Don't expose sensitive information
- Use environment variables for secrets

## Resources

### Backend
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Framework Reference](https://docs.spring.io/spring-framework/reference/)
- [Java SE Documentation](https://docs.oracle.com/en/java/javase/17/)

### Frontend
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Algorithms
- [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/)
- [Algorithm Design Manual](https://www.algorist.com/)
- [LeetCode](https://leetcode.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review API examples

---

Happy Coding! 🚀
