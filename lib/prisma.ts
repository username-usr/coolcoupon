// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined; 
}

// 1. Initialize the PostgreSQL Adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// 2. Initialize the Prisma Client
const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],});

// 3. In development, save the instance to the global object
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;