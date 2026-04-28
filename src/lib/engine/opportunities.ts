import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Opportunity Discovery Engine
 * Matches users with real-world roles based on their skill matrix and evidence strength.
 */
export async function discoverOpportunities() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true
    }
  });

  if (!user) return [];

  const techSkills = user.skills.filter(s => s.category === 'TECHNICAL');
  const avgTechScore = techSkills.reduce((acc, s) => acc + s.score, 0) / (techSkills.length || 1);

  // Mock Market Data (Real companies, realistic roles)
  const marketRoles = [
    {
      title: 'Full Stack Engineer',
      company: 'Vercel',
      location: 'Remote',
      salary: '$140k - $190k',
      requiredSkills: ['Next.js', 'React', 'TypeScript'],
      url: 'https://vercel.com/careers'
    },
    {
      title: 'Backend Systems Engineer',
      company: 'Cloudflare',
      location: 'Remote',
      salary: '$150k - $210k',
      requiredSkills: ['Rust', 'Go', 'Systems Design'],
      url: 'https://www.cloudflare.com/careers'
    },
    {
      title: 'Frontend Engineer',
      company: 'Linear',
      location: 'Remote',
      salary: '$130k - $180k',
      requiredSkills: ['React', 'TypeScript', 'Design Systems'],
      url: 'https://linear.app/careers'
    }
  ];

  const discoveries = marketRoles.map(role => {
    // Basic match logic
    const matchingSkills = role.requiredSkills.filter(req => 
      user.skills.some(s => s.name.toLowerCase().includes(req.toLowerCase()))
    );
    
    const skillFit = (matchingSkills.length / role.requiredSkills.length) * 100;
    const evidenceBonus = user.evidences.length * 2;
    const finalScore = Math.min(100, skillFit + evidenceBonus);

    return {
      userId: user.id,
      title: role.title,
      company: role.company,
      location: role.location,
      salary: role.salary,
      url: role.url,
      fitScore: parseFloat(finalScore.toFixed(1)),
      reason: matchingSkills.length > 0 
        ? `Strong match for ${matchingSkills.join(', ')}.`
        : "Matches your general engineering volume.",
      source: 'ENGINEER_OS_SCANNER'
    };
  });

  // Save to DB
  for (const opp of discoveries) {
    await prisma.opportunity.upsert({
      where: { id: `${opp.company}-${opp.title}-${user.id}` }, // Composite-like ID for upsert
      update: {
        fitScore: opp.fitScore,
        reason: opp.reason
      },
      create: {
        id: `${opp.company}-${opp.title}-${user.id}`,
        ...opp
      }
    });
  }

  return discoveries;
}
