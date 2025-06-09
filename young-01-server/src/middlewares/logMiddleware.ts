import { Request, Response, NextFunction } from 'express';
import logger from '@/lib/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    logger.info(`[REQUEST]  :${req.headers['x-request-id']} [${req.method}] ${req.originalUrl}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(
            `[RESPONSE] :${req.headers['x-request-id']} [${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
        );
    });

    next();
}
