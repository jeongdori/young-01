const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { resCustom } = require('@utils/response');
const jwtConfig = require('@config/jwt');
const redis = require('@lib/redis');

const authRepo = require('./auth.repository');

exports.login = async ({ email, password }) => {
    const user = await authRepo.findUserWithGroupsByEmail(email);
    if (!user) throw resCustom(401, '존재하지 않는 사용자입니다');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new resCustom(401, '비밀번호가 일치하지 않습니다');

    const plainUser = {
        id: user.id,
        groups: user.Groups.map((g) => g.name),
    };

    const accessToken = jwt.sign(plainUser, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.accessExpiresIn),
    });
    const refreshToken = jwt.sign({ id: user.id }, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.refreshExpiresIn),
    });
    await redis.set(`refresh:${user.id}`, refreshToken, {
        EX: Number(jwtConfig.refreshExpiresIn), // 초 단위 (604800 = 7일)
    });
    return { user, token: { accessToken, refreshToken } };
};

exports.register = async ({ email, password, name }) => {
    const exists = await authRepo.findUserByEmail(email);
    if (exists) throw resCustom(409, '이미 등록된 이메일입니다');

    const hashed = await bcrypt.hash(password, 10);
    const user = await authRepo.createUser({ email, password: hashed, name });
    console.log('user1 : ', user);
    // 기본 그룹 매핑 (예: id=1인 'user' 그룹)
    const group = await authRepo.findGroupByName('user');
    if (!group) throw resCustom(500, '기본 그룹이 존재하지 않습니다');
    await user.addGroup(group);
    console.log('user2 : ', user);

    return user;
};

exports.refresh = async (refreshToken) => {
    if (!refreshToken) throw resCustom(401, 'Refresh token이 없습니다');

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, jwtConfig.secret);
    } catch {
        throw resCustom(403, '유효하지 않은 refresh token 입니다.');
    }

    const user = await authRepo.findUserWithGroupsById(decoded.id);
    if (!user) throw resCustom(404, '존재하지 않는 사용자입니다');

    const storedToken = await redis.get(`refresh:${decoded.id}`);
    if (storedToken !== token) {
        throw resCustom(404, 'Refresh token을 찾을 수 없습니다.');
    }
    const plainUser = {
        id: user.id,
        email: user.email,
        groups: user.Groups.map((g) => g.name),
    };

    const accessToken = jwt.sign(plainUser, jwtConfig.secret, {
        expiresIn: Number(jwtConfig.accessExpiresIn),
    });

    return { accessToken };
};

exports.logout = async (user) => {
    await redis.del(`refresh:${user.id}`);
};
