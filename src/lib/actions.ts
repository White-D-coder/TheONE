'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/utils';
import { syncGitHub as runSyncGitHub, syncCodeforces as runSyncCodeforces, syncLeetCode as runSyncLeetCode, syncMedium as runSyncMedium, syncYouTube as runSyncYouTube, syncPublicProfile as runSyncPublicProfile } from '@/lib/engine/sync';
import { generateSocialDraft as runGenerateSocialDraft, getDrafts as runGetDrafts } from '@/lib/engine/proof';
import { getMentorAudit as runGetMentorAudit, getDailyInsight as runGetDailyInsight, getStrategicInsights as runGetStrategicInsights, getSystemBottlenecks as runGetSystemBottlenecks } from '@/lib/engine/mentor';
import { discoverOpportunities as runDiscoverOpportunities } from '@/lib/engine/opportunities';
import { syncContentFeeds as runSyncContentFeeds } from '@/lib/engine/content';
import { logEvent as runLogEvent, EventType } from '@/lib/engine/events';
import { draftApplicationMaterials as runDraftApplication, createApplication as runCreateApplication } from '@/lib/engine/applications';
import { generateWeeklyReport as runGenerateWeeklyReport } from '@/lib/engine/reports';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

// Helper to serialize Prisma objects (converts Dates to strings)

export async function getOSState() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: {
        skills: true,
        evidences: true,
        projects: true,
        routines: true,
        logs: {
          orderBy: { date: 'desc' },
          take: 1
        },
        worthHistory: {
          orderBy: { createdAt: 'desc' },
          take: 2
        },
        accounts: true,
        speaking: true,
        opportunities: true,
        applications: true
      }
    });

    if (!user) return { roles: {}, currentMode: 'NORMAL' };

    return serialize({
      user,
      roles: user.roleWeights || {},
      currentMode: user.currentMode
    });
  } catch (e) {
    console.error('getOSState failed:', e);
    return { roles: {}, currentMode: 'NORMAL' };
  }
}

export async function updateRoles(weights: any) {
  try {
    const user = await prisma.user.update({
      where: { email: DEFAULT_USER_EMAIL },
      data: { roleWeights: weights }
    });
    revalidatePath('/identity');
    revalidatePath('/');
    return serialize(user);
  } catch (e) {
    console.error('updateRoles failed:', e);
    return null;
  }
}

export async function updateMode(mode: string) {
  try {
    const user = await prisma.user.update({
      where: { email: DEFAULT_USER_EMAIL },
      data: { currentMode: mode }
    });
    revalidatePath('/identity');
    revalidatePath('/');
    revalidatePath('/routine');
    return serialize(user);
  } catch (e) {
    console.error('updateMode failed:', e);
    return null;
  }
}

export async function generateRoutine() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: { logs: { orderBy: { date: 'desc' }, take: 1 } }
    });
    
    if (!user) return [];

    const roles = user.roleWeights as any || {};
    const mode = user.currentMode;

    // Routine Logic
    const routine = [];
    const sortedRoles = Object.entries(roles).sort(([, a]: any, [, b]: any) => b - a);
    const primaryRole = sortedRoles[0]?.[0] || 'engineer';
    const secondaryRole = sortedRoles[1]?.[0] || 'builder';

    const evidences = user.evidences || [];
    const skills = user.skills || [];

    // Build schedule
    routine.push({ 
      time: '08:00', 
      label: 'Morning Ritual', 
      duration: 30, 
      type: 'HABIT', 
      color: 'var(--accent-emerald)', 
      status: 'DONE',
      target: 'Review today\'s high-gravity targets.'
    });
    
    let deepWorkLabel = `Power Block: ${primaryRole.toUpperCase()} Deep Work`;
    let deepWorkTarget = evidences.length > 0 ? `Focus on shipping: ${evidences[0].title}` : 'Initialize a high-complexity project.';
    
    if (mode === 'CANDIDATE') {
      deepWorkLabel = "LeetCode / System Design Drill";
      deepWorkTarget = "Solve 3 'Medium' Array/DP problems.";
    }
    
    routine.push({ 
      time: '09:00', 
      label: deepWorkLabel, 
      duration: 180, 
      type: 'DEEP', 
      color: 'var(--accent-blue)', 
      status: 'ACTIVE',
      tag: mode === 'SPRINT' ? 'MAX INTENSITY' : 'CORE',
      target: deepWorkTarget
    });

    routine.push({ 
      time: '12:00', 
      label: 'Fuel & Reset', 
      duration: 60, 
      type: 'REST', 
      color: 'var(--text-tertiary)', 
      status: 'PENDING',
      target: 'Step away from all screens.'
    });

    const buildTarget = skills.length > 0 ? `Refine ${skills[0].name} mastery.` : 'Build a system visualization.';

    routine.push({ 
      time: '13:00', 
      label: `Execution: ${secondaryRole.toUpperCase()} Session`, 
      duration: 120, 
      type: 'BUILD', 
      color: 'var(--accent-purple)', 
      status: 'PENDING',
      target: buildTarget
    });

    // Sync with DB
    await prisma.routine.upsert({
      where: { id: `daily-${user.id}` },
      update: { blocks: routine },
      create: { id: `daily-${user.id}`, userId: user.id, name: 'Dynamic Daily', blocks: routine }
    });

    return routine;
  } catch (e) {
    console.error('generateRoutine failed:', e);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: {
        skills: true,
        evidences: true,
        projects: true,
        worthHistory: { orderBy: { createdAt: 'desc' }, take: 2 },
        applications: true,
        accounts: true,
        logs: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }
      }
    });

    if (!user) return null;

    // GitHub Consistency
    const githubAccount = user.accounts.find(a => a.platform === 'GITHUB');
    const githubStats = githubAccount?.stats as any;

    // Calculate real deep work hours from today's logs
    const todayLog = user.logs[0];
    let workBlocks = todayLog?.workBlocks || [];
    if (typeof workBlocks === 'string') {
      try {
        workBlocks = JSON.parse(workBlocks);
      } catch {
        workBlocks = [];
      }
    }
    
    const deepWorkMinutes = Array.isArray(workBlocks) 
      ? workBlocks.reduce((acc: number, block: any) => acc + (block.duration || 0), 0)
      : 0;
    
    const skillScore = user.skills.length > 0 
      ? (user.skills.reduce((acc, s) => acc + s.score, 0) / user.skills.length).toFixed(1) 
      : "0";

    const worthTrend = user.worthHistory.length >= 2 
      ? `${(user.worthHistory[0].score - user.worthHistory[1].score) >= 0 ? '+' : ''}${(user.worthHistory[0].score - user.worthHistory[1].score).toFixed(1)} this month`
      : "First month";

    const latestInsight = await getDailyInsight();

    return serialize({
      skillScore,
      evidenceCount: user.evidences.length,
      activeProjects: user.projects.length,
      deepWorkHours: (deepWorkMinutes / 60).toFixed(1) + 'h',
      worthTrend,
      latestInsight,
      applicationCount: user.applications.length,
      githubConsistency: {
        score: githubStats?.consistencyScore || 0,
        committedToday: githubStats?.committedToday || false
      }
    });
  } catch (e) {
    console.error('getDashboardStats failed:', e);
    return null;
  }
}

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
  const logId = `log-${user.id}-${today.getTime()}`;

  const existingLog = await prisma.dailyLog.findUnique({
    where: { id: logId }
  });

  let workBlocks: any[] = [];
  if (existingLog) {
    workBlocks = (existingLog.workBlocks as any[]) || [];
    if (typeof workBlocks === 'string') workBlocks = JSON.parse(workBlocks);
  }

  workBlocks.push({ label: blockLabel, duration, completedAt: new Date() });

  const log = await prisma.dailyLog.upsert({
    where: { id: logId },
    update: { workBlocks },
    create: {
      id: logId,
      userId: user.id,
      date: today,
      workBlocks
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

export async function getMentorAudit() {
  return await runGetMentorAudit();
}

export async function getDailyInsight() {
  return await runGetDailyInsight();
}

export async function logDrift() {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await prisma.dailyLog.findFirst({
    where: { userId: user.id, date: today }
  });

  if (log) {
    await prisma.dailyLog.update({
      where: { id: log.id },
      data: { distractions: (log.distractions || 0) + 1 }
    });
  }

  await runLogEvent('TASK_DONE', { type: 'DRIFT_DETECTED' });
  revalidatePath('/');
  revalidatePath('/analytics');
}

export async function syncLeetCode(username: string) {
  const result = await runSyncLeetCode(username);
  if (result.success) {
    revalidatePath('/');
  }
  return result;
}

export async function syncMedium(username: string) {
  const result = await runSyncMedium(username);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/vault');
  }
  return result;
}

export async function syncYouTube(channelId: string) {
  const result = await runSyncYouTube(channelId);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/vault');
  }
  return result;
}

export async function syncPublicProfile(url: string) {
  const result = await runSyncPublicProfile(url);
  if (result.success) {
    revalidatePath('/vault');
  }
  return result;
}

export async function discoverOpportunities() {
  const result = await runDiscoverOpportunities();
  revalidatePath('/opportunities');
  return serialize(result);
}

export async function syncContentFeeds() {
  const result = await runSyncContentFeeds();
  revalidatePath('/content');
  return result;
}

export async function getContentItems() {
  const items = await prisma.contentItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  return serialize(items);
}

export async function updateContentStatus(id: string, status: 'SAVED' | 'IGNORED') {
  await prisma.contentItem.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/content');
}

export async function getStrategicInsights() {
  return await runGetStrategicInsights();
}

export async function getSystemBottlenecks() {
  return await runGetSystemBottlenecks();
}

export async function logEvent(type: EventType, metadata: any = {}) {
  return await runLogEvent(type, metadata);
}

export async function draftApplication(oppId: string) {
  const result = await runDraftApplication(oppId);
  return serialize(result);
}

export async function submitApplication(oppId: string, materials: any) {
  const result = await runCreateApplication(oppId, materials);
  // Update opportunity status
  await prisma.opportunity.update({
    where: { id: oppId },
    data: { status: 'APPLIED' }
  });
  revalidatePath('/opportunities');
  revalidatePath('/applications');
  return serialize(result);
}

export async function getApplications() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: { applications: { orderBy: { updatedAt: 'desc' } } }
  });
  return serialize(user?.applications || []);
}

export async function getWeeklyReport() {
  return await runGenerateWeeklyReport();
}
