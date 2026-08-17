"""
SQLAlchemy and Pydantic models for AI Code Review & Debugging Assistant.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float, create_engine
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# --- SQLAlchemy Database Models ---

class DBCodeAnalysis(Base):
    __tablename__ = "code_analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    language = Column(String)
    code_content = Column(Text)
    cyclomatic_complexity = Column(Integer, default=1)
    bugs_detected = Column(JSON, default=list)
    code_smells = Column(JSON, default=list)
    security_vulnerabilities = Column(JSON, default=list)
    ast_summary = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DBPRReview(Base):
    __tablename__ = "pr_reviews"

    id = Column(Integer, primary_key=True, index=True)
    repo_name = Column(String)
    pr_number = Column(Integer)
    title = Column(String)
    author = Column(String)
    status = Column(String, default="APPROVED")
    summary = Column(Text)
    comments = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# --- Pydantic Request & Response Schemas ---

class CodeAnalysisRequest(BaseModel):
    code: str
    filename: Optional[str] = "main.py"
    language: str = "python"
    api_key: Optional[str] = None

class CodeSmellItem(BaseModel):
    line: int
    rule: str
    severity: str  # 'high', 'medium', 'low'
    message: str
    category: str  # 'bug', 'smell', 'security', 'performance'
    suggestion: str

class ASTNodeInfo(BaseModel):
    id: str
    type: str
    name: str
    line: int
    col: int
    children: List[Dict[str, Any]] = []

class StaticAnalysisResult(BaseModel):
    filename: str
    language: str
    loc: int
    cyclomatic_complexity: int
    maintainability_index: float
    issues: List[CodeSmellItem]
    ast_tree: Dict[str, Any]
    metrics: Dict[str, Any]

class OptimizationRequest(BaseModel):
    code: str
    language: str = "python"
    target_goal: str = "performance"  # 'performance', 'readability', 'security', 'memory'
    api_key: Optional[str] = None

class OptimizationResponse(BaseModel):
    original_code: str
    optimized_code: str
    explanation: str
    performance_gain: str
    memory_savings: str
    diff: str
    key_changes: List[str]

class ComplexityRequest(BaseModel):
    code: str
    language: str = "python"

class ComplexityResponse(BaseModel):
    time_complexity: str
    space_complexity: str
    mathematical_derivation: str
    explanation: str
    benchmark_data: List[Dict[str, Any]]
    recommendations: List[str]

class UnitTestRequest(BaseModel):
    code: str
    language: str = "python"
    test_framework: Optional[str] = "pytest"

class UnitTestResponse(BaseModel):
    test_code: str
    framework: str
    test_cases_count: int
    coverage_estimate: str
    instructions: str

class PRReviewRequest(BaseModel):
    repo_url: Optional[str] = "https://github.com/example/demo-repo"
    pr_number: Optional[int] = 42
    files: List[Dict[str, str]] = []  # list of {'filename': str, 'patch': str, 'content': str}

class PRReviewComment(BaseModel):
    filename: str
    line: int
    side: str = "RIGHT"
    comment: str
    severity: str
    suggested_fix: Optional[str] = None

class PRReviewResponse(BaseModel):
    title: str
    author: str
    status: str
    summary: str
    comments: List[PRReviewComment]
    score: int  # 0 to 100
    approval_recommendation: str

class DebugChatRequest(BaseModel):
    message: str
    code_context: str
    language: str = "python"
    chat_history: List[Dict[str, str]] = []
    api_key: Optional[str] = None

class DebugChatResponse(BaseModel):
    reply: str
    suggested_code: Optional[str] = None
    action_type: str = "explanation"  # 'fix', 'refactor', 'explanation', 'general'
