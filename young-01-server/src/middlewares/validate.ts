import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { resError } from '@utils/response';

/**
 * Express 미들웨어로 요청의 body, query, params를 Zod 스키마로 검증합니다.
 * 검증 실패 시 400 에러와 함께 에러 메시지를 반환합니다.
 *
 * @param schema - 검증할 Zod 스키마
 * @param from - 검증할 요청의 위치 (body, query, params)
 * @returns Express 미들웨어 함수
 */
const validate =
    (schema: z.ZodTypeAny, from: 'body' | 'query' | 'params' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[from]);
        console.log('Validation result:', result);
        if (!result.success) {
            return resError(
                res,
                'VALIDATION_ERROR',
                400,
                result.error.errors[0].message || '유효성 검사 실패',
            );
        }
        req[from] = result.data;
        next();
    };

export default validate;
