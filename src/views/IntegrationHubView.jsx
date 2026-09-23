import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  FileCode, 
  RefreshCw, 
  Layers, 
  Sparkles,
  Link2,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  parseCSVToMilestones, 
  parseMSProjectXMLText, 
  exportMilestonesToCSV, 
  exportToJiraCSV, 
  exportToMSProjectXML, 
  downloadSampleTemplate 
} from '../utils/exportUtils';

export default function IntegrationHubView() {
  const { milestones, setMilestones, goals } = useProject();

  const [activeTab, setActiveTab] = useState('excel');
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [importMode, setImportMode] = useState('append');
  const [pasteText, setPasteText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Jira simulated sync states
  const [jiraDomain, setJiraDomain] = useState('keepnote.atlassian.net');
  const [jiraProjectKey, setJiraProjectKey] = useState('KEEP');
  const [isJiraSyncing, setIsJiraSyncing] = useState(false);

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

  const handleJiraSync = () => {
    setIsJiraSyncing(true);
    setStatusMsg('Connecting to Jira Cloud REST API...');

    setTimeout(() => {
      const jiraMockMilestones = [
        {
          id: 'ms-jira-201',
          title: 'Jira Epic: Cloud Vault Sync Engine',
          description: 'Synced from Jira Project KEEP (KEEP-201). Real-time encrypted data sync across devices.',
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
            { id: 'f-jira-201-1', title: 'KEEP-202: End-to-End Encryption Layer', completed: true, points: 5 }
          ]
        },
        {
          id: 'ms-jira-204',
          title: 'Jira Epic: Rich Text Web Editor',
          description: 'Synced from Jira Project KEEP (KEEP-204). WYSIWYG note editing & formatting controls.',
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
            { id: 'f-jira-204-1', title: 'KEEP-205: Table & Code Block formatting', completed: true, points: 3 }
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
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md">
            <UploadCloud className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <span>Data Sync & Enterprise Integrations</span>
              <span className="text-xs uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-mono">
                Enterprise Sync Engine
              </span>
            </h2>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              Seamlessly import, export, and live-sync project milestones with Excel, CSV, Jira Software, and Microsoft Project.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSampleTemplate('csv')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Sample CSV</span>
          </button>
          <button
            onClick={() => exportMilestonesToCSV(milestones)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Roadmap CSV</span>
          </button>
        </div>
      </div>

      {/* Main Hub Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-bold gap-3 pt-3 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('excel'); setParsedData(null); }}
            className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'excel' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs font-extrabold' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / CSV Drag & Drop</span>
          </button>

          <button
            onClick={() => { setActiveTab('jira'); setParsedData(null); }}
            className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'jira' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs font-extrabold' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>Jira Software Sync</span>
          </button>

          <button
            onClick={() => { setActiveTab('msproject'); setParsedData(null); }}
            className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'msproject' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs font-extrabold' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span>MS Project XML / MPP</span>
          </button>

          <button
            onClick={() => { setActiveTab('paste'); setParsedData(null); }}
            className={`py-3 px-5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 border-x ${
              activeTab === 'paste' 
                ? 'bg-white text-indigo-700 border-t-indigo-600 border-x-slate-200 shadow-2xs font-extrabold' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-4 h-4 text-purple-600" />
            <span>Direct Paste Spreadsheet</span>
          </button>
        </div>

        {/* Tab Content View */}
        <div className="p-6 space-y-6">
          
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  dragActive 
                    ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]' 
                    : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Drag & Drop your Excel or CSV Spreadsheet Here</h3>
                  <p className="text-slate-500 text-xs mt-1">Parses milestone titles, owners, statuses, due dates, impact, effort, and RICE scores automatically.</p>
                </div>

                <label className="mt-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md">
                  Choose File from Computer
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.tsv,.txt" 
                    onChange={handleFileInput} 
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Auto Field Detection</span>
                  </span>
                  <p className="text-slate-500">Supports headers: <code className="text-indigo-700 font-mono">Title, Owner, Status, Health, Due Date, Impact, Effort</code>.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Instant RICE Calculation</span>
                  </span>
                  <p className="text-slate-500">Auto-calculates RICE Reach, Impact, Confidence, & Effort metrics for every imported item.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jira' && (
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Jira Software Cloud Integration</h3>
                      <p className="text-slate-500 text-xs">Import Jira Epics & User Stories directly into Kinetix Roadmap.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Jira Cloud Domain</label>
                    <input 
                      type="text" 
                      value={jiraDomain} 
                      onChange={(e) => setJiraDomain(e.target.value)}
                      placeholder="org.atlassian.net" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Project Key / JQL</label>
                    <input 
                      type="text" 
                      value={jiraProjectKey} 
                      onChange={(e) => setJiraProjectKey(e.target.value)}
                      placeholder="e.g. KEEP" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleJiraSync}
                    disabled={isJiraSyncing}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isJiraSyncing ? 'animate-spin' : ''}`} />
                    <span>{isJiraSyncing ? 'Syncing Jira Epics...' : 'Sync Epics from Jira Cloud'}</span>
                  </button>

                  <button
                    onClick={() => exportToJiraCSV(milestones)}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Export Kinetix to Jira CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'msproject' && (
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Microsoft Project (.XML / .MPP) Integration</h3>
                    <p className="text-slate-500 text-xs">Import Work Breakdown Structure (WBS), task start/finish dates, & predecessor dependencies.</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Upload MS Project XML File</label>
                  <input 
                    type="file" 
                    accept=".xml,.mpp,.csv" 
                    onChange={handleFileInput}
                    className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">Need MS Project XML Export?</span>
                  <button
                    onClick={() => exportToMSProjectXML(milestones)}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Roadmap to MS Project XML</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Paste Raw Spreadsheet Rows</h3>
                  <p className="text-slate-500 text-xs">Copy cells from Microsoft Excel or Google Sheets and paste them below.</p>
                </div>

                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={8}
                  placeholder={`Title\tOwner\tStatus\tHealth\tStart Date\tDue Date\n"Cloud Sync Engine"\tAkshay\tIn Progress\tOn Track\t2026-09-01\t2026-10-15`}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600"
                />

                <button
                  onClick={handleParsePastedText}
                  disabled={!pasteText.trim()}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Parse & Preview Spreadsheet Data</span>
                </button>
              </div>
            </div>
          )}

          {statusMsg && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* PARSED PREVIEW GRID */}
          {parsedData && parsedData.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-slide-up">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>Parsed Roadmap Preview</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                      {parsedData.length} Milestones Found
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs">Review detected records before applying to active Kinetix roadmap.</p>
                </div>

                <div className="flex items-center gap-3 text-xs bg-slate-100 p-2 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer px-2 py-1 rounded hover:bg-white">
                    <input 
                      type="radio" 
                      name="importModeView" 
                      value="append" 
                      checked={importMode === 'append'} 
                      onChange={() => setImportMode('append')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Append to Existing</span>
                  </label>

                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer px-2 py-1 rounded hover:bg-white">
                    <input 
                      type="radio" 
                      name="importModeView" 
                      value="replace" 
                      checked={importMode === 'replace'} 
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-amber-700">Overwrite Entire Roadmap</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="max-h-72 overflow-y-auto">
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
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-extrabold text-slate-900 max-w-[240px] truncate">{m.title}</td>
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

              <button
                onClick={handleApplyImport}
                disabled={isSuccess}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    <span>Successfully Imported {parsedData.length} Milestones into Kinetix Roadmap!</span>
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
