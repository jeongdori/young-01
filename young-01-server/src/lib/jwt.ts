import jwt from 'jsonwebtoken';
import jwtConfig from '@/config/jwt';

import { UserResponseDto } from '@shared/types/user/user.types';
/**
 * 사용자 정보로 accessToken 생성
 */
export const signAccessToken = (user: UserResponseDto) => {
    const payload = {
        id: user.id,
        groups: user.groups,
    };

    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.accessExpiresIn),
    });
};

/**
 * userId로 refreshToken 생성
 */
export const signRefreshToken = (userId: number) => {
    const payload = { id: userId };
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.refreshExpiresIn),
    });
};

/**
 * 토큰 검증
 */
export const verifyToken = (token: string): UserResponseDto => {
    return jwt.verify(token, jwtConfig.secret) as UserResponseDto;
};
