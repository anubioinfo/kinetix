import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { AlertTriangle, Sparkles, CheckCircle2, RefreshCw, X, ShieldAlert, Zap } from 'lucide-react';

export default function AIRiskWarningBanner() {
  const { aiRiskAlerts, applyAIRiskFix } = useProject();
  const [fixedAlertIds, setFixedAlertIds] = useState([]);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!aiRiskAlerts || aiRiskAlerts.length === 0 || isDismissed) return null;

  const activeAlerts = aiRiskAlerts.filter(a => !fixedAlertIds.includes(a.id));
  if (activeAlerts.length === 0) return null;

  const handleFix = (alertId) => {
    applyAIRiskFix(alertId);
    setFixedAlertIds(prev => [...prev, alertId]);
  };

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 p-3 px-4 text-xs shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Kinetix AI Risk Radar:</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[10px] font-extrabold border border-amber-300">
                {activeAlerts.length} Active {activeAlerts.length === 1 ? 'Risk' : 'Risks'}
              </span>
            </div>
            <p className="text-amber-800 font-medium truncate leading-tight">
              {activeAlerts[0].title} — {activeAlerts[0].message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleFix(activeAlerts[0].id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Apply AI Fix: {activeAlerts[0].remediationText}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-200/50 transition-colors"
            title="Dismiss Alert Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
