import React, { useState } from "react";
import { FactCheck } from "../types";
import { Search, ShieldAlert, ShieldCheck, HelpCircle, Loader2, Info } from "lucide-react";

interface FactCheckPanelProps {
  initialFactCheck: FactCheck | null;
  onRunCustomQuery?: (query: string) => Promise<FactCheck | null>;
}

export const FactCheckPanel: React.FC<FactCheckPanelProps> = ({ 
  initialFactCheck,
  onRunCustomQuery 
}) => {
  const [query, setQuery] = useState("");
  const [currentFactCheck, setCurrentFactCheck] = useState<FactCheck | null>(initialFactCheck);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with initial fact check when results change
  React.useEffect(() => {
    setCurrentFactCheck(initialFactCheck);
    setQuery("");
    setError(null);
  }, [initialFactCheck]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (onRunCustomQuery) {
        const result = await onRunCustomQuery(query);
        if (result) {
          setCurrentFactCheck(result);
        } else {
          setError("Failed to verify the claim. Please try again.");
        }
      } else {
        // Fallback local API post request if onRunCustomQuery is not provided
        const response = await fetch("/api/fact-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (data.success && data.factCheck) {
          setCurrentFactCheck(data.factCheck);
        } else {
          setError(data.error || "Failed to process the requested claim.");
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected networking error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyles = (verdict: "TRUE" | "FALSE" | "MISLEADING") => {
    switch (verdict) {
      case "TRUE":
        return {
          bg: "bg-emerald-950/40 border-emerald-500/20",
          text: "text-emerald-400",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          label: "VERIFIED AUTHENTIC",
        };
      case "FALSE":
        return {
          bg: "bg-rose-950/40 border-rose-500/20",
          text: "text-rose-500",
          icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
          label: "FALSEHOOD / DEBUNKED SIGNATURE",
        };
      case "MISLEADING":
      default:
        return {
          bg: "bg-amber-950/40 border-amber-500/20",
          text: "text-amber-400",
          icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
          label: "MISLEADING / LACKS CONTEXT",
        };
    }
  };

  const verdictStyles = currentFactCheck ? getVerdictStyles(currentFactCheck.claimVerdict) : null;

  return (
    <div className="bg-[#141421] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/50 mb-5">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            TruthLens OSINT Fact-Check Core
          </h3>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Module 12-C
          </span>
        </div>

        {/* Custom Query Search Form */}
        <form onSubmit={handleSearch} id="fact-check-form" className="mb-6">
          <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wide">
            Analyze Media Claims & Public Record Claims
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Political figure declaration on tax rates..."
              className="w-full bg-[#0c0c16]/80 text-sm border border-zinc-800 focus:border-indigo-500/50 rounded-xl py-3 pl-4 pr-11 text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all font-mono"
            />
            <button
              type="submit"
              id="btn-search-fact-check"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:hover:bg-indigo-600 transition-colors flex items-center justify-center focus:outline-none"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-xs font-mono text-rose-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}
        </form>

        {/* Fact-check results content */}
        {currentFactCheck ? (
          <div className={`p-5 rounded-xl border ${verdictStyles?.bg} transition-all duration-300`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Consensus Verdict
              </span>
              <span className={`text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 ${verdictStyles?.text}`}>
                {verdictStyles?.icon}
                {verdictStyles?.label}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Evaluated Target Claim
              </h4>
              <p className="text-sm font-semibold text-zinc-100 font-sans italic leading-snug">
                &ldquo;{currentFactCheck.query}&rdquo;
              </p>
            </div>

            <div className="space-y-3.5 pt-3.5 border-t border-zinc-800/40">
              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  Forensic Explanation
                </h4>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  {currentFactCheck.explanation}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pt-2 border-t border-zinc-900 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <span>Source Verification Authority:</span>
                  <span className="text-zinc-300 truncate max-w-[160px] sm:max-w-xs font-bold">
                    {currentFactCheck.source}
                  </span>
                </div>
                <div className="text-zinc-500 flex items-center gap-1 shrink-0">
                  <span>Probability:</span>
                  <span className={`font-semibold ${verdictStyles?.text}`}>
                    {currentFactCheck.confidence}% Accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-zinc-800/80 rounded-xl p-8 text-center bg-zinc-950/20">
            <HelpCircle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-xs font-mono text-zinc-500 leading-normal max-w-xs mx-auto">
              No claim match detected directly in media container metadata. Use the scanner search bar above to verify quotes, public figures declarations or specific claims in our registry.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 text-[10px] font-mono text-zinc-500 text-center flex items-center justify-center gap-1 border-t border-zinc-900 pt-3">
        <Info className="w-3.5 h-3.5" /> 
        Data sourced using real-time OSINT records cross-referenced with public news layers.
      </div>
    </div>
  );
};
