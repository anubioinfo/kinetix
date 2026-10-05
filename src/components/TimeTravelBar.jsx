import React from 'react';
import { useProject } from '../context/ProjectContext';
import { RotateCcw, History, Calendar } from 'lucide-react';
import { formatDateStr } from '../utils/dateUtils';

function subDaysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDateStr(d);
}

export default function TimeTravelBar() {
  const { timeTravelDate, setTimeTravelDate } = useProject();

  const presets = [
    { label: 'Today (Live)', date: null },
    { label: '7 Days Ago', date: subDaysFromNow(7) },
    { label: '14 Days Ago', date: subDaysFromNow(14) },
    { label: '30 Days Ago', date: subDaysFromNow(30) },
    { label: '60 Days Ago', date: subDaysFromNow(60) }
  ];

  if (!timeTravelDate) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-40 shadow-md animate-fade-in border-b border-amber-400/40">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-white/20 backdrop-blur-xs rounded-lg text-white animate-pulse shadow-xs">
          <History className="w-4 h-4 text-amber-100" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold uppercase text-[9px] tracking-wider bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded-full border border-amber-300/30 font-mono">
            Time Travel Active
          </span>
          <span className="font-bold text-amber-50 text-xs">
            Viewing historical roadmap snapshot as of <strong className="text-white font-mono underline underline-offset-2">{timeTravelDate}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Custom Date Picker */}
        <div className="flex items-center gap-1 bg-amber-900/40 border border-amber-300/30 rounded-lg px-2 py-1 shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-amber-200" />
          <input
            type="date"
            value={timeTravelDate || ''}
            onChange={(e) => setTimeTravelDate(e.target.value || null)}
            className="bg-transparent text-white text-[11px] font-mono font-bold focus:outline-none"
          />
        </div>

        {/* Preset Selector */}
        <div className="flex items-center bg-amber-950/40 border border-amber-300/30 rounded-lg p-0.5 shadow-inner">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setTimeTravelDate(p.date)}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                (p.date === timeTravelDate)
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Exit Time Travel / Return to Live State */}
        <button
          onClick={() => setTimeTravelDate(null)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md transition-all border border-slate-700 active:scale-95"
          title="Return to live current roadmap state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Return to Live State</span>
        </button>
      </div>
    </div>
  );
}

