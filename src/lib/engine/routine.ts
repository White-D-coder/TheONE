import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Adaptive Routine Engine
 * Generates the day's blocks based on mode, energy, and current performance.
 */
export async function generateAdaptiveRoutine(userEmail: string = DEFAULT_USER_EMAIL) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { 
      logs: { orderBy: { date: 'desc' }, take: 3 },
      evidences: { take: 1, orderBy: { createdAt: 'desc' } },
      skills: { take: 1, orderBy: { score: 'asc' } }
    }
  });

  if (!user) return [];

  const roles = (user.roleWeights as any) || { engineer: 100 };
  const mode = user.currentMode;
  const lastLog = user.logs[0];
  const sortedRoles = Object.entries(roles).sort(([, a]: any, [, b]: any) => b - a);
  const primaryRole = sortedRoles[0]?.[0] || 'engineer';

  const routine: any[] = [];

  // 1. BURNOUT DETECTION
  const logsWithFocus = user.logs.filter(l => (l as any).focusScore !== undefined);
  const avgFocus = logsWithFocus.length >= 3 
    ? logsWithFocus.reduce((acc, l) => acc + ((l as any).focusScore || 0), 0) / logsWithFocus.length
    : 80; // Default to healthy if data is sparse

  if ((lastLog?.energy || 10) < 3) {
    return generateStreakSaverPlan(primaryRole);
  }

  // 2. MODE-BASED ALLOCATION
  if (mode === 'RECOVERY') {
    return generateRecoveryPlan();
  }

  // Standard Morning Ritual
  routine.push({ 
    time: '08:00', label: 'Morning Ritual', duration: 30, type: 'HABIT', color: 'var(--accent-emerald)', 
    target: 'Grounding and daily priority mapping.' 
  });

  // Main Execution Block
  let mainDuration = 180;
  let mainLabel = `Power Block: ${primaryRole.toUpperCase()}`;
  
  if (mode === 'SPRINT') {
    mainDuration = 240;
    mainLabel = `Sprint Block: ${primaryRole.toUpperCase()} (Max Intensity)`;
  } else if (mode === 'EXAM') {
    mainDuration = 300;
    mainLabel = 'Deep Study: Theoretical Mastery';
  }

  routine.push({ 
    time: '09:00', label: mainLabel, duration: mainDuration, type: 'DEEP', color: 'var(--accent-blue)',
    target: user.evidences[0] ? `Build on: ${user.evidences[0].title}` : 'Initialize new high-gravity artifact.'
  });

  // REST
  routine.push({ time: '13:00', label: 'Strategic Rest', duration: 60, type: 'REST', color: 'var(--text-tertiary)' });

  // Secondary Execution / Review
  routine.push({ 
    time: '14:00', label: 'Secondary Execution', duration: 90, type: 'BUILD', color: 'var(--accent-purple)',
    target: user.skills[0] ? `Level up ${user.skills[0].name}` : 'Breadth exploration.'
  });

  return routine;
}

function generateStreakSaverPlan(role: string) {
  return [
    { 
      time: '09:00', label: 'Minimum Execution', duration: 30, type: 'DEEP', color: 'var(--accent-amber)',
      target: `Just 30 mins of ${role} to keep professional gravity.`
    },
    { time: '09:30', label: 'Active Recovery', duration: 120, type: 'REST', color: 'var(--text-tertiary)' },
    { time: '11:30', label: 'System Review', duration: 45, type: 'BUILD', color: 'var(--accent-blue)', target: 'Low-energy backlog grooming.' }
  ];
}

function generateRecoveryPlan() {
  return [
    { time: '09:00', label: 'Gentle Learning', duration: 60, type: 'HABIT', color: 'var(--accent-emerald)', target: 'Low-intensity consumption.' },
    { time: '10:00', label: 'Physical Reset / System Planning', duration: 120, type: 'REST', color: 'var(--accent-blue)' }
  ];
}
