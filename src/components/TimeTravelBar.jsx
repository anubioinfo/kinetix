import React from 'react';
import { useProject } from '../context/ProjectContext';
import { RotateCcw, History } from 'lucide-react';
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
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center space-x-2">
        <div className="p-1 bg-amber-200/80 rounded text-amber-900 animate-pulse">
          <History className="w-4 h-4" />
        </div>
        <div>
          <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-800 bg-amber-200/50 px-1.5 py-0.5 rounded mr-2">
            Time Travel Active
          </span>
          <span className="font-medium text-amber-900">
            Viewing historical state as of <strong>{timeTravelDate}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-white border border-amber-200 rounded-lg p-0.5 shadow-2xs">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setTimeTravelDate(p.date)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                (p.date === timeTravelDate)
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-amber-800 hover:bg-amber-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTimeTravelDate(null)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Exit Time Travel</span>
        </button>
      </div>
    </div>
  );
}
