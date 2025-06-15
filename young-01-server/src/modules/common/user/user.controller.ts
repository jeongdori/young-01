import { Request, Response } from 'express';
import { resSuccess, resError, resCustom } from '@/utils/response';

import {
    findById as findByIdUser,
    update as updateUser,
    deleteById as deleteUser,
    findAll as findAllUsers,
} from './user.service';

export const findMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await findByIdUser(userId);
        if (!user) throw resCustom(404, '사용자를 찾을 수 없습니다');
        resSuccess(res, user);
    } catch (err) {
        resError(res, err);
    }
};

export const updateMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body!;

        const updated = await updateUser(userId, { name, email });
        if (!updated) throw resCustom(404, '수정 대상이 없습니다');

        resSuccess(res, null, '수정 완료');
    } catch (err) {
        resError(res, err);
    }
};

export const deleteMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const deleted = await deleteUser(userId);
        if (!deleted) throw resCustom(404, '삭제 대상 없음');
        resSuccess(res, null, '삭제 완료');
    } catch (err) {
        resError(res, err);
    }
};

export const findAll = async (req: Request, res: Response) => {
    try {
        const users = await findAllUsers();
        resSuccess(res, users);
    } catch (err) {
        resError(res, err);
    }
};

export const findById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) throw resCustom(404, '사용자를 찾을 수 없습니다');

        const user = await findByIdUser(userId);
        if (!user) throw resCustom(404, '사용자를 찾을 수 없습니다');
        resSuccess(res, user);
    } catch (err) {
        resError(res, err);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) throw resCustom(404, '사용자를 찾을 수 없습니다');

        const updated = await updateUser(userId, req.body);
        if (!updated) throw resCustom(404, '수정 대상 없음');
        resSuccess(res, null, '수정 완료');
    } catch (err) {
        resError(res, err);
    }
};

export const deleteById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) throw resCustom(404, '사용자를 찾을 수 없습니다');

        const deleted = await deleteUser(userId);
        if (!deleted) throw resCustom(404, '삭제 대상 없음');
        resSuccess(res, null, '삭제 완료');
    } catch (err) {
        resError(res, err);
    }
};
