const jwt = require('jsonwebtoken');
const { resError } = require('@utils/response');
const jwtConfig = require('@config/jwt');

// 인증 예외 경로
const publicPaths = ['/login', '/register', '/refresh'];

module.exports = (req, res, next) => {
    console.log('Request Path:', req.path);
    if (publicPaths.includes(req.path)) {
        return next(); // 예외 경로는 통과
    }

    // 쿠키에서 accessToken 가져오기
    const token = req.cookies?.accessToken;
    if (!token) {
        return resError(res, 'NO_TOKEN', 401);
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // 재발급 시도 가능
                return resError(res, 'TOKEN_EXPIRED', 401);
            } else {
                // 서명 위조, 포맷 오류 등
                return resError(res, 'INVALID_TOKEN', 403);
            }
        }

        req.user = decoded;
        next();
    });
};
