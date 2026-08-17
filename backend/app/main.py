"""
FastAPI Main Entrypoint for AI Code Review & Debugging Assistant.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.models import (
    CodeAnalysisRequest, StaticAnalysisResult,
    OptimizationRequest, OptimizationResponse,
    ComplexityRequest, ComplexityResponse,
    UnitTestRequest, UnitTestResponse,
    PRReviewRequest, PRReviewResponse,
    DebugChatRequest, DebugChatResponse,
    DBCodeAnalysis
)
from app.ast_analyzer import StaticCodeAnalyzer
from app.llm_engine import LLMEngine
from app.sample_repos import SAMPLE_SNIPPETS
from app.database import init_db, get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="AI Code Review & Debugging Assistant API",
    description="Automated static analysis, AST code smells detection, LLM code optimizations, Big-O complexity, unit test generation, and GitHub PR reviews.",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = StaticCodeAnalyzer()
llm = LLMEngine()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Code Review Assistant", "version": "2.0.0"}

@app.get("/api/sample-repos")
def get_sample_repos():
    return SAMPLE_SNIPPETS

@app.post("/api/analyze", response_model=StaticAnalysisResult)
def analyze_code(req: CodeAnalysisRequest, db: Session = Depends(get_db)):
    """Runs AST parsing & static analysis to detect cyclomatic complexity and code smells."""
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")
    
    result = analyzer.analyze(req.code, filename=req.filename or "main.py", language=req.language)

    # Save analysis audit record to database
    try:
        record = DBCodeAnalysis(
            filename=result.filename,
            language=result.language,
            code_content=req.code,
            cyclomatic_complexity=result.cyclomatic_complexity,
            bugs_detected=[i.model_dump() for i in result.issues if i.category == 'bug'],
            code_smells=[i.model_dump() for i in result.issues if i.category == 'smell'],
            security_vulnerabilities=[i.model_dump() for i in result.issues if i.category == 'security'],
            ast_summary=result.ast_tree
        )
        db.add(record)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Warning: Database save failed: {e}")

    return result

@app.post("/api/optimize", response_model=OptimizationResponse)
def optimize_code(req: OptimizationRequest):
    """Generates AI code refactoring with unified diff and performance metrics."""
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")
    return llm.optimize_code(req.code, req.language, req.target_goal, req.api_key)

@app.post("/api/complexity", response_model=ComplexityResponse)
def analyze_complexity(req: ComplexityRequest):
    """Calculates Big-O Time & Space complexity with recurrence relations."""
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")
    return llm.analyze_complexity(req.code, req.language)

@app.post("/api/generate-tests", response_model=UnitTestResponse)
def generate_unit_tests(req: UnitTestRequest):
    """Generates automated unit test suites for edge cases & happy path."""
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")
    return llm.generate_unit_tests(req.code, req.language, req.test_framework)

@app.post("/api/pr-review", response_model=PRReviewResponse)
def review_pull_request(req: PRReviewRequest):
    """Generates GitHub PR Code Review with inline patch comments."""
    return llm.generate_pr_review(req.repo_url or "https://github.com/example/demo-repo", req.pr_number or 42, req.files)

@app.post("/api/chat", response_model=DebugChatResponse)
def chat_debug(req: DebugChatRequest):
    """Context-aware AI Debugging Chat Assistant."""
    return llm.chat_debug(req.message, req.code_context, req.language, req.chat_history)

@app.get("/api/history")
def get_analysis_history(db: Session = Depends(get_db)):
    """Retrieves list of past analysis audit logs from database."""
    records = db.query(DBCodeAnalysis).order_by(DBCodeAnalysis.id.desc()).limit(50).all()
    history = []
    for r in records:
        history.append({
            "id": r.id,
            "filename": r.filename,
            "language": r.language,
            "cyclomatic_complexity": r.cyclomatic_complexity,
            "bugs_count": len(r.bugs_detected or []),
            "smells_count": len(r.code_smells or []),
            "security_count": len(r.security_vulnerabilities or []),
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
    return history

@app.get("/api/history/{analysis_id}")
def get_analysis_detail(analysis_id: int, db: Session = Depends(get_db)):
    """Retrieves full audit log detail by ID."""
    record = db.query(DBCodeAnalysis).filter(DBCodeAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return {
        "id": record.id,
        "filename": record.filename,
        "language": record.language,
        "code_content": record.code_content,
        "cyclomatic_complexity": record.cyclomatic_complexity,
        "bugs_detected": record.bugs_detected,
        "code_smells": record.code_smells,
        "security_vulnerabilities": record.security_vulnerabilities,
        "ast_summary": record.ast_summary,
        "created_at": record.created_at.isoformat() if record.created_at else None
    }

@app.delete("/api/history/{analysis_id}")
def delete_analysis_record(analysis_id: int, db: Session = Depends(get_db)):
    """Deletes an analysis record by ID."""
    record = db.query(DBCodeAnalysis).filter(DBCodeAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    db.delete(record)
    db.commit()
    return {"status": "deleted", "id": analysis_id}

