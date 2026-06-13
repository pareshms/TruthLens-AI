import React from "react";
import { ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

interface TrustGaugeProps {
  score: number;
  confidence: number;
  verdict: "REAL" | "DEEPFAKE" | "SUSPICIOUS";
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({ score, confidence, verdict }) => {
  // Determine color theme based on score/verdict
  let strokeColor = "stroke-emerald-500";
  let textColor = "text-emerald-400";
  let bgColor = "bg-emerald-950/40 border-emerald-500/20";
  let radialGlow = "shadow-[0_0_20px_rgba(16,185,129,0.15)]";
  let feedback = "PASSED: Authentic biological structure and noise metadata coherence.";

  if (verdict === "DEEPFAKE" || score < 35) {
    strokeColor = "stroke-rose-600";
    textColor = "text-rose-500";
    bgColor = "bg-rose-950/40 border-rose-500/20";
    radialGlow = "shadow-[0_0_20px_rgba(225,29,72,0.15)]";
    feedback = "CRITICAL: Generative AI architectural remnants and facial boundary warping detected.";
  } else if (verdict === "SUSPICIOUS" || score < 75) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-400";
    bgColor = "bg-amber-950/40 border-amber-500/20";
    radialGlow = "shadow-[0_0_20px_rgba(245,158,11,0.15)]";
    feedback = "WARNING: Suspicious audio spectrals or container metadata mismatches identified.";
  }

  // Calculate gauge circumference for SVG circle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation for semi-complete circle (e.g., 270 degrees)
  const angleRange = 270;
  const strokeDashoffset = circumference - (score / 100) * (angleRange / 360) * circumference;

  return (
    <div className={`p-6 rounded-2xl border ${bgColor} ${radialGlow} flex flex-col items-center justify-center transition-all duration-500`}>
      <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa] mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
        Media Trust Forensic Gauge
      </h3>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* SVG speedometer circular ring */}
        <svg className="w-full h-full transform -rotate-225" viewBox="0 0 200 200">
          {/* Background circle track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-[#1e1e2d] fill-none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (angleRange / 360) * circumference}
          />
          {/* Active colored gauge track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className={`${strokeColor} fill-none transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center label overlay */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-4xl font-mono font-bold tracking-tight text-white select-none">
            {score}%
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase mt-1">
            Trust Score
          </span>
          <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-current bg-[#09090b]/70 text-xs font-mono font-semibold uppercase">
            {verdict === "REAL" ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={textColor}>{verdict}</span>
          </div>
        </div>
      </div>

      {/* Confidence status */}
      <div className="w-full mt-4 grid grid-cols-2 gap-4 divide-x divide-zinc-800 text-center border-t border-zinc-800/60 pt-4">
        <div>
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Analysis Confidence</div>
          <div className="text-lg font-mono font-semibold text-zinc-200 mt-1">{confidence}%</div>
        </div>
        <div>
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold">Forensic Risk</div>
          <div className="text-lg font-mono font-semibold mt-1">
            <span className={textColor}>
              {verdict === "REAL" ? "LOW" : verdict === "SUSPICIOUS" ? "ELEVATED" : "CRITICAL"}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs font-mono text-zinc-400 text-center max-w-sm">
        {feedback}
      </p>
    </div>
  );
};
