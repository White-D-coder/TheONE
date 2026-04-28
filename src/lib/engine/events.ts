import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

export type EventType = 
  | 'TASK_DONE' 
  | 'EVIDENCE_ADDED' 
  | 'SPEAKING_DONE' 
  | 'SYNC_DONE' 
  | 'MODE_CHANGE' 
  | 'WORTH_CALC' 
  | 'PROJECT_VIEW'
  | 'OPPORTUNITY_SAVE';

/**
 * Event Logging System
 * Tracks every high-value action in the OS for analytics and AI review.
 */
export async function logEvent(type: EventType, metadata: any = {}) {
  try {
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return;

    await prisma.eventLog.create({
      data: {
        userId: user.id,
        type,
        metadata
      }
    });

    console.log(`[EVENT] ${type} logged.`);
  } catch (error) {
    console.error(`[EVENT] Failed to log event ${type}:`, error);
  }
}
