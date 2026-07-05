import { PrismaClient } from "@revisly/db";
import { PrismaPg } from "@prisma/adapter-pg";

export function getPrisma(databaseUrl: string) {
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}