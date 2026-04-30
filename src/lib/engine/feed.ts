import prisma from '@/lib/prisma';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

/**
 * Mindset & Research Feed Engine
 * Pulls high-signal content from engineering and career growth feeds.
 */
export async function syncMindsetFeed() {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) return { success: false };

  // High-signal Engineering/Career RSS Feeds
  const feeds = [
    'https://netflixtechblog.com/feed',
    'https://engineering.fb.com/feed/',
    'https://vercel.com/blog/feed'
  ];

  try {
    for (const feed of feeds) {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feed}`);
      const data = await res.json();

      if (data.status !== 'ok') continue;

      for (const item of data.items.slice(0, 5)) {
        await prisma.contentItem.upsert({
          where: { id: `feed-${item.guid || item.link}` },
          update: {},
          create: {
            id: `feed-${item.guid || item.link}`,
            userId: user.id,
            title: item.title,
            category: 'RESEARCH',
            content: item.content || item.description,
            url: item.link,
            source: data.feed.title || 'Tech Blog',
            status: 'NEW',
            tags: item.categories || []
          }
        });
      }
    }
    return { success: true };
  } catch (e) {
    console.error('[FEED] Sync failed:', e);
    return { success: false };
  }
}
