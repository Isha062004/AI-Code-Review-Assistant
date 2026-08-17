import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Database, Copy, Check } from 'lucide-react';

export default function OptimizationDiffView({ optimizationResult, onOptimize, isLoading }) {
  const [copied, setCopied] = useState(false);

  if (!optimizationResult) {
    return (
      <div className="glass-panel p-8 text-center text-gray-400">
        <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-semibold text-gray-200">AI Code Optimization Engine</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4">Click below to generate intelligent refactoring, unified diff, and performance metrics.</p>
        <button
          onClick={onOptimize}
          disabled={isLoading}
          className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Optimization
        </button>
      </div>
    );
  }

  const { original_code, optimized_code, explanation, performance_gain, memory_savings, diff, key_changes } = optimizationResult;

  const copyCode = () => {
    navigator.clipboard.writeText(optimized_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Benchmark Badges Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Speedup Gain</p>
            <p className="text-lg font-bold text-emerald-400">{performance_gain}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Memory Reduction</p>
            <p className="text-lg font-bold text-indigo-400">{memory_savings}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Action</p>
            <p className="text-xs text-gray-300">Copy Refactored Code</p>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Side-by-side Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Code */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Original Unoptimized Code
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Before AI Refactor</span>
          </div>

          <pre className="flex-1 bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs font-mono text-gray-300 overflow-x-auto leading-6">
            {original_code}
          </pre>
        </div>

        {/* AI Optimized Code */}
        <div className="glass-panel p-4 flex flex-col border border-emerald-500/30">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              AI Refactored & Optimized Code
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Recommended Fix</span>
          </div>

          <pre className="flex-1 bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-6">
            {optimized_code}
          </pre>
        </div>
      </div>

      {/* Key Architectural Refactorings & Unified Diff */}
      <div className="glass-panel p-5">
        <h4 className="text-sm font-bold text-gray-100 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Key Refactoring Breakdown & Structural Improvements
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {key_changes.map((change, idx) => (
            <div key={idx} className="glass-card p-3 flex items-start gap-2 text-xs text-gray-300">
              <ArrowRight className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <span>{change}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Unified Git Diff View</p>
          <pre className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs font-mono overflow-x-auto leading-5">
            {diff.split('\n').map((line, i) => {
              const isAdd = line.startsWith('+') && !line.startsWith('+++');
              const isDel = line.startsWith('-') && !line.startsWith('---');
              return (
                <div
                  key={i}
                  className={isAdd ? 'diff-added' : isDel ? 'diff-removed' : 'text-gray-400'}
                >
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
