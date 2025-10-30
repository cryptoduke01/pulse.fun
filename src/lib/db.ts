// Use a safe, dynamic import to avoid build failures when Prisma isn't available
let PrismaClientCtor: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientCtor = require('@prisma/client').PrismaClient;
} catch {
  PrismaClientCtor = class {
    async $connect() { /* noop */ }
    async $disconnect() { /* noop */ }
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

export const db: any = globalForPrisma.prisma ?? new PrismaClientCtor();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
