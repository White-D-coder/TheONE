const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock the modules that reports.ts might need
const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

async function testReport() {
  const user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    include: {
      skills: true,
      evidences: true,
      logs: { take: 7, orderBy: { date: 'desc' } },
      speaking: { take: 3, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  const totalLogs = user.logs.length;
  const avgFocus = totalLogs ? user.logs.reduce((acc, l) => acc + (l.focusScore || 0), 0) / totalLogs : 0;
  const totalEvidence = user.evidences.length;
  
  const eliteSkills = user.skills.filter(s => s.score >= 80).map(s => s.name);
  const fillerAvg = user.speaking.length > 0 
    ? user.speaking.reduce((acc, s) => acc + ((s.scores && s.scores.filler === 'High') ? 1 : 0), 0) / user.speaking.length 
    : 0;

  console.log('Report Data Calculated:');
  console.log({ avgFocus, totalEvidence, eliteSkills, fillerAvg });
}

testReport()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
