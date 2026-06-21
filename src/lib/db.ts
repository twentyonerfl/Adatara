import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

let prismaInstance: PrismaClient;

if (connectionString) {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const globalForPrisma = global as unknown as { prisma: PrismaClient };

  prismaInstance =
    globalForPrisma.prisma ||
    new PrismaClient({
      adapter,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  // Fallback hanya jika DATABASE_URL tidak ada (misal saat build time di Vercel)
  prismaInstance = new Proxy({} as PrismaClient, {
    get(target, prop) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
  });
}

export const db = prismaInstance;


