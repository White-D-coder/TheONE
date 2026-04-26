import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Mentor Engine
 * Provides the "Strict Mentor" analysis and insights for the OS.
 */
export async function getMentorAudit() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      logs: { take: 7, orderBy: { date: 'desc' } },
      worthHistory: { take: 2, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!user) return "System initializing...";

  const skillCount = user.skills.length;
  const evidenceCount = user.evidences.length;
  const avgSkillScore = skillCount ? user.skills.reduce((acc, s) => acc + s.score, 0) / skillCount : 0;

  // Logic for the audit
  if (evidenceCount < 5) {
    return "Your evidence count is critically low. You are building in the dark. Sync your GitHub and document 2 major projects this week to establish market trust.";
  }

  if (avgSkillScore < 70) {
    return "Mastery levels are shallow. You are spreading gravity too thin across too many roles. Shift to DEEP mode and focus on your core Technical stack.";
  }

  return "Performance is stable, but consistency is fluctuating. Your 'Power Blocks' are being diluted by maintenance tasks. Rebalance your Identity weights to prioritize Deep Work.";
}

export async function getDailyInsight() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      logs: { take: 1, orderBy: { date: 'desc' } }
    }
  });

  const lastLog = user?.logs[0];
  if (!lastLog) return "Log your first activity to generate insights.";

  if ((lastLog.distractions || 0) > 3) {
    return "High distraction count detected today. Your 'Power Block' was compromised. Tomorrow, disable all notifications and use a hardware focus lock.";
  }

  return "Optimal focus today. Your technical depth is increasing. Shift tomorrow's execution block to a 'Higher Gravity' task.";
}
