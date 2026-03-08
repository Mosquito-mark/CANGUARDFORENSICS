
import React, { useState } from 'react';
import { Button } from './Button';

interface AuditFormProps {
  onScan: (cmaName: string) => void;
  isLoading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ onScan, isLoading }) => {
  const [cmaName, setCmaName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cmaName.trim()) {
      onScan(cmaName.trim());
    }
  };

  return (
    <div className="w-full bg-slate-900/40 border-y sm:border border-slate-800/60 p-1 rounded-none sm:rounded-2xl backdrop-blur-md shadow-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <input 
            required
            className="w-full bg-slate-950/50 text-lg md:text-xl border-none rounded-none sm:rounded-xl pl-12 pr-4 py-4 md:py-5 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-slate-600"
            placeholder="Enter CMA Name (e.g. Toronto)..."
            value={cmaName}
            onChange={e => setCmaName(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full md:w-48 py-4 md:py-5 rounded-none sm:rounded-xl text-lg uppercase tracking-widest font-black"
          isLoading={isLoading}
        >
          {isLoading ? 'Scanning' : 'Start Scan'}
        </Button>
      </form>
      <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar scroll-smooth">
        {['Toronto', 'Vancouver', 'Calgary', 'Montreal', 'Red Deer'].map(city => (
          <button
            key={city}
            type="button"
            onClick={() => { setCmaName(city); onScan(city); }}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/40 text-[9px] md:text-[10px] font-bold text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition-all border border-slate-700/50"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
