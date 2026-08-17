import React from 'react';
import { ShieldCheck, Cpu, Code2, GitPullRequest, MessageSquareCode, Terminal, Sparkles, FolderGit2, History } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, loadSampleRepo, sampleRepos, apiStatus }) {
  return (
    <header className="glass-panel border-b border-gray-800 sticky top-0 z-50 px-6 py-3.5 mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            AI Code Review & Debugging Assistant
          </h1>
          <p className="text-xs text-gray-400 font-mono">FastAPI • React • PostgreSQL • Tree-sitter • LLMs</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1.5 bg-gray-900/80 p-1.5 rounded-xl border border-gray-800">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'studio'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Code Studio
        </button>

        <button
          onClick={() => setActiveTab('ast')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ast'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          AST & Static Smells
        </button>

        <button
          onClick={() => setActiveTab('optimize')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'optimize'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Optimization Diff
        </button>

        <button
          onClick={() => setActiveTab('complexity')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'complexity'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Big-O Complexity
        </button>

        <button
          onClick={() => setActiveTab('unittests')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'unittests'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-400" />
          Unit Test Generator
        </button>

        <button
          onClick={() => setActiveTab('pr')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'pr'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <GitPullRequest className="w-4 h-4 text-purple-400" />
          PR Reviewer
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <MessageSquareCode className="w-4 h-4 text-cyan-400" />
          AI Debugger
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <History className="w-4 h-4 text-amber-400" />
          Audit History
        </button>
      </nav>

      {/* Right Controls: Sample Repository Loader & API Health */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-lg">
          <FolderGit2 className="w-4 h-4 text-indigo-400" />
          <select
            onChange={(e) => e.target.value && loadSampleRepo(e.target.value)}
            className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select Sample Repository...</option>
            {Object.entries(sampleRepos).map(([key, repo]) => (
              <option key={key} value={key} className="bg-gray-900 text-gray-200">
                {repo.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          API {apiStatus}
        </div>
      </div>
    </header>
  );
}
