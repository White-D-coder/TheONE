import prisma from '@/lib/prisma';
import { serialize } from '@/lib/utils';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Analytics Aggregation Engine
 * Processes EventLogs into performance snapshots.
 */
export async function computePerformanceSnapshot() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      logs: { take: 7, orderBy: { date: 'desc' } },
      events: { 
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } 
      },
      skills: true,
      evidences: true,
      projects: true
    }
  });

  if (!user) return null;

  // 1. Calculate Execution Score
  const avgFocus = user.logs.length > 0
    ? user.logs.reduce((acc, l) => acc + (l.focusScore || 0), 0) / user.logs.length
    : 0;

  // 2. Evidence Velocity (Events in last 7 days)
  const evidenceEvents = user.events.filter(e => e.type === 'EVIDENCE_ADDED').length;
  
  // 3. Project Pulse
  const shippingRatio = user.projects.length > 0
    ? user.projects.filter(p => p.stage === 'SHIPPED').length / user.projects.length
    : 0;

  // 4. Drift Analysis
  const driftEvents = user.events.filter(e => (e.metadata as any)?.type === 'DRIFT_DETECTED').length;

  const snapshot = {
    userId: user.id,
    timestamp: new Date(),
    metrics: {
      executionScore: avgFocus.toFixed(1),
      evidenceVelocity: evidenceEvents,
      shippingRatio: shippingRatio.toFixed(2),
      driftIncidents: driftEvents,
      eliteSignalRatio: (user.evidences.filter(e => e.strength > 0.8).length / (user.evidences.length || 1)).toFixed(2)
    }
  };

  // In a real production system, we'd save this to an AnalyticsSnapshot table.
  // For now, we return it for the dashboard to consume.
  return serialize(snapshot);
}
