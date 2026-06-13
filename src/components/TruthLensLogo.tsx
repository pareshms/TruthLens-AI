import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function TruthLensLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center select-none group transition-transform duration-300 ease-out hover:scale-105 ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
        className="overflow-visible"
      >
        <defs>
          {/* Elite Premium Gradient representing deep cryptographic inspection */}
          <linearGradient id="truthlens-glowing-optics" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#4f46e5" />   {/* Cyber Indigo */}
            <stop offset="40%" stopColor="#818cf8" />  {/* Radiant Light Blue */}
            <stop offset="70%" stopColor="#d946ef" />  {/* Deep Violet Pink */}
            <stop offset="100%" stopColor="#ec4899" /> {/* Vivid Rose */}
          </linearGradient>

          {/* Golden Ratio inner flare gradient */}
          <linearGradient id="core-verification-node" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* 1. Outer Calibration Guideline Ring (Technical Verification Radar Accent) */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#truthlens-glowing-optics)" 
          strokeWidth="1.5" 
          strokeDasharray="4 6"
          opacity="0.25"
          className="animate-spin"
          style={{ animationDuration: "60s" }}
        />

        {/* 2. Overlapping Geometric Lens Aperture Slices (Clean, Minimalist SaaS Craftsmanship) */}
        {/* Top-Right Optical Arc */}
        <path
          d="M 50 18 A 32 32 0 0 1 82 50 C 82 62, 72 72, 60 76"
          stroke="url(#truthlens-glowing-optics)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Bottom-Left Optical Arc (Symmetric geometric offset) */}
        <path
          d="M 50 82 A 32 32 0 0 1 18 50 C 18 38, 28 28, 40 24"
          stroke="url(#truthlens-glowing-optics)"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* 3. The Precision Crosshair/Focal lines (Gives the impression of scanning/inspecting) */}
        <line x1="50" y1="8" x2="50" y2="14" stroke="url(#truthlens-glowing-optics)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <line x1="50" y1="86" x2="50" y2="92" stroke="url(#truthlens-glowing-optics)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <line x1="8" y1="50" x2="14" y2="50" stroke="url(#truthlens-glowing-optics)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <line x1="86" y1="50" x2="92" y2="50" stroke="url(#truthlens-glowing-optics)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

        {/* 4. Core Optical Iris Hexagon-inspired Aperture Core (Ultra sleek, geometric, Human Design) */}
        <polygon
          points="50,34 64,42 64,58 50,66 36,58 36,42"
          stroke="url(#truthlens-glowing-optics)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="rgba(79, 70, 229, 0.05)"
          className="transition-transform duration-700 ease-out origin-center group-hover:rotate-45"
        />

        {/* 5. Central Proof-of-Trust Node (Verification Core Spark) */}
        <circle
          cx="50"
          cy="50"
          r="6.5"
          fill="url(#core-verification-node)"
          className="transition-all duration-300 ease-in-out group-hover:scale-125"
        />

        {/* 6. Active Specular Prism Dot */}
        <circle
          cx="50"
          cy="50"
          r="1.8"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}
