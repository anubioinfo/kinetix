export function parseDate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateStr(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatPrettyDate(dateStr) {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getDaysDifference(startStr, endStr) {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr, days) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateStr(d);
}

export function isDateBefore(date1Str, date2Str) {
  const d1 = parseDate(date1Str);
  const d2 = parseDate(date2Str);
  return d1.getTime() < d2.getTime();
}

export function getQuarter(dateStr) {
  const d = parseDate(dateStr);
  const month = d.getMonth();
  const q = Math.floor(month / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}
