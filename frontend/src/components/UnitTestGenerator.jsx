import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, Play, ShieldCheck } from 'lucide-react';

export default function UnitTestGenerator({ testResult, onGenerateTests, isLoading, language }) {
  const [framework, setFramework] = useState(language === 'python' ? 'pytest' : 'vitest');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    onGenerateTests(framework);
  };

  const copyTestCode = () => {
    if (testResult?.test_code) {
      navigator.clipboard.writeText(testResult.test_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-100">Automated Unit Test Generator</h3>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-xs font-mono text-gray-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="pytest">Pytest (Python)</option>
            <option value="unittest">Unittest (Python Standard)</option>
            <option value="vitest">Vitest / Jest (JS/TS)</option>
            <option value="junit">JUnit 5 (Java)</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Play className="w-4 h-4 text-emerald-300" />
          Build Unit Test Suite
        </button>
      </div>

      {testResult ? (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Test Framework</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{testResult.framework}</p>
              </div>
              <Code2 className="w-6 h-6 text-emerald-400 opacity-80" />
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Generated Cases</p>
                <p className="text-lg font-bold text-indigo-400 font-mono mt-0.5">{testResult.test_cases_count} Test Cases</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-indigo-400 opacity-80" />
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Estimated Code Coverage</p>
                <p className="text-lg font-bold text-purple-400 font-mono mt-0.5">{testResult.coverage_estimate}</p>
              </div>
              <Terminal className="w-6 h-6 text-purple-400 opacity-80" />
            </div>
          </div>

          {/* Test Code Editor / Output */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
              <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Generated Test Suite Code
              </span>

              <button
                onClick={copyTestCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                {copied ? 'Copied to Clipboard' : 'Copy Test Suite'}
              </button>
            </div>

            <pre className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs font-mono text-emerald-300 leading-6 overflow-x-auto">
              {testResult.test_code}
            </pre>

            <div className="mt-4 p-3 bg-gray-900/60 rounded-lg border border-gray-800 text-xs text-gray-400 font-mono flex items-center gap-2">
              <span className="text-indigo-400 font-bold">Execution Guide:</span>
              <span>{testResult.instructions}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 text-center text-gray-400">
          <Code2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-gray-200">No Unit Tests Generated Yet</h3>
          <p className="text-xs text-gray-500 mt-1">Select your target test framework and click "Build Unit Test Suite" above.</p>
        </div>
      )}
    </div>
  );
}
