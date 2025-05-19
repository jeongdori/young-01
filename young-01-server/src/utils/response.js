/**
 * 성공 응답 유틸
 * @param {Response} res
 * @param {any} data
 * @param {string} message
 * @param {number} status
 */
exports.resSuccess = (res, data, message = 'success', status = 200) => {
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
exports.resError = (res, error, status, customMessage) => {
    let message = 'internal server error';
    let httpStatus = status || 500;

    if (customMessage) {
        message = customMessage;
    } else if (typeof error === 'string') {
        message = error;
    } else if (error?.message) {
        message = error.message;

        if (error.status || error.statusCode) {
            httpStatus = error.status || error.statusCode;
        }
    }

    console.error('[resError]', {
        message,
        status: httpStatus,
        stack: error?.stack || error,
    });

    res.status(httpStatus).json({
        success: false,
        message,
    });
};

/**
 * HTTP 오류 객체 생성 유틸
 * @param {number} status
 * @param {string} message
 * @returns {Error & {status: number}}
 */
exports.resCustom = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};
