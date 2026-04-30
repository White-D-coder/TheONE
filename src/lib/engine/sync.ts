import prisma from '@/lib/prisma';
const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * GitHub Sync Engine
 */
export async function syncGitHub(username: string, userEmail: string = DEFAULT_USER_EMAIL) {
  console.log(`[SYNC] Starting GitHub sync for ${username}...`);
  
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) return { success: false, error: 'User not found' };

  const accountId = `github-${user.id}`;
  
  // 0. Update Status to SYNCING
  await prisma.platformAccount.update({
    where: { id: accountId },
    data: { syncStatus: 'SYNCING' }
  });

  try {
    // 1. Fetch Repos
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });

    // Observability: Log rate limits
    const remaining = res.headers.get('x-ratelimit-remaining');
    console.log(`[SYNC] GitHub API Remaining: ${remaining}`);

    if (!res.ok) throw new Error(`GitHub API error: ${res.status} (${res.statusText})`);
    const repos = await res.json();

    // 2. Fetch Recent Events
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    const events = await eventsRes.json();
    
    const pushEvents = Array.isArray(events) ? events.filter((e: any) => e.type === 'PushEvent' || e.type === 'PullRequestEvent') : [];
    const todayCommit = pushEvents.some((e: any) => {
      const date = new Date(e.created_at);
      return date.toDateString() === new Date().toDateString();
    });

    const stats = {
      repoCount: repos.length,
      latestRepos: repos.map((r: any) => r.name),
      consistencyScore: Math.min(100, pushEvents.length * 5),
      committedToday: todayCommit,
      lastCommitDate: pushEvents[0]?.created_at || null
    };

    await prisma.platformAccount.update({
      where: { id: accountId },
      data: {
        lastSynced: new Date(),
        syncStatus: 'IDLE',
        username: username,
        stats
      }
    });

    // 3. Process Evidence (Limit to top 3 to prevent payload bloat)
    for (const repo of repos.slice(0, 3)) {
      await prisma.evidence.upsert({
        where: { id: `gh-repo-${repo.id}` }, // Use GitHub ID for idempotency
        update: {
          strength: repo.stargazers_count > 10 ? 0.9 : 0.6,
          description: repo.description || 'Synced from GitHub'
        },
        create: {
          id: `gh-repo-${repo.id}`,
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

    await updateStreak(user.id, 'CODE');

    await prisma.eventLog.create({
      data: {
        userId: user.id,
        type: 'SYNC_DONE',
        metadata: { platform: 'GITHUB', reposSynced: repos.length }
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error(`[SYNC] GitHub failed:`, error);
    
    await prisma.platformAccount.update({
      where: { id: accountId },
      data: { syncStatus: 'FAILED' }
    });

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
        stats: { solvedTotal, breakdown: stats },
        syncStatus: 'IDLE'
      }
    });

    // Create Evidence artifact for milestone
    if (solvedTotal > 0) {
      await prisma.evidence.upsert({
        where: { id: `lc-milestone-${user.id}-${solvedTotal}` },
        update: {},
        create: {
          id: `lc-milestone-${user.id}-${solvedTotal}`,
          userId: user.id,
          type: 'ALGORITHMIC',
          title: `LeetCode Mastery: ${solvedTotal} Problems Solved`,
          description: `Verified algorithmic proficiency across ${stats.length} difficulty levels.`,
          url: `https://leetcode.com/${username}`,
          source: 'LEETCODE',
          strength: Math.min(1, solvedTotal / 500)
        }
      });
    }

    if (solvedTotal > 50) {
      await prisma.skill.upsert({
        where: { id: `dsa-${user.id}` },
        update: { score: Math.min(95, 60 + (solvedTotal / 10)) },
        create: { userId: user.id, name: 'DSA & Algorithms', category: 'TECHNICAL', score: 70 }
      });
    }

    await updateStreak(user.id, 'DSA');
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

    // Create Evidence artifact
    if (stats.rating) {
      await prisma.evidence.upsert({
        where: { id: `cf-rank-${user.id}-${stats.rating}` },
        update: {},
        create: {
          id: `cf-rank-${user.id}-${stats.rating}`,
          userId: user.id,
          type: 'ALGORITHMIC',
          title: `Codeforces Rank: ${stats.rank.toUpperCase()}`,
          description: `Achieved a competitive rating of ${stats.rating} (Max: ${stats.maxRating}).`,
          url: `https://codeforces.com/profile/${username}`,
          source: 'CODEFORCES',
          strength: Math.min(1, stats.rating / 2000)
        }
      });
    }

    await updateStreak(user.id, 'DSA');
    return { success: true };
  } catch (error: any) {
    console.error(`[SYNC] Codeforces failed:`, error.message);
    return { success: false, error: error.message };
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

/**
 * Streak Update Logic
 */
async function updateStreak(userId: string, type: 'CODE' | 'DSA' | 'CONTENT' | 'ROUTINE') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await prisma.streak.findFirst({
    where: { userId, type }
  });

  if (!streak) {
    await prisma.streak.create({
      data: { userId, type, currentCount: 1, longestCount: 1, lastUpdate: today }
    });
    return;
  }

  const lastUpdate = new Date(streak.lastUpdate);
  lastUpdate.setHours(0, 0, 0, 0);

  const diff = today.getTime() - lastUpdate.getTime();
  const dayInMs = 24 * 60 * 60 * 1000;

  if (diff === dayInMs) {
    // Consecutive day
    const newCount = streak.currentCount + 1;
    await prisma.streak.update({
      where: { id: streak.id },
      data: { 
        currentCount: newCount,
        longestCount: Math.max(streak.longestCount, newCount),
        lastUpdate: today
      }
    });
  } else if (diff > dayInMs) {
    // Streak broken
    await prisma.streak.update({
      where: { id: streak.id },
      data: { currentCount: 1, lastUpdate: today }
    });
  }
}
