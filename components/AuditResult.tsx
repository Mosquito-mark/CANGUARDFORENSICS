
import React, { useState, useMemo } from 'react';
import { ScanResult, FlaggedPosting } from '../types';
import { CITY_REGISTRY } from '../constants';
import { Button } from './Button';

interface AuditResultProps {
  result: ScanResult;
}

type SortField = 'postedDaysAgo' | 'riskScore' | 'riskLevel';
type SortDirection = 'asc' | 'desc';

const RISK_PRIORITY_MAP: Record<string, number> = {
  'Low': 1,
  'Medium': 2,
  'High': 3,
  'Critical': 4
};

const PostingCard: React.FC<{ posting: FlaggedPosting, cityName: string }> = ({ posting, cityName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cityInfo = CITY_REGISTRY[cityName] || CITY_REGISTRY[Object.keys(CITY_REGISTRY).find(k => cityName.includes(k)) || ''];

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const encodedAddress = encodeURIComponent(`${posting.address}, ${cityName}, Canada`);
  const streetView = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <div className={`sm:border border-x-0 border-y border-slate-800 sm:rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-0 sm:ring-1 ring-blue-500/50 bg-slate-900/40' : 'bg-slate-900/20 hover:bg-slate-900/40'} ${posting.isNewBusiness ? 'border-l-4 border-l-cyan-500' : ''}`}>
      <div 
        className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getPriorityColor(posting.riskLevel)} border-current bg-current/5`}>
              {posting.riskLevel} Audit
            </span>
            {posting.isNewBusiness && (
              <span className="text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded border border-cyan-500 text-cyan-400 bg-cyan-950/30">
                New Entity
              </span>
            )}
            <span className="text-slate-600 text-[10px]">• {posting.postedDaysAgo}d active</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-100">{posting.title}</h3>
          <p className="text-[11px] md:text-xs text-slate-500 font-medium truncate max-w-[280px] sm:max-w-none">{posting.company} — {posting.address}</p>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6">
          <div className="text-left md:text-right">
            <div className="text-[8px] md:text-[9px] uppercase font-bold text-slate-600 tracking-widest">Anomaly Index</div>
            <div className={`text-xl md:text-2xl font-black ${getPriorityColor(posting.riskLevel)}`}>{posting.riskScore}%</div>
          </div>
          <i className={`fas fa-chevron-down transition-transform duration-300 text-slate-700 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}></i>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 md:p-6 border-t border-slate-800/50 bg-slate-950/30 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                   <div className="text-[8px] font-black text-slate-500 uppercase mb-1">AI Disclosure (2026)</div>
                   <div className={`text-[10px] font-bold ${posting.aiDisclosureStatus === 'Compliant' ? 'text-green-400' : 'text-red-400'}`}>
                     {posting.aiDisclosureStatus}
                   </div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                   <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Transparency</div>
                   <div className={`text-[10px] font-bold ${posting.salaryTransparencyStatus === 'Compliant' ? 'text-green-400' : 'text-red-400'}`}>
                     {posting.salaryTransparencyStatus}
                   </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-2">
                  <i className="fas fa-list-check"></i> Forensic Indicators
                </h4>
                <ul className="space-y-2">
                  {posting.indicators.map((indicator, i) => (
                    <li key={i} className="text-xs text-slate-300 flex gap-2">
                      <span className="text-blue-500">•</span> {indicator}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-2">
                  <i className="fas fa-gavel"></i> Investigative Opinion
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-800 pl-4">
                  {posting.forensicAnalysis}
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3">Verification Tools</h4>
                <div className="grid grid-cols-1 gap-2">
                  <a href={streetView} target="_blank" className="flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-md text-[10px] font-bold transition-colors">
                    <span>VISUAL AUDIT (STREET VIEW)</span>
                    <i className="fas fa-street-view"></i>
                  </a>
                  {cityInfo && (
                    <>
                      <a href={cityInfo.zoningLink} target="_blank" className="flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-md text-[10px] font-bold transition-colors">
                        <span>ZONING & LAND USE MAP</span>
                        <i className="fas fa-map"></i>
                      </a>
                      <a href={cityInfo.registryLink} target="_blank" className="flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-md text-[10px] font-bold transition-colors">
                        <span>BUSINESS REGISTRY</span>
                        <i className="fas fa-building"></i>
                      </a>
                    </>
                  )}
                </div>
              </section>
              <section>
                 <Button variant="danger" className="w-full text-[10px] py-3 uppercase tracking-widest" onClick={() => {
                   navigator.clipboard.writeText(posting.cafcBlock);
                   alert('CAFC block copied.');
                 }}>
                   COPY CAFC EVIDENTIARY BLOCK
                 </Button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuditDashboard: React.FC<{ result: ScanResult, onExport: () => void }> = ({ result, onExport }) => {
  const stats = useMemo(() => {
    const totalFlagged = result.flaggedPostings.length;
    const avgRisk = totalFlagged > 0 ? result.flaggedPostings.reduce((acc, p) => acc + p.riskScore, 0) / totalFlagged : 0;
    const criticalCount = result.flaggedPostings.filter(p => p.riskLevel === 'Critical').length;
    const newEntities = result.flaggedPostings.filter(p => p.isNewBusiness).length;
    
    const riskLevels = {
      Critical: result.flaggedPostings.filter(p => p.riskLevel === 'Critical').length,
      High: result.flaggedPostings.filter(p => p.riskLevel === 'High').length,
      Medium: result.flaggedPostings.filter(p => p.riskLevel === 'Medium').length,
      Low: result.flaggedPostings.filter(p => p.riskLevel === 'Low').length,
    };

    const compliance = {
      ai: result.flaggedPostings.filter(p => p.aiDisclosureStatus === 'Compliant').length,
      salary: result.flaggedPostings.filter(p => p.salaryTransparencyStatus === 'Compliant').length,
    };

    return { totalFlagged, avgRisk, criticalCount, newEntities, riskLevels, compliance };
  }, [result.flaggedPostings]);

  return (
    <div className="space-y-4 md:space-y-6 mb-12 w-full">
      {/* Narrative Summary Section */}
      <div className="bg-slate-900/40 border-y sm:border border-slate-800 p-6 sm:rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 pointer-events-none">
          <i className="fas fa-fingerprint text-6xl md:text-8xl"></i>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-tighter">
              Forensic Narrative <span className="text-slate-500 tracking-widest text-[9px] md:text-xs font-bold ml-1 md:ml-2">CMA: {result.cmaName}</span>
            </h2>
          </div>
          <Button variant="secondary" className="w-full md:w-auto text-[9px] md:text-[10px] py-3 md:px-6 uppercase tracking-widest font-black border border-slate-700/50" onClick={onExport}>
            <i className="fas fa-file-csv mr-2"></i> Export Audit Results
          </Button>
        </div>
        <p className="text-slate-400 text-[13px] md:text-sm leading-relaxed font-medium">
          {result.summary}
        </p>
      </div>

      {/* Stats Grid - Vertical Separators for Desktop, Horizontal for Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-6 border-y sm:border border-slate-800/80 bg-slate-800/20 sm:rounded-2xl overflow-hidden divide-x divide-y md:divide-y-0 divide-slate-800">
        <div className="p-4 md:p-5">
          <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Vol</div>
          <div className="text-lg md:text-2xl font-black text-slate-100">{result.totalMarketVolume.toLocaleString()}</div>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Reviewed</div>
          <div className="text-lg md:text-2xl font-black text-slate-100">{result.reviewedPostingsCount.toLocaleString()}</div>
        </div>
        <div className="p-4 md:p-5 border-l-4 md:border-l-0 border-l-red-500">
          <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Anomalies</div>
          <div className="text-lg md:text-2xl font-black text-red-500">{stats.totalFlagged}</div>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg Index</div>
          <div className="text-lg md:text-2xl font-black text-blue-500">{stats.avgRisk.toFixed(1)}%</div>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Critical</div>
          <div className="text-lg md:text-2xl font-black text-red-500">{stats.criticalCount}</div>
        </div>
        <div className="p-4 md:p-5 border-l-4 md:border-l-0 border-l-cyan-500">
          <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">New Ents</div>
          <div className="text-lg md:text-2xl font-black text-cyan-500">{stats.newEntities}</div>
        </div>
      </div>

      {/* Visual Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px md:gap-6 bg-slate-800 sm:bg-transparent">
        <div className="bg-slate-900/40 md:bg-slate-900/20 md:border border-slate-800 p-6 md:rounded-2xl">
          <h3 className="text-[9px] md:text-xs font-black uppercase text-slate-500 tracking-widest mb-5 flex items-center gap-2">
            <i className="fas fa-chart-bar text-blue-500"></i> Risk Priority Distribution
          </h3>
          <div className="space-y-5">
            {Object.entries(stats.riskLevels).map(([level, count]) => {
              const percentage = stats.totalFlagged > 0 ? (count / stats.totalFlagged) * 100 : 0;
              const colorClass = level === 'Critical' ? 'bg-red-500' : 
                               level === 'High' ? 'bg-orange-500' : 
                               level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
                    <span className="text-slate-400">{level}</span>
                    <span className="text-slate-200">{count} Cases ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <div 
                      className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/40 md:bg-slate-900/20 md:border border-slate-800 p-6 md:rounded-2xl">
          <h3 className="text-[9px] md:text-xs font-black uppercase text-slate-500 tracking-widest mb-5 flex items-center gap-2">
            <i className="fas fa-shield-check text-green-500"></i> 2026 Compliance Overview
          </h3>
          <div className="grid grid-cols-1 gap-8">
             <div className="flex items-center gap-5">
               <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                  <svg className="w-14 h-14 md:w-16 md:h-16 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-slate-800 md:hidden" />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-800 hidden md:block" />
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" 
                      strokeDasharray={2 * Math.PI * 24} 
                      strokeDashoffset={2 * Math.PI * 24 * (1 - (stats.compliance.ai / (stats.totalFlagged || 1)))} 
                      className="text-blue-500 transition-all duration-1000 ease-out md:hidden"
                    />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 28} 
                      strokeDashoffset={2 * Math.PI * 28 * (1 - (stats.compliance.ai / (stats.totalFlagged || 1)))} 
                      className="text-blue-500 transition-all duration-1000 ease-out hidden md:block"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[11px] font-black text-slate-100">
                    {((stats.compliance.ai / (stats.totalFlagged || 1)) * 100).toFixed(0)}%
                  </div>
               </div>
               <div>
                 <div className="text-[10px] md:text-[11px] font-black text-slate-100 uppercase tracking-tight">AI Recruitment Disclosure</div>
                 <div className="text-[9px] md:text-xs text-slate-500 leading-tight mt-1.5 font-medium">Algorithmic screening transparency status.</div>
               </div>
             </div>

             <div className="flex items-center gap-5 border-t border-slate-800 pt-6">
               <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                  <svg className="w-14 h-14 md:w-16 md:h-16 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-slate-800 md:hidden" />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-800 hidden md:block" />
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" 
                      strokeDasharray={2 * Math.PI * 24} 
                      strokeDashoffset={2 * Math.PI * 24 * (1 - (stats.compliance.salary / (stats.totalFlagged || 1)))} 
                      className="text-cyan-400 transition-all duration-1000 ease-out md:hidden"
                    />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 28} 
                      strokeDashoffset={2 * Math.PI * 28 * (1 - (stats.compliance.salary / (stats.totalFlagged || 1)))} 
                      className="text-cyan-400 transition-all duration-1000 ease-out hidden md:block"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[11px] font-black text-slate-100">
                    {((stats.compliance.salary / (stats.totalFlagged || 1)) * 100).toFixed(0)}%
                  </div>
               </div>
               <div>
                 <div className="text-[10px] md:text-[11px] font-black text-slate-100 uppercase tracking-tight">Salary Transparency</div>
                 <div className="text-[9px] md:text-xs text-slate-500 leading-tight mt-1.5 font-medium">Public posting of specific pay rates.</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuditResultView: React.FC<AuditResultProps> = ({ result }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedPostings = useMemo(() => {
    const data = [...result.flaggedPostings];
    return data.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'riskLevel') {
        valA = RISK_PRIORITY_MAP[valA] || 0;
        valB = RISK_PRIORITY_MAP[valB] || 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [result.flaggedPostings, sortField, sortDirection]);

  const paginatedPostings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPostings.slice(startIndex, startIndex + pageSize);
  }, [sortedPostings, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedPostings.length / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: document.getElementById('results-list')?.offsetTop ? document.getElementById('results-list')!.offsetTop - 100 : 0, behavior: 'smooth' });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      'Audit Title',
      'Company',
      'Address',
      'Salary Range',
      'Days Active',
      'Anomaly Index (%)',
      'Audit Priority',
      'Verified Status',
      'New Entity Flag',
      'AI Disclosure (2026)',
      'Salary Transparency',
      'Forensic Indicators',
      'Investigative Opinion'
    ];

    const disclaimer = 'LEGAL DISCLAIMER: The findings presented are investigative opinions based on the cross-referencing of publicly available records including municipal zoning business registries and regional wage baselines. No definitive determination of legality is made. All identifiers are anomalies for further user verification.';

    const rows = sortedPostings.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.company.replace(/"/g, '""')}"`,
      `"${p.address.replace(/"/g, '""')}"`,
      `"${p.salary.replace(/"/g, '""')}"`,
      p.postedDaysAgo,
      p.riskScore,
      p.riskLevel,
      p.isVerified ? 'VERIFIED' : 'UNVERIFIED',
      p.isNewBusiness ? 'YES' : 'NO',
      p.aiDisclosureStatus,
      p.salaryTransparencyStatus,
      `"${p.indicators.join(' | ').replace(/"/g, '""')}"`,
      `"${p.forensicAnalysis.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      `"AUDIT REPORT - ${result.cmaName.toUpperCase()} - ${new Date(result.timestamp).toLocaleDateString()}"`,
      `"${disclaimer}"`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CanGuard_Audit_${result.cmaName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 w-full" id="results-list">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8 px-6 sm:px-0">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
             <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-black uppercase tracking-widest text-blue-400 border border-blue-900/50">Pipeline Active</span>
             <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tighter w-full md:w-auto">
               Audit <span className="text-blue-500">Dashboard</span>
             </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl text-[9px] md:text-[10px] uppercase tracking-widest">Anomaly Detection & Regulatory Compliance Tracking</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <div className="text-right font-mono text-[9px] text-slate-600 uppercase tracking-widest">
            Audit ID: {new Date(result.timestamp).getTime().toString(36).toUpperCase()}
          </div>
        </div>
      </div>

      <AuditDashboard result={result} onExport={exportToCSV} />

      <div className="space-y-4 md:space-y-6 pt-10 border-t border-slate-900 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 sm:px-0 mb-4">
           <h3 className="text-[11px] md:text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Detailed Record Audit</h3>
           <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800 w-full md:w-auto">
              <label htmlFor="sortField" className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-2">Sort:</label>
              <select 
                id="sortField"
                value={sortField}
                onChange={(e) => handleSort(e.target.value as SortField)}
                className="bg-slate-950 text-slate-100 border border-slate-800 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer flex-grow"
              >
                <option value="riskScore">Index</option>
                <option value="riskLevel">Priority</option>
                <option value="postedDaysAgo">Age</option>
              </select>
              <button 
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-400"
              >
                <i className={`fas fa-sort-amount-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800 w-full md:w-auto">
              <label htmlFor="pageSize" className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-2">Limit:</label>
              <select 
                id="pageSize"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-950 text-slate-100 border border-slate-800 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer flex-grow"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-px md:space-y-4">
          {paginatedPostings.map((posting, idx) => (
            <PostingCard key={idx} posting={posting} cityName={result.cmaName} />
          ))}
        </div>
      </div>

      <div className="bg-slate-950 p-6 border-y sm:border border-slate-900 sm:rounded-lg">
        <p className="text-[8px] md:text-[9px] text-slate-700 leading-tight uppercase tracking-wider text-center max-w-2xl mx-auto font-medium">
          <span className="font-black text-slate-600">LEGAL DISCLAIMER:</span> The findings presented are investigative opinions based on the cross-referencing of publicly available records including municipal zoning, business registries, and regional wage baselines. No definitive determination of legality is made. All identifiers are "anomalies" for further user verification.
        </p>
      </div>

      <div className="pt-4 flex flex-col items-center gap-4 pb-12">
          <div className="flex items-center gap-1">
            <Button 
              variant="secondary" 
              className="w-10 h-10 p-0 rounded-lg flex items-center justify-center border border-slate-800 disabled:opacity-20"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <div className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Page {currentPage} / {totalPages}
            </div>
            <Button 
              variant="secondary" 
              className="w-10 h-10 p-0 rounded-lg flex items-center justify-center border border-slate-800 disabled:opacity-20"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
      </div>
    </div>
  );
};
