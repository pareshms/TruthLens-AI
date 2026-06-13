import React from "react";
import { Indicator } from "../types";
import { Eye, Volume2, Database, Orbit, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

interface IndicatorCardProps {
  indicator: Indicator;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator }) => {
  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "visual":
        return <Eye className="w-4 h-4 text-sky-400" />;
      case "audio":
        return <Volume2 className="w-4 h-4 text-purple-400" />;
      case "metadata":
        return <Database className="w-4 h-4 text-emerald-400" />;
      default:
        return <Orbit className="w-4 h-4 text-[#a855f7]" />;
    }
  };

  // Map status to visual styles
  const getStatusConf = (status: string) => {
    switch (status) {
      case "passed":
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
          badgeBg: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20",
          label: "SANE/PASSED",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
          badgeBg: "bg-amber-950/40 text-amber-400 border-amber-500/20",
          label: "SUSPICIOUS",
        };
      case "failed":
      default:
        return {
          icon: <XCircle className="w-4 h-4 text-rose-500" />,
          badgeBg: "bg-rose-950/40 text-rose-400 border-rose-500/20",
          label: "MANIPULATED",
        };
    }
  };

  const statusConf = getStatusConf(indicator.status);

  return (
    <div className="bg-[#141421] border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              {getCategoryIcon(indicator.category)}
            </span>
            <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              {indicator.category}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusConf.badgeBg} flex items-center gap-1`}>
            {statusConf.icon}
            {statusConf.label}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-zinc-100 mb-1.5 font-sans">
          {indicator.name}
        </h4>
        <p className="text-xs font-mono text-zinc-400 leading-relaxed">
          {indicator.description}
        </p>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-2.5 flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-500">Anomaly Level</span>
        <span className={`uppercase font-bold ${
          indicator.severity === "high" 
            ? "text-rose-500" 
            : indicator.severity === "medium" 
              ? "text-amber-500" 
              : "text-emerald-500"
        }`}>
          {indicator.severity}
        </span>
      </div>
    </div>
  );
};
