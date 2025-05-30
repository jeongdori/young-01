import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { resError } from '@/utils/response';
import jwtConfig from '@/config/jwt';

import { UserResponseDto } from '@shared/types/user/user.types';

// 인증 예외 경로
const publicPaths = ['/public-key', '/login', '/register', '/refresh'];

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (publicPaths.includes(req.path)) {
        return next(); // 예외 경로는 통과
    }

    // 쿠키에서 accessToken 가져오기
    const token = req.cookies?.accessToken;
    if (!token) {
        return resError(res, 'NO_TOKEN', 401);
    }

    jwt.verify(
        token,
        jwtConfig.secret,
        (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // 재발급 시도 가능
                    return resError(res, 'TOKEN_EXPIRED', 401);
                } else {
                    // 서명 위조, 포맷 오류 등
                    return resError(res, 'INVALID_TOKEN', 403);
                }
            }

            req.user = decoded as UserResponseDto; // 타입 단언
            next();
        },
    );
};

export default authMiddleware;
