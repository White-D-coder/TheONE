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
import { calculateMonthlyWorth as runCalculateMonthlyWorth } from '@/lib/engine/worth';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

// Helper to serialize Prisma objects (converts Dates to strings)

export async function getOSState() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: {
        skills: {
          include: {
            evidences: true
          }
        },
        evidences: true,
        projects: true,
        routines: true,
        logs: {
          orderBy: { date: 'desc' },
          take: 7
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

import { generateAdaptiveRoutine } from '@/lib/engine/routine';

export async function updateRoutinePrefs(prefs: any) {
  try {
    const user = await prisma.user.update({
      where: { email: DEFAULT_USER_EMAIL },
      data: { routinePrefs: prefs }
    });
    revalidatePath('/routine');
    return serialize(user);
  } catch (e) {
    console.error('updateRoutinePrefs failed:', e);
    return null;
  }
}

export async function generateRoutine() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL }
    });
    
    if (!user) return [];

    const routine = await generateAdaptiveRoutine(DEFAULT_USER_EMAIL);

    // Sync with DB
    await prisma.routine.upsert({
      where: { id: `daily-${user.id}` },
      update: { blocks: routine },
      create: { id: `daily-${user.id}`, userId: user.id, name: 'Dynamic Daily', blocks: routine }
    });

    revalidatePath('/routine');
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
        streaks: true,
        logs: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }
      }
    });
    
    console.log("[DEBUG] getDashboardStats user found:", !!user);
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
      worthScore: user.worthHistory[0]?.score || 0,
      skillScore,
      evidenceCount: user.evidences.length,
      activeProjects: user.projects.length,
      deepWorkHours: (deepWorkMinutes / 60).toFixed(1) + 'h',
      worthTrend,
      latestInsight: latestInsight || "Ready for performance audit.",
      applicationCount: user.applications.length,
      githubConsistency: {
        score: githubStats?.consistencyScore || 0,
        committedToday: githubStats?.committedToday || false
      },
      streaks: user.streaks
    });
  } catch (e) {
    console.error('getDashboardStats failed:', e);
    // Fallback to minimal state instead of null to prevent "System Offline"
    return {
      worthScore: 0,
      skillScore: "0",
      evidenceCount: 0,
      activeProjects: 0,
      deepWorkHours: "0.0h",
      worthTrend: "Initializing...",
      latestInsight: "System stabilizing...",
      applicationCount: 0,
      githubConsistency: { score: 0, committedToday: false }
    };
  }
}

export async function broadcastEvidence(evidenceId: string, platforms: string[]) {
  try {
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false };

    const evidence = await prisma.evidence.findUnique({ where: { id: evidenceId } });
    if (!evidence) return { success: false };

    const results = [];
    for (const platform of platforms) {
      const draft = await prisma.postDraft.create({
        data: {
          userId: user.id,
          evidenceId: evidence.id,
          platform: platform,
          status: 'DRAFT',
          content: `🚀 Verification: ${evidence.title}\n\nJust shipped/logged this to my Engineer OS vault. Evidence Strength: ${(evidence.strength * 100).toFixed(0)}%\n\nView here: ${evidence.url || '#'}\n\n#BuildingInPublic #EngineerOS`
        }
      });
      results.push(draft);
    }

    revalidatePath('/vault');
    return { success: true, count: results.length };
  } catch (error) {
    console.error('broadcastEvidence failed:', error);
    return { success: false };
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

export async function calculateMonthlyWorth() {
  const result = await runCalculateMonthlyWorth();
  revalidatePath('/');
  revalidatePath('/worth');
  return serialize(result);
}

export async function getDrafts() {
  const result = await runGetDrafts();
  return serialize(result);
}

export async function publishDraft(draftId: string) {
  try {
    const draft = await prisma.postDraft.findUnique({ where: { id: draftId } });
    if (!draft) throw new Error('Draft not found');

    // SIMULATED PUBLISHING LAYER
    // In production, this would call LinkedIn/Twitter/Instagram APIs via OAuth
    const publishedUrl = `https://${draft.platform.toLowerCase()}.com/p/${Math.random().toString(36).substring(7)}`;

    const updatedDraft = await prisma.postDraft.update({
      where: { id: draftId },
      data: { 
        status: 'PUBLISHED',
        publishedUrl
      }
    });
    
    // Convert the Published Post into an Evidence Item
    await prisma.evidence.create({
      data: {
        userId: draft.userId,
        type: draft.platform === 'YOUTUBE' ? 'VIDEO' : 'ARTICLE',
        title: `Published to ${draft.platform}`,
        description: draft.content.substring(0, 100) + '...',
        url: publishedUrl,
        source: draft.platform.toUpperCase(),
        strength: 0.7
      }
    });

    // Log the event for analytics
    await runLogEvent(EventType.PUBLIC_PROOF, { 
      description: `Published proof to ${draft.platform}`,
      draftId: draft.id, 
      platform: draft.platform,
      publishedUrl
    });

    revalidatePath('/proof');
    revalidatePath('/vault');
    return serialize(updatedDraft);
  } catch (e: any) {
    console.error('publishDraft failed:', e);
    return null;
  }
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

  const focusScore = Math.min(100, workBlocks.length * 25);

  const log = await prisma.dailyLog.upsert({
    where: { id: logId },
    update: { workBlocks, focusScore },
    create: {
      id: logId,
      userId: user.id,
      date: today,
      workBlocks,
      focusScore
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

export async function syncPublicProfile(url: string, title?: string, projectId?: string, type: string = 'LINK') {
  const result = await runSyncPublicProfile(url, title, projectId, type);
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
