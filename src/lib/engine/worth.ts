import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * The Worth Engine
 * Calculates career value based on actual measurable output and progress.
 * Now includes Platform Reputation logic.
 */
export async function calculateMonthlyWorth() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      projects: true,
      speaking: true,
      accounts: true
    }
  });

  if (!user) return null;

  // 1. Skill Score (30% weight)
  const skillScore = user.skills.length > 0 
    ? user.skills.reduce((acc, s) => acc + (s.score * s.confidenceScore), 0) / user.skills.length
    : 0;

  // 2. Evidence Score (20% weight)
  const evidenceScore = user.evidences.length > 0
    ? user.evidences.reduce((acc, e) => acc + e.strength, 0) * 10
    : 0;

  // 3. Project & Shipping Score (20% weight)
  const projectScore = user.projects.length * 15;

  // 4. Platform Reputation (20% weight)
  let platformReputation = 0;
  user.accounts.forEach(acc => {
    const stats = acc.stats as any;
    if (acc.platform === 'LEETCODE' && stats?.solvedTotal) {
      platformReputation += (stats.solvedTotal / 10);
    }
    if (acc.platform === 'GITHUB' && stats?.repoCount) {
      platformReputation += (stats.repoCount * 2);
    }
    if (acc.platform === 'CODEFORCES' && stats?.rating) {
      platformReputation += (stats.rating / 50);
    }
  });

  // 5. Communication Bonus (10% weight)
  const speakingBonus = user.speaking.length * 5;

  const totalScore = (skillScore * 0.3) + (evidenceScore * 0.2) + (projectScore * 0.2) + (platformReputation * 0.2) + (speakingBonus * 0.1);

  const now = new Date();
  const record = await prisma.worthRecord.create({
    data: {
      userId: user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      score: parseFloat(totalScore.toFixed(1)),
      breakdown: {
        skillScore: (skillScore * 0.3).toFixed(1),
        evidenceScore: (evidenceScore * 0.2).toFixed(1),
        projectScore: (projectScore * 0.2).toFixed(1),
        platformRep: (platformReputation * 0.2).toFixed(1),
        speakingBonus: (speakingBonus * 0.1).toFixed(1)
      }
    }
  });

  try {
    revalidatePath('/');
    revalidatePath('/worth');
  } catch (e) {}
  return record;
}
