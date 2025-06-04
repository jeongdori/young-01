import { signAccessToken, signRefreshToken, verifyToken } from '@/lib/jwt';
import jwtConfig from '@/config/jwt';
import { set, get, del } from '@/lib/redis';

import { UserResponseDto } from '@shared/types/user/user.types';

import { resCustom } from '@/utils/response';

/**
 * access + refresh token 발급 + 저장
 */
export const generateTokenPair = async (user: UserResponseDto) => {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user.id);

    await set(`refresh:${user.id}`, refreshToken, {
        EX: Number(jwtConfig.refreshExpiresIn),
    });

    return { accessToken, refreshToken };
};

/**
 * access token 발급
 */
export const getSignAccessToken = (user: UserResponseDto) => {
    return signAccessToken(user);
};

/**
 * refreshToken 유효성 검사 및 user id 반환
 */
export const validateRefreshToken = async (refreshToken: string) => {
    if (!refreshToken) throw resCustom(401, 'Refresh token이 없습니다');

    let decoded;
    try {
        decoded = verifyToken(refreshToken);
    } catch {
        throw resCustom(403, '유효하지 않은 refresh token입니다');
    }

    const stored = await get(`refresh:${decoded.id}`);
    if (stored !== refreshToken) {
        throw resCustom(403, '저장된 token과 일치하지 않습니다');
    }

    return decoded.id;
};

/**
 * refreshToken 제거
 */
export const invalidateRefreshToken = async (userId: number) => {
    await del(`refresh:${userId}`);
};
