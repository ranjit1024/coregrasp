import { PrismaClient } from "./src/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

export function createPrismaClient(databaseUrl: string) {
  const adapter = new PrismaPg({ connectionString: databaseUrl, max:5 });
  return new PrismaClient({ adapter });
}
export * from "./src/generated/prisma/client";