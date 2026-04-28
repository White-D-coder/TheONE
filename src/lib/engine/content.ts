import prisma from '@/lib/prisma';

const FEEDS = [
  { name: 'Netflix Tech Blog', url: 'https://netflixtechblog.com/feed', category: 'ENGINEERING' },
  { name: 'Uber Engineering', url: 'https://www.uber.com/en-IN/blog/engineering/rss/', category: 'ENGINEERING' },
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml', category: 'AI' }
];

/**
 * Content Feed Engine
 * Ingests high-value engineering content via RSS.
 */
export async function syncContentFeeds() {
  console.log("[CONTENT] Syncing high-value feeds...");

  for (const feed of FEEDS) {
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feed.url}`);
      const data = await res.json();
      
      if (data.status !== 'ok') continue;

      for (const item of data.items) {
        await prisma.contentItem.upsert({
          where: { url: item.link },
          update: {
            summary: item.description?.substring(0, 500) || '',
          },
          create: {
            title: item.title,
            url: item.link,
            source: feed.name,
            category: feed.category,
            summary: item.description?.substring(0, 500) || '',
            relevance: 0.9, // Default high relevance for curated feeds
            status: 'UNREAD'
          }
        });
      }
    } catch (error) {
      console.error(`[CONTENT] Failed to sync ${feed.name}:`, error);
    }
  }

  return { success: true };
}
