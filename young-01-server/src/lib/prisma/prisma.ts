import { PrismaClient, Prisma } from '@prisma/client';
import logger from '@/lib/logger';

const MODE = process.env.NODE_ENV;

const prisma = new PrismaClient({
    log:
        MODE === 'prod'
            ? [{ level: 'error', emit: 'event' }]
            : [
                  { level: 'query', emit: 'event' },
                  { level: 'warn', emit: 'event' },
                  { level: 'info', emit: 'event' },
                  { level: 'error', emit: 'event' },
              ],
});

if (MODE !== 'prod') {
    prisma.$on('query', (e) => {
        const cleanedQuery = e.query.replace(/`[^`]+`\.`([^`]+)`\.`([^`]+)`/g, '$1.$2');
        logger.info(`[DB][QUERY] ${cleanedQuery}`);
        logger.info(`[DB][PARAMS] ${e.params}`);
        logger.info(`[DB][DURATION] ${e.duration}ms`);
    });
    prisma.$on('info', (e) => {
        logger.info(`[DB] ${e}`);
    });
    prisma.$on('warn', (e) => {
        logger.warn(`[DB] ${e}`);
    });
    prisma.$on('error', (e) => {
        logger.error(`[DB] ${e}`);
    });
}

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
