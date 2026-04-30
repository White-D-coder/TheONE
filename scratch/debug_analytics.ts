import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

async function test() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
      include: {
        skills: true,
        evidences: true,
        projects: true,
        logs: { take: 7, orderBy: { date: 'desc' } },
        worthHistory: { take: 2, orderBy: { createdAt: 'desc' } },
        speaking: { take: 3, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("User found:", user.email);

    // Test Weekly Report logic
    const totalLogs = user.logs.length;
    const avgFocus = totalLogs ? user.logs.reduce((acc, l) => acc + ((l as any).focusScore || 0), 0) / totalLogs : 0;
    console.log("Avg Focus:", avgFocus);

    const report = {
      overallScore: (avgFocus * 0.4 + (user.evidences.length / 10 * 100) * 0.3 + (user.skills.length * 5) * 0.3).toFixed(0),
    };
    console.log("Report Score:", report.overallScore);

    console.log("Test Success");
  } catch (e) {
    console.error("Test Failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
