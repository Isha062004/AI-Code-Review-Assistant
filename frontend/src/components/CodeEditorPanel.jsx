import React from 'react';
import { Play, Sparkles, RefreshCw, FileCode, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function CodeEditorPanel({
  code,
  setCode,
  filename,
  setFilename,
  language,
  setLanguage,
  onAnalyze,
  onOptimize,
  isLoading,
  issuesCount
}) {
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="glass-panel p-5 flex flex-col h-full border border-gray-800">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <FileCode className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-gray-900/90 border border-gray-800 text-xs font-mono text-gray-200 px-3 py-1.5 rounded-lg focus:border-indigo-500 focus:outline-none w-48"
            placeholder="filename.py"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-900/90 border border-gray-800 text-xs font-mono text-gray-200 px-3 py-1.5 rounded-lg focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript / TS</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run AST Analysis
          </button>

          <button
            onClick={onOptimize}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 hover:bg-indigo-900/80 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Optimize
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex-1 flex bg-gray-950/90 rounded-xl border border-gray-800 font-mono text-sm overflow-hidden">
        {/* Line Numbers */}
        <div className="py-4 px-3 bg-gray-900/80 border-r border-gray-800 text-gray-600 select-none text-right text-xs font-mono">
          {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          placeholder="Paste or write your source code here..."
          className="flex-1 bg-transparent p-4 text-gray-100 font-mono text-xs leading-6 resize-none focus:outline-none overflow-y-auto"
        />
      </div>

      {/* Footer stats bar */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-4">
          <span>Lines: <strong className="text-gray-200">{lineCount}</strong></span>
          <span>Chars: <strong className="text-gray-200">{charCount}</strong></span>
          <span>Language: <strong className="text-indigo-400 uppercase">{language}</strong></span>
        </div>

        {issuesCount > 0 ? (
          <span className="pulse-badge-red text-xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            {issuesCount} Issue(s) Found
          </span>
        ) : (
          <span className="pulse-badge-green text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready for Analysis
          </span>
        )}
      </div>
    </div>
  );
}
