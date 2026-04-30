import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * The Worth Engine
 * Calculates career value based on actual measurable output and progress.
 * Now includes Platform Reputation logic.
 */
export async function calculateMonthlyWorth() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL }
  });

  if (!user) return null;

  // 0. Scale-First Caching: Check if we have a fresh record (last 15 mins)
  const cachedRecord = await prisma.worthRecord.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (cachedRecord && (Date.now() - cachedRecord.createdAt.getTime() < 15 * 60 * 1000)) {
    console.log("[WORTH] Serving cached record for scale.");
    return cachedRecord;
  }

  // Deep fetch for calculation
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      skills: true,
      evidences: true,
      projects: true,
      speaking: true,
      accounts: true,
      worthHistory: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  if (!fullUser) return null;
  const userToUse = fullUser; // Alias for backward compatibility in the function


  // 1. Skill Score (30% weight)
  const skillScore = userToUse.skills.length > 0 
    ? userToUse.skills.reduce((acc, s) => acc + (s.score * s.confidenceScore), 0) / userToUse.skills.length
    : 0;

  // 2. Evidence Score (20% weight)
  const evidenceScore = userToUse.evidences.length > 0
    ? userToUse.evidences.reduce((acc, e) => acc + e.strength, 0) * 10
    : 0;

  // 3. Project & Shipping Score (20% weight)
  const projectScore = userToUse.projects.reduce((acc, p) => {
    let stageWeight = 10; // IDEA
    if (p.stage === 'BUILDING') stageWeight = 25;
    if (p.stage === 'SHIPPED') stageWeight = 50;
    
    // Bonus for evidence linked to project
    const projectEvidence = userToUse.evidences.filter(e => e.projectId === p.id).length;
    return acc + stageWeight + (projectEvidence * 5);
  }, 0);

  // 4. Platform Reputation (20% weight)
  let platformReputation = 0;
  userToUse.accounts.forEach(acc => {
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
  const speakingBonus = userToUse.speaking.length * 5;

  const totalScore = (skillScore * 0.3) + (evidenceScore * 0.2) + (projectScore * 0.2) + (platformReputation * 0.2) + (speakingBonus * 0.1);

  // 6. Trajectory Mapping (Logic-driven prediction)
  const lastRecord = userToUse.worthHistory[0];
  let trajectory = "Establishing baseline...";
  
  if (lastRecord) {
    const delta = totalScore - lastRecord.score;
    if (delta > 0) {
      const monthsToSenior = Math.ceil((800 - totalScore) / (delta || 1));
      trajectory = monthsToSenior > 0 
        ? `Ready for Senior roles in ~${monthsToSenior} months at current velocity.`
        : "Senior readiness reached. Focus on elite visibility.";
    } else if (delta < 0) {
      trajectory = "Velocity declining. Potential stagnation detected.";
    } else {
      trajectory = "Growth plateau. Increase execution intensity.";
    }
  }

  const now = new Date();
  const record = await prisma.worthRecord.create({
    data: {
      userId: userToUse.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      score: parseFloat(totalScore.toFixed(1)),
      breakdown: {
        skillScore: (skillScore * 0.3).toFixed(1),
        evidenceScore: (evidenceScore * 0.2).toFixed(1),
        projectScore: (projectScore * 0.2).toFixed(1),
        platformRep: (platformReputation * 0.2).toFixed(1),
        speakingBonus: (speakingBonus * 0.1).toFixed(1),
        trajectory
      }
    }
  });

  return record;
}
