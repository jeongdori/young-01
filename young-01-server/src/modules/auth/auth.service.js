const bcrypt = require('bcrypt');
const { resCustom } = require('@utils/response');

const authRepo = require('./auth.repository');
const authTokenService = require('./auth.token.service');

exports.login = async ({ email, password }) => {
    const user = await authRepo.findUserWithGroupsByEmail(email);
    if (!user) throw resCustom(401, '존재하지 않는 사용자입니다');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw resCustom(401, '비밀번호가 일치하지 않습니다');

    const plainUser = {
        id: user.id,
        groups: user.Groups.map((g) => g.name),
    };

    const { accessToken, refreshToken } =
        await authTokenService.generateTokenPair(plainUser);
    if (!accessToken) throw resCustom(500, 'Access token 생성 실패');
    if (!refreshToken) throw resCustom(500, 'Refresh token 생성 실패');

    return { user, token: { accessToken, refreshToken } };
};

exports.register = async ({ email, password, name }) => {
    const exists = await authRepo.findUserByEmail(email);
    if (exists) throw resCustom(409, '이미 등록된 이메일입니다');

    const hashed = await bcrypt.hash(password, 10);
    const user = await authRepo.createUser({ email, password: hashed, name });

    // 기본 그룹 매핑 (예: id=1인 'user' 그룹)
    const group = await authRepo.findGroupByName('user');
    if (!group) throw resCustom(500, '기본 그룹이 존재하지 않습니다');

    await user.addGroup(group);

    return user;
};

exports.refresh = async (refreshToken) => {
    if (!refreshToken) throw resCustom(401, 'Refresh token이 없습니다');

    const userId = await authTokenService.validateRefreshToken(refreshToken);
    const user = await authRepo.findUserWithGroupsById(userId);
    if (!user) throw resCustom(404, '사용자를 찾을 수 없습니다');

    const plainUser = {
        id: user.id,
        email: user.email,
        groups: user.Groups.map((g) => g.name),
    };

    const { accessToken, refreshToken: newRefreshToken } =
        await authTokenService.generateTokenPair(plainUser);
    if (!accessToken) throw resCustom(500, 'Access token 생성 실패');
    if (!newRefreshToken) throw resCustom(500, 'Refresh token 생성 실패');

    return { token: { accessToken, refreshToken: newRefreshToken } };
};

exports.logout = async (user) => {
    await authTokenService.invalidateRefreshToken(user.id);
};
