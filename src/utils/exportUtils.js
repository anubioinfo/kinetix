// Universal Integration & Import/Export Utilities for Kinetix

// Export current state to JSON backup
export function exportToJSON(data, filename = 'kinetix_roadmap_export.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export milestones to standard CSV
export function exportMilestonesToCSV(milestones, filename = 'kinetix_milestones.csv') {
  const headers = ['ID', 'Title', 'Status', 'Health', 'Priority', 'Start Date', 'Due Date', 'Progress %', 'Impact', 'Effort', 'Owner', 'Dependencies'];
  const rows = milestones.map(m => [
    `"${m.id}"`,
    `"${(m.title || '').replace(/"/g, '""')}"`,
    `"${m.status}"`,
    `"${m.health}"`,
    `"${m.priority}"`,
    `"${m.startDate}"`,
    `"${m.dueDate}"`,
    m.progress || 0,
    m.impact || 5,
    m.effort || 3,
    `"${m.owner || 'Unassigned'}"`,
    `"${(m.dependencies || []).join(';')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to Jira CSV Format
export function exportToJiraCSV(milestones, filename = 'kinetix_jira_import.csv') {
  const headers = ['Issue Type', 'Summary', 'Description', 'Assignee', 'Priority', 'Status', 'Story Points', 'Due Date'];
  const rows = milestones.map(m => [
    '"Epic"',
    `"${(m.title || '').replace(/"/g, '""')}"`,
    `"${(m.description || '').replace(/"/g, '""')}"`,
    `"${m.owner || ''}"`,
    `"${m.priority || 'Medium'}"`,
    `"${m.status === 'Completed' ? 'Done' : m.status === 'In Progress' ? 'In Progress' : 'To Do'}"`,
    m.effort || 5,
    `"${m.dueDate || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to MS Project XML Format
export function exportToMSProjectXML(milestones, filename = 'kinetix_msproject_export.xml') {
  const tasksXML = milestones.map((m, idx) => `
    <Task>
      <UID>${idx + 1}</UID>
      <ID>${idx + 1}</ID>
      <Name>${escapeXml(m.title)}</Name>
      <Type>0</Type>
      <CreateDate>${new Date().toISOString()}</CreateDate>
      <Start>${m.startDate}T08:00:00</Start>${m.dueDate ? `\n      <Finish>${m.dueDate}T17:00:00</Finish>` : ''}
      <PercentComplete>${m.progress || 0}</PercentComplete>
      <Priority>${m.priority === 'P0' ? 900 : m.priority === 'P1' ? 700 : 500}</Priority>
      <Notes>${escapeXml(m.description || '')}</Notes>
    </Task>`).join('');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Project xmlns="http://schemas.microsoft.com/project">
  <Title>Kinetix Exported Roadmap</Title>
  <CreationDate>${new Date().toISOString()}</CreationDate>
  <Tasks>${tasksXML}
  </Tasks>
</Project>`;

  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generic CSV / TSV Parser
export function parseCSVToMilestones(rawText) {
  if (!rawText || !rawText.trim()) return [];
  const lines = rawText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Determine delimiter (, or \t or ;)
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(';')) delimiter = ';';

  const headers = splitCSVLine(firstLine, delimiter).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));

  const parsedMilestones = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCSVLine(line, delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length === 0) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });

    // Auto-map fields
    const title = rowObj['title'] || rowObj['name'] || rowObj['summary'] || rowObj['milestone'] || `Imported Task ${i}`;
    const owner = rowObj['owner'] || rowObj['assignee'] || rowObj['lead'] || 'Jitendra';
    const status = normalizeStatus(rowObj['status']);
    const health = normalizeHealth(rowObj['health']);
    const priority = normalizePriority(rowObj['priority']);
    const startDate = rowObj['start date'] || rowObj['startdate'] || rowObj['start'] || new Date().toISOString().split('T')[0];
    
    // Calculate default due date if missing (14 days ahead)
    const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dueDate = rowObj['due date'] || rowObj['duedate'] || rowObj['end date'] || rowObj['due'] || rowObj['finish'] || defaultDue;

    const progress = parseInt(rowObj['progress %'] || rowObj['progress'] || rowObj['% complete'] || '15', 10) || 15;
    const impact = parseInt(rowObj['impact'] || '8', 10) || 8;
    const effort = parseInt(rowObj['effort'] || rowObj['story points'] || '4', 10) || 4;

    const riceReach = parseInt(rowObj['reach'] || '10000', 10) || 10000;
    const riceImpact = parseFloat(rowObj['rice impact'] || '2.5') || 2.5;
    const riceConfidence = parseFloat(rowObj['confidence'] || '0.8') || 0.8;
    const riceEffort = parseInt(rowObj['rice effort'] || '3', 10) || 3;

    parsedMilestones.push({
      id: `ms-imp-${Date.now()}-${i}`,
      title,
      description: rowObj['description'] || rowObj['notes'] || `Imported via Integration Hub on ${new Date().toLocaleDateString()}`,
      goalId: rowObj['goalid'] || 'goal-1',
      startDate,
      dueDate,
      status,
      health,
      priority,
      impact,
      effort,
      riceReach,
      riceImpact,
      riceConfidence,
      riceEffort,
      owner,
      tags: rowObj['tags'] ? rowObj['tags'].split(/[,;]/).map(t => t.trim()) : ['Imported'],
      progress: Math.min(100, Math.max(0, progress)),
      dependencies: rowObj['dependencies'] ? rowObj['dependencies'].split(/[,;]/).map(d => d.trim()) : [],
      features: [
        { id: `f-imp-${i}-1`, title: `Primary delivery phase for ${title}`, completed: progress > 50, points: Math.max(1, Math.round(effort * 0.6)) },
        { id: `f-imp-${i}-2`, title: `Validation & QA testing pass`, completed: progress === 100, points: Math.max(1, Math.round(effort * 0.4)) }
      ]
    });
  }

  return parsedMilestones;
}

