import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, ChevronRight, ChevronDown, Cpu, Activity, Gauge } from 'lucide-react';

export default function StaticAnalysisView({ analysisResult }) {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  if (!analysisResult) {
    return (
      <div className="glass-panel p-8 text-center text-gray-400">
        <ShieldAlert className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-semibold text-gray-200">No Static Analysis Results Yet</h3>
        <p className="text-xs text-gray-500 mt-1">Run AST Analysis on your source code to view Tree-sitter AST nodes, bugs, and security smells.</p>
      </div>
    );
  }

  const { metrics, issues, ast_tree, maintainability_index, cyclomatic_complexity } = analysisResult;

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllNodes = (node, depth = 0, path = "root") => {
    if (!node) return {};
    const nodeId = `${path}-${node.name}-${depth}`;
    let map = { [nodeId]: true };
    if (node.children) {
      node.children.forEach((c, i) => {
        Object.assign(map, expandAllNodes(c, depth + 1, `${nodeId}-${i}`));
      });
    }
    return map;
  };

  const handleExpandAll = () => {
    setExpandedNodes(expandAllNodes(ast_tree));
  };

  const handleCollapseAll = () => {
    setExpandedNodes({});
  };

  // Helper to render tree node recursively
  const renderASTNode = (node, depth = 0, path = "root") => {
    if (!node) return null;
    const nodeId = `${path}-${node.name}-${depth}`;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[nodeId];

    if (searchTerm) {
      const matches = node.name?.toLowerCase().includes(searchTerm.toLowerCase()) || node.type?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matches && !hasChildren) return null;
    }

    return (
      <div key={nodeId} className="ml-4 my-1 font-mono text-xs">
        <div
          onClick={() => hasChildren && toggleNode(nodeId)}
          className={`flex items-center gap-2 py-1 px-2.5 rounded-md cursor-pointer transition-colors ${
            hasChildren ? 'hover:bg-gray-800/80 text-indigo-300' : 'text-gray-400'
          }`}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <span className="w-3.5 h-3.5 inline-block text-center text-gray-600">•</span>
          )}
          <span className="font-semibold text-gray-200">{node.name}</span>
          <span className="text-[10px] text-gray-500 bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded">
            {node.type}
          </span>
          {node.line && <span className="text-[10px] text-gray-600">Line {node.line}</span>}
        </div>

        {hasChildren && (isExpanded || searchTerm) && (
          <div className="border-l border-indigo-900/40 ml-2.5 pl-1">
            {node.children.map((child, idx) => renderASTNode(child, depth + 1, `${nodeId}-${idx}`))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Cards Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Maintainability Index Card */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Maintainability Index</p>
            <h4 className={`text-2xl font-bold mt-1 ${maintainability_index >= 70 ? 'text-emerald-400' : maintainability_index >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
              {maintainability_index} / 100
            </h4>
            <p className="text-[10px] text-gray-500 mt-1">Higher is better maintainability</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center">
            <Gauge className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Cyclomatic Complexity Card */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cyclomatic Complexity</p>
            <h4 className={`text-2xl font-bold mt-1 ${cyclomatic_complexity <= 5 ? 'text-emerald-400' : cyclomatic_complexity <= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
              V(G) = {cyclomatic_complexity}
            </h4>
            <p className="text-[10px] text-gray-500 mt-1">Decision branches count</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Total Issues Card */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Detected Code Smells</p>
            <h4 className="text-2xl font-bold text-amber-400 mt-1">{issues.length}</h4>
            <p className="text-[10px] text-gray-500 mt-1">Bugs, Security & Performance</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-950/50 border border-amber-800/50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Security Vulnerabilities */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Security Risks</p>
            <h4 className="text-2xl font-bold text-rose-400 mt-1">{metrics.issue_counts?.high || 0}</h4>
            <p className="text-[10px] text-gray-500 mt-1">High Severity Flaws</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left (Issues List) | Right (AST Tree Explorer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Code Smells & Bugs List */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Detected Bugs, Smells & Security Flaws ({issues.length})
            </h3>
          </div>

          {issues.length === 0 ? (
            <div className="p-6 text-center text-emerald-400 font-mono text-xs">
              ✅ Clean Codebase! No AST code smells or security flaws detected.
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {issues.map((issue, idx) => (
                <div key={idx} className="glass-card p-3.5 border-l-4 border-l-amber-500">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-semibold text-gray-200 flex items-center gap-2">
                      <span className="text-indigo-400">Line {issue.line}:</span>
                      {issue.rule}
                    </span>

                    <span className={
                      issue.severity === 'high' ? 'pulse-badge-red' :
                      issue.severity === 'medium' ? 'pulse-badge-amber' : 'pulse-badge-indigo'
                    }>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 font-sans mb-2">{issue.message}</p>

                  <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800/80 font-mono text-[11px] text-emerald-300 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-gray-400">Suggested Fix:</strong> {issue.suggestion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Tree-sitter / AST Node Explorer */}
        <div className="glass-panel p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              AST Tree Hierarchy Explorer
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter AST nodes..."
                className="bg-gray-900 border border-gray-800 text-[11px] font-mono text-gray-200 px-2.5 py-1 rounded focus:border-indigo-500 focus:outline-none w-36"
              />
              <button
                onClick={handleExpandAll}
                className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 hover:bg-indigo-900/80 px-2 py-1 rounded cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="text-[10px] font-mono text-gray-400 bg-gray-900 border border-gray-800 hover:bg-gray-800 px-2 py-1 rounded cursor-pointer"
              >
                Collapse
              </button>
            </div>
          </div>

          <div className="flex-1 bg-gray-950/90 p-4 rounded-xl border border-gray-800 overflow-y-auto max-h-[460px]">
            {renderASTNode(ast_tree)}
          </div>
        </div>
      </div>
    </div>
  );
}
