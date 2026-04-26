'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

// Helper to serialize Prisma objects (converts Dates to strings)
function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export async function getOSState() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: {
        skills: { orderBy: { score: 'desc' } },
        evidences: { orderBy: { createdAt: 'desc' }, take: 10 },
        projects: { orderBy: { updatedAt: 'desc' } },
        accounts: true,
        speaking: { orderBy: { createdAt: 'desc' }, take: 1 },
        worthHistory: { orderBy: { createdAt: 'desc' }, take: 2 },
        logs: { orderBy: { date: 'desc' }, take: 1 }
      }
    });

    if (!user) {
      return {
        roles: { engineer: 60, builder: 40, communicator: 20, candidate: 10 },
        currentMode: 'NORMAL',
        user: null
      };
    }

    return serialize({
      roles: user.roleWeights || { engineer: 60, builder: 40, communicator: 20, candidate: 10 },
      currentMode: user.currentMode,
      user
    });
  } catch (e) {
    console.error('getOSState failed:', e);
    return {
      roles: { engineer: 60, builder: 40, communicator: 20, candidate: 10 },
      currentMode: 'NORMAL',
      user: null
    };
  }
}

export async function updateRoles(newRoles: any) {
  await prisma.user.update({
    where: { email: DEFAULT_USER_EMAIL },
    data: { roleWeights: newRoles }
  });
  revalidatePath('/identity');
  revalidatePath('/routine');
  revalidatePath('/');
  return { success: true };
}

export async function updateMode(mode: string) {
  await prisma.user.update({
    where: { email: DEFAULT_USER_EMAIL },
    data: { currentMode: mode }
  });
  revalidatePath('/identity');
  revalidatePath('/routine');
  revalidatePath('/');
  return { success: true };
}

export async function generateRoutine() {
  const state = await getOSState();
  const roles: any = state.roles;
  const mode = state.currentMode;
  
  const sortedRoles = Object.entries(roles)
    .sort(([, a]: any, [, b]: any) => b - a);
  
  const primaryRole = sortedRoles[0][0];
  const secondaryRole = sortedRoles[1][0];

  let routine = [];

  // 1. Morning Health Block
  routine.push({ time: '07:30', label: 'Physical Prime', duration: 45, type: 'BODY', color: 'var(--accent-emerald)', status: 'DONE' });

  // 2. Primary Deep Work Block
  let deepWorkLabel = `Power Block: ${primaryRole.toUpperCase()} Deep Work`;
  if (mode === 'CANDIDATE') deepWorkLabel = "Power Block: Interview Prep (DSA/System Design)";
  
  routine.push({ 
    time: '09:00', 
    label: deepWorkLabel, 
    duration: mode === 'DEEP' ? 240 : 180, 
    type: primaryRole.toUpperCase(), 
    color: primaryRole === 'engineer' ? 'var(--accent-blue)' : 'var(--accent-purple)', 
    status: 'ACTIVE',
    tag: 'HIGH GRAVITY'
  });

  // 3. Maintenance
  routine.push({ time: '12:00', label: 'Maintenance & Nutrition', duration: 60, type: 'REST', color: 'var(--text-tertiary)', status: 'PENDING' });

  // 4. Secondary Execution Block
  routine.push({ 
    time: '13:00', 
    label: `Execution: ${secondaryRole.toUpperCase()} Session`, 
    duration: 120, 
    type: secondaryRole.toUpperCase(), 
    color: secondaryRole === 'builder' ? 'var(--accent-purple)' : 'var(--accent-amber)', 
    status: 'PENDING' 
  });

  // 5. Output/Review
  routine.push({ time: '15:30', label: 'AI Review & Strategy', duration: 30, type: 'AI_REVIEW', color: 'var(--text-primary)', status: 'LOCKED' });

  // Persist to DB
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (user) {
    await prisma.routine.upsert({
      where: { id: `daily-${user.id}` },
      update: { blocks: routine },
      create: { id: `daily-${user.id}`, userId: user.id, name: 'Dynamic Daily', blocks: routine }
    });
  }

  return serialize(routine);
}

