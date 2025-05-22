const { resSuccess, resError } = require('@utils/response');
const { requireFields } = require('@utils/validate');

const userService = require('./user.service');

exports.findMe = async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        if (!user) return resError(res, '사용자를 찾을 수 없습니다', 404);
        resSuccess(res, user);
    } catch (err) {
        resError(res, err);
    }
};

exports.updateMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.validatedBody;

        const updated = await userService.update(userId, { name, email });
        if (!updated) return resError(res, '수정 대상이 없습니다', 404);

        resSuccess(res, null, '수정 완료');
    } catch (err) {
        resError(res, err);
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await userService.findAll();
        resSuccess(res, users);
    } catch (err) {
        resError(res, err);
    }
};

exports.findById = async (req, res) => {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) return resError(res, '사용자를 찾을 수 없습니다', 404);
        resSuccess(res, user);
    } catch (err) {
        resError(res, err);
    }
};

exports.create = async (req, res) => {
    try {
        requireFields(req.body, ['name', 'email']);
        await userService.create(req.body);
        resSuccess(res, null, '등록 완료', 201);
    } catch (err) {
        resError(res, err, 400);
    }
};

exports.update = async (req, res) => {
    try {
        requireFields(req.body, ['name', 'email']);
        const updated = await userService.update(req.params.id, req.body);
        if (!updated) return resError(res, '수정 대상 없음', 404);
        resSuccess(res, null, '수정 완료');
    } catch (err) {
        resError(res, err, 400);
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await userService.delete(req.params.id);
        if (!deleted) return resError(res, '삭제 대상 없음', 404);
        resSuccess(res, null, '삭제 완료');
    } catch (err) {
        resError(res, err);
    }
};
