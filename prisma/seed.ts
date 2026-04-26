import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clean slate
    await prisma.worthRecord.deleteMany({})
    await prisma.speakingSession.deleteMany({})
    await prisma.opportunity.deleteMany({})
    await prisma.dailyLog.deleteMany({})
    await prisma.eventLog.deleteMany({})
    await prisma.platformAccount.deleteMany({})
    await prisma.skill.deleteMany({})
    await prisma.evidence.deleteMany({})
    await prisma.project.deleteMany({})

    const user = await prisma.user.upsert({
      where: { email: 'student@engineer-os.com' },
      update: {},
      create: {
        email: 'student@engineer-os.com',
        name: 'Elite Student',
        roleWeights: {
          engineer: 65,
          builder: 35,
          communicator: 25,
          candidate: 15
        },
        currentMode: 'NORMAL',
      },
    })

    // Seed Skills
    await prisma.skill.createMany({
      data: [
        { userId: user.id, name: 'System Design', category: 'TECHNICAL', score: 78, confidenceScore: 0.85, consistencyScore: 0.90 },
        { userId: user.id, name: 'React / Next.js', category: 'TECHNICAL', score: 92, confidenceScore: 0.95, consistencyScore: 0.98 },
        { userId: user.id, name: 'PostgreSQL', category: 'TECHNICAL', score: 65, confidenceScore: 0.70, consistencyScore: 0.60 },
        { userId: user.id, name: 'Node.js', category: 'TECHNICAL', score: 84, confidenceScore: 0.88, consistencyScore: 0.82 },
      ],
    })

    // Seed Evidence
    await prisma.evidence.createMany({
      data: [
        { userId: user.id, type: 'REPO', title: 'TheONE Core Engine', strength: 0.95, url: 'https://github.com/elite/the-one' },
        { userId: user.id, type: 'REPO', title: 'System Viz Library', strength: 0.88, url: 'https://github.com/elite/sys-viz' },
      ],
    })

    // Seed Projects
    await prisma.project.create({
      data: {
        userId: user.id,
        name: 'TheONE OS',
        stage: 'BUILDING',
        techStack: ['Next.js', 'Prisma', 'SQLite'],
        visibility: 'PUBLIC'
      }
    })

    // Seed Worth History
    await prisma.worthRecord.createMany({
      data: [
        { userId: user.id, month: 3, year: 2026, score: 72.4, breakdown: { skillScore: 7.2, evidenceScore: 6.8, projectScore: 8.0, speakingBonus: 5.0 } },
        { userId: user.id, month: 4, year: 2026, score: 81.2, breakdown: { skillScore: 8.1, evidenceScore: 7.5, projectScore: 8.5, speakingBonus: 6.0 } },
      ]
    })

    // Seed Speaking Sessions
    await prisma.speakingSession.createMany({
      data: [
        { userId: user.id, topic: 'Explain B-Trees', scores: { clarity: 8.2, pacing: 7.5, filler: 'Low' }, feedback: 'Strong structural explanation.' },
        { userId: user.id, topic: 'React Reconciliation', scores: { clarity: 7.8, pacing: 8.1, filler: 'High' }, feedback: 'Avoid repeating "basically".' },
      ]
    })

    // Seed Opportunities
    await prisma.opportunity.createMany({
      data: [
        { userId: user.id, company: 'Vercel', title: 'Backend Engineer', fitScore: 94, reason: 'Next.js mastery is your primary strength.', url: 'https://vercel.com/jobs' },
        { userId: user.id, company: 'Supabase', title: 'Infrastructure Intern', fitScore: 88, reason: 'Relevant Postgres expertise detected.', url: 'https://supabase.com/jobs' },
      ]
    })

    // Seed Daily Log for today
    await prisma.dailyLog.create({
      data: {
        userId: user.id,
        date: new Date(),
        workBlocks: [
          { label: 'Deep Work', duration: 180, type: 'ENGINEER' },
          { label: 'Project Execution', duration: 90, type: 'BUILDER' }
        ],
        summary: 'Focused heavily on DB stabilization and core engine logic.'
      }
    })

    console.log('Production-grade seed data created successfully')
  } catch (e) {
    console.error('Seed failed:', e)
  }
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
