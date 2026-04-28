import prisma from '@/lib/prisma';
import { serialize } from '@/lib/utils';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * AI Mentor Report Engine
 * Generates structured weekly reviews based on real platform data.
 */
export async function generateWeeklyReport() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      logs: { take: 7, orderBy: { date: 'desc' } },
      speaking: { take: 3, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!user) return null;

  const totalLogs = user.logs.length;
  const avgFocus = totalLogs ? user.logs.reduce((acc, l) => acc + (l.focusScore || 0), 0) / totalLogs : 0;
  const totalEvidence = user.evidences.length;
  
  // High-signal evaluation
  const eliteSkills = user.skills.filter(s => s.score >= 80).map(s => s.name);
  const fillerAvg = user.speaking.length > 0 
    ? user.speaking.reduce((acc, s) => acc + ((s.scores as any)?.filler === 'High' ? 1 : 0), 0) / user.speaking.length 
    : 0;

  const report = {
    weekRange: 'Current Week',
    overallScore: (avgFocus * 0.4 + (totalEvidence / 10 * 100) * 0.3 + (user.skills.length * 5) * 0.3).toFixed(0),
    executiveSummary: `You have maintained a focus score of ${avgFocus.toFixed(1)}%. Your evidence velocity is ${totalEvidence > 5 ? 'Strong' : 'Low'}.`,
    wins: [
      totalEvidence > 0 ? `Captured ${totalEvidence} new professional signals.` : "No new evidence this week.",
      eliteSkills.length > 0 ? `Mastery confirmed in: ${eliteSkills.join(', ')}.` : "No skills reached 'Elite' status yet."
    ],
    failures: [
      avgFocus < 70 ? "Focus consistency is below the 70% threshold." : "Focus is stable.",
      fillerAvg > 0.5 ? "Communication filler-word density is critically high." : "Communication is crisp."
    ],
    strategy: `Shift focus to ${user.skills.find(s => s.score < 50)?.name || 'Technical Mastery'} next week.`
  };

  return serialize(report);
}
