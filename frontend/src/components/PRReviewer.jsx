import React, { useState } from 'react';
import { GitPullRequest, GitMerge, ShieldAlert, CheckCircle2, AlertTriangle, Play, FileText, CornerDownRight } from 'lucide-react';

export default function PRReviewer({ prReviewResult, onReviewPR, isLoading }) {
  const [repoUrl, setRepoUrl] = useState('https://github.com/my-org/backend-service');
  const [prNumber, setPrNumber] = useState(42);

  const handleReview = () => {
    onReviewPR(repoUrl, Number(prNumber));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* GitHub PR Selector Header */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <GitPullRequest className="w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/org/repo"
            className="flex-1 min-w-[240px] bg-gray-900 border border-gray-800 text-xs font-mono text-gray-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
            <span>PR #</span>
            <input
              type="number"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              className="w-20 bg-gray-900 border border-gray-800 text-xs font-mono text-gray-200 px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleReview}
          disabled={isLoading}
          className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 text-purple-300" />
          Run Automated PR Review
        </button>
      </div>

      {prReviewResult ? (
        <div className="space-y-6">
          {/* PR Score & Approval Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Quality Score</p>
                <p className={`text-2xl font-bold font-mono mt-1 ${prReviewResult.score >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {prReviewResult.score} / 100
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">PR Decision</p>
                <span className={prReviewResult.status === 'APPROVED' ? 'pulse-badge-green mt-1.5' : 'pulse-badge-red mt-1.5'}>
                  {prReviewResult.status === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  {prReviewResult.status}
                </span>
              </div>
              <GitMerge className={`w-6 h-6 ${prReviewResult.status === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Author & Title</p>
                <p className="text-xs font-bold text-gray-200 truncate max-w-[200px] mt-0.5">{prReviewResult.title}</p>
                <p className="text-[10px] text-gray-500">Author: {prReviewResult.author}</p>
              </div>
            </div>
          </div>

          {/* Inline Patch Review Comments */}
          <div className="glass-panel p-5">
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 pb-3 mb-4 border-b border-gray-800">
              <GitPullRequest className="w-4 h-4 text-purple-400" />
              Inline GitHub Review Comments ({prReviewResult.comments.length})
            </h3>

            {prReviewResult.comments.length === 0 ? (
              <p className="text-xs text-emerald-400 font-mono py-4 text-center">
                ✅ No blocking issues found! Ready to merge into target branch.
              </p>
            ) : (
              <div className="space-y-4">
                {prReviewResult.comments.map((comment, i) => (
                  <div key={i} className="glass-card p-4 border border-gray-800/80">
                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-gray-500" />
                        {comment.filename}:{comment.line}
                      </span>
                      <span className={comment.severity === 'CRITICAL' ? 'pulse-badge-red' : 'pulse-badge-amber'}>
                        {comment.severity}
                      </span>
                    </div>

                    <p className="text-xs text-gray-200 leading-relaxed mb-3 font-sans">{comment.comment}</p>

                    {comment.suggested_fix && (
                      <div className="bg-gray-950 p-3 rounded-lg border border-emerald-900/40 text-[11px] font-mono text-emerald-300">
                        <strong className="text-emerald-400">Suggested Code Change:</strong>
                        <pre className="mt-1 text-emerald-200 overflow-x-auto">{comment.suggested_fix}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 text-center text-gray-400">
          <GitPullRequest className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-gray-200">GitHub Pull Request Review Simulator</h3>
          <p className="text-xs text-gray-500 mt-1">Scan repository pull requests for security vulnerabilities, performance regressions, and inline reviews.</p>
        </div>
      )}
    </div>
  );
}
