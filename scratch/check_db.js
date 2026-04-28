const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const userCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      skills: true,
      evidences: true
    }
  });
  
  console.log('Total Users:', userCount);
  console.log('Users Data:', JSON.stringify(users, null, 2));
  
  const opportunities = await prisma.opportunity.count();
  console.log('Total Opportunities:', opportunities);
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
