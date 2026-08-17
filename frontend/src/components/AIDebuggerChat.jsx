import React, { useState } from 'react';
import { MessageSquareCode, Send, Bot, User, Sparkles, Copy, Check, Terminal } from 'lucide-react';

export default function AIDebuggerChat({ chatHistory, onSendMessage, isLoading, currentCode, language, setCode }) {
  const [inputMsg, setInputMsg] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleSend = (msgToSend) => {
    const text = msgToSend || inputMsg;
    if (!text.strip && !text.trim()) return;
    onSendMessage(text);
    setInputMsg('');
  };

  const applyCodeToEditor = (codeSnippet) => {
    if (setCode && codeSnippet) {
      setCode(codeSnippet);
    }
  };

  const copySnippet = (codeSnippet, idx) => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-[650px] animate-fade-in border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              Interactive AI Debugging Assistant
            </h3>
            <p className="text-[10px] text-gray-400 font-mono">Context-Aware Code Inspector ({language.toUpperCase()})</p>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleSend("Fix all bugs and security issues in my current code context.")}
            className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-full font-mono transition-all cursor-pointer"
          >
            ⚡ Fix Bugs
          </button>
          <button
            onClick={() => handleSend("Explain step-by-step how my code operates.")}
            className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-full font-mono transition-all cursor-pointer"
          >
            📖 Explain Code
          </button>
          <button
            onClick={() => handleSend("Refactor my code for optimal algorithm time complexity.")}
            className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-full font-mono transition-all cursor-pointer"
          >
            🚀 Optimize Algorithm
          </button>
        </div>
      </div>

      {/* Chat Conversation Window */}
      <div className="flex-1 bg-gray-950/90 p-4 rounded-xl border border-gray-800 overflow-y-auto space-y-4 font-sans text-xs">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <Bot className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-gray-300 text-sm">Ask any debugging or code refactoring question</p>
            <p className="text-xs text-gray-500 mt-1">The assistant automatically reads your active code context from Code Studio.</p>
          </div>
        ) : (
          chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {item.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-xl text-xs ${
                  item.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-md'
                    : 'glass-card border border-gray-800 text-gray-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{item.content}</div>

                {item.suggested_code && (
                  <div className="mt-3 bg-gray-950 p-3 rounded-lg border border-gray-800 font-mono text-[11px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Terminal className="w-3.5 h-3.5" />
                        Suggested Code Fix
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => applyCodeToEditor(item.suggested_code)}
                          className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 text-[10px] cursor-pointer"
                        >
                          Apply to Editor
                        </button>
                        <button
                          onClick={() => copySnippet(item.suggested_code, idx)}
                          className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800 text-[10px] cursor-pointer"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400 inline" /> : <Copy className="w-3 h-3 inline" />}
                        </button>
                      </div>
                    </div>
                    <pre className="text-emerald-300 overflow-x-auto leading-5">{item.suggested_code}</pre>
                  </div>
                )}
              </div>

              {item.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-gray-300" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask AI assistant about your code..."
          className="flex-1 bg-gray-950 border border-gray-800 text-xs font-sans text-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMsg.trim()}
          className="btn-glow flex items-center justify-center w-11 h-11 rounded-xl text-white disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
