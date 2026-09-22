import { parseDate, addDays, getDaysDifference, isDateBefore, formatDateStr } from './dateUtils.js';

/**
 * Checks for dependency conflict errors:
 * Conflict occurs if milestone's startDate is BEFORE its predecessor's dueDate.
 */
export function detectDependencyConflicts(milestones) {
  const milestoneMap = new Map(milestones.map(m => [m.id, m]));
  const conflicts = [];

  for (const ms of milestones) {
    if (!ms.dependencies || ms.dependencies.length === 0) continue;

    for (const predId of ms.dependencies) {
      const pred = milestoneMap.get(predId);
      if (!pred) continue;

      if (isDateBefore(ms.startDate, pred.dueDate)) {
        const overlapDays = getDaysDifference(ms.startDate, pred.dueDate);
        conflicts.push({
          milestoneId: ms.id,
          milestoneTitle: ms.title,
          predecessorId: pred.id,
          predecessorTitle: pred.title,
          overlapDays: Math.max(1, overlapDays),
          message: `"${ms.title}" starts on ${ms.startDate} before predecessor "${pred.title}" finishes on ${pred.dueDate} (${overlapDays}d overlap).`
        });
      }
    }
  }

  return conflicts;
}

/**
 * Validates if adding candidatePredId as predecessor to milestone targetId creates a circular loop.
 */
export function hasCircularDependency(milestones, targetId, candidatePredId) {
  if (targetId === candidatePredId) return true;

  const milestoneMap = new Map(milestones.map(m => [m.id, m]));
  const visited = new Set();
  const queue = [candidatePredId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (currentId === targetId) return true; // Found path back to target!

    visited.add(currentId);
    const node = milestoneMap.get(currentId);
    if (node && node.dependencies) {
      for (const parentId of node.dependencies) {
        if (!visited.has(parentId)) {
          queue.push(parentId);
        }
      }
    }
  }

  return false;
}

/**
 * Auto-reschedules milestones to fix dependency conflicts automatically.
 * Pushes successor start dates to be 1 day after predecessor due dates, keeping duration intact.
 */
export function autoRescheduleDependencies(milestones) {
  const updated = JSON.parse(JSON.stringify(milestones));
  const milestoneMap = new Map(updated.map(m => [m.id, m]));
  let changed = true;
  let iterations = 0;

  // Repeat until graph reaches clean state or max 50 iterations to avoid infinite loop
  while (changed && iterations < 50) {
    changed = false;
    iterations++;

    for (const ms of updated) {
      if (!ms.dependencies || ms.dependencies.length === 0) continue;

      let latestPredDueDate = null;

      for (const predId of ms.dependencies) {
        const pred = milestoneMap.get(predId);
        if (!pred) continue;

        if (!latestPredDueDate || isDateBefore(latestPredDueDate, pred.dueDate)) {
          latestPredDueDate = pred.dueDate;
        }
      }

      if (latestPredDueDate && isDateBefore(ms.startDate, latestPredDueDate)) {
        const duration = Math.max(1, getDaysDifference(ms.startDate, ms.dueDate));
        const newStartDate = addDays(latestPredDueDate, 1);
        const newDueDate = addDays(newStartDate, duration);

        ms.startDate = newStartDate;
        ms.dueDate = newDueDate;
        changed = true;
      }
    }
  }

  return updated;
}
