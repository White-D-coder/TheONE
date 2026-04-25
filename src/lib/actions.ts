'use server';

import { revalidatePath } from 'next/cache';

// Mock in-memory store for the prototype
// In a real app, this would be Prisma/Postgres
let roles = {
  engineer: 60,
  builder: 40,
  communicator: 20,
  candidate: 10
};

let currentMode = 'NORMAL';

export async function updateRoles(newRoles: any) {
  roles = newRoles;
  revalidatePath('/identity');
  revalidatePath('/');
  return { success: true };
}

export async function updateMode(mode: string) {
  currentMode = mode;
  revalidatePath('/identity');
  revalidatePath('/');
  return { success: true };
}

export async function getGitHubStats(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();
    return {
      public_repos: data.public_repos,
      followers: data.followers,
      avatar_url: data.avatar_url
    };
  } catch (e) {
    return null;
  }
}
