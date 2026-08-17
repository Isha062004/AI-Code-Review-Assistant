"""
AST & Static Code Analysis Engine.
Implements Python AST parsing and regex-driven multi-language AST tree construction and bug detection.
"""

import ast
import re
import math
from typing import List, Dict, Any
from app.models import StaticAnalysisResult, CodeSmellItem

class StaticCodeAnalyzer:
    def __init__(self):
        pass

    def analyze(self, code: str, filename: str = "main.py", language: str = "python") -> StaticAnalysisResult:
        language = language.lower().strip()
        lines = code.split('\n')
        loc = len(lines)

        issues: List[CodeSmellItem] = []
        ast_tree: Dict[str, Any] = {}
        cyclomatic_complexity = 1

        if language == "python":
            ast_tree, cyclomatic_complexity, python_issues = self._analyze_python_ast(code)
            issues.extend(python_issues)
        else:
            ast_tree, cyclomatic_complexity, generic_issues = self._analyze_generic_ast(code, language)
            issues.extend(generic_issues)

        # Additional cross-language heuristic static analysis checks
        heuristic_issues = self._run_security_and_smell_checks(code, lines, language)
        issues.extend(heuristic_issues)

        # Remove duplicate issues on the same line with same message
        unique_issues = []
        seen = set()
        for issue in issues:
            key = (issue.line, issue.category, issue.message)
            if key not in seen:
                seen.add(key)
                unique_issues.append(issue)

        # Maintainability Index Calculation
        # MI = max(0, (171 - 5.2 * ln(Halstead Volume) - 0.23 * CC - 16.2 * ln(LOC)) * 100 / 171)
        loc_val = max(1, loc)
        halstead_est = loc_val * 3.5  # estimate
        mi = max(0.0, min(100.0, 171.0 - (5.2 * math.log(max(1, halstead_est))) - (0.23 * cyclomatic_complexity) - (16.2 * math.log(loc_val))))
        maintainability_index = round((mi / 171.0) * 100, 1)

        metrics = {
            "total_lines": loc,
            "code_lines": sum(1 for line in lines if line.strip() and not line.strip().startswith('#') and not line.strip().startswith('//')),
            "comment_lines": sum(1 for line in lines if line.strip().startswith('#') or line.strip().startswith('//')),
            "cyclomatic_complexity": cyclomatic_complexity,
            "maintainability_index": maintainability_index,
            "issue_counts": {
                "high": sum(1 for i in unique_issues if i.severity == "high"),
                "medium": sum(1 for i in unique_issues if i.severity == "medium"),
                "low": sum(1 for i in unique_issues if i.severity == "low"),
            }
        }

        return StaticAnalysisResult(
            filename=filename,
            language=language,
            loc=loc,
            cyclomatic_complexity=cyclomatic_complexity,
            maintainability_index=maintainability_index,
            issues=unique_issues,
            ast_tree=ast_tree,
            metrics=metrics
        )

    def _analyze_python_ast(self, code: str):
        issues: List[CodeSmellItem] = []
        cyclomatic_complexity = 1

        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            issues.append(CodeSmellItem(
                line=e.lineno or 1,
                rule="SyntaxError",
                severity="high",
                message=f"Syntax Error: {e.msg}",
                category="bug",
                suggestion="Fix invalid syntax before static analysis."
            ))
            return {"name": "Module", "type": "Error", "children": []}, 1, issues

        # Measure cyclomatic complexity by counting decision nodes
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.For, ast.While, ast.And, ast.Or, ast.ExceptHandler, ast.With, ast.Assert)):
                cyclomatic_complexity += 1

            # Detect dangerous eval/exec
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                if node.func.id in ["eval", "exec"]:
                    issues.append(CodeSmellItem(
                        line=getattr(node, 'lineno', 1),
                        rule="DangerousFunctionUse",
                        severity="high",
                        message=f"Use of dangerous function '{node.func.id}' detected.",
                        category="security",
                        suggestion=f"Avoid using '{node.func.id}' due to remote code execution risk."
                    ))

            # Detect bare except clauses
            if isinstance(node, ast.ExceptHandler):
                if node.type is None:
                    issues.append(CodeSmellItem(
                        line=node.lineno,
                        rule="BareExcept",
                        severity="medium",
                        message="Bare 'except:' clause catches all exceptions including SystemExit.",
                        category="smell",
                        suggestion="Specify explicit exception type like 'except Exception as e:'"
                    ))

            # Detect functions with too many arguments (> 5)
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                args_count = len(node.args.args)
                if args_count > 5:
                    issues.append(CodeSmellItem(
                        line=node.lineno,
                        rule="TooManyArguments",
                        severity="medium",
                        message=f"Function '{node.name}' has {args_count} parameters (max recommended: 5).",
                        category="smell",
                        suggestion="Refactor parameters into a Dataclass or dictionary wrapper."
                    ))

        # Convert Python AST to visual JSON tree
        def _convert_node(node):
            node_name = type(node).__name__
            children = []

            for field, value in ast.iter_fields(node):
                if isinstance(value, list):
                    for item in value:
                        if isinstance(item, ast.AST):
                            children.append(_convert_node(item))
                elif isinstance(value, ast.AST):
                    children.append(_convert_node(value))

            label = node_name
            if isinstance(node, ast.FunctionDef):
                label = f"FunctionDef({node.name})"
            elif isinstance(node, ast.ClassDef):
                label = f"ClassDef({node.name})"
            elif isinstance(node, ast.Name):
                label = f"Name({node.id})"
            elif isinstance(node, ast.Constant):
                label = f"Constant({value})"

            return {
                "name": label,
                "type": node_name,
                "line": getattr(node, 'lineno', 1),
                "children": children[:10]  # prune deep trees for UI performance
            }

        ast_tree_json = _convert_node(tree)
        return ast_tree_json, cyclomatic_complexity, issues

    def _analyze_generic_ast(self, code: str, language: str):
        """Constructs an AST representation for JS/TS/C++/Java/Go using structural regex parsing."""
        issues: List[CodeSmellItem] = []
        cyclomatic_complexity = 1
        lines = code.split('\n')

        # Count decision structures for cyclomatic complexity
        cc_keywords = ['if', 'else if', 'for', 'while', 'catch', 'case', '&&', '||', '?']
        for line in lines:
            for kw in cc_keywords:
                if kw in line:
                    cyclomatic_complexity += line.count(kw)

        root_children = []

        # Find functions / methods
        func_patterns = {
            "javascript": r'function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*\(',
            "typescript": r'function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*\(',
            "cpp": r'(?:[a-zA-Z0-9_<>]+)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{',
            "java": r'(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{',
            "go": r'func\s+(?:\([^\)]+\)\s+)?([a-zA-Z0-9_]+)'
        }

        pattern = func_patterns.get(language, r'function\s+([a-zA-Z0-9_]+)')

        for idx, line in enumerate(lines, 1):
            matches = re.findall(pattern, line)
            for m in matches:
                name = m if isinstance(m, str) else (m[0] or m[1])
                if name and name not in ['if', 'while', 'for', 'switch']:
                    root_children.append({
                        "name": f"Function({name})",
                        "type": "FunctionDeclaration",
                        "line": idx,
                        "children": []
                    })

        ast_tree = {
            "name": f"Program({language.capitalize()})",
            "type": "Program",
            "line": 1,
            "children": root_children
        }

        return ast_tree, cyclomatic_complexity, issues

    def _run_security_and_smell_checks(self, code: str, lines: List[str], language: str) -> List[CodeSmellItem]:
        issues = []

        for idx, line in enumerate(lines, 1):
            stripped = line.strip()

            # Hardcoded API keys / credentials check
            if re.search(r'(api_key|secret|password|auth_token)\s*=\s*["\'][A-Za-z0-9_\-]{16,}["\']', stripped, re.IGNORECASE):
                issues.append(CodeSmellItem(
                    line=idx,
                    rule="HardcodedSecret",
                    severity="high",
                    message="Possible hardcoded secret or API credential detected.",
                    category="security",
                    suggestion="Move sensitive tokens into environment variables or secrets manager."
                ))

            # SQL Injection via string formatting
            if re.search(r'SELECT|INSERT|UPDATE|DELETE', stripped, re.IGNORECASE):
                if '+' in stripped or '%' in stripped or f'f"' in stripped or f"f'" in stripped:
                    issues.append(CodeSmellItem(
                        line=idx,
                        rule="SQLInjectionRisk",
                        severity="high",
                        message="Potential SQL Injection vulnerability via string concatenation.",
                        category="security",
                        suggestion="Use parameterized queries or ORM query bindings."
                    ))

            # N+1 Query in Loop (e.g. executing queries inside for loops)
            if any(loop_kw in stripped for loop_kw in ['for ', 'while ', '.map(', '.forEach(']):
                # Check surrounding lines for database calls
                sub_snippet = "\n".join(lines[idx-1:idx+6])
                if re.search(r'db\.query|objects\.get|SELECT|\.execute\(', sub_snippet, re.IGNORECASE):
                    issues.append(CodeSmellItem(
                        line=idx,
                        rule="NPlusOneQuery",
                        severity="high",
                        message="N+1 Database query anti-pattern detected inside iteration loop.",
                        category="performance",
                        suggestion="Batch query outside loop using IN clause or eager loading (JOIN)."
                    ))

            # Memory Leak in C++ / JS (unreleased listeners, raw new without delete or unclosed connections)
            if 'new ' in stripped and 'delete ' not in code and language in ['cpp', 'c']:
                issues.append(CodeSmellItem(
                    line=idx,
                    rule="PotentialMemoryLeak",
                    severity="high",
                    message="Manual heap memory allocation 'new' without corresponding 'delete'.",
                    category="bug",
                    suggestion="Use smart pointers (std::unique_ptr, std::shared_ptr) or RAII wrappers."
                ))

            # Unhandled Promise / Async catch in JS/TS
            if language in ['javascript', 'typescript'] and 'async' in stripped and 'try' not in code and 'catch' not in code:
                issues.append(CodeSmellItem(
                    line=idx,
                    rule="UnhandledPromiseRejection",
                    severity="medium",
                    message="Async function missing try/catch error boundary.",
                    category="bug",
                    suggestion="Wrap asynchronous operations in try/catch or append .catch() handlers."
                ))

            # Long Line Smell (> 120 chars)
            if len(line) > 130:
                issues.append(CodeSmellItem(
                    line=idx,
                    rule="LineTooLong",
                    severity="low",
                    message=f"Line exceeds recommended width ({len(line)} > 120 chars).",
                    category="smell",
                    suggestion="Break line into multi-line formatting for better readability."
                ))

        return issues
