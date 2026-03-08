
import React, { useState } from 'react';
import { AuditForm } from './components/AuditForm';
import { AuditResultView } from './components/AuditResult';
import { ScanResult } from './types';
import { scanCMAForFraud } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (cmaName: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const scanData = await scanCMAForFraud(cmaName);
      setResult(scanData);
    } catch (err: any) {
      setError(err.message || "Forensic sweep failed. Connectivity anomaly or API constraint reached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-0 sm:px-4 py-8 md:py-20">
      <header className="mb-10 md:mb-16 text-center px-6">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-700 rounded-2xl mb-6 shadow-2xl shadow-blue-500/40 transform -rotate-3 border border-blue-500/50">
          <i className="fas fa-balance-scale text-2xl md:text-3xl text-white rotate-3"></i>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 uppercase">
          CanGuard <span className="text-blue-500">Forensic</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-bold tracking-tight uppercase text-[9px] md:text-xs leading-relaxed">
          Recruitment Audit & Anomaly Detection Pipeline<br/>
          <span className="text-blue-900/50">Working for Workers Act — 2026 Regulatory Context</span>
        </p>
      </header>

      <main className="space-y-12 md:space-y-20">
        <section className="w-full max-w-3xl mx-auto">
          <AuditForm onScan={handleScan} isLoading={loading} />
        </section>

        {error && (
          <div className="mx-0 sm:mx-auto bg-red-950/20 border-y sm:border border-red-900/50 p-6 sm:rounded-2xl flex items-center gap-4 text-red-400 max-w-2xl">
            <i className="fas fa-circle-exclamation text-2xl"></i>
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest">Audit Error</h4>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 space-y-6 px-6">
            <div className="relative inline-block">
              <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-blue-900/10 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 md:w-16 md:h-16 border-4 border-slate-900/20 border-b-blue-400 rounded-full animate-spin-slow"></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-blue-500 font-black tracking-widest text-[9px] md:text-[10px] uppercase animate-pulse">Running Forensic Scan (90d Lookback)...</p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                <span>NOC Wage Baseline</span>
                <span>Zoning Validation</span>
                <span>Registry Cross-Ref</span>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 w-full">
            <AuditResultView result={result} />
          </div>
        )}
      </main>

      <footer className="mt-20 md:mt-32 pt-10 border-t border-slate-900 flex flex-col items-center gap-6 px-6 text-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
          <span className="flex items-center gap-2"><i className="fas fa-gavel"></i> Libel Safe</span>
          <span className="flex items-center gap-2"><i className="fas fa-file-contract"></i> 2026 Act</span>
          <span className="flex items-center gap-2"><i className="fas fa-fingerprint"></i> OSINT Pipeline</span>
        </div>
        <p className="text-[9px] md:text-[10px] text-slate-800 font-medium">CAN-FORENSIC-AUDIT-v5.1.0-PROD</p>
      </footer>
    </div>
  );
};

export default App;
