const jwt = require('@lib/jwt');
const jwtConfig = require('@config/jwt');
const redis = require('@lib/redis');

/**
 * access + refresh token 발급 + 저장
 */
exports.generateTokenPair = async (user) => {
    const accessToken = jwt.signAccessToken(user);
    const refreshToken = jwt.signRefreshToken(user.id);

    await redis.set(`refresh:${user.id}`, refreshToken, {
        EX: Number(jwtConfig.refreshExpiresIn),
    });

    return { accessToken, refreshToken };
};

/**
 * access token 발급
 */
exports.signAccessToken = (user) => {
    return jwt.signAccessToken(user);
};

/**
 * refreshToken 유효성 검사 및 user id 반환
 */
exports.validateRefreshToken = async (refreshToken) => {
    if (!refreshToken) throw resCustom(401, 'Refresh token이 없습니다');

    let decoded;
    try {
        decoded = jwt.verifyToken(refreshToken);
    } catch {
        throw resCustom(403, '유효하지 않은 refresh token입니다');
    }

    const stored = await redis.get(`refresh:${decoded.id}`);
    if (stored !== refreshToken) {
        throw resCustom(403, '저장된 token과 일치하지 않습니다');
    }

    return decoded.id;
};

/**
 * refreshToken 제거
 */
exports.invalidateRefreshToken = async (userId) => {
    await redis.del(`refresh:${userId}`);
};
