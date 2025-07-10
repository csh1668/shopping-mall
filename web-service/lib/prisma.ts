// import { serverEnv } from "@/server-env"
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (serverEnv.NODE_ENV !== "production") globalForPrisma.prisma = prisma
