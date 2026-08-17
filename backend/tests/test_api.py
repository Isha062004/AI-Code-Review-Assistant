"""
Unit tests for FastAPI endpoints, AST analyzer, and LLM engine.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_sample_repos():
    response = client.get("/api/sample-repos")
    assert response.status_code == 200
    data = response.json()
    assert "python_fib_n1" in data
    assert "js_async_memory" in data

def test_static_analysis_python():
    payload = {
        "code": "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n",
        "filename": "fib.py",
        "language": "python"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["language"] == "python"
    assert res["cyclomatic_complexity"] >= 2
    assert "ast_tree" in res

def test_code_optimization():
    payload = {
        "code": "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n",
        "language": "python",
        "target_goal": "performance"
    }
    response = client.post("/api/optimize", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "lru_cache" in res["optimized_code"] or "iterative" in res["optimized_code"]
    assert "diff" in res

def test_complexity_analysis():
    payload = {
        "code": "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n",
        "language": "python"
    }
    response = client.post("/api/complexity", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "2^N" in res["time_complexity"] or "O(" in res["time_complexity"]

def test_unit_test_generation():
    payload = {
        "code": "def add(a, b): return a + b\n",
        "language": "python",
        "test_framework": "pytest"
    }
    response = client.post("/api/generate-tests", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "pytest" in res["framework"]
    assert "def test_" in res["test_code"]

def test_pr_review():
    payload = {
        "repo_url": "https://github.com/myorg/myapp",
        "pr_number": 101,
        "files": []
    }
    response = client.post("/api/pr-review", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "PR #101" in res["title"]
    assert res["score"] >= 0

def test_analysis_history():
    # Run analysis first to populate DB
    client.post("/api/analyze", json={"code": "x = 10", "filename": "test.py", "language": "python"})
    
    # Query history
    response = client.get("/api/history")
    assert response.status_code == 200
    history = response.json()
    assert isinstance(history, list)
    assert len(history) > 0
    
    item_id = history[0]["id"]
    detail_res = client.get(f"/api/history/{item_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["filename"] == "test.py" or "filename" in detail_res.json()