export async function getDashboardStats() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: {
        skills: true,
        evidences: true,
        projects: true,
        logs: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        },
        worthHistory: {
          orderBy: { createdAt: 'desc' },
          take: 2
        }
      }
    });

    if (!user) return null;

    // Calculate real deep work hours from today's logs
    const todayLog = user.logs[0];
    const deepWorkMinutes = todayLog?.workBlocks 
      ? (todayLog.workBlocks as any[]).reduce((acc, block) => acc + (block.duration || 0), 0)
      : 0;
    
    const skillScore = user.skills.length > 0 
      ? (user.skills.reduce((acc, s) => acc + s.score, 0) / user.skills.length).toFixed(1) 
      : "0";

    const worthTrend = user.worthHistory.length >= 2 
      ? \`\${(user.worthHistory[0].score - user.worthHistory[1].score) >= 0 ? '+' : ''}\${(user.worthHistory[0].score - user.worthHistory[1].score).toFixed(1)} this month\`
      : "First month";

    const latestInsight = await getDailyInsight();

    return serialize({
      skillScore,
      evidenceCount: user.evidences.length,
      activeProjects: user.projects.length,
      deepWorkHours: (deepWorkMinutes / 60).toFixed(1) + 'h',
      worthTrend,
      latestInsight
    });
  } catch (e) {
    console.error('getDashboardStats failed:', e);
    return null;
  }
}

import { syncGitHub as runSyncGitHub, syncCodeforces as runSyncCodeforces } from '@/lib/engine/sync';

export async function syncGitHub(username: string) {
  const result = await runSyncGitHub(username);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/vault');
  }
  return result;
}

export async function syncCodeforces(username: string) {
  const result = await runSyncCodeforces(username);
  if (result.success) {
    revalidatePath('/');
  }
  return result;
}

export async function saveSpeakingSession(topic: string, transcript: string) {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) return null;

  // Simulate AI Analysis
  const fillerWords = (transcript.match(/um|uh|like|basically|so/gi) || []).length;
  const clarity = Math.max(0, 10 - fillerWords);
  const scores = {
    clarity: clarity.toFixed(1),
    pacing: (8.0 + Math.random()).toFixed(1),
    filler: fillerWords > 3 ? 'High' : 'Low'
  };

  const session = await prisma.speakingSession.create({
    data: {
      userId: user.id,
      topic,
      transcript,
      scores,
      feedback: `You used ${fillerWords} filler words. Try to replace them with brief silences to sound more confident.`
    }
  });

  revalidatePath('/');
  revalidatePath('/speaking');
  return serialize(session);
}

import { generateSocialDraft as runGenerateSocialDraft, getDrafts as runGetDrafts } from '@/lib/engine/proof';

export async function generateSocialDraft(evidenceId: string, platform: 'LINKEDIN' | 'MEDIUM' | 'TWITTER') {
  const result = await runGenerateSocialDraft(evidenceId, platform);
  revalidatePath('/proof');
  return serialize(result);
}

export async function getDrafts() {
  const result = await runGetDrafts();
  return serialize(result);
}

export async function completeRoutineBlock(blockLabel: string, duration: number) {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await prisma.dailyLog.upsert({
    where: { id: `log-${user.id}-${today.getTime()}` },
    update: {
      workBlocks: {
        push: { label: blockLabel, duration, completedAt: new Date() }
      }
    },
    create: {
      id: `log-${user.id}-${today.getTime()}`,
      userId: user.id,
      date: today,
      workBlocks: [{ label: blockLabel, duration, completedAt: new Date() }]
    }
  });

  // Also log to EventLog
  await prisma.eventLog.create({
    data: {
      userId: user.id,
      type: 'TASK_DONE',
      metadata: { label: blockLabel, duration }
    }
  });

  revalidatePath('/');
  revalidatePath('/routine');
  return serialize(log);
}

import { getMentorAudit as runGetMentorAudit, getDailyInsight as runGetDailyInsight } from '@/lib/engine/mentor';

export async function getMentorAudit() {
  return await runGetMentorAudit();
}

export async function getDailyInsight() {
  return await runGetDailyInsight();
}
