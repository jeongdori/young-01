const jwt = require('jsonwebtoken');
const { resError } = require('@utils/response');
const jwtConfig = require('@config/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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
