import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const db = new Database('./prisma/dev.db')
const adapter = new PrismaBetterSqlite3(db)
const prisma = new PrismaClient({ adapter })

async function test() {
  try {
    const user = await prisma.user.findFirst()
    console.log('Connection successful:', user)
  } catch (e) {
    console.error('Connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

test()
