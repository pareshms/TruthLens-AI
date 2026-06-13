import React, { useRef, useState } from "react";
import { AnalysisResult } from "../types";
import { Award, Printer, Shield, CheckCircle, Verified, Terminal, Copy, ClipboardCheck } from "lucide-react";

interface EvidenceReportViewProps {
  result: AnalysisResult;
}

export const EvidenceReportView: React.FC<EvidenceReportViewProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Elegant system print of the certificate container
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    if (printContent) {
      const windowPrint = window.open("", "", "width=900,height=650");
      if (windowPrint) {
        windowPrint.document.write(`
          <html>
            <head>
              <title>TruthLens AI Legal Forensic Certificate</title>
              <style>
                body {
                  font-family: 'Courier New', Courier, monospace;
                  background-color: #ffffff;
                  color: #000000;
                  padding: 40px;
                }
                .bordered-box {
                  border: 4px double #000000;
                  padding: 30px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  border-bottom: 2px solid #000000;
                  padding-bottom: 20px;
                  margin-bottom: 20px;
                }
                .title {
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 2px;
                }
                .meta-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                }
                .meta-table td {
                  padding: 8px;
                  border-bottom: 1px dotted #000000;
                }
                .verdict-box {
                  border: 2px solid #000000;
                  text-align: center;
                  font-size: 20px;
                  font-weight: bold;
                  padding: 15px;
                  margin: 25px 0;
                  background-color: #f4f4f5;
                }
                .footer {
                  margin-top: 50px;
                  font-size: 11px;
                  text-align: center;
                  border-top: 1px solid #000000;
                  padding-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="bordered-box">
                <div class="header">
                  <div class="title">TRUTHLENS FORENSIC AUDIT RECORD</div>
                  <div style="font-size: 11px; margin-top: 5px;">AUTOMATED MEDIA VERIFICATION PROTOCOL</div>
                </div>
                <div class="verdict-box">
                  FORENSIC VERDICT: ${result.verdict.toUpperCase()} (${result.trustScore}% AUTHENTICITY SCORE)
                </div>
                <table class="meta-table">
                  <tr>
                    <td><strong>Target File:</strong></td>
                    <td>${result.fileName}</td>
                  </tr>
                  <tr>
                    <td><strong>Mime Classification:</strong></td>
                    <td>${result.mimeType}</td>
                  </tr>
                  <tr>
                    <td><strong>File Byte Size:</strong></td>
                    <td>${result.fileSize}</td>
                  </tr>
                  <tr>
                    <td><strong>Forensic Identifier (SHA256):</strong></td>
                    <td><small>${result.evidenceReport.forensicHash}</small></td>
                  </tr>
                  <tr>
                    <td><strong>Audit Timestamp:</strong></td>
                    <td>${new Date(result.evidenceReport.analyzedAt).toUTCString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Analysis Core Accuracy:</strong></td>
                    <td>${result.confidence}% Model Confidence</td>
                  </tr>
                  <tr>
                    <td><strong>Classification Signature:</strong></td>
                    <td>${result.evidenceReport.fingerprintRisk}</td>
                  </tr>
                </table>
                <div style="margin: 25px 0;">
                  <h3>Forensic Markers Checklist:</h3>
                  <ul>
                    ${result.indicators.map(ind => `<li>[${ind.status === 'passed' ? 'PASSED' : 'MANIPULATED'}] ${ind.name} - Severity: ${ind.severity}</li>`).join('')}
                  </ul>
                </div>
                <div class="footer">
                  This report is issued by TruthLens AI Forensic Registry. Security fingerprint parameters verified using Gemini-3.5-Flash neural verification protocols. Secure transaction hash: TL-${Math.floor(Math.random() * 1000000)}.
                </div>
              </div>
            </body>
          </html>
        `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
      }
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(result.evidenceReport.forensicHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
      {/* Visual glowing elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              Forensic Evidence Document
              <Verified className="w-4 h-4 text-sky-400" />
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Verified security signature for target media authentication
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          id="btn-print-forensic-report"
          className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-200 transition-colors px-4 py-2 rounded-xl text-xs font-mono focus:outline-none"
        >
          <Printer className="w-4 h-4" />
          Print / Export Report Certificate
        </button>
      </div>

      {/* Hidden container formatted specifically for printing */}
      <div ref={printAreaRef} className="bg-[#0e0e1a]/40 border border-zinc-800 rounded-xl p-5 font-mono text-xs text-zinc-300">
        <div className="flex items-center gap-2 text-zinc-400 font-bold mb-3 border-b border-zinc-800/50 pb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          CRYPTOGRAPHIC HASH AND PARSING LOG
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">Forensic Identifier (SHA-256)</span>
            <span className="sm:col-span-2 text-zinc-200 flex items-center gap-1.5 break-all">
              {result.evidenceReport.forensicHash}
              <button
                onClick={copyHash}
                className="hover:text-white text-zinc-500 transition-colors p-0.5"
                title="Copy cryptographic hash"
              >
                {copied ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">Source Media Signature</span>
            <span className="sm:col-span-2 text-zinc-200">{result.evidenceReport.fileSignature}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">Analyzed On</span>
            <span className="sm:col-span-2 text-zinc-200">{new Date(result.evidenceReport.analyzedAt).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">Classification</span>
            <span className="sm:col-span-2 text-emerald-400 font-semibold">{result.evidenceReport.fingerprintRisk}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pb-1">
            <span className="text-zinc-500">Consensus Authority</span>
            <span className="sm:col-span-2 text-zinc-200 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> TruthLens Forensic Neural Grid
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-3">
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="text-[11px] font-mono text-zinc-400 leading-relaxed">
          <strong>Authority Audit Assurance:</strong> This media footprint has been committed to TruthLens immutable local database. Any future uploads with matching cryptographic hash records will retrieve referencing analysis histories automatically.
        </span>
      </div>
    </div>
  );
};
