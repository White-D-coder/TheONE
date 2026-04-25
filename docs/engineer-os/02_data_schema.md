# Engineer OS: Data Schema (Prisma)

This schema defines the foundational entities required for tracking progress and calculating worth.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  roleWeights   Json      // { student: 0.5, builder: 0.3, ... }
  currentMode   String    @default("NORMAL")
  skills        Skill[]
  evidences     Evidence[]
  routines      Routine[]
  projects      Project[]
  logs          DailyLog[]
  worthHistory  WorthRecord[]
}

model Skill {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  name              String
  category          String   // TECHNICAL, COMMUNICATION, CAREER
  score             Float    @default(0)
  consistencyScore  Float    @default(0)
  evidenceCount     Int      @default(0)
  lastPracticedAt   DateTime @updatedAt
}

model Evidence {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String   // COMMIT, REPO, BLOG, SPEECH, CERT
  title       String
  url         String?
  strength    Float    // 0 to 1
  skillId     String?
  projectId   String?
  createdAt   DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  stage       String   // IDEA, BUILDING, SHIPPED
  techStack   String[]
  visibility  String   // PRIVATE, PUBLIC
  createdAt   DateTime @default(now())
}

model DailyLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  date        DateTime @default(now())
  workBlocks  Json     // [{ start, end, type, focusScore }]
  distractions Int     @default(0)
  summary     String?
}

model WorthRecord {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  month       Int
  year        Int
  score       Float
  breakdown   Json
}
```
