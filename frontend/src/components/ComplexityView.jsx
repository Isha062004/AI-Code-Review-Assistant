import React from 'react';
import { Terminal, TrendingUp, Cpu, Lightbulb, Calculator } from 'lucide-react';

export default function ComplexityView({ complexityResult, onAnalyzeComplexity, isLoading }) {
  if (!complexityResult) {
    return (
      <div className="glass-panel p-8 text-center text-gray-400">
        <Terminal className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-semibold text-gray-200">Algorithm Time & Space Complexity Visualizer</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4">Analyze asymptotic Big-O runtime bounds and mathematical derivations.</p>
        <button
          onClick={onAnalyzeComplexity}
          disabled={isLoading}
          className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          <Terminal className="w-4 h-4" />
          Calculate Big-O Bounds
        </button>
      </div>
    );
  }

  const { time_complexity, space_complexity, mathematical_derivation, explanation, benchmark_data, recommendations } = complexityResult;

  // Maximum operations for relative percentage bar graph calculation
  const maxOps = Math.max(...benchmark_data.map(d => d.operations), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Big-O Badges Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Complexity Card */}
        <div className="glass-card p-5 border-l-4 border-l-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Asymptotic Time Complexity</p>
            <h3 className="text-3xl font-extrabold text-indigo-400 font-mono mt-1">{time_complexity}</h3>
            <p className="text-[11px] text-gray-500 mt-1">Worst-case growth rate</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Space Complexity Card */}
        <div className="glass-card p-5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Auxiliary Space Complexity</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">{space_complexity}</h3>
            <p className="text-[11px] text-gray-500 mt-1">Memory stack & heap footprint</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Math Derivation Card */}
        <div className="glass-card p-5 border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recurrence Relation</p>
            <h3 className="text-sm font-bold text-purple-300 font-mono mt-1 truncate max-w-[200px]">
              {mathematical_derivation || 'T(N) = N · O(1)'}
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">Mathematical induction</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Mathematical Derivation & Breakdown) | Right (Input Size Growth Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Explanation & Math */}
        <div className="glass-panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 pb-3 border-b border-gray-800">
            <Calculator className="w-4 h-4 text-purple-400" />
            Mathematical Derivation & Analysis
          </h3>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-2">Formal Expression</p>
            <div className="font-mono text-sm text-purple-300 bg-purple-950/30 p-3 rounded-lg border border-purple-900/50">
              {mathematical_derivation ? mathematical_derivation : 'T(N) = O(N)'}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Step-by-step Explanation</p>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">{explanation}</p>
          </div>

          <div className="pt-3 border-t border-gray-800 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Optimization Recommendations
            </p>
            {recommendations.map((rec, i) => (
              <div key={i} className="text-xs text-gray-300 flex items-start gap-2 bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Input Size Scaling Visualizer (Bar Chart & Benchmark Data) */}
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 pb-3 border-b border-gray-800">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Asymptotic Scaling Benchmark (N = 10 to 5,000)
          </h3>

          <div className="space-y-4 my-3">
            {benchmark_data.map((item, idx) => {
              const widthPct = Math.max(4, Math.min(100, (item.operations / maxOps) * 100));
              return (
                <div key={idx} className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>N = {item.n.toLocaleString()}</span>
                    <span>{item.operations.toLocaleString()} ops ({item.time_ms} ms)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-500 font-mono mt-4 text-center">
            Calculated for standard single-thread 3.2GHz CPU cycles
          </p>
        </div>
      </div>
    </div>
  );
}
