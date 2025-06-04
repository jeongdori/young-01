import { Request, Response } from 'express';
import { resSuccess, resError, resCustom } from '@/utils/response';

import {
    getPublicKey as getPublicKeyService,
    login as loginService,
    logout as logoutService,
    register as registerService,
    refresh as refreshService,
} from './auth.service';

export const getPublicKey = (req: Request, res: Response) => {
    const key = getPublicKeyService();
    resSuccess(res, { publicKey: key }, '공개키 조회 성공');
};

export const login = async (req: Request, res: Response) => {
    try {
        if (!req.body)
            throw resCustom(403, '로그인 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        const data = await loginService(req.body);

        res.cookie('accessToken', data.token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: (Number(process.env.JWT_ACCESS_EXPIRES_IN) || 60 * 30) * 1000, // 30분
        });
        res.cookie('refreshToken', data.token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: (Number(process.env.JWT_REFRESH_EXPIRES_IN) || 60 * 60 * 24 * 7) * 1000, // 7일
        });
        resSuccess(res, data.user, '로그인 성공');
    } catch (err: unknown) {
        resError(res, err);
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) throw resCustom(401, '로그인 상태가 아닙니다');

        await logoutService(req.user.id);

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

export const register = async (req: Request, res: Response) => {
    try {
        if (!req.body)
            throw resCustom(403, '회원가입 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        await registerService(req.body);
        resSuccess(res, null, '회원가입 완료', 201);
    } catch (err) {
        resError(res, err);
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) throw resCustom(401, '로그인 상태가 아닙니다');

        const data = await refreshService(refreshToken);
        res.cookie('accessToken', data.token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: (Number(process.env.JWT_ACCESS_EXPIRES_IN) || 60 * 30) * 1000, // 30분
        });
        res.cookie('refreshToken', data.token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: (Number(process.env.JWT_REFRESH_EXPIRES_IN) || 60 * 60 * 24 * 7) * 1000, // 7일
        });
        resSuccess(res, null, '토큰 갱신 성공');
    } catch (err) {
        resError(res, err);
    }
};
