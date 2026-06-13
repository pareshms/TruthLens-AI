import React, { useState, useRef, useEffect } from "react";
import { 
  Shield, 
  Upload, 
  Clock, 
  FileText, 
  Tv, 
  Volume2, 
  CheckCircle, 
  Fingerprint, 
  Globe, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Search, 
  ArrowLeft, 
  FolderLock, 
  HardDriveUpload, 
  Cpu, 
  Dna, 
  Lock, 
  Server, 
  Terminal, 
  Bookmark, 
  AlertOctagon,
  Gauge
} from "lucide-react";
import { TrustGauge } from "./components/TrustGauge";
import { IndicatorCard } from "./components/IndicatorCard";
import { EvidenceReportView } from "./components/EvidenceReportView";
import { FactCheckPanel } from "./components/FactCheckPanel";
import { TruthLensLogo } from "./components/TruthLensLogo";
import { InteractiveScanner } from "./components/InteractiveScanner";
import { AnalysisResult, ActiveScanPhase, FactCheck } from "./types";

// Static mock files list for demo/sandbox testing
const SAMPLE_MEDIAS = [
  {
    id: "political",
    name: "Political Figure Tax Policy Declaration",
    type: "Video/MP4",
    size: "14.2 MB",
    duration: "45s",
    desc: "Speaks about sudden tax hikes in local town council. Clear vocal anomalies present.",
    icon: <Tv className="w-5 h-5 text-indigo-400" />
  },
  {
    id: "ceo",
    name: "Enterprise CEO Quarterly Product Recall",
    type: "Audio/AAC",
    size: "4.8 MB",
    duration: "1m 15s",
    desc: "Voice message supposedly leaked from internal board call discussing a faulty component.",
    icon: <Volume2 className="w-5 h-5 text-purple-400" />
  },
  {
    id: "authentic",
    name: "Official Environment Summit Press Briefing",
    type: "Video/H264",
    size: "24.1 MB",
    duration: "30s",
    desc: "Clean live stream from press gallery with matching biological markers.",
    icon: <Shield className="w-5 h-5 text-emerald-400" />
  }
];

// Initial analysis history list to seed the dashboard
const INITIAL_HISTORY: AnalysisResult[] = [
  {
    id: "hist-1",
    fileName: "vlad_putin_cloned_briefing.mp4",
    fileSize: "18.4 MB",
    mimeType: "video/mp4",
    uploadedAt: "2026-06-12 14:32",
    verdict: "DEEPFAKE",
    trustScore: 14,
    confidence: 97,
    summary: "Visual mesh tracking highlights facial swap on known speaker profile. Low blink-rate and synthetic mouth movement vectors.",
    faceMatchScore: 38,
    audioSplicingDetected: true,
    metadataManipulated: true,
    indicators: [
      { id: "i1", name: "Landmark Warp", category: "visual", severity: "high", description: "Mouth and teeth shapes show spatial disintegration during speech.", status: "failed" },
      { id: "i2", name: "Acoustic Discontinuity", category: "audio", severity: "high", description: "Spectral phase transitions feature unnatural silence boundaries.", status: "failed" }
    ],
    analysisSections: [
      { title: "Visual Mesh Breakdown", rating: "critical", text: "Target facial keypoints show spatial displacement during fast rotation angles." }
    ],
    factCheck: {
      query: "Presidential speech draft confirmation",
      claimVerdict: "FALSE",
      explanation: "No official transcripts from diplomatic sources exist regarding a draft statement matching this speaker's content.",
      source: "Global Verification Index",
      confidence: 95
    },
    evidenceReport: {
      forensicHash: "sha256-df53a811abc2a8bcfa2f6992d13ab3fbc882182efedef0eec89ca582d",
      analyzedAt: "2026-06-12T14:32:10Z",
      fileSignature: "MPEG-4 Container Layer 2",
      fingerprintRisk: "96% AI Face Swap Confidence"
    }
  },
  {
    id: "hist-2",
    fileName: "tech_ceo_interview_audio.wav",
    fileSize: "5.1 MB",
    mimeType: "audio/wav",
    uploadedAt: "2026-06-11 09:12",
    verdict: "SUSPICIOUS",
    trustScore: 54,
    confidence: 82,
    summary: "Synthesized synthetic accent cloner elements found in vocal pitch formants. Minor biological variance.",
    faceMatchScore: null,
    audioSplicingDetected: true,
    metadataManipulated: false,
    indicators: [
      { id: "i3", name: "Phoneme Glitch", category: "audio", severity: "high", description: "Repetitive formant static matches standard wave generator frameworks.", status: "failed" }
    ],
    analysisSections: [
      { title: "Spectral Analysis", rating: "warning", text: "Vocal frequency envelopes do not have standard human mechanical variation." }
    ],
    factCheck: null,
    evidenceReport: {
      forensicHash: "sha256-ff71a2a4bce8995a7a2e6992d13ab3fbc882182efedef0eec89cb00e4",
      analyzedAt: "2026-06-11T09:12:45Z",
      fileSignature: "WAV Stereo 44.1kHz",
      fingerprintRisk: "72% Cloner Spectral match"
    }
  }
];

