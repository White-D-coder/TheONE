import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Proof Engine
 * Converts raw technical evidence into public-facing narratives.
 */
export async function generateSocialDraft(evidenceId: string, platform: 'LINKEDIN' | 'MEDIUM' | 'TWITTER') {
  const evidence = await prisma.evidence.findUnique({
    where: { id: evidenceId }
  });

  if (!evidence) throw new Error('Evidence not found');

  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) throw new Error('User not found');

  // Logic to "generate" draft (In production, this would call GPT-4)
  let draftContent = '';
  
  if (platform === 'LINKEDIN') {
    draftContent = `🚀 Just shipped: ${evidence.title}!\n\nTechnical deep dive: ${evidence.description || 'Verified engineering artifact.'}\n\nThis project taught me a lot about [System Design/Scalability]. Check out the full source and verification here: ${evidence.url}\n\n#Engineering #DeepWork #TheONE`;
  } else if (platform === 'TWITTER') {
    draftContent = `New build: ${evidence.title}. Focused on performance and modularity. 🧵👇\n\nProof: ${evidence.url}`;
  } else {
    draftContent = `How I built ${evidence.title}\n\nA comprehensive guide to the architecture and implementation... [Drafting in progress]`;
  }

  const draft = await prisma.postDraft.create({
    data: {
      userId: user.id,
      platform,
      content: draftContent,
      evidenceId: evidence.id,
      status: 'DRAFT'
    }
  });

  revalidatePath('/vault');
  revalidatePath('/proof');
  return draft;
}

export async function getDrafts() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      drafts: {
        include: {
          user: true // Simple join
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return user?.drafts || [];
}
