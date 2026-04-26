'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

// Hardcoded for now until we have auth: use a single "Elite Student" user
const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

export async function getOSState() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      projects: true
    }
  });

  if (!user) {
    // Return defaults if user doesn't exist yet
    return {
      roles: { engineer: 60, builder: 40, communicator: 20, candidate: 10 },
      currentMode: 'NORMAL'
    };
  }

  return {
    roles: user.roleWeights || { engineer: 60, builder: 40, communicator: 20, candidate: 10 },
    currentMode: user.currentMode,
    user
  };
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
  
  // Sorting roles by weight
  const sortedRoles = Object.entries(roles)
    .sort(([, a]: any, [, b]: any) => b - a);
  
  const primaryRole = sortedRoles[0][0];
  const secondaryRole = sortedRoles[1][0];

  const routine = [
    { time: '07:30', label: 'Physical Prime', duration: '45m', type: 'BODY', color: 'var(--accent-emerald)', status: 'DONE' },
    { 
      time: '09:00', 
      label: `Power Block: ${primaryRole.toUpperCase()} Deep Work`, 
      duration: '180m', 
      type: primaryRole.toUpperCase(), 
      color: primaryRole === 'engineer' ? 'var(--accent-blue)' : 'var(--accent-purple)', 
      status: 'ACTIVE',
      tag: 'HIGH GRAVITY'
    },
    { time: '12:00', label: 'Maintenance & Nutrition', duration: '60m', type: 'REST', color: 'var(--text-tertiary)', status: 'PENDING' },
    { 
      time: '13:00', 
      label: `Execution: ${secondaryRole.toUpperCase()} Session`, 
      duration: '120m', 
      type: secondaryRole.toUpperCase(), 
      color: secondaryRole === 'builder' ? 'var(--accent-purple)' : 'var(--accent-amber)', 
      status: 'PENDING' 
    },
    { time: '15:30', label: 'AI Review & Strategy', duration: '30m', type: 'AI_REVIEW', color: 'var(--text-primary)', status: 'LOCKED' }
  ];

  return routine;
}

export async function getGitHubStats(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();
    
    // Save to DB as evidence
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (user) {
      await prisma.evidence.create({
        data: {
          userId: user.id,
          type: 'REPO_SYNC',
          title: `GitHub Sync: ${username}`,
          url: `https://github.com/${username}`,
          strength: 0.8
        }
      });
      revalidatePath('/vault');
    }

    return {
      public_repos: data.public_repos,
      followers: data.followers,
      avatar_url: data.avatar_url
    };
  } catch (e) {
    return null;
  }
}

export async function getDashboardStats() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      projects: true
    }
  });

  if (!user) return null;

  return {
    skillScore: user.skills.length > 0 ? (user.skills.reduce((acc, s) => acc + s.score, 0) / user.skills.length).toFixed(1) : 0,
    evidenceCount: user.evidences.length,
    activeProjects: user.projects.length,
    consistency: "94%" // Calculated or hardcoded for now until we have logs
  };
}
