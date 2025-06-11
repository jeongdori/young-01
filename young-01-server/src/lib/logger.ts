// src/utils/logger.ts
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = format;
const mode = process.env.NODE_ENV || 'dev';

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}] ${stack || message}`;
});

// 공통 transport: 콘솔
const consoleTransport = new transports.Console({
    format: combine(colorize(), logFormat),
});

// prod에만 파일 저장
const fileTransport =
    mode === 'prod'
        ? new transports.DailyRotateFile({
              dirname: 'logs',
              filename: '%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: false,
              maxFiles: '7d',
              format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
          })
        : null;

const logger = createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [consoleTransport, ...(fileTransport ? [fileTransport] : [])],
    exitOnError: false,
});

/**
 * 로그 플러시 및 종료 대기 함수
 */
export async function flushLogger(): Promise<void> {
    if (fileTransport) {
        return new Promise((resolve) => {
            fileTransport.on('finish', () => resolve());
            fileTransport.end();
        });
    }
}

export default logger;
