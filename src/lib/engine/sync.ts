import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Safe revalidation for both Next.js and Standalone environments
 */
function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch (e) {
    // Ignore error when running in standalone scripts
  }
}

/**
 * GitHub Sync Engine
 */
export async function syncGitHub(username: string) {
  console.log(`[SYNC] Starting GitHub sync for ${username}...`);
  
  try {
    // 1. Fetch Repos
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const repos = await res.json();

    // 2. Fetch Recent Events for Consistency Tracking
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    const events = await eventsRes.json();
    
    // Calculate Commit Density (how many of last 30 events are commits/PRs)
    const pushEvents = Array.isArray(events) ? events.filter((e: any) => e.type === 'PushEvent' || e.type === 'PullRequestEvent') : [];
    const todayCommit = pushEvents.some((e: any) => {
      const date = new Date(e.created_at);
      return date.toDateString() === new Date().toDateString();
    });

    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false, error: 'User not found' };

    const stats = {
      repoCount: repos.length,
      latestRepos: repos.map((r: any) => r.name),
      consistencyScore: Math.min(100, pushEvents.length * 5),
      committedToday: todayCommit,
      lastCommitDate: pushEvents[0]?.created_at || null
    };

    await prisma.platformAccount.upsert({
      where: { id: `github-${user.id}` },
      update: {
        lastSynced: new Date(),
        syncStatus: 'IDLE',
        username: username,
        stats
      },
      create: {
        id: `github-${user.id}`,
        userId: user.id,
        platform: 'GITHUB',
        username: username,
        lastSynced: new Date(),
        syncStatus: 'IDLE',
        stats
      }
    });

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

    await prisma.eventLog.create({
      data: {
        userId: user.id,
        type: 'SYNC_DONE',
        metadata: { platform: 'GITHUB', reposSynced: repos.length }
      }
    });

    safeRevalidate('/');
    safeRevalidate('/vault');
    return { success: true };
  } catch (error: any) {
    console.error(`[SYNC] GitHub failed:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * LeetCode Sync Engine
 */
export async function syncLeetCode(username: string) {
  console.log(`[SYNC] Starting LeetCode sync for ${username}...`);
  
  try {
    const query = `
      query userProblemsSolved($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await res.json();
    if (data.errors) throw new Error('LeetCode user not found or private');

    const stats = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    const solvedTotal = stats.find((s: any) => s.difficulty === 'All')?.count || 0;

    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false };

    await prisma.platformAccount.upsert({
      where: { id: `leetcode-${user.id}` },
      update: {
        lastSynced: new Date(),
        username: username,
        stats: { solvedTotal, breakdown: stats }
      },
      create: {
        id: `leetcode-${user.id}`,
        userId: user.id,
        platform: 'LEETCODE',
        username: username,
        lastSynced: new Date(),
        stats: { solvedTotal, breakdown: stats }
      }
    });

    if (solvedTotal > 50) {
      await prisma.skill.upsert({
        where: { id: `dsa-${user.id}` },
        update: { score: Math.min(95, 60 + (solvedTotal / 10)) },
        create: { userId: user.id, name: 'DSA & Algorithms', category: 'TECHNICAL', score: 70 }
      });
    }

    safeRevalidate('/');
    return { success: true };
  } catch (error: any) {
    console.error(`[SYNC] LeetCode failed:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Codeforces Sync Engine
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
        username: username,
        stats: { rating: stats.rating, rank: stats.rank, maxRating: stats.maxRating }
      },
      create: {
        id: `codeforces-${user.id}`,
        userId: user.id,
        platform: 'CODEFORCES',
        username: username,
        lastSynced: new Date(),
        stats: { rating: stats.rating, rank: stats.rank, maxRating: stats.maxRating }
      }
    });

    safeRevalidate('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Medium Sync Engine
 */
export async function syncMedium(username: string) {
  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`);
    const data = await res.json();
    
    if (data.status !== 'ok') throw new Error('Medium feed not found');
    
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false };

    for (const item of data.items) {
      const existing = await prisma.evidence.findFirst({
        where: { userId: user.id, url: item.link }
      });

      if (!existing) {
        await prisma.evidence.create({
          data: {
            userId: user.id,
            type: 'ARTICLE',
            title: item.title,
            description: 'Published on Medium',
            url: item.link,
            strength: 0.85,
            source: 'MEDIUM'
          }
        });
      }
    }

    safeRevalidate('/vault');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * YouTube Sync Engine
 */
export async function syncYouTube(channelId: string) {
  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const data = await res.json();
    
    if (data.status !== 'ok') throw new Error('YouTube channel not found');
    
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false };

    for (const item of data.items) {
      const existing = await prisma.evidence.findFirst({
        where: { userId: user.id, url: item.link }
      });

      if (!existing) {
        await prisma.evidence.create({
          data: {
            userId: user.id,
            type: 'VIDEO',
            title: item.title,
            description: 'Published on YouTube',
            url: item.link,
            strength: 0.9,
            source: 'YOUTUBE'
          }
        });
      }
    }

    safeRevalidate('/vault');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * YouTube Handle Resolver
 */
async function resolveYouTubeHandle(handle: string) {
  const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
  const res = await fetch(`https://www.youtube.com/${cleanHandle}`);
  const html = await res.text();
  const match = html.match(/"channelId":"(.*?)"/);
  return match ? match[1] : null;
}

export async function syncYouTubeWithHandle(handle: string) {
  const channelId = await resolveYouTubeHandle(handle);
  if (!channelId) return { success: false, error: 'Could not resolve channel ID' };
  return await syncYouTube(channelId);
}

/**
 * Public Profile Ingestor
 */
export async function syncPublicProfile(url: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) return { success: false };

    let platform = 'OTHER';
    if (url.includes('linkedin.com')) platform = 'LINKEDIN';
    if (url.includes('instagram.com')) platform = 'INSTAGRAM';
    if (url.includes('hackerrank.com')) platform = 'HACKERRANK';
    if (url.includes('twitter.com') || url.includes('x.com')) platform = 'TWITTER';

    await prisma.evidence.create({
      data: {
        userId: user.id,
        type: 'LINK',
        title: `Public Profile: ${platform}`,
        description: `Verified link to ${platform} profile.`,
        url: url,
        strength: 0.5,
        source: platform
      }
    });

    safeRevalidate('/vault');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