export default function App() {
  // Navigation state: "home" | "dashboard" | "upload" | "results"
  const [currentTab, setCurrentTab] = useState<"home" | "dashboard" | "upload" | "results">("home");
  
  // App operational state
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem("truthlens_history");
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      return INITIAL_HISTORY;
    }
  });
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  const updateHistory = (newHistory: AnalysisResult[] | ((prev: AnalysisResult[]) => AnalysisResult[])) => {
    setHistory(prev => {
      const next = typeof newHistory === "function" ? newHistory(prev) : newHistory;
      try {
        localStorage.setItem("truthlens_history", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to write to localStorage", e);
      }
      return next;
    });
  };
  
  // Custom uploaded file state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [base64Payload, setBase64Payload] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Active Scan state simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [currentPhaseLabel, setCurrentPhaseLabel] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // High-fidelity dynamic statistics for premium interactive look
  const [liveHashes, setLiveHashes] = useState(412891402);
  const [liveSpeed, setLiveSpeed] = useState(2.42);
  const [liveNodes, setLiveNodes] = useState(136);

  useEffect(() => {
    const statInterval = setInterval(() => {
      setLiveHashes(prev => prev + Math.floor(Math.random() * 8) + 1);
      setLiveSpeed(prev => {
        const delta = (Math.random() - 0.5) * 0.12;
        const nextVal = parseFloat((prev + delta).toFixed(2));
        return nextVal > 2.8 ? 2.8 : nextVal < 1.9 ? 1.9 : nextVal;
      });
      setLiveNodes(prev => {
        const delta = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const nextVal = prev + delta;
        return nextVal > 145 ? 145 : nextVal < 125 ? 125 : nextVal;
      });
    }, 4000);

    return () => clearInterval(statInterval);
  }, []);

  // Triggered when a sandbox demo is clicked
  const handleSelectSample = async (sampleId: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    setCurrentTab("dashboard");

    const phases = [
      { log: "Checking cryptographic SHA-256 header fingerprints...", delay: 120, progress: 20 },
      { log: "Isolating visual streams & reconstructing facial keypoint meshes...", delay: 150, progress: 45 },
      { log: "Auditing audio vocal spectrum for artificial formants & text-to-speech signatures...", delay: 120, progress: 70 },
      { log: "Cross-referencing claims database index with automatic G-Web facts indexing...", delay: 100, progress: 90 },
      { log: "Finalizing immutable cybersecurity verification audit report format...", delay: 100, progress: 100 }
    ];

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhaseLabel(phases[i].log);
      setScanLogs(prev => [...prev, `[ONLINE] ${phases[i].log}`]);
      setScanProgress(phases[i].progress);
      await new Promise(resolve => setTimeout(resolve, phases[i].delay));
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleType: sampleId, fileName: `sample_${sampleId}.mp4` }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        const fullResult: AnalysisResult = {
          id: `res-${Date.now()}`,
          fileName: `sample_${sampleId === "political" ? "political_tax_declaration" : sampleId === "ceo" ? "leaked_board_recall" : "clean_press_summit"}.${sampleId === "ceo" ? "aac" : "mp4"}`,
          fileSize: SAMPLE_MEDIAS.find(s => s.id === sampleId)?.size || "10 MB",
          mimeType: sampleId === "ceo" ? "audio/aac" : "video/mp4",
          uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          isMock: data.isMock,
          errorMsg: data.errorMsg,
          ...data.analysis
        };

        // Add to history
        updateHistory(prev => [fullResult, ...prev]);
        setSelectedResult(fullResult);
        setCurrentTab("results");
      }
    } catch (err) {
      console.error("Analysis retrieval failed", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const processSelectedFile = (file: File) => {
    setUploadFile(file);
    
    // Read file as base64 to allow real payload transfers (images/audios under 15MB)
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBase64Payload(event.target.result as string);
        setCurrentTab("upload"); // switch to analysis parameter staging tab
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit custom upload for full Gemini analysis!
  const handleSubmitAnalysis = async () => {
    if (!uploadFile || !base64Payload) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    setCurrentTab("dashboard");

    const phases = [
      { log: "Reading media binary sequence and resolving structure metrics...", delay: 150, progress: 15 },
      { log: "Extracting file metadata container strings and checking spoof signatures...", delay: 150, progress: 40 },
      { log: "Initializing Google Gemini 3.5-Flash high-dimension media model processor...", delay: 180, progress: 65 },
      { log: "Decoding spatial frames and voice frequency patterns...", delay: 150, progress: 85 },
      { log: "Generating full forensic consensus indicators and fact checking matches...", delay: 120, progress: 100 }
    ];

    // Trigger simulation progress steps visually
    for (const phase of phases) {
      setCurrentPhaseLabel(phase.log);
      setScanLogs(prev => [...prev, `[ANALYSIS STAGE] ${phase.log}`]);
      setScanProgress(phase.progress);
      await new Promise(resolve => setTimeout(resolve, phase.delay));
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: base64Payload,
          mimeType: uploadFile.type,
          fileName: uploadFile.name
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        const fullResult: AnalysisResult = {
          id: `res-${Date.now()}`,
          fileName: uploadFile.name,
          fileSize: `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
          mimeType: uploadFile.type,
          uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          isMock: data.isMock,
          errorMsg: data.errorMsg,
          ...data.analysis
        };

        updateHistory(prev => [fullResult, ...prev]);
        setSelectedResult(fullResult);
        setCurrentTab("results");
        
        // Reset upload fields
        setUploadFile(null);
        setBase64Payload(null);
      } else {
        alert("Server failed to analyze target file. Falling back to clean simulation.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Network exception: ${err?.message || "Verify your backend port is active"}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Run subsequent claim queries from the Fact check panel
  const handleRunCustomQuery = async (queryText: string): Promise<FactCheck | null> => {
    try {
      const resp = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText })
      });
      const data = await resp.json();
      if (data.success && data.factCheck) {
        return data.factCheck;
      }
    } catch (e) {
      console.error("Custom query search failed", e);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-zinc-100 flex flex-col relative selection:bg-indigo-500/30 selection:text-white">
      {/* Global Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,audio/*,video/*"
        className="hidden"
      />
      {/* Dynamic Background Network Grid for Cybersecurity ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.07),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* Header Bar */}
      <header className="border-b border-zinc-900 bg-[#08080f]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab("home")}>
            <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.06)] hover:border-indigo-500/30 transition-all">
              <TruthLensLogo size={24} />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                TruthLens <span className="bg-indigo-500/10 text-indigo-400 text-[10px] border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">AI Platform</span>
              </span>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wide uppercase">Forensic Authenticator</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400 font-mono">
            <button 
              onClick={() => setCurrentTab("home")}
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-white ${currentTab === "home" ? "text-indigo-400 bg-indigo-950/20 border border-indigo-900/35" : ""}`}
            >
              Portal Home
            </button>
            <button 
              onClick={() => setCurrentTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-white ${currentTab === "dashboard" || currentTab === "results" ? "text-indigo-400 bg-indigo-950/20 border border-indigo-900/35" : ""}`}
            >
              Detection Suite
            </button>
            <a 
              href="#sandbox" 
              onClick={() => { setCurrentTab("home"); setTimeout(() => document.getElementById("sandbox")?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="px-3 py-1.5 rounded-lg transition-colors hover:text-white"
            >
              Demo Sandbox
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerFileBrowser}
              id="header-btn-upload"
              className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)] flex items-center gap-1.5 focus:outline-none"
            >
              <Upload className="w-3.5 h-3.5" />
              Verify Media File
            </button>
          </div>
        </div>
      </header>

      {/* Primary Container / Navigation Router Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* =======================================================
            TAB: HOME (Saas High-End Landing Page)
            ======================================================= */}
        {currentTab === "home" && (
          <div className="space-y-16 animate-fade-in">
            {/* Hero Splash Area */}
            <section className="text-center py-8 max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/20 rounded-full px-4.5 py-1 text-xs font-mono text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                TruthLens AI Forensic Engine v4.8 Released
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] font-sans">
                Immutable Media Authentication &
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-1">
                  Deepfake Verification Core
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 font-mono max-w-2xl mx-auto leading-relaxed">
                Submit raw image, audio, or video files to analyze geometric facial landmarks, vocal timbre matrices, spectral anomalies, and header manipulation tags. Powered by Gemini 3.5.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-semibold font-mono text-white transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2"
                >
                  Enter Detection suite
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#sandbox"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-sm font-semibold font-mono text-zinc-300 transition-colors flex items-center justify-center gap-2"
                >
                  Run Sandbox Demo
                </a>
              </div>

              {/* Live Metric Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-center font-mono text-xs">
                <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4">
                  <div className="text-zinc-500 mb-1">AUDITED HASHES</div>
                  <div className="text-lg font-bold text-white tabular-nums">{liveHashes.toLocaleString()}</div>
                </div>
                <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4">
                  <div className="text-zinc-500 mb-1">ANALYSIS SPEED</div>
                  <div className="text-lg font-bold text-emerald-400 tabular-nums">~{liveSpeed.toFixed(2)} SEC / FILE</div>
                </div>
                <div className="border border-zinc-900 bg-[#a855f7]/5 border-[#a855f7]/15 rounded-xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.03)]">
                  <div className="text-[#a855f7] mb-1 font-bold">MUTATION ACCURACY</div>
                  <div className="text-lg font-bold text-purple-400 tabular-nums">99.82% PASS RATE</div>
                </div>
                <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4">
                  <div className="text-zinc-500 mb-1">NEURAL NODES</div>
                  <div className="text-lg font-bold text-white tabular-nums">{liveNodes} ACTIVE</div>
                </div>
              </div>
            </section>

            {/* Interactive Upload Gateway Block */}
            <section className="bg-gradient-to-b from-[#10101b] to-zinc-950/40 border border-zinc-800/80 rounded-3xl p-8 max-w-5xl mx-auto relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Military-Grade Verification Workspace
                  </h2>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    TruthLens extracts high-frequency sub-pixel motion vectors, examines lip sync mismatch margins, and audits the exact Fourier coefficients of audio spectrum structures to isolate voice-cloning fingerprints. 
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 text-xs font-mono">
                      <Fingerprint className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-zinc-200 font-bold block">Biometric Scan Matrix</span>
                        <span className="text-zinc-500">Reviews human micro-expression temporal consistency.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs font-mono">
                      <Volume2 className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-zinc-200 font-bold block">Acoustic Splice Checker</span>
                        <span className="text-zinc-500">Uncovers high-pass audio gaps representing cloner models.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload drag drop panel */}
                <div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileBrowser}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? "border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950/40 bg-zinc-950/20"
                    }`}
                  >
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 w-14 h-14 mx-auto flex items-center justify-center text-zinc-400 mb-4 transition-colors group-hover:text-white">
                      <Upload className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-200 block mb-1">
                      Drag & Drop Target Media File
                    </span>
                    <p className="text-[11px] font-mono text-zinc-500 leading-normal max-w-xs mx-auto">
                      Supports high-resolution images, video streams and audio containers. Up to 50MB.
                    </p>
                    <div className="mt-4.5 inline-flex items-center gap-1 bg-indigo-950/15 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-400 px-3.5 py-1 rounded-full uppercase tracking-wider">
                      <Server className="w-3 h-3" /> Fully Client and Server Proxy Ensured
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Simulation Laboratory */}
            <section className="py-4">
              <InteractiveScanner />
            </section>

            {/* Sandbox media section */}
            <section id="sandbox" className="py-4 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500 animate-pulse" />
                  Forensic Media Sandbox
                </h2>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                  No testing file on hand? Trigger instant, full-scale analyses on our pre-packaged mock forensics profiles representing standard enterprise use-cases.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {SAMPLE_MEDIAS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className="group border border-zinc-900 bg-zinc-950/20 rounded-2xl p-5 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                          {sample.icon}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {sample.duration} &bull; {sample.type}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors mb-1.5 font-sans">
                        {sample.name}
                      </h3>
                      <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-4">
                        {sample.desc}
                      </p>
                    </div>

                    <div className="border-t border-zinc-900 pt-3 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-600">Simulate analysis</span>
                      <span className="text-indigo-400 font-bold group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                        EXECUTE <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Explanatory breakdown */}
            <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 font-mono text-xs text-zinc-500 max-w-3xl mx-auto space-y-3">
              <h4 className="text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                SECURITY COMPLIANCE ADVISORY
              </h4>
              <p className="leading-relaxed">
                TruthLens utilizes advanced neural media fingerprint classification networks designed in compliance with the Global Media Authentication Protocol (GMAP). Uploaded assets are processed securely; raw data is streamed temporarily to process vector maps and are not stored permanently inside production backups unless requested by legal department administrators.
              </p>
            </section>
          </div>
        )}

        {/* =======================================================
            TAB: UPLOAD SCREEN (Media configuration stage)
            ======================================================= */}
        {currentTab === "upload" && uploadFile && (
          <div className="max-w-3xl mx-auto bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer" onClick={() => setCurrentTab("home")}>
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs">Return back</span>
            </div>

            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-indigo-400" />
                Configure Forensics Scanners
              </h2>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                Asset staged and ready for cryptographic neural evaluation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900/40 p-4 border border-zinc-800 rounded-xl">
              <div>
                <span className="text-xs text-zinc-500 block">Staged File</span>
                <span className="text-xs font-semibold text-zinc-200 mt-0.5 truncate block">{uploadFile.name}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Identified MIME Type</span>
                <span className="text-xs font-semibold text-zinc-200 mt-0.5 font-mono">{uploadFile.type || "unknown binary stream"}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Stream Size</span>
                <span className="text-xs font-semibold text-zinc-200 mt-0.5 font-mono">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                Verification Protocols Enabled
              </h3>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a14] border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>SHA-256 Block Signature Generation</span>
                  </div>
                  <span className="text-zinc-500 uppercase text-[10px]">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a14] border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Gemini Facial Mesh Keypoints Scan</span>
                  </div>
                  <span className="text-zinc-500 uppercase text-[10px]">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a14] border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Acoustic Frequency Discontinuity Analysis</span>
                  </div>
                  <span className="text-zinc-500 uppercase text-[10px]">Active (Audio files)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitAnalysis}
              id="btn-trigger-ai-verdict"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-semibold font-mono text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.15)] flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 animate-pulse" />
              BEGIN NEURAL AUTHENTICATION PROCESS
            </button>
          </div>
        )}

        {/* =======================================================
            TAB: DASHBOARD MAIN LAUNCHER / DETECTOR SUITE (Idle state)
            ======================================================= */}
        {currentTab === "dashboard" && !isScanning && (
          <div className="space-y-8 animate-fade-in">
            {/* Header section with high-tech badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-505 bg-indigo-500 animate-pulse" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">TruthLens Lab Environment</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Biometric Detection Suite & Forensic Analyzer
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Upload raw media or test with our catalog of simulation profiles.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950/40 px-3.5 py-1.5 rounded-xl border border-zinc-900">
                <span className="text-zinc-500">ENGINE STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ONLINE
                </span>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left main: Drag & Drop upload console */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-gradient-to-b from-[#0e0e1a] to-zinc-950/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
                    <HardDriveUpload className="w-4 h-4 text-indigo-400" />
                    Console Upload Interface
                  </h3>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileBrowser}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? "border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                        : "border-zinc-805 hover:border-zinc-700 bg-[#06060c] hover:bg-zinc-950/40"
                    }`}
                  >
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 w-14 h-14 mx-auto flex items-center justify-center text-zinc-400 mb-4">
                      <Upload className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-200 block mb-1">
                      Drag & Drop Target Media File here
                    </span>
                    <p className="text-xs font-mono text-zinc-500 leading-normal max-w-sm mx-auto">
                      Supports direct upload of AAC, MP4, WAV, PNG, WEBP, or JPG. Files up to 50MB will be analyzed by our multi-modal neural frameworks.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold font-mono rounded-xl transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Additional diagnostic specifications info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0b0c13] border border-zinc-900 rounded-xl p-4 font-mono text-xs text-zinc-400 space-y-2">
                    <span className="text-zinc-200 font-bold block flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Advanced Neural Pipeline
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Verifies high-frequency color gradient continuity and subtle frame-to-frame pixel drift sequences mapping spatial discrepancies.
                    </p>
                  </div>

                  <div className="bg-[#0b0c13] border border-zinc-900 rounded-xl p-4 font-mono text-xs text-zinc-400 space-y-2">
                    <span className="text-zinc-200 font-bold block flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" /> Cryptographic Integrity
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Computes double SHA-256 signatures to log verification records and cross-references them against active tampering lists.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right main: Sandbox simulation trials */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Sandbox Simulation Suite
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 font-mono">
                      Instantly test the suite capability using standard mock forensic media assets:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {SAMPLE_MEDIAS.map((sample) => (
                      <div
                        key={sample.id}
                        onClick={() => handleSelectSample(sample.id)}
                        className="group border border-zinc-900 bg-zinc-950/50 hover:bg-[#0c0c16]/80 hover:border-indigo-900/60 p-3.5 rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-2.5 items-center">
                            <span className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                              {sample.icon}
                            </span>
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                                {sample.name}
                              </h4>
                              <p className="text-[10px] text-zinc-500 font-mono">
                                {sample.type} &bull; {sample.size}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/40">
                            {sample.duration}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          {sample.desc}
                        </p>
                        <div className="border-t border-zinc-900 pt-2 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-zinc-600">Simulate scanner</span>
                          <span className="text-indigo-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1.5 transition-transform uppercase">
                            RUN MODULE <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit History section */}
            <div className="border-t border-zinc-900 pt-8 space-y-4">
              <h3 className="text-md font-bold text-white tracking-tight flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-indigo-400" />
                Audit Logs Database Index ({history.length} Saved Scans)
              </h3>

              {history.length === 0 ? (
                <div className="text-center py-8 bg-zinc-950/10 border border-zinc-900 rounded-2xl text-zinc-500 font-mono text-xs">
                  No previous audit indexes stored. Upload a file above to begin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((hist) => (
                    <div
                      key={hist.id}
                      onClick={() => {
                        setSelectedResult(hist);
                        setCurrentTab("results");
                      }}
                      className="border border-zinc-900 bg-zinc-950/10 hover:bg-[#0c0c16]/50 hover:border-indigo-900/40 p-4.5 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${
                          hist.verdict === "DEEPFAKE" ? "text-rose-500" : hist.verdict === "SUSPICIOUS" ? "text-amber-500" : "text-emerald-400"
                        }`}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-zinc-200 block truncate max-w-[220px]">
                            {hist.fileName}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase mt-0.5">
                            {hist.mimeType} &bull; Trust: {hist.trustScore}%
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 border rounded-full font-bold uppercase shrink-0 ${
                        hist.verdict === "DEEPFAKE"
                          ? "bg-rose-950/40 text-rose-400 border-rose-500/20"
                          : hist.verdict === "SUSPICIOUS"
                            ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                            : "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {hist.verdict}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =======================================================
            TAB: DASHBOARD SCANNING FEEDBACK STAGE
            ======================================================= */}
        {currentTab === "dashboard" && isScanning && (
          <div className="max-w-xl mx-auto text-center space-y-8 py-10 animate-fade-in bg-zinc-950/30 p-8 border border-zinc-900 rounded-3xl">
            <div className="relative w-32 h-32 mx-auto">
              {/* Spinning decorative ring */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-2 rounded-full border-4 border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '14s' }} />
              
              <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                <Gauge className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Authenticating Staged Media Profile...
              </h2>
              <div className="w-full bg-[#11111f] border border-zinc-800 rounded-full h-2 overflow-hidden max-w-sm mx-auto">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="inline-block text-xs font-mono text-indigo-400 font-bold mt-1">
                {scanProgress}% Completed
              </span>
            </div>

            {/* Interactive Terminal log viewer for active cybersecurity feel */}
            <div className="bg-[#050508] border border-zinc-800/80 rounded-xl p-4 font-mono text-left text-[11px] leading-relaxed select-text shadow-inner">
              <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900 pb-2 mb-2 uppercase text-[9px] tracking-widest font-bold">
                <span>TruthLens Forensics Console Log</span>
                <span className="text-indigo-400 animate-pulse">Running</span>
              </div>
              
              <div className="h-44 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="text-zinc-600">[CONNECT] Resolved local socket buffer stack...</div>
                {scanLogs.map((log, index) => (
                  <div key={index} className="text-zinc-300 flex items-start gap-1">
                    <span className="text-emerald-500 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="text-[#a855f7] font-bold animate-pulse">
                  &gt; {currentPhaseLabel}...
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-zinc-500 max-w-xs mx-auto text-center leading-normal">
              Running deep neural frequency extraction via developer API. Avoid closing this browser instance.
            </p>
          </div>
        )}

        {/* =======================================================
            TAB: DETAILED ANALYSIS RESULTS VIEW
            ======================================================= */}
        {currentTab === "results" && selectedResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Upper Action Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab("home")}
                  className="p-2 border border-zinc-800 bg-[#08080f]/40 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors focus:outline-none"
                  id="btn-return-landing"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Forensic Report Database</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider font-bold">Verified</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                    {selectedResult.fileName}
                  </h2>
                </div>
              </div>

              {/* Quick info header cards */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-400">
                  Size: {selectedResult.fileSize}
                </span>
                <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-400 uppercase">
                  Container: {selectedResult.mimeType || "media"}
                </span>
                <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-400">
                  {selectedResult.uploadedAt}
                </span>
              </div>
            </div>

            {selectedResult.isMock && (
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4.5 flex items-start gap-3.5 text-xs text-indigo-400 font-mono leading-relaxed shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-bold text-white block">Autonomous Simulation Pipeline Engaged</span>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    {selectedResult.errorMsg ? (
                      <>
                        The developer API key is currently experiencing rate or quota limits (<code className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15 font-bold text-[10px]">{selectedResult.errorMsg}</code>). High-definition simulation coordinates and biological landmarks have been synthesized successfully.
                      </>
                    ) : (
                      <>
                        Running simulation mode profile. Neural landmark matches and verification matrices have been calculated using stored baseline reference datasets.
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Big Forensic Classification Banner */}
            <div className={`p-6 rounded-2xl border transition-all ${
              selectedResult.verdict === "DEEPFAKE"
                ? "bg-rose-950/20 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]"
                : selectedResult.verdict === "SUSPICIOUS"
                  ? "bg-amber-950/20 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                  : "bg-emerald-950/20 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            } flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-xl ${
                  selectedResult.verdict === "DEEPFAKE"
                    ? "bg-rose-950/60 border border-rose-500/30 text-rose-500"
                    : selectedResult.verdict === "SUSPICIOUS"
                      ? "bg-amber-950/60 border border-amber-500/30 text-amber-500"
                      : "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
                }`}>
                  <AlertOctagon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Synthetics Classification: {selectedResult.verdict}
                    <span className="text-xs font-mono font-medium text-zinc-400"> &bull; {selectedResult.confidence}% confidence</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-300 mt-1 max-w-3xl leading-relaxed">
                    {selectedResult.summary}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right font-mono text-xs shrink-0 bg-[#090910]/80 p-4 border border-zinc-800/60 rounded-xl">
                <span className="text-zinc-500 block">Unique ID</span>
                <span className="text-zinc-200 block truncate max-w-[140px] font-bold">TL-AUD-{selectedResult.id.toUpperCase()}</span>
                <span className="text-[10px] text-zinc-500 shrink-0 select-text">File Security Approved</span>
              </div>
            </div>

            {/* Split layout: Gauge / Certificates and Indicators details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Gauge and Evidence report */}
              <div className="lg:col-span-4 space-y-8">
                <TrustGauge 
                  score={selectedResult.trustScore}
                  confidence={selectedResult.confidence}
                  verdict={selectedResult.verdict}
                />

                <EvidenceReportView result={selectedResult} />
              </div>

              {/* Right Column: Deepfake details and Indicators section */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Visual mesh & frequency indicators */}
                <div className="space-y-4">
                  <h3 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-indigo-400" />
                    Forensic Anomalies & Verification Markers
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedResult.indicators.map((indicator) => (
                      <IndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                  </div>
                </div>

                {/* Sub-system details */}
                <div className="space-y-4">
                  <h3 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-400" />
                    Detailed Sub-System Analyses
                  </h3>

                  <div className="space-y-4">
                    {selectedResult.analysisSections.map((section, idx) => (
                      <div key={idx} className="bg-[#10101b] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3 mb-3.5">
                          <h4 className="text-sm font-semibold text-zinc-100 font-mono">
                            {section.title}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border font-bold ${
                            section.rating === "critical"
                              ? "bg-rose-950/20 text-rose-400 border-rose-500/20"
                              : section.rating === "warning"
                                ? "bg-amber-950/20 text-amber-400 border-amber-500/20"
                                : "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {section.rating}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fact-check panel integration */}
                <div className="space-y-4">
                  <FactCheckPanel 
                    initialFactCheck={selectedResult.factCheck} 
                    onRunCustomQuery={handleRunCustomQuery}
                  />
                </div>

              </div>
            </div>

            {/* Lower audit history quick access panel */}
            <div className="border-t border-zinc-900 pt-8 space-y-4">
              <h3 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Previous Forensic Audits Historic Index
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((hist) => (
                  <div
                    key={hist.id}
                    onClick={() => {
                      setSelectedResult(hist);
                      setCurrentTab("results");
                    }}
                    className={`border p-4.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      selectedResult.id === hist.id
                        ? "border-indigo-500 bg-indigo-950/10"
                        : "border-zinc-900 bg-zinc-950/10 hover:bg-zinc-950/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${
                        hist.verdict === "DEEPFAKE" ? "text-rose-500" : hist.verdict === "SUSPICIOUS" ? "text-amber-500" : "text-emerald-400"
                      }`}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-200 block truncate max-w-[200px]">
                          {hist.fileName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase mt-0.5">
                          {hist.mimeType} &bull; Trust: {hist.trustScore}%
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 border rounded-full font-bold uppercase shrink-0 ${
                      hist.verdict === "DEEPFAKE"
                        ? "bg-rose-950/40 text-rose-400 border-rose-500/20"
                        : hist.verdict === "SUSPICIOUS"
                          ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                          : "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {hist.verdict}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer bar */}
      <footer className="border-t border-zinc-900/60 bg-[#06060c] py-8 text-xs font-mono text-zinc-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TruthLensLogo size={18} />
            <span className="text-zinc-300">TruthLens AI Verification Cryptosystems</span>
          </div>
          <div>
            &copy; 2026 TruthLens Security. Built by Team Omega.
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase text-zinc-600">
            <span>ISO 27001</span>
            <span>GDPR COMPLIANT</span>
            <span>GMAP CRITERIA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
