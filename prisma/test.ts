import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const userCount = await prisma.user.count()
    console.log(`✅ Connection successful. User count: ${userCount}`)
    
    const user = await prisma.user.findFirst({
      include: { 
        skills: true,
        evidences: true,
        projects: true
      }
    })
    
    if (user) {
      console.log('✅ User "Elite Student" found.')
      console.log(`- Skills: ${user.skills.length}`)
      console.log(`- Evidence: ${user.evidences.length}`)
      console.log(`- Projects: ${user.projects.length}`)
    }
  } catch (e) {
    console.error('❌ Connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
