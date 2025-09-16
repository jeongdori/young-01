import { Response } from 'express';
import createError, { HttpError } from 'http-errors';
import util from 'util';
import logger from '@/lib/logger';
import { Prisma } from '@/lib/prisma/prisma';
import { isPrismaError, classifyPrismaError } from '@/lib/prisma/prisam-error';

const MODE = process.env.NODE_ENV;

/**
 * 성공 응답 유틸
 * @param {Response} res
 * @param {unknown} data
 * @param {string} message
 * @param {number} status
 */
export const resSuccess = (res: Response, data: unknown, message = 'success', status = 200) => {
    console.log('data', data);
    // if (MODE !== 'prod') {
    //     logger.info(`[RES DATA] ${util.inspect(data, { depth: null, maxArrayLength: 10 })}`);
    // }
    res.status(status).json({
        success: true,
        message,
        data,
    });
};

/**
 * 공통 에러 응답
 * @param {Response} res - Express 응답 객체
 * @param {unknown} error - Error 객체 or 커스텀 메시지
 * @param {number} status - HTTP 상태 코드
 */
export const resError = (res: Response, error: unknown, status?: number) => {
    let message = 'internal server error';
    let httpStatus = status || 500;
    let stack: string | undefined = undefined;
    let logError = error;

    if (typeof error === 'string') {
        message = error;
    } else if (isPrismaError(error)) {
        const { message: dbMessage, status: dbStatus, error: dbError } = classifyPrismaError(error);
        message = dbMessage;
        httpStatus = dbStatus;
        stack = dbError.stack;
        logError = dbError;
    } else if (error instanceof Error) {
        message = error.message;
        stack = error.stack;

        // http-errors 패키지의 HttpError 객체인 경우
        const maybeHttpErr = error as Partial<HttpError>;
        if (maybeHttpErr.status || maybeHttpErr.statusCode) {
            httpStatus = maybeHttpErr.status || maybeHttpErr.statusCode || httpStatus;
        }
    }

    logger.error('[RES ERROR]', {
        message,
        status: httpStatus,
        stack: stack,
        error: logError,
    });

    res.status(httpStatus).json({
        success: false,
        message,
        data: null,
    });
};

/**
 * HTTP 오류 객체 생성 유틸
 * @param {number} status
 * @param {string} message
 * @returns {Error & {status: number}}
 */
export const resCustom = (status: number, message: string): HttpError => {
    return createError(status, message);
};
