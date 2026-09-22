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
    m.progress,
    m.impact,
    m.effort,
    `"${m.owner}"`,
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
