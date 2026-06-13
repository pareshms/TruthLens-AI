import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, 
  Eye, 
  Volume2, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Fingerprint, 
  ShieldAlert,
  SlidersHorizontal,
  Compass
} from "lucide-react";

type ScanMode = "acoustic" | "biometric" | "chrominance";

interface LogMessage {
  time: string;
  type: "info" | "warn" | "success" | "danger";
  message: string;
}

export function InteractiveScanner() {
  const [activeMode, setActiveMode] = useState<ScanMode>("acoustic");
  const [isDeepfakeToggled, setIsDeepfakeToggled] = useState<boolean>(false);
  const [jitterIntensity, setJitterIntensity] = useState<number>(35); // 0 - 100
  const [calibrationFreq, setCalibrationFreq] = useState<number>(50); // 10 - 100
  const [logs, setLogs] = useState<LogMessage[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastLogTimeRef = useRef<number>(0);

  // Initialize Logs
  useEffect(() => {
    const timeString = new Date().toLocaleTimeString();
    setLogs([
      { time: timeString, type: "success", message: "System initialized. TruthLens analysis kernel loaded." },
      { time: timeString, type: "info", message: "Calibration node synchronized with regional legal verification protocols." },
      { time: timeString, type: "info", message: "Select verification modules to preview raw sensory telemetry." }
    ]);
  }, []);

  // Update logs dynamically based on states
  useEffect(() => {
    const interval = setInterval(() => {
      const timeString = new Date().toLocaleTimeString();
      let newLog: LogMessage;

      if (isDeepfakeToggled) {
        const warnings = [
          "Anomalous high-frequency jitter detected within the 3.2kHz acoustic formant region.",
          "Lip-sync correlation margins dropped below acceptable threshold (0.68 index).",
          "Generative GAN checkerboard matrix detected in chrominance high frequencies.",
          "Sub-pixel artificial shadow blending mismatch isolated along nasal plane vectors.",
          "Discontinuity in vocal spectrogram points to concatenative TTS synthesis model."
        ];
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        newLog = { time: timeString, type: "danger", message: `[ALERT] ${randomWarning}` };
      } else {
        const normals = [
          "Micro-expression transient drift within standard biological deviation limit (+/- 2.1%).",
          "Chrominance spatial noise displays natural organic Gaussian distribution.",
          "Vocal timbre timbre-structure aligns with biological physiological characteristics.",
          "Frame-to-frame optical flow vectors confirm natural continuity.",
          "Metadata SHA-256 block matching authenticated secure origin credentials."
        ];
        const randomNormal = normals[Math.floor(Math.random() * normals.length)];
        newLog = { time: timeString, type: "success", message: `[STABLE] ${randomNormal}` };
      }

      setLogs(prev => [newLog, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isDeepfakeToggled]);

  // Handle immediate log injection upon toggle
  const handleToggleDeepfake = () => {
    const nextVal = !isDeepfakeToggled;
    setIsDeepfakeToggled(nextVal);
    
    const timeString = new Date().toLocaleTimeString();
    if (nextVal) {
      setLogs(prev => [
        { time: timeString, type: "danger", message: "CRITICAL DETECTION: Synthesized artificial generation patterns injected!" },
        { time: timeString, type: "info", message: "Initiating Deepfake Forensic signature verification sweep..." },
        ...prev.slice(0, 4)
      ]);
    } else {
      setLogs(prev => [
        { time: timeString, type: "success", message: "DEEPFAKE INJECTION TERMINATED. Returning to baseline environment analysis." },
        { time: timeString, type: "info", message: "Re-calibrating biometric sensor models." },
        ...prev.slice(0, 4)
      ]);
    }
  };

  // HTML5 Live Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark tech background
      ctx.fillStyle = "#0c0c16";
      ctx.fillRect(0, 0, width, height);

      // Draw standard cyber grid backdrop
      ctx.strokeStyle = "rgba(49, 46, 129, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Drawing according to active mode
      if (activeMode === "acoustic") {
        // Render Audio Spectral signature
        ctx.lineWidth = 2.2;
        const baselineY = height / 2;
        
        // Let's draw 3 voice waveforms (Fundamental, 1st Harmonic, Ambient Noise)
        ctx.beginPath();
        const calibPhase = frame * (calibrationFreq / 1000);
        const jitterMult = isDeepfakeToggled ? (jitterIntensity / 25) + 1 : 0.05;

        for (let x = 0; x < width; x++) {
          // Synthetic audio signal has jagged spikes and flat regions if deepfaked
          let wave = Math.sin(x * 0.03 + calibPhase) * 35;
          wave += Math.sin(x * 0.08 - calibPhase * 1.5) * 15;
          wave += Math.cos(x * 0.15 + calibPhase * 2) * 5;

          if (isDeepfakeToggled) {
            // Add high-frequency digital jitter
            if (x % 14 === 0) {
              wave += (Math.random() - 0.5) * 30 * jitterMult;
            }
            // Add clipping synthesis limitation flatline
            if (wave > 28) wave = 28;
            if (wave < -28) wave = -28;
          }

          if (x === 0) {
            ctx.moveTo(x, baselineY + wave);
          } else {
            ctx.lineTo(x, baselineY + wave);
          }
        }
        
        // Gradient color based on state
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        if (isDeepfakeToggled) {
          grad.addColorStop(0, "#f87171"); // bright red
          grad.addColorStop(0.5, "#f59e0b"); // amber
          grad.addColorStop(1, "#ef4444");
        } else {
          grad.addColorStop(0, "#6366f1"); // deep indigo
          grad.addColorStop(0.5, "#c084fc"); // purple-violet
          grad.addColorStop(1, "#60a5fa"); // light blue
        }
        ctx.strokeStyle = grad;
        ctx.stroke();

        // Secondary underlying spectrogram heat visualization
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x += 12) {
          const barHeight = Math.abs(Math.sin(x * 0.045 + calibPhase) * 50) + 10;
          const randomSpike = isDeepfakeToggled ? (Math.random() * jitterIntensity * 0.6) : 0;
          const finalHeight = Math.min(height - 20, barHeight + randomSpike);
          
          ctx.fillStyle = isDeepfakeToggled 
            ? `rgba(239, 68, 68, ${0.08 + (x / width) * 0.15})`
            : `rgba(99, 102, 241, ${0.05 + (x / width) * 0.12})`;
          ctx.fillRect(x, height - finalHeight, 8, finalHeight);
        }

        // Labels
        ctx.font = "9px monospace";
        ctx.fillStyle = isDeepfakeToggled ? "#ef4444" : "#818cf8";
        ctx.fillText(isDeepfakeToggled ? "TELEMETRY: SYNTHESIZED CLONE FREQUENCY WARNING" : "TELEMETRY: ORGANIC VOICE FORMANT", 15, 25);
        ctx.fillText(`Calib: ${calibrationFreq}Hz`, width - 90, 25);

      } else if (activeMode === "biometric") {
        // Render 3D style facial keypoint mesh mapping
        const centerX = width / 2;
        const centerY = height / 2 - 10;
        const timeVal = frame * 0.025;
        const jitter = isDeepfakeToggled ? (Math.random() - 0.5) * (jitterIntensity / 6) : 0;

        // Custom facial nodes (Floating dynamic coordinates)
        const nodes = [
          { id: "forehead", x: centerX, y: centerY - 45, label: "F1" },
          { id: "left_eye", x: centerX - 35 + jitter, y: centerY - 15 + Math.sin(timeVal) * 2, label: "L_EYE" },
          { id: "right_eye", x: centerX + 35 - jitter, y: centerY - 15 + Math.cos(timeVal) * 2, label: "R_EYE" },
          { id: "nose_tip", x: centerX + (isDeepfakeToggled ? jitter * 1.5 : 0), y: centerY + 15, label: "N_BASE" },
          { id: "left_cheek", x: centerX - 55, y: centerY + 10, label: "L_CH" },
          { id: "right_cheek", x: centerX + 55, y: centerY + 10, label: "R_CH" },
          { id: "mouth_left", x: centerX - 25, y: centerY + 40 + (isDeepfakeToggled ? Math.sin(frame * 0.3) * 4 : 0), label: "M_L" },
          { id: "mouth_right", x: centerX + 25, y: centerY + 40 + (isDeepfakeToggled ? Math.cos(frame * 0.3) * 4 : 0), label: "M_R" },
          { id: "chin", x: centerX, y: centerY + 65, label: "CHIN" }
        ];

        // Draw structural wireframe connection lines
        ctx.strokeStyle = isDeepfakeToggled ? "rgba(239, 68, 68, 0.25)" : "rgba(99, 102, 241, 0.2)";
        ctx.lineWidth = 1.2;
        
        const connectNodes = (n1: typeof nodes[0], n2: typeof nodes[0]) => {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        };

        const getNode = (id: string) => nodes.find(n => n.id === id)!;

        // Outer face oval construct
        connectNodes(getNode("forehead"), getNode("left_cheek"));
        connectNodes(getNode("forehead"), getNode("right_cheek"));
        connectNodes(getNode("left_cheek"), getNode("chin"));
        connectNodes(getNode("right_cheek"), getNode("chin"));
        // Inner keypoint alignments
        connectNodes(getNode("left_eye"), getNode("nose_tip"));
        connectNodes(getNode("right_eye"), getNode("nose_tip"));
        connectNodes(getNode("left_eye"), getNode("left_cheek"));
        connectNodes(getNode("right_eye"), getNode("right_cheek"));
        connectNodes(getNode("nose_tip"), getNode("mouth_left"));
        connectNodes(getNode("nose_tip"), getNode("mouth_right"));
        connectNodes(getNode("mouth_left"), getNode("chin"));
        connectNodes(getNode("mouth_right"), getNode("chin"));
        connectNodes(getNode("mouth_left"), getNode("mouth_right")); // Lip seal

        // Draw nodes themselves
        nodes.forEach(node => {
          const isEyeMouth = ["left_eye", "right_eye", "mouth_left", "mouth_right"].includes(node.id);
          const drawRed = isDeepfakeToggled && isEyeMouth;

          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRed ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = drawRed ? "#ef4444" : "#818cf8";
          ctx.fill();

          // Outer pulse indicator ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = drawRed ? "rgba(239, 68, 68, 0.4)" : "rgba(129, 140, 248, 0.3)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Coordinate label text overlay
          ctx.font = "8px monospace";
          ctx.fillStyle = drawRed ? "#f87171" : "#a1a1aa";
          ctx.fillText(`(${Math.round(node.x)}, ${Math.round(node.y)})`, node.x + 8, node.y + 3);
        });

        // Focal overlay scanner target
        ctx.strokeStyle = isDeepfakeToggled ? "rgba(239, 68, 68, 0.15)" : "rgba(99, 102, 241, 0.1)";
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 30, width - 80, height - 70);

        // Scan sweeping laser horizontal line
        const laserY = (frame * 1.5) % (height - 40) + 20;
        ctx.strokeStyle = isDeepfakeToggled ? "rgba(239, 68, 68, 0.6)" : "rgba(99, 102, 241, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = isDeepfakeToggled ? "#ef4444" : "#6366f1";
        ctx.beginPath();
        ctx.moveTo(30, laserY);
        ctx.lineTo(width - 30, laserY);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Draw alert overlay tags if deepfake active
        if (isDeepfakeToggled) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = "#ef4444";
          ctx.fillText("[ASYMMETRIC EYE-BLINK BLEND]", centerX - 75, height - 25);
          ctx.fillText("[LIP COGNITIVE DEVIATION DETECTED]", centerX - 85, 35);
        } else {
          ctx.font = "9px monospace";
          ctx.fillStyle = "#10b981";
          ctx.fillText("FACIAL FLOW MESH: VERIFIED BASELINE PASS", centerX - 90, height - 25);
        }

      } else if (activeMode === "chrominance") {
        // Render Spatial Chrominance Anomaly representation
        // We draw beautiful custom generative frequency block noise
        ctx.fillStyle = "#0c0c16";
        ctx.fillRect(0, 0, width, height);

        const cols = 20;
        const rows = 12;
        const blockW = width / cols;
        const blockH = height / rows;

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            let intensity = Math.sin(c * 0.4 + frame * 0.05) * Math.cos(r * 0.3 - frame * 0.03) * 0.5 + 0.5;
            
            // If deepfake active, we overlay a non-random artificial "checkerboard" artifact matrix (classic CNN signatures)
            if (isDeepfakeToggled) {
              const checkPattern = (c % 2 === r % 2);
              if (checkPattern) {
                intensity += (jitterIntensity / 100) * 0.65;
              }
            }

            // Map intensity to cyber colors (indigo gradient range vs hot pink)
            let colorString = "";
            if (isDeepfakeToggled) {
              const val = Math.floor(intensity * 180 + 50);
              // Hot pink/crimson artifacting
              colorString = `rgba(${val}, 30, 110, ${0.1 + intensity * 0.4})`;
            } else {
              const val = Math.floor(intensity * 120 + 40);
              // Deep cool blue-purple natural organic camera grain
              colorString = `rgba(30, ${val}, 170, ${0.05 + intensity * 0.25})`;
            }

            ctx.fillStyle = colorString;
            ctx.fillRect(c * blockW + 1, r * blockH + 1, blockW - 2, blockH - 2);
          }
        }

        // Draw spatial filter overlay coordinates
        ctx.strokeStyle = isDeepfakeToggled ? "rgba(244, 114, 182, 0.4)" : "rgba(99, 102, 241, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 60 + Math.sin(frame * 0.02) * 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = "9px monospace";
        ctx.fillStyle = isDeepfakeToggled ? "#f472b6" : "#60a5fa";
        ctx.fillText(isDeepfakeToggled ? "SENSOR MATRIX: GAN/DIFFUSION STRUCTURAL REPETITIONS FOUND" : "SENSOR MATRIX: NATURAL MICROSCOPIC CHROMINANCE WAVE", 15, 25);
        ctx.fillText(`Noise dispersion: ${(jitterIntensity * 1.5).toFixed(1)} dB`, width - 165, height - 15);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeMode, isDeepfakeToggled, jitterIntensity, calibrationFreq]);

  const handleModeChange = (mode: ScanMode) => {
    setActiveMode(mode);
    const timeString = new Date().toLocaleTimeString();
    let moduleName = "";
    if (mode === "acoustic") moduleName = "Acoustic Timbre Fourier Spectrogram";
    if (mode === "biometric") moduleName = "3D Facial Landmark Coordinate Flow";
    if (mode === "chrominance") moduleName = "High-Harmonic Chrominance Block Matrix";
    
    setLogs(prev => [
      { time: timeString, type: "info", message: `Viewport routing switched to: [${moduleName}] mode.` },
      ...prev.slice(0, 4)
    ]);
  };

  return (
    <div id="interactive-verification-lab" className="border border-zinc-800 bg-[#0b0c15]/95 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto relative overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Lab Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-900 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2.5">
            <Sparkles className="w-3 h-3 text-purple-400" /> Human-Interactive Forensics Playground
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Signature Verification Simulation Lab
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1 max-w-xl">
            Tinker with real biometric and acoustic manipulation anomalies using the live interactive simulation matrix.
          </p>
        </div>
        
        {/* Deepfake Toggle Switch (Highly Interactive and Eye-catching) */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-5 self-start lg:self-center transition-all hover:border-zinc-700">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border transition-all ${isDeepfakeToggled ? "bg-rose-950/20 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>
              {isDeepfakeToggled ? <ShieldAlert className="w-4.5 h-4.5" /> : <CheckCircle2 className="w-4.5 h-4.5 text-zinc-600" />}
            </div>
            <div>
              <span className="text-[10px] block font-mono text-zinc-400 font-semibold leading-none mb-1">INJECT MANIPULATION</span>
              <span className={`text-xs block font-mono font-bold leading-none ${isDeepfakeToggled ? "text-rose-400 text-shadow-red" : "text-zinc-500"}`}>
                {isDeepfakeToggled ? "DEEPFAKE ACTIVE" : "OFF (SAFE BASELINE)"}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleDeepfake}
            className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDeepfakeToggled ? "bg-rose-600" : "bg-zinc-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isDeepfakeToggled ? "translate-x-5.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Grid: Modules & Viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls & Parameters Module - Col-span 5 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Analysis Viewport Selectors */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider block">
              FORENSIC DETECTION PATTERN
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleModeChange("acoustic")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  activeMode === "acoustic"
                    ? "bg-indigo-950/20 border-indigo-500/30 text-white"
                    : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Volume2 className={`w-4 h-4 ${activeMode === "acoustic" ? "text-indigo-400" : "text-zinc-500"}`} />
                  <div>
                    <span className="text-xs font-semibold block">Vocal Spectrogram</span>
                    <span className="text-[10px] font-mono text-zinc-500">Audio formants analysis</span>
                  </div>
                </div>
                <Activity className={`w-3.5 h-3.5 animate-pulse ${activeMode === "acoustic" ? "text-indigo-400" : "text-zinc-700"}`} />
              </button>

              <button
                onClick={() => handleModeChange("biometric")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  activeMode === "biometric"
                    ? "bg-indigo-950/20 border-indigo-500/30 text-white"
                    : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Fingerprint className={`w-4 h-4 ${activeMode === "biometric" ? "text-indigo-400" : "text-zinc-500"}`} />
                  <div>
                    <span className="text-xs font-semibold block">Facial Landmarks</span>
                    <span className="text-[10px] font-mono text-zinc-500">Biometric mesh tracking</span>
                  </div>
                </div>
                <Eye className={`w-3.5 h-3.5 ${activeMode === "biometric" ? "text-indigo-400" : "text-zinc-700"}`} />
              </button>

              <button
                onClick={() => handleModeChange("chrominance")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  activeMode === "chrominance"
                    ? "bg-indigo-950/20 border-indigo-500/30 text-white"
                    : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className={`w-4 h-4 ${activeMode === "chrominance" ? "text-indigo-400" : "text-zinc-500"}`} />
                  <div>
                    <span className="text-xs font-semibold block">Chrominance Noise</span>
                    <span className="text-[10px] font-mono text-zinc-500">Spatial frequency anomalies</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-pink-500/80 animate-ping" />
              </button>
            </div>
          </div>

          {/* Sliders Parameters Module */}
          <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-900/60 text-zinc-300 font-mono text-xs font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2.5} />
              <span>SIGNAL MODIFIERS</span>
            </div>

            {/* Slider 1: Jitter Volatility */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-500">SYNTHETIC JITTER MATRIX</span>
                <span className={`font-bold ${isDeepfakeToggled ? "text-rose-400" : "text-indigo-400"}`}>{jitterIntensity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={jitterIntensity}
                onChange={(e) => setJitterIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[9px] font-mono text-zinc-600 block leading-tight">
                Controls volatility of structural distortions. Higher yields major verification model anomalies.
              </span>
            </div>

            {/* Slider 2: Sweep/Calibration Frequency */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-500">SCAN SWEEP FREQUENCY</span>
                <span className="text-indigo-400 font-bold">{calibrationFreq} Hz</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={calibrationFreq}
                onChange={(e) => setCalibrationFreq(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[9px] font-mono text-zinc-600 block leading-tight">
                Controls telemetry sweep resolution and Fourier segment slice metrics index.
              </span>
            </div>
          </div>

        </div>

        {/* Live Rendering Terminal Viewport - Col-span 8 */}
        <div className="lg:col-span-8 space-y-4 flex flex-col h-full justify-between">
          
          {/* Main Visual Terminal Screen */}
          <div className="relative border border-zinc-800 bg-[#07070c] rounded-2xl overflow-hidden shadow-inner flex-1 flex flex-col">
            
            {/* Window header */}
            <div className="px-4.5 py-3 border-b border-zinc-900 bg-zinc-950/70 flex items-center justify-between text-[11px] font-mono font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                <span className="text-zinc-400 ml-1.5">FORENSIC_KERNEL_OUTPUT://{activeMode}_scan_telemetry</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                <span>ONLINE_SWEEP</span>
              </div>
            </div>

            {/* Canvas Core Element */}
            <div className="relative flex-1 bg-[#05060b] min-h-[260px] flex items-center justify-center p-1.5">
              <canvas
                ref={canvasRef}
                width={520}
                height={260}
                className="w-full h-[260px] object-cover rounded-lg"
              />
              
              {/* Corner tech marks */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-500/25 pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-500/25 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-500/25 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-500/25 pointer-events-none" />
            </div>
          </div>

          {/* Diagnostic Log Output - scrolling live logs */}
          <div className="border border-zinc-900/80 bg-zinc-950/70 rounded-xl p-4 font-mono text-[10px] leading-relaxed select-text space-y-1.5 max-h-[110px] overflow-y-auto">
            <div className="text-zinc-500 font-bold tracking-wider mb-2 uppercase border-b border-zinc-900 pb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              AUTHENTICATION ENGINE STABILIZATION DIALOGUE_LOGS
            </div>
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-zinc-600 shrink-0 select-none">[{log.time}]</span>
                <span className={
                  log.type === "danger" ? "text-rose-400 font-semibold" : 
                  log.type === "warn" ? "text-amber-400" : 
                  log.type === "success" ? "text-emerald-400" : "text-indigo-300"
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
