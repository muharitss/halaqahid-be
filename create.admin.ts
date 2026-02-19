import { PrismaClient } from "./src/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  await prisma.user.create({
    data: {
      email: "admin@halaqah.id",
      username: "admin",
      password: hashedPassword,
      role: "superadmin",
      deleted_at: null
    }
  });
  console.log("User admin berhasil dibuat!");
}
run();