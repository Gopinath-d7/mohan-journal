import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import { neonConfig } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import ws from "ws"
import * as dotenv from "dotenv"

dotenv.config()

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL as string })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const password = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@mohanjournal.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mohanjournal.com",
      password,
      role: "ADMIN",
    },
  })
  console.log("✅ Admin created!")
  console.log("📧 Email:    admin@mohanjournal.com")
  console.log("🔑 Password: admin123")
  await prisma.journal.upsert({
    where: { slug: "computer-science-journal" },
    update: {},
    create: {
      title: "Computer Science Journal",
      slug: "computer-science-journal",
      description: "A journal for computer science research",
      subject: "Computer Science",
      isActive: true,
    },
  })

  console.log("✅ Test journal created!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
