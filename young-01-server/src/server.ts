import app from './app';
import { Server } from 'http';

import logger, { flushLogger } from '@/lib/logger';
import { connectDB, disconnectDB } from '@/lib/prisma/prisma';
import { connectRedis, disconnectRedis } from '@/lib/redis';
import { runAllCleanup } from '@/lib/shutdownRegistry';

const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'prod';

function startServer(): Server | null {
    try {
        const server = app.listen(port, () => {
            logger.info(`✅ Server started on port ${port}`);
        });

        server.on('error', (err: Error) => {
            logger.error('❌ Server failed to start:', err);
        });

        return server;
    } catch (e) {
        logger.error('❌ Unexpected error in startServer()', e);
    }
    return null;
}

/**
 * 예외 이벤트 등록
 * @param {Server} server - http Server
 */
function handleOnException(server: Server) {
    /**
     * 서버, 커넥션 등 종료
     */
    const shutdown = async () => {
        logger.info('🔄 Shutting down...');
        if (server) server.close(() => logger.info('✅ HTTP server closed'));
        await disconnectDB();
        await disconnectRedis();
        await runAllCleanup();
        await flushLogger();
        // await websocketServer.close();
        // await kafkaConsumer.disconnect();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    process.on('unhandledRejection', async (err) => {
        logger.error('Unhandled rejection:', err);
        if (isProd) await shutdown();
    });
    process.on('uncaughtException', async (err) => {
        logger.error('Uncaught exception:', err);
        if (isProd) await shutdown();
    });
}

async function bootstrap() {
    try {
        await connectDB();
        await connectRedis();
        const server = startServer();
        if (server) handleOnException(server);
        else throw Error('서버 시작에 실패하여 종료 훅을 등록하지 않습니다.');
    } catch (err) {
        logger.error('❌ 앱 부트스트랩 중 예외 발생 ', err);
    }
}

bootstrap();
