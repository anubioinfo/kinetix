import { parseDate, formatDateStr, isDateBefore } from './dateUtils';

/**
 * Calculates historical state of milestones and team members as of a past target date.
 * @param {Array} milestones Current milestones
 * @param {Array} teamMembers Current team members
 * @param {string} targetDate Str date YYYY-MM-DD to back-project to
 */
export function calculateHistoricalState(milestones, teamMembers, targetDate) {
  if (!targetDate) return { milestones, teamMembers };

  const target = parseDate(targetDate);

  // Back-project milestones based on date history
  const historicalMilestones = milestones.map(m => {
    const startDate = parseDate(m.startDate || '2026-01-01');
    const dueDate = parseDate(m.dueDate || '2026-12-31');

    if (startDate.getTime() > target.getTime()) {
      return {
        ...m,
        progress: 0,
        status: 'Not Started',
        health: 'On Track',
        features: m.features?.map(f => ({ ...f, completed: false })) || []
      };
    }

    // Estimate historical progress based on timeline position up to targetDate
    const totalDuration = Math.max(1, (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsed = Math.max(0, (target.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const rawRatio = Math.min(1, elapsed / totalDuration);
    
    // Scale progress deterministically
    const historicalProgress = Math.min(m.progress, Math.round(rawRatio * 100));

    let historicalStatus = m.status;
    if (historicalProgress === 0) historicalStatus = 'Not Started';
    else if (historicalProgress < 100) historicalStatus = 'In Progress';
    else historicalStatus = 'Completed';

    return {
      ...m,
      progress: historicalProgress,
      status: historicalStatus,
      features: m.features?.map((f, idx) => ({
        ...f,
        completed: (idx / (m.features?.length || 1)) < (historicalProgress / 100)
      })) || []
    };
  });

  // Re-evaluate team member workload based on historical milestones
  const historicalTeamMembers = teamMembers.map(tm => {
    const assignedMilestones = historicalMilestones.filter(m => m.owner === tm.name);
    const assignedHours = assignedMilestones.length * 12; // 12h per active milestone standard
    return {
      ...tm,
      assignedHours
    };
  });

  return {
    milestones: historicalMilestones,
    teamMembers: historicalTeamMembers
  };
}
