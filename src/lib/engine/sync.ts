import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

export async function syncGitHub(username: string) {
  console.log(`[SYNC] Starting GitHub sync for ${username}...`);
  
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional: for higher rate limits
      }
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const repos = await res.json();

    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false, error: 'User not found' };

    // Update Platform Account
    await prisma.platformAccount.upsert({
      where: { id: `github-${user.id}` },
      update: {
        lastSynced: new Date(),
        syncStatus: 'IDLE',
        stats: { repoCount: repos.length, latestRepos: repos.map((r: any) => r.name) }
      },
      create: {
        id: `github-${user.id}`,
        userId: user.id,
        platform: 'GITHUB',
        username: username,
        lastSynced: new Date(),
        syncStatus: 'IDLE',
        stats: { repoCount: repos.length, latestRepos: repos.map((r: any) => r.name) }
      }
    });

    // Create evidence for the latest 3 repos if they don't exist
    for (const repo of repos.slice(0, 3)) {
      const existing = await prisma.evidence.findFirst({
        where: { userId: user.id, url: repo.html_url }
      });

      if (!existing) {
        await prisma.evidence.create({
          data: {
            userId: user.id,
            type: 'REPO',
            title: repo.name,
            description: repo.description || 'Synced from GitHub',
            url: repo.html_url,
            strength: repo.stargazers_count > 10 ? 0.9 : 0.6,
            source: 'GITHUB'
          }
        });
      }
    }

    // Log Event
    await prisma.eventLog.create({
      data: {
        userId: user.id,
        type: 'SYNC_DONE',
        metadata: { platform: 'GITHUB', reposSynced: repos.length }
      }
    });

    revalidatePath('/');
    revalidatePath('/vault');
    return { success: true };
  } catch (error: any) {
    console.error(`[SYNC] GitHub failed:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Placeholder for LeetCode Sync
 * Since LeetCode doesn't have a public official API, 
 * we use a public GraphQL endpoint or user-provided manual import.
 */
export async function syncLeetCode(username: string) {
  console.log(`[SYNC] Starting LeetCode sync for ${username}...`);
  // Implementation of GraphQL fetch here
  // For now, updating stats to mark as 'CONNECTED'
  return { success: true, message: 'Sync logic pending (Scraping/GraphQL required)' };
}

/**
 * Placeholder for Codeforces Sync
 */
export async function syncCodeforces(username: string) {
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await res.json();
    
    if (data.status !== 'OK') throw new Error('Codeforces handle not found');
    
    const stats = data.result[0];
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false };

    await prisma.platformAccount.upsert({
      where: { id: `codeforces-${user.id}` },
      update: {
        lastSynced: new Date(),
        stats: { rating: stats.rating, rank: stats.rank }
      },
      create: {
        id: `codeforces-${user.id}`,
        userId: user.id,
        platform: 'CODEFORCES',
        username: username,
        lastSynced: new Date(),
        stats: { rating: stats.rating, rank: stats.rank }
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
