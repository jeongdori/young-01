const { resSuccess, resError } = require('@utils/response');

const authService = require('./auth.service');

exports.login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        res.cookie('accessToken', data.token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: (process.env.ACCESS_TOKEN_EXPIRES_IN || 60 * 30) * 1000, // 30분
        });
        res.cookie('refreshToken', data.token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge:
                (process.env.REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 7) *
                1000, // 7일
        });

        resSuccess(res, data.user, '로그인 성공');
    } catch (err) {
        resError(res, err);
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) return resCustom(401, '로그인 상태가 아닙니다');

        await authService.logout(req.user);

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });
        resSuccess(res, null, '로그아웃 성공');
    } catch (err) {
        return resError(res, err);
    }
};

exports.register = async (req, res) => {
    try {
        await authService.register(req.body);
        resSuccess(res, null, '회원가입 완료', 201);
    } catch (err) {
        resError(res, err);
    }
};

exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        const data = await authService.refresh(refreshToken);
        res.cookie('accessToken', data.token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: (process.env.ACCESS_TOKEN_EXPIRES_IN || 60 * 30) * 1000, // 30분
        });
        res.cookie('refreshToken', data.token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge:
                (process.env.REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 7) *
                1000, // 7일
        });
        resSuccess(res, data.user);
    } catch (err) {
        resError(res, err);
    }
};
