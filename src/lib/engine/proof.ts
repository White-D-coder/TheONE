import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

  // Logic to generate draft via AI
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('AI Engine disconnected. Please provide an OPENAI_API_KEY in settings.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a technical branding assistant for elite engineers. Create concise, high-impact social media drafts from technical evidence."
        },
        {
          role: "user",
          content: `Convert this evidence artifact into a high-impact ${platform} post.
            Title: ${evidence.title}
            Description: ${evidence.description || 'N/A'}
            URL: ${evidence.url || 'N/A'}
            
            Return ONLY the draft content.`
        }
      ],
      temperature: 0.7,
    });

    const draftContent = response.choices[0].message.content || `[Drafting failed for ${platform}]`;

    const draft = await prisma.postDraft.create({
      data: {
        userId: user.id,
        platform,
        content: draftContent,
        evidenceId: evidence.id,
        status: 'DRAFT'
      }
    });

    return draft;
  } catch (error: any) {
    console.error('[AI_PROOF] OpenAI call failed:', error);
    // Fallback to a structured template if AI fails
    const fallbackContent = `🚀 Project Update: ${evidence.title}\n\nCheck out the latest verification here: ${evidence.url}`;
    
    return await prisma.postDraft.create({
      data: {
        userId: user.id,
        platform,
        content: fallbackContent,
        evidenceId: evidence.id,
        status: 'DRAFT'
      }
    });
  }
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
