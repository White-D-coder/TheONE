import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const db = new Database('/Users/deeptanubhunia/Desktop/TheONE/prisma/dev.db')
const adapter = new PrismaBetterSqlite3(db)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clear existing data
  await prisma.skill.deleteMany({})
  await prisma.evidence.deleteMany({})

  const user = await prisma.user.upsert({
    where: { email: 'student@engineer-os.com' },
    update: {},
    create: {
      email: 'student@engineer-os.com',
      name: 'Elite Student',
      roleWeights: {
        engineer: 60,
        builder: 40,
        communicator: 20,
        candidate: 10
      },
      currentMode: 'NORMAL',
    },
  })

  // Seed Skills
  await prisma.skill.createMany({
    data: [
      { userId: user.id, name: 'System Design', category: 'TECHNICAL', score: 78, confidenceScore: 85, consistencyScore: 90 },
      { userId: user.id, name: 'React / Next.js', category: 'TECHNICAL', score: 92, confidenceScore: 95, consistencyScore: 98 },
      { userId: user.id, name: 'PostgreSQL', category: 'TECHNICAL', score: 65, confidenceScore: 70, consistencyScore: 60 },
      { userId: user.id, name: 'Technical Explanation', category: 'COMMUNICATION', score: 55, confidenceScore: 60, consistencyScore: 40 },
    ],
  })

  // Seed Evidence
  await prisma.evidence.createMany({
    data: [
      { userId: user.id, type: 'REPO', title: 'Adaptive Scheduler Core', strength: 0.92, url: 'https://github.com/user/adaptive-scheduler' },
      { userId: user.id, type: 'ARTICLE', title: 'Why Consistency Beats Intensity', strength: 0.85 },
    ],
  })

  console.log('Seed data created successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
