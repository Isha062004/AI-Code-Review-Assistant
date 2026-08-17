import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CodeEditorPanel from './components/CodeEditorPanel';
import StaticAnalysisView from './components/StaticAnalysisView';
import OptimizationDiffView from './components/OptimizationDiffView';
import ComplexityView from './components/ComplexityView';
import UnitTestGenerator from './components/UnitTestGenerator';
import PRReviewer from './components/PRReviewer';
import AIDebuggerChat from './components/AIDebuggerChat';
import AuditHistoryView from './components/AuditHistoryView';

// Dynamic API Base URL resolution for local, LAN (Wi-Fi), and Cloud deployment
const API_BASE = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [sampleRepos, setSampleRepos] = useState({});
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [isLoading, setIsLoading] = useState(false);

  // Active Code Context
  const [code, setCode] = useState(`import time

# O(2^N) Recursive Fibonacci bug
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

# N+1 Database Query Anti-pattern
def fetch_user_orders(db, user_list):
    results = []
    for user in user_list:
        # N+1 query inside loop
        orders = db.query("SELECT * FROM orders WHERE user_id = " + str(user.id))
        results.append(orders)
    return results
`);
  const [filename, setFilename] = useState('fibonacci_and_db.py');
  const [language, setLanguage] = useState('python');

  // Results State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [complexityResult, setComplexityResult] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [prReviewResult, setPrReviewResult] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Code Review & Debugging Assistant. Load sample code or paste your script to run Tree-sitter AST static analysis, Big-O complexity calculations, or PR reviews.',
      suggested_code: null
    }
  ]);

  // Initial API health check & sample repos load
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') setApiStatus('Online');
      })
      .catch(() => setApiStatus('Offline'));

    fetch(`${API_BASE}/api/sample-repos`)
      .then(res => res.json())
      .then(data => setSampleRepos(data))
      .catch(err => console.error("Error loading sample repos:", err));

    // Run initial analysis on default code
    handleAnalyzeCode();
  }, []);

  const loadSampleRepo = (key) => {
    const repo = sampleRepos[key];
    if (repo) {
      setCode(repo.code);
      setFilename(repo.filename);
      setLanguage(repo.language);
      setAnalysisResult(null);
      setOptimizationResult(null);
      setComplexityResult(null);
      setTestResult(null);
    }
  };

  const handleAnalyzeCode = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, filename, language })
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizeCode = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, target_goal: 'performance' })
      });
      const data = await res.json();
      setOptimizationResult(data);
      setActiveTab('optimize');
    } catch (err) {
      console.error("Optimization failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeComplexity = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/complexity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      setComplexityResult(data);
      setActiveTab('complexity');
    } catch (err) {
      console.error("Complexity analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTests = async (framework) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, test_framework: framework })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error("Test generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewPR = async (repoUrl, prNumber) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/pr-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl, pr_number: prNumber, files: [] })
      });
      const data = await res.json();
      setPrReviewResult(data);
    } catch (err) {
      console.error("PR Review failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (userMessage) => {
    const updatedHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          code_context: code,
          language,
          chat_history: []
        })
      });
      const data = await res.json();
      setChatHistory([
        ...updatedHistory,
        {
          role: 'assistant',
          content: data.reply,
          suggested_code: data.suggested_code
        }
      ]);
    } catch (err) {
      console.error("Chat failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loadSampleRepo={loadSampleRepo}
        sampleRepos={sampleRepos}
        apiStatus={apiStatus}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-6 pb-8 max-w-7xl mx-auto w-full">
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
            {/* Left Column: Code Editor (7 cols) */}
            <div className="lg:col-span-7 h-full">
              <CodeEditorPanel
                code={code}
                setCode={setCode}
                filename={filename}
                setFilename={setFilename}
                language={language}
                setLanguage={setLanguage}
                onAnalyze={handleAnalyzeCode}
                onOptimize={handleOptimizeCode}
                isLoading={isLoading}
                issuesCount={analysisResult?.issues?.length || 0}
              />
            </div>

            {/* Right Column: Instant Static Analysis Overview (5 cols) */}
            <div className="lg:col-span-5 h-full overflow-y-auto">
              <StaticAnalysisView analysisResult={analysisResult} />
            </div>
          </div>
        )}

        {activeTab === 'ast' && (
          <StaticAnalysisView analysisResult={analysisResult} />
        )}

        {activeTab === 'optimize' && (
          <OptimizationDiffView
            optimizationResult={optimizationResult}
            onOptimize={handleOptimizeCode}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'complexity' && (
          <ComplexityView
            complexityResult={complexityResult}
            onAnalyzeComplexity={handleAnalyzeComplexity}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'unittests' && (
          <UnitTestGenerator
            testResult={testResult}
            onGenerateTests={handleGenerateTests}
            isLoading={isLoading}
            language={language}
          />
        )}

        {activeTab === 'pr' && (
          <PRReviewer
            prReviewResult={prReviewResult}
            onReviewPR={handleReviewPR}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'chat' && (
          <AIDebuggerChat
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentCode={code}
            language={language}
            setCode={setCode}
          />
        )}

        {activeTab === 'history' && (
          <AuditHistoryView
            setCode={setCode}
            setFilename={setFilename}
            setLanguage={setLanguage}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
}
