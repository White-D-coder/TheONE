import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * The Worth Engine
 * Calculates career value based on actual measurable output and progress.
 * Formula: Worth = (SkillsSum * ConfidenceAvg) + (EvidenceSum * Visibility) + Consistency
 */
export async function calculateMonthlyWorth() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      projects: true,
      speaking: true
    }
  });

  if (!user) return null;

  // 1. Skill Score (40% weight)
  const skillScore = user.skills.length > 0 
    ? user.skills.reduce((acc, s) => acc + (s.score * s.confidenceScore), 0) / user.skills.length
    : 0;

  // 2. Evidence Score (30% weight)
  const evidenceScore = user.evidences.length > 0
    ? user.evidences.reduce((acc, e) => acc + e.strength, 0) * 10
    : 0;

  // 3. Project & Shipping Score (20% weight)
  const projectScore = user.projects.length * 15;

  // 4. Speaking/Communication Bonus (10% weight)
  const speakingBonus = user.speaking.length * 5;

  const totalScore = (skillScore * 0.4) + (evidenceScore * 0.3) + (projectScore * 0.2) + (speakingBonus * 0.1);

  // Persist the record
  const now = new Date();
  const record = await prisma.worthRecord.create({
    data: {
      userId: user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      score: parseFloat(totalScore.toFixed(1)),
      breakdown: {
        skillScore: skillScore.toFixed(1),
        evidenceScore: evidenceScore.toFixed(1),
        projectScore: projectScore.toFixed(1),
        speakingBonus: speakingBonus.toFixed(1)
      }
    }
  });

  revalidatePath('/');
  revalidatePath('/worth');
  return record;
}
