const jwt = require('jsonwebtoken');
const jwtConfig = require('@config/jwt');
const redis = require('@lib/redis');

/**
 * 사용자 정보로 accessToken 생성
 */
exports.signAccessToken = (user) => {
    const payload = {
        id: user.id,
        groups: user.Groups?.map((g) => g.name),
    };

    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.accessExpiresIn),
    });
};

/**
 * userId로 refreshToken 생성
 */
exports.signRefreshToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.refreshExpiresIn),
    });
};

/**
 * 토큰 검증
 */
exports.verifyToken = (token) => {
    return jwt.verify(token, jwtConfig.secret);
};
