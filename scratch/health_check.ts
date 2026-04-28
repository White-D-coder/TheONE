import prisma from '../src/lib/prisma';
import { calculateMonthlyWorth } from '../src/lib/engine/worth';
import { generateRoutine } from '../src/lib/actions';
import { getMentorAudit } from '../src/lib/engine/mentor';

const DEFAULT_USER_EMAIL = 'student@engineer-os.com';

async function healthCheck() {
  console.log('--- ENGINEER OS SYSTEM HEALTH CHECK ---');
  
  // 1. User Presence
  const user = await prisma.user.findUnique({ 
    where: { email: DEFAULT_USER_EMAIL },
    include: { accounts: true, skills: true, evidences: true, logs: true }
  });
  
  if (!user) {
    console.error('❌ FAIL: Default user not found. Database must be seeded.');
    process.exit(1);
  }
  console.log('✅ PASS: Default user found:', user.name);

  // 2. Connectivity Check
  const github = user.accounts.find(a => a.platform === 'GITHUB');
  const leetcode = user.accounts.find(a => a.platform === 'LEETCODE');
  
  if (github) console.log('✅ PASS: GitHub connected:', github.username);
  else console.log('⚠️ WARN: GitHub not connected.');
  
  if (leetcode) console.log('✅ PASS: LeetCode connected:', leetcode.username);
  else console.log('⚠️ WARN: LeetCode not connected.');

  // 3. Engine Verification (Worth)
  try {
    const worth = await calculateMonthlyWorth();
    console.log('✅ PASS: Worth Engine operational. Current Score:', worth?.score);
  } catch (e: any) {
    console.error('❌ FAIL: Worth Engine crashed:', e.message);
  }

  // 4. Engine Verification (Routine)
  try {
    const routine = await generateRoutine();
    console.log('✅ PASS: Routine Engine operational. Blocks:', routine.length);
  } catch (e: any) {
    console.error('❌ FAIL: Routine Engine crashed:', e.message);
  }

  // 5. Engine Verification (Mentor)
  try {
    const audit = await getMentorAudit();
    console.log('✅ PASS: Mentor Engine operational.');
    console.log('   Audit Snippet:', audit.substring(0, 50) + '...');
  } catch (e: any) {
    console.error('❌ FAIL: Mentor Engine crashed:', e.message);
  }

  // 6. DB Integrity (Event Logs)
  const logsCount = await prisma.eventLog.count();
  console.log('✅ PASS: Event Log system active. Total logs:', logsCount);

  console.log('--- HEALTH CHECK COMPLETE ---');
}

healthCheck()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
