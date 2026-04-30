import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Application Assistant Engine
 * Helps draft custom resumes and cover letters based on role fit.
 */
export async function draftApplicationMaterials(oppId: string) {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: { skills: true, evidences: true }
  });

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: oppId }
  });

  if (!user || !opportunity) return null;

  // Simulate AI Drafting
  const topSkills = user.skills
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.name);

  const bestEvidence = user.evidences
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 2)
    .map(e => e.title);

  const coverLetter = `
Dear Hiring Team at ${opportunity.company},

I am writing to express my strong interest in the ${opportunity.title} role. 
With a core focus on ${topSkills.join(', ')}, I have built a proven track record of shipping high-gravity engineering projects.

My recent work includes ${bestEvidence[0]} and ${bestEvidence[1]}, which demonstrates my ability to handle complex system requirements with precision. 
I am particularly drawn to ${opportunity.company} because of your leadership in the space.

I look forward to discussing how my background in verified engineering execution can contribute to your team.

Best regards,
${user.name || 'Engineer'}
  `;

  return {
    oppId: opportunity.id,
    title: opportunity.title,
    company: opportunity.company,
    coverLetter,
    suggestedResume: `Custom Variant: Focus on ${topSkills.join(' + ')}`
  };
}

export async function createApplication(oppId: string, materials: any) {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) return null;

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      oppId: oppId,
      title: materials.title,
      company: materials.company,
      coverLetter: materials.coverLetter,
      status: 'SUBMITTED'
    }
  });

  // Generate a Public Proof draft for the application
  await prisma.postDraft.create({
    data: {
      userId: user.id,
      platform: 'LINKEDIN',
      content: `Just applied for the ${materials.title} position at ${materials.company}! 🚀\n\nI'm leveraging my verified track record in technical execution to contribute to their team. #BuildingInPublic #Engineering #TheONE`,
      status: 'DRAFT'
    }
  });

  return application;
}
