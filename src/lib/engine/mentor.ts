import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

/**
 * Mentor Engine
 * Provides the "Strict Mentor" analysis and insights for the OS.
 */
export async function getMentorAudit() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      projects: true,
      logs: { take: 7, orderBy: { date: 'desc' } },
      worthHistory: { take: 2, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!user) return "System initializing...";

  const skillCount = user.skills.length;
  const evidenceCount = user.evidences.length;
  const avgSkillScore = skillCount ? user.skills.reduce((acc, s) => acc + s.score, 0) / skillCount : 0;

  const bottlenecks = [];
  if (evidenceCount < 5) bottlenecks.push("Critically low evidence (under 5 items)");
  if (avgSkillScore < 75) bottlenecks.push(`Low mastery average (${avgSkillScore.toFixed(1)})`);
  
  const worthDelta = user.worthHistory.length > 1 
    ? (user.worthHistory[0].score - user.worthHistory[1].score).toFixed(1)
    : '0.0';

  if (!openai) {
    // Fallback Rule-based logic
    if (bottlenecks.length > 0) {
      return `SYSTEM CRITICAL: ${bottlenecks[0]}. You are leaking professional gravity. Focus on deep technical proof.`;
    }
    return "Performance is stable. Your project momentum is grounded. Push for expert status.";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a 'Strict Performance Analyst' for a top-tier engineer. Your goal is to identify bottlenecks and output-leaks. Be sharp, direct, and professional. No fluff."
        },
        {
          role: "user",
          content: `Audit this engineer's profile:
            - Evidence Velocity: ${evidenceCount} items
            - Mastery Avg: ${avgSkillScore.toFixed(1)}%
            - Worth Delta: ${worthDelta}
            - Bottlenecks: ${bottlenecks.join(', ') || 'None'}
            - Shipped Projects: ${user.projects.filter(p => p.stage === 'SHIPPED').length}
            
            Provide a 3-sentence performance audit.`
        }
      ],
      temperature: 0.5,
    });

    return response.choices[0].message.content || "Audit generation failed.";
  } catch (error) {
    console.error('[AI_MENTOR] OpenAI call failed:', error);
    return "AI Audit failed. Check API connectivity.";
  }
}

export async function getDailyInsight() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      logs: { take: 1, orderBy: { date: 'desc' } }
    }
  });

  const lastLog = user?.logs[0];
  if (!lastLog) return "Log your first activity to generate insights.";

  if ((lastLog.distractions || 0) > 3) {
    return "High distraction count detected today. Your 'Power Block' was compromised. Tomorrow, disable all notifications and use a hardware focus lock.";
  }

  return "Optimal focus today. Your technical depth is increasing. Shift tomorrow's execution block to a 'Higher Gravity' task.";
}

/**
 * Dynamic Strategic Insights
 */
export async function getStrategicInsights() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: { skills: true, evidences: true, speaking: true }
  });

  if (!user) return [];

  const insights = [];
  const roles = (user.roleWeights as any) || {};
  const currentMode = user.currentMode;

  // Role Mismatch Detection
  if (currentMode === 'CANDIDATE' && roles.candidate < 40) {
    insights.push({
      type: 'ROLE_CALIBRATION',
      title: 'Role Mismatch',
      text: `Your current mode is CANDIDATE but your weight for this role is only ${roles.candidate}%. Shift priority to interview prep.`
    });
  }

  // Communication Bottleneck
  const lastSpeaking = user.speaking[0];
  if (lastSpeaking && (lastSpeaking.scores as any)?.clarity < 7) {
    insights.push({
      type: 'BOTTLENECK',
      title: 'Communication Lag',
      text: 'Technical clarity is dragging down your career worth. Perform 3 speaking drills this week focusing on "System Design Explanations".'
    });
  }

  // Evidence Weakness
  const eliteEvidence = user.evidences.filter(e => e.strength > 0.8).length;
  if (eliteEvidence < 3) {
    insights.push({
      type: 'BOTTLENECK',
      title: 'Low Signal Ratio',
      text: 'You have high volume but low "ELITE" signals. One high-complexity project is worth more than 10 minor repos right now.'
    });
  }

  return insights;
}

/**
 * System Bottlenecks
 */
export async function getSystemBottlenecks() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: { evidences: true, speaking: true }
  });

  if (!user) return [];

  const bottlenecks = [];
  
  if (user.evidences.length < 10) bottlenecks.push('Low evidence volume');
  
  const eliteRatio = user.evidences.filter(e => e.strength > 0.8).length / (user.evidences.length || 1);
  if (eliteRatio < 0.2) bottlenecks.push('Low "ELITE" signal ratio');

  const speakingAvg = user.speaking.length > 0 
    ? user.speaking.reduce((acc, s) => acc + ((s.scores as any)?.clarity || 0), 0) / user.speaking.length 
    : 10;
  if (speakingAvg < 8) bottlenecks.push('Communication clarity gap');

  return bottlenecks;
}