// Parse MS Project XML
export function parseMSProjectXMLText(xmlText) {
  if (!xmlText || !xmlText.trim()) return [];
  const milestones = [];
  
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const taskNodes = xmlDoc.getElementsByTagName('Task');

    for (let i = 0; i < taskNodes.length; i++) {
      const task = taskNodes[i];
      const name = task.getElementsByTagName('Name')[0]?.textContent;
      if (!name || name === 'Project Summary') continue;

      const start = task.getElementsByTagName('Start')[0]?.textContent?.split('T')[0] || new Date().toISOString().split('T')[0];
      const finish = task.getElementsByTagName('Finish')[0]?.textContent?.split('T')[0] || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const percent = parseInt(task.getElementsByTagName('PercentComplete')[0]?.textContent || '0', 10);
      const notes = task.getElementsByTagName('Notes')[0]?.textContent || '';

      milestones.push({
        id: `ms-xml-${Date.now()}-${i}`,
        title: name,
        description: notes || `Imported from MS Project XML`,
        goalId: 'goal-1',
        startDate: start,
        dueDate: finish,
        status: percent === 100 ? 'Completed' : percent > 0 ? 'In Progress' : 'Planning',
        health: 'On Track',
        priority: 'P1',
        impact: 7,
        effort: 5,
        riceReach: 8000,
        riceImpact: 2.0,
        riceConfidence: 0.8,
        riceEffort: 4,
        owner: 'Jitendra',
        tags: ['MS-Project'],
        progress: percent,
        dependencies: [],
        features: [
          { id: `f-xml-${i}-1`, title: `WBS Execution: ${name}`, completed: percent > 50, points: 5 }
        ]
      });
    }
  } catch (err) {
    console.error('Error parsing MS Project XML:', err);
  }

  return milestones;
}

// Generate Downloadable Sample Templates
export function downloadSampleTemplate(type = 'csv') {
  if (type === 'csv') {
    const content = `Title,Owner,Status,Health,Priority,Start Date,Due Date,Progress %,Impact,Effort,Tags
"Mobile Cloud Sync Engine","Akshay","In Progress","On Track","P0","2026-09-01","2026-10-15",45,9,5,"Mobile, Cloud"
"WYSIWYG Markdown Editor","Ram","In Progress","On Track","P1","2026-09-10","2026-10-25",30,8,4,"Web, Frontend"
"Global CDN Distribution","Shyam","Planning","On Track","P1","2026-10-01","2026-11-10",0,7,3,"DevOps, Infrastructure"
"Automated Test Coverage","Dinesh","In Progress","At Risk","P2","2026-09-15","2026-10-20",20,6,4,"QA, Automation"`;
    downloadBlob(content, 'sample_kinetix_roadmap_import.csv', 'text/csv');
  } else if (type === 'jira') {
    const content = `Issue Type,Summary,Assignee,Priority,Status,Story Points,Due Date
"Epic","End-to-End Encrypted Sync","Akshay","Highest","In Progress",8,"2026-10-30"
"Epic","Rich Text Formatting System","Ram","High","In Progress",5,"2026-10-20"
"Epic","Multi-Region Failover Architecture","Shyam","High","To Do",8,"2026-11-15"
"Epic","Cross-Platform Push Alerts","Nitin","Medium","In Progress",3,"2026-10-10"`;
    downloadBlob(content, 'sample_jira_epics_import.csv', 'text/csv');
  }
}

function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: `${contentType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function splitCSVLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function normalizeStatus(st) {
  if (!st) return 'In Progress';
  const s = st.toLowerCase();
  if (s.includes('done') || s.includes('complete') || s.includes('closed')) return 'Completed';
  if (s.includes('plan') || s.includes('to do') || s.includes('backlog')) return 'Planning';
  return 'In Progress';
}

function normalizeHealth(h) {
  if (!h) return 'On Track';
  const hl = h.toLowerCase();
  if (hl.includes('risk') || hl.includes('yellow')) return 'At Risk';
  if (hl.includes('delay') || hl.includes('block') || hl.includes('red')) return 'Delayed';
  return 'On Track';
}

function normalizePriority(p) {
  if (!p) return 'P1';
  const pr = p.toLowerCase();
  if (pr.includes('p0') || pr.includes('highest') || pr.includes('critical')) return 'P0';
  if (pr.includes('p1') || pr.includes('high')) return 'P1';
  if (pr.includes('p2') || pr.includes('medium')) return 'P2';
  return 'P3';
}
