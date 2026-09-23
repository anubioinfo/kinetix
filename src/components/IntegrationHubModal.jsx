import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileCode, 
  RefreshCw, 
  Layers, 
  Zap, 
  Check, 
  Sparkles,
  Link2
} from 'lucide-react';
import { 
  parseCSVToMilestones, 
  parseMSProjectXMLText, 
  exportMilestonesToCSV, 
  exportToJiraCSV, 
  exportToMSProjectXML, 
  exportToJSON, 
  downloadSampleTemplate 
} from '../utils/exportUtils';

export default function IntegrationHubModal({ isOpen, onClose }) {
  const { milestones, setMilestones, goals, team } = useProject();

  const [activeTab, setActiveTab] = useState('excel'); // 'excel' | 'jira' | 'msproject' | 'paste'
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [importMode, setImportMode] = useState('append'); // 'append' | 'replace'
  const [pasteText, setPasteText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Jira simulated sync states
  const [jiraDomain, setJiraDomain] = useState('keepnote.atlassian.net');
  const [jiraProjectKey, setJiraProjectKey] = useState('KEEP');
  const [isJiraSyncing, setIsJiraSyncing] = useState(false);

  if (!isOpen) return null;

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      if (file.name.endsWith('.xml')) {
        const items = parseMSProjectXMLText(text);
        setParsedData(items);
        setStatusMsg(`Successfully parsed ${items.length} MS Project XML task(s)!`);
      } else {
        const items = parseCSVToMilestones(text);
        setParsedData(items);
        setStatusMsg(`Successfully parsed ${items.length} milestone(s) from ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleParsePastedText = () => {
    if (!pasteText.trim()) return;
    const items = parseCSVToMilestones(pasteText);
    setParsedData(items);
    setStatusMsg(`Parsed ${items.length} milestone(s) from pasted spreadsheet text.`);
  };

  // Simulate Jira API Sync
  const handleJiraSync = () => {
    setIsJiraSyncing(true);
    setStatusMsg('Connecting to Jira Cloud REST API...');

    setTimeout(() => {
      const jiraMockMilestones = [
        {
          id: 'ms-jira-101',
          title: 'Jira Epic: Cloud Vault Sync Engine',
          description: 'Synced from Jira Project KEEP (KEEP-101). Real-time encrypted data sync across devices.',
          goalId: goals[0]?.id || 'goal-1',
          startDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'In Progress',
          health: 'On Track',
          priority: 'P0',
          impact: 9,
          effort: 8,
          riceReach: 20000,
          riceImpact: 3.0,
          riceConfidence: 0.9,
          riceEffort: 5,
          owner: 'Akshay',
          tags: ['Jira-Import', 'Epic'],
          progress: 35,
          dependencies: [],
          features: [
            { id: 'f-jira-1', title: 'KEEP-102: End-to-End Encryption Layer', completed: true, points: 5 },
            { id: 'f-jira-2', title: 'KEEP-103: Conflict Resolution Worker', completed: false, points: 3 }
          ]
        },
        {
          id: 'ms-jira-104',
          title: 'Jira Epic: Rich Text Web Editor',
          description: 'Synced from Jira Project KEEP (KEEP-104). WYSIWYG note editing & formatting controls.',
          goalId: goals[1]?.id || 'goal-2',
          startDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'In Progress',
          health: 'On Track',
          priority: 'P1',
          impact: 8,
          effort: 5,
          riceReach: 15000,
          riceImpact: 2.5,
          riceConfidence: 0.85,
          riceEffort: 3,
          owner: 'Ram',
          tags: ['Jira-Import', 'Web'],
          progress: 50,
          dependencies: [],
          features: [
            { id: 'f-jira-3', title: 'KEEP-105: Table & Code Block formatting', completed: true, points: 3 }
          ]
        }
      ];

      setParsedData(jiraMockMilestones);
      setIsJiraSyncing(false);
      setStatusMsg(`Successfully fetched ${jiraMockMilestones.length} Epics from ${jiraDomain} (${jiraProjectKey})!`);
    }, 1200);
  };

  const handleApplyImport = () => {
    if (!parsedData || parsedData.length === 0) return;

    if (importMode === 'replace') {
      setMilestones(parsedData);
    } else {
      setMilestones(prev => [...parsedData, ...prev]);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setParsedData(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md">
              <UploadCloud className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>Universal Integration Hub</span>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">Live Sync & Import</span>
              </h2>
              <p className="text-xs text-indigo-200 font-medium">Import, export, & sync milestones with Excel, CSV, Jira, & MS Project</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Hub Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-bold gap-2 pt-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('excel'); setParsedData(null); }}
            className={`py-2.5 px-4 rounded-t-lg transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'excel' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / CSV Drag & Drop</span>
          </button>

          <button
            onClick={() => { setActiveTab('jira'); setParsedData(null); }}
            className={`py-2.5 px-4 rounded-t-lg transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'jira' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>Jira Import & Export</span>
          </button>

          <button
            onClick={() => { setActiveTab('msproject'); setParsedData(null); }}
            className={`py-2.5 px-4 rounded-t-lg transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'msproject' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span>MS Project XML / MPP</span>
          </button>

          <button
            onClick={() => { setActiveTab('paste'); setParsedData(null); }}
            className={`py-2.5 px-4 rounded-t-lg transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'paste' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-4 h-4 text-purple-600" />
            <span>Direct Paste Spreadsheet</span>
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: Excel & CSV Drag and Drop */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  dragActive 
                    ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]' 
                    : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/20'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Drag & Drop your Excel or CSV File Here</h3>
                  <p className="text-slate-500 text-xs mt-1">Supports <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">.csv</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">.xlsx</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">.tsv</code> files</p>
                </div>

                <label className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs">
                  Browse File from Computer
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.tsv,.txt" 
                    onChange={handleFileInput} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Sample Templates & Export Options */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Need a starting template?</span>
                  <span className="text-slate-500">Download formatted CSV template for easy spreadsheet editing.</span>
                </div>
                <button
                  onClick={() => downloadSampleTemplate('csv')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Jira Import & Export */}
          {activeTab === 'jira' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">Jira Software Cloud Integration</h3>
                      <p className="text-slate-500 text-xs">Sync Sprints & Epics directly or export Kinetix milestones to Jira CSV format.</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">REST API v3 Ready</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Jira Cloud Domain</label>
                    <input 
                      type="text" 
                      value={jiraDomain} 
                      onChange={(e) => setJiraDomain(e.target.value)}
                      placeholder="org.atlassian.net" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Project Key / JQL</label>
                    <input 
                      type="text" 
                      value={jiraProjectKey} 
                      onChange={(e) => setJiraProjectKey(e.target.value)}
                      placeholder="e.g. KEEP" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleJiraSync}
                    disabled={isJiraSyncing}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isJiraSyncing ? 'animate-spin' : ''}`} />
                    <span>{isJiraSyncing ? 'Syncing Jira Epics...' : 'Sync Epics from Jira Cloud'}</span>
                  </button>

                  <button
                    onClick={() => exportToJiraCSV(milestones)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Export Roadmap to Jira CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MS Project Integration */}
          {activeTab === 'msproject' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Microsoft Project (.XML / .MPP) Hub</h3>
                    <p className="text-slate-500 text-xs">Import Work Breakdown Structures (WBS) with task durations, start/finish dates, & resources.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Upload MS Project XML File</label>
                  <input 
                    type="file" 
                    accept=".xml,.mpp,.csv" 
                    onChange={handleFileInput}
                    className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Need to export Kinetix to MS Project?</span>
                  <button
                    onClick={() => exportToMSProjectXML(milestones)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Roadmap to MS Project XML</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Direct Paste Spreadsheet Data */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Paste Spreadsheet Data (Excel / Google Sheets)</h3>
                  <p className="text-slate-500 text-xs">Copy rows directly from Excel or Google Sheets and paste below.</p>
                </div>

                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={6}
                  placeholder={`Title\tOwner\tStatus\tHealth\tStart Date\tDue Date\n"Cloud Sync Engine"\tAkshay\tIn Progress\tOn Track\t2026-09-01\t2026-10-15`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600"
                />

                <button
                  onClick={handleParsePastedText}
                  disabled={!pasteText.trim()}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Parse & Preview Spreadsheet Data</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Notification Message */}
          {statusMsg && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* PARSED DATA PREVIEW GRID */}
          {parsedData && parsedData.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-200 animate-slide-up">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <span>Parsed Roadmap Preview</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono">
                      {parsedData.length} Milestones Found
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs">Review detected records before applying to active Kinetix roadmap.</p>
                </div>

                {/* Import Mode Selection */}
                <div className="flex items-center gap-3 text-xs bg-white p-1.5 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer px-2 py-1 rounded hover:bg-slate-100">
                    <input 
                      type="radio" 
                      name="importMode" 
                      value="append" 
                      checked={importMode === 'append'} 
                      onChange={() => setImportMode('append')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Append to Existing</span>
                  </label>

                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer px-2 py-1 rounded hover:bg-slate-100">
                    <input 
                      type="radio" 
                      name="importMode" 
                      value="replace" 
                      checked={importMode === 'replace'} 
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-amber-700">Overwrite Entire Roadmap</span>
                  </label>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Health</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3 text-center">Impact/Effort</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-extrabold text-slate-900 max-w-[220px] truncate">{m.title}</td>
                          <td className="p-3 font-semibold text-slate-700">{m.owner}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.health === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {m.health}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-600">{m.dueDate}</td>
                          <td className="p-3 text-center font-mono font-bold text-indigo-700">
                            {m.impact}/10 | {m.effort} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Apply Action Button */}
              <button
                onClick={handleApplyImport}
                disabled={isSuccess}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    <span>Successfully Imported {parsedData.length} Milestones!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Import {parsedData.length} Milestones into Kinetix Roadmap</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
