import { Response } from 'express';
import createError, { HttpError } from 'http-errors';

/**
 * 성공 응답 유틸
 * @param {Response} res
 * @param {any} data
 * @param {string} message
 * @param {number} status
 */
export const resSuccess = (res: Response, data: unknown, message = 'success', status = 200) => {
    res.status(status).json({
        success: true,
        message,
        data,
    });
};

/**
 * 공통 에러 응답
 * @param {Response} res - Express 응답 객체
 * @param {Error|string} error - Error 객체 or 커스텀 메시지
 * @param {number} status - HTTP 상태 코드
 * @param {string} [customMessage] - 강제로 지정할 메시지 (선택)
 */
export const resError = (
    res: Response,
    error: unknown,
    status?: number,
    customMessage?: string,
) => {
    let message = 'internal server error';
    let httpStatus = status || 500;
    let stack: string | undefined = undefined;

    if (customMessage) {
        message = customMessage;
    } else if (typeof error === 'string') {
        message = error;
    } else if (error instanceof Error) {
        message = error.message;
        stack = error.stack;

        // http-errors 패키지의 HttpError 객체인 경우
        const maybeHttpErr = error as Partial<HttpError>;
        if (maybeHttpErr.status || maybeHttpErr.statusCode) {
            httpStatus = maybeHttpErr.status || maybeHttpErr.statusCode || httpStatus;
        }
    }

    console.error('[resError]', {
        message,
        status: httpStatus,
        stack: stack,
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
