import { PrismaClient, Prisma } from '@prisma/client';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

async function connectDB() {
    try {
        await prisma.$connect();
        logger.info('✅ DB connected');
    } catch (err: unknown) {
        let msg = 'Unknown Error';
        if (err instanceof Error) msg = err.message;
        logger.error('❌ DB connection failed:', msg);
    }
}
async function disconnectDB() {
    prisma.$disconnect();
}
export { prisma, Prisma, PrismaClient, connectDB, disconnectDB };
