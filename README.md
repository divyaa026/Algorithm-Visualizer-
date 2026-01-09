# 🎯 Algorithm Visualizer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://algovisualizer-snowy.vercel.app)
[![Java](https://img.shields.io/badge/Java-17+-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

> **An interactive, full-stack algorithm visualization platform that brings data structures and algorithms to life through beautiful animations and step-by-step execution.**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Key Technical Highlights](#-key-technical-highlights)
- [Author](#-author)

---

## 🌟 Overview

Algorithm Visualizer is a comprehensive educational platform designed to help developers, students, and coding enthusiasts understand complex algorithms through interactive visualizations. Watch algorithms execute step-by-step, compare performance metrics, and deepen your understanding of computational complexity.

### Why This Project?

- 🎓 **Visual Learning**: See exactly how algorithms manipulate data in real-time
- 📊 **Performance Insights**: Understand time and space complexity through actual metrics
- 💼 **Interview Prep**: Perfect for preparing for technical interviews at top tech companies
- 📚 **Educational Tool**: Great for teaching and learning data structures & algorithms

---

## 🚀 Live Demo

🔗 **[View Live Demo on Vercel](https://algovisualizer-snowy.vercel.app)**

---

## ✨ Features

### 🔢 Sorting Algorithms
| Algorithm | Time Complexity (Avg) | Space Complexity | Status |
|-----------|----------------------|------------------|--------|
| Bubble Sort | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(1) | ✅ |
| Insertion Sort | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(log n) | ✅ |
| Heap Sort | O(n log n) | O(1) | ✅ |

### 🗺️ Path Finding Algorithms
| Algorithm | Use Case | Weighted | Status |
|-----------|----------|----------|--------|
| Dijkstra's | Shortest Path | Yes | ✅ |
| A* Search | Optimal Pathfinding | Yes | ✅ |
| BFS | Unweighted Shortest Path | No | ✅ |
| DFS | Graph Traversal | No | ✅ |

### 🔗 Graph Algorithms
| Algorithm | Purpose | Status |
|-----------|---------|--------|
| BFS Traversal | Level-order traversal | ✅ |
| DFS Traversal | Depth-first exploration | ✅ |
| Kruskal's MST | Minimum Spanning Tree | ✅ |
| Dijkstra's Shortest Path | Weighted shortest path | ✅ |

### 📊 Dynamic Programming
| Problem | Approach | Status |
|---------|----------|--------|
| Fibonacci Sequence | Memoization / Tabulation | ✅ |
| 0/1 Knapsack | 2D DP Table | ✅ |
| Longest Common Subsequence | 2D DP Table | ✅ |
| Edit Distance | 2D DP Table | ✅ |
| Coin Change | 1D DP Array | ✅ |
| Longest Increasing Subsequence | 1D DP Array | ✅ |
| Matrix Chain Multiplication | 2D DP Table | ✅ |
| Subset Sum | 2D DP Table | ✅ |

### 🏗️ Data Structures
- Binary Search Tree
- Linked List
- Stack & Queue
- Heap

### 🎮 Interactive Features
- ⏯️ **Play/Pause Controls**: Control algorithm execution speed
- 🎚️ **Speed Adjustment**: Slow down or speed up visualizations
- 📊 **Real-time Metrics**: Track comparisons, swaps, and time
- 🔄 **Algorithm Racing**: Compare multiple algorithms side-by-side
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🌙 **Dark Theme**: Beautiful dark mode interface

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **Shadcn/UI** | Component Library |
| **Framer Motion** | Animations |
| **Zustand** | State Management |
| **React Router** | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| **Java 17** | Programming Language |
| **Spring Boot 3.2** | Application Framework |
| **Spring Web** | REST API |
| **Maven** | Build & Dependency Management |
| **JUnit 5** | Testing |
| **OpenAPI/Swagger** | API Documentation |
| **Spring Actuator** | Monitoring & Health Checks |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend Hosting |
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD Pipeline |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│   React + TypeScript + Tailwind CSS + Framer Motion + Zustand   │
│                                                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│   │   Pages     │  │ Components  │  │    State Management     │ │
│   │ - Dashboard │  │ - Visualizer│  │ - algorithmStore        │ │
│   │ - Sorting   │  │ - Controls  │  │ - graphStore            │ │
│   │ - Graph     │  │ - Panels    │  │ - dpStore               │ │
│   │ - DP        │  │ - UI        │  │ - pathfindingStore      │ │
│   └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP/REST API
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │   Controllers   │  │    Services     │  │  Data Structures│ │
│   │ - Sorting       │  │ - BubbleSort    │  │ - Graph.java    │ │
│   │ - Graph         │  │ - QuickSort     │  │ - MinHeap.java  │ │
│   │ - DP            │  │ - BFS/DFS       │  │ - DisjointSet   │ │
│   │ - Health        │  │ - Dijkstra      │  │                 │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                    Config & Monitoring                           │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │   CORS Config   │  │    OpenAPI      │  │    Actuator     │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.6+ (or use included Maven wrapper)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/divyaa026/Algorithm-Visualizer-.git
   cd Algorithm-Visualizer-
   ```

2. **Start the Backend**
   ```bash
   cd backend
   
   # On Windows - Set JAVA_HOME if needed
   set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
   
   # Run with Maven wrapper
   ./mvnw spring-boot:run    # Linux/Mac
   mvnw.cmd spring-boot:run  # Windows
   ```
   Backend will be available at `http://localhost:8080`

3. **Start the Frontend**
   ```bash
   cd algo-canvas
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Using Docker (Alternative)

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
Algorithm-Visualizer-/
│
├── 📂 algo-canvas/                    # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 controls/           # Algorithm control panels
│   │   │   ├── 📂 layout/             # Page layouts, navbar, sidebar
│   │   │   ├── 📂 panels/             # Code panel, stats panel
│   │   │   ├── 📂 ui/                 # Reusable UI components (Shadcn)
│   │   │   └── 📂 visualization/      # Algorithm visualizers
│   │   ├── 📂 hooks/                  # Custom React hooks
│   │   ├── 📂 pages/                  # Page components
│   │   ├── 📂 store/                  # Zustand state stores
│   │   └── 📂 lib/                    # Utility functions
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── 📂 backend/                         # Spring Boot Backend
│   ├── 📂 src/main/java/com/algoviz/
│   │   ├── 📂 algorithms/
│   │   │   ├── 📂 sorting/            # Sorting algorithm services
│   │   │   ├── 📂 graph/              # Graph algorithm services
│   │   │   └── 📂 dp/                 # DP algorithm services
│   │   ├── 📂 controller/             # REST API controllers
│   │   ├── 📂 model/                  # Request/Response models
│   │   ├── 📂 datastructures/         # Custom data structures
│   │   ├── 📂 config/                 # App configuration
│   │   └── 📂 exception/              # Global exception handling
│   ├── 📂 src/test/                   # Unit & integration tests
│   ├── pom.xml
│   └── Dockerfile
│
├── 📂 .github/workflows/              # CI/CD pipelines
├── docker-compose.yml
└── README.md
```

---

## 📡 API Documentation

### Base URL
- **Local Development**: `http://localhost:8080`

### REST Endpoints

#### Sorting Algorithms
```http
POST /api/sorting/bubble
POST /api/sorting/quick
POST /api/sorting/merge
POST /api/sorting/insertion
```

**Request Body:**
```json
{
  "array": [64, 34, 25, 12, 22, 11, 90]
}
```

**Response:**
```json
{
  "sortedArray": [11, 12, 22, 25, 34, 64, 90],
  "steps": [
    {
      "type": "compare",
      "indices": [0, 1],
      "description": "Comparing elements at index 0 and 1"
    }
  ],
  "metrics": {
    "comparisons": 21,
    "swaps": 15,
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)"
  }
}
```

#### Graph Algorithms
```http
POST /api/graph/bfs
POST /api/graph/dfs
POST /api/graph/dijkstra
POST /api/graph/kruskal
```

#### Dynamic Programming
```http
GET  /api/dp/fibonacci/{n}
POST /api/dp/knapsack
POST /api/dp/lcs
```

#### Health & Monitoring
```http
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
```

### Interactive API Docs
Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Go to [Vercel](https://vercel.com) and import your GitHub repository**

2. **Configure Build Settings:**
   | Setting | Value |
   |---------|-------|
   | Root Directory | `algo-canvas` |
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

3. **Deploy** - Vercel will automatically deploy on every push to main branch

### Backend Deployment Options

#### Option 1: Railway
1. Connect your GitHub repository
2. Set root directory to `backend`
3. Railway will auto-detect Spring Boot

#### Option 2: Render
1. Create new Web Service
2. Connect repository, set root to `backend`
3. Build Command: `./mvnw clean package -DskipTests`
4. Start Command: `java -jar target/*.jar`

#### Option 3: Docker
```bash
cd backend
docker build -t algorithm-visualizer-api .
docker run -p 8080:8080 algorithm-visualizer-api
```

---

## 🎯 Key Technical Highlights

### For Recruiters & Hiring Managers

| Skill Area | Demonstrated Competency |
|------------|------------------------|
| **Full-Stack Development** | Complete end-to-end implementation with React frontend and Spring Boot backend |
| **Modern Tech Stack** | Industry-standard technologies used by top companies |
| **Clean Architecture** | Well-organized codebase following SOLID principles |
| **Type Safety** | TypeScript on frontend, strong typing in Java backend |
| **State Management** | Efficient state handling with Zustand |
| **RESTful API Design** | Proper HTTP methods, status codes, and response structures |
| **Documentation** | OpenAPI/Swagger for API documentation |
| **Testing** | Unit tests with JUnit 5 |
| **DevOps** | Docker containerization, CI/CD pipelines |
| **Performance** | Optimized rendering, debounced updates, smooth animations |
| **Responsive Design** | Mobile-first approach, works on all screen sizes |
| **Algorithm Knowledge** | Deep understanding of DSA through implementations |

### Code Quality Practices
- ✅ Component-based architecture
- ✅ Custom hooks for reusable logic
- ✅ Centralized state management
- ✅ Error boundaries and graceful error handling
- ✅ Consistent code formatting (ESLint, Prettier)
- ✅ Git workflow with meaningful commits

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

### Divya

[![GitHub](https://img.shields.io/badge/GitHub-divyaa026-181717?style=for-the-badge&logo=github)](https://github.com/divyaa026)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/divyabhatt026/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you found it helpful! ⭐

**Built with ❤️ for algorithm enthusiasts and learners worldwide**

</div>
