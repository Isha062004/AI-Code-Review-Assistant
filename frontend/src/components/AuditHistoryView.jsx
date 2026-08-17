import React, { useState, useEffect } from 'react';
import { History, FileCode, Trash2, RefreshCw, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function AuditHistoryView({ setCode, setFilename, setLanguage, setActiveTab }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load audit history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const loadRecordIntoStudio = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/history/${id}`);
      const data = await res.json();
      if (data.code_content) {
        setCode(data.code_content);
        setFilename(data.filename || 'script.py');
        setLanguage(data.language || 'python');
        setActiveTab('studio');
      }
    } catch (err) {
      console.error("Failed to load record:", err);
    }
  };

  const deleteRecord = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE}/api/history/${id}`, { method: 'DELETE' });
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between glass-panel p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center">
            <History className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">Database Audit History</h3>
            <p className="text-xs text-gray-400">Audit logs of all code static analysis scans stored in SQLite / PostgreSQL</p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Log
        </button>
      </div>

      {loading ? (
        <div className="glass-panel p-8 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-400" />
          <p className="text-xs font-mono">Loading audit log records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-8 text-center text-gray-400">
          <FileCode className="w-12 h-12 mx-auto mb-2 text-gray-600 opacity-50" />
          <p className="text-sm font-semibold text-gray-300">No Analysis History Found</p>
          <p className="text-xs text-gray-500 mt-1">Run AST static analysis in the Code Studio to record audit logs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                onClick={() => loadRecordIntoStudio(record.id)}
                className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 hover:border-indigo-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-200">{record.filename}</span>
                      <span className="text-[10px] font-mono uppercase bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 px-2 py-0.5 rounded">
                        {record.language}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {record.created_at ? new Date(record.created_at).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center font-mono text-xs">
                    <span className="text-gray-400 block text-[10px]">Complexity</span>
                    <strong className="text-purple-400">V(G) = {record.cyclomatic_complexity}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.bugs_count > 0 && (
                      <span className="pulse-badge-red text-[11px]">
                        {record.bugs_count} Bug(s)
                      </span>
                    )}
                    {record.smells_count > 0 && (
                      <span className="pulse-badge-amber text-[11px]">
                        {record.smells_count} Smell(s)
                      </span>
                    )}
                    {record.security_count > 0 && (
                      <span className="pulse-badge-red text-[11px]">
                        {record.security_count} Security
                      </span>
                    )}
                    {record.bugs_count === 0 && record.smells_count === 0 && record.security_count === 0 && (
                      <span className="pulse-badge-green text-[11px]">
                        Clean
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadRecordIntoStudio(record.id);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md cursor-pointer"
                    >
                      Load in Studio
                    </button>
                    <button
                      onClick={(e) => deleteRecord(record.id, e)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
