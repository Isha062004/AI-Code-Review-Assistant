# AI Code Review & Debugging Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1.svg?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)
[![Pytest](https://img.shields.io/badge/Pytest-Passed-success.svg?style=flat&logo=pytest)](https://docs.pytest.org/)

An enterprise-grade developer tool integrating GitHub repositories for automated static code analysis, Abstract Syntax Tree (AST) node parsing, bug detection, and code smell identification. Leverages LLM capabilities to suggest intelligent code optimizations, explain algorithm time/space complexity with mathematical derivations, and automatically generate unit test suites and PR reviews.

---

## Key Features

1. **Tree-sitter & AST Static Analysis Engine**:
   - Parses code into Abstract Syntax Tree (AST) node hierarchies across Python, JavaScript/TypeScript, C++, Java, Go, and SQL.
   - Calculates **Cyclomatic Complexity $V(G)$** and **Maintainability Index (0-100)**.
   - Detects code smells (bare excepts, high parameter counts, unhandled promise rejections, memory leaks via raw pointers, SQL injection risks, and N+1 query loops).

2. **AI Code Optimization & Side-by-Side Diff Visualizer**:
   - Refactors inefficient code (e.g. converting exponential recursive Fibonacci $O(2^N)$ to Memoization/Iterative DP $O(N)$ or set-based lookups).
   - Computes performance speedup percentage and memory allocation savings.
   - Generates unified git diff comparisons.

3. **Algorithm Time & Space Complexity Visualizer**:
   - Asymptotic Big-O bounds derivation ($O(1), O(N), O(N^2), O(2^N), O(\log N)$).
   - Recurrence relations $T(N) = T(N-1) + T(N-2)$ and mathematical induction breakdowns.
   - Interactive execution graph scaling across input sizes $N \in [10, 5000]$.

4. **Automated Unit Test Generator**:
   - Synthesizes complete test suites targeting Edge Cases, Happy Path, and Exception Boundaries.
   - Supports **Pytest**, **Unittest**, **Vitest/Jest**, and **JUnit 5**.

5. **Automated GitHub PR Code Reviewer**:
   - Scans repository pull request diff patches and assigns automated Quality Scores (0-100).
   - Generates inline line-by-line review comments with severity labels (`CRITICAL`, `WARNING`, `INFO`).
   - Produces merge recommendations (`APPROVED` vs `CHANGES_REQUESTED`).

6. **Interactive Context-Aware AI Debugger**:
   - Real-time chat assistant aware of active Code Studio context.
   - Quick-action pills ("Fix Bugs", "Explain Code", "Optimize Algorithm").

---

## Tech Stack

- **Backend**: FastAPI, Python 3.12, AST Parser, SQLAlchemy, Pytest, Uvicorn
- **Frontend**: React (Vite), Lucide Icons, Glassmorphism Cyber-Luxe CSS
- **Database**: PostgreSQL 15 (with automatic SQLite fallback)
- **Containerization**: Docker & Docker Compose

---

## Quick Start (Local Run)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`. Interactive API Docs (Swagger UI) at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend app will open at `http://localhost:5173`.

---

## Running with Docker Compose

To launch FastAPI, React, and PostgreSQL in Docker containers:

```bash
docker-compose up --build
```

- **Frontend App**: `http://localhost:3000`
- **FastAPI API**: `http://localhost:8000`
- **PostgreSQL Database**: `localhost:5432`

---

## Running Unit Tests

```bash
cd backend
python -m pytest tests/test_api.py
```

All 7 unit tests pass 100%.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI endpoints & CORS
│   │   ├── ast_analyzer.py  # AST parser & code smells engine
│   │   ├── llm_engine.py    # AI optimization, complexity, tests, PR reviews
│   │   ├── models.py        # SQLAlchemy & Pydantic models
│   │   ├── database.py      # Postgres & SQLite connection
│   │   └── sample_repos.py  # Sample multi-language code snippets
│   ├── tests/
│   │   └── test_api.py      # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CodeEditorPanel.jsx
│   │   │   ├── StaticAnalysisView.jsx
│   │   │   ├── OptimizationDiffView.jsx
│   │   │   ├── ComplexityView.jsx
│   │   │   ├── UnitTestGenerator.jsx
│   │   │   ├── PRReviewer.jsx
│   │   │   └── AIDebuggerChat.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
