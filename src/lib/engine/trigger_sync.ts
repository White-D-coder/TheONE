import { syncGitHub } from './sync';
import prisma from '../prisma';

async function main() {
  const username = 'White-D-coder';
  const email = 'student@engineer-os.com';
  
  console.log(`[TRIGGER] Starting sync for ${username}...`);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("User not found in DB");
    return;
  }

  // Ensure PlatformAccount exists
  await prisma.platformAccount.upsert({
    where: { id: `github-${user.id}` },
    update: {},
    create: {
      id: `github-${user.id}`,
      userId: user.id,
      platform: 'GITHUB',
      username: username,
      syncStatus: 'IDLE'
    }
  });

  const result = await syncGitHub(username, email);
  console.log("[TRIGGER] Sync result:", result);
  process.exit(result.success ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
