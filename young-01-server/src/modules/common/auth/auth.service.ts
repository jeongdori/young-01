import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma, Prisma } from '@/lib/prisma';
import { resCustom } from '@/utils/response';

import { UserLoginDto, UserResponseDto } from '@shared/types/user/user.types';

import {
    findUserForLogin,
    findUserForToken,
    findUserForExists,
    createUser,
    findGroup,
    createUserGroupMap,
} from './auth.repository';
import {
    generateTokenPair,
    validateRefreshToken,
    invalidateRefreshToken,
} from './auth.token.service';

const { generateKeyPairSync } = crypto;
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

const decryptPassword = (encrypted: string) => {
    return crypto
        .privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            Buffer.from(encrypted, 'base64'),
        )
        .toString();
};

export const login = async ({ email, password }: UserLoginDto) => {
    const user = await findUserForLogin(email!);
    if (!user) throw resCustom(401, '존재하지 않는 사용자입니다');

    const dncryptedPassword = decryptPassword(password);

    const match = await bcrypt.compare(dncryptedPassword, user.password);
    if (!match) throw resCustom(401, '비밀번호가 일치하지 않습니다');

    const plainUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        groups: user.groups,
    };

    const { accessToken, refreshToken } = await generateTokenPair(plainUser as UserResponseDto);
    if (!accessToken) throw resCustom(500, 'Access token 생성 실패');
    if (!refreshToken) throw resCustom(500, 'Refresh token 생성 실패');

    return { user: plainUser, token: { accessToken, refreshToken } };
};

export const getPublicKey = () => publicKey.export({ type: 'spki', format: 'pem' });

export const register = async ({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name: string;
}) => {
    const exists = await findUserForExists(email);
    if (exists) throw resCustom(409, '이미 등록된 이메일입니다');

    const hashed = await bcrypt.hash(password, 10);

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await createUser(tx, { email, password: hashed, name });
        if (!user) throw resCustom(500, '사용자 생성 중 오류가 발생했습니다');

        const defaultGroup = await findGroup(tx, 'user');
        if (!defaultGroup) throw resCustom(500, '기본 그룹이 존재하지 않습니다');

        const userGroupMap = await createUserGroupMap(tx, {
            user_id: user.id!,
            group_id: defaultGroup.id,
        });
        if (!userGroupMap) throw resCustom(500, '사용자 그룹 매핑 생성 중 오류가 발생했습니다');

        return user;
    });
};

export const refresh = async (refreshToken: string) => {
    if (!refreshToken) throw resCustom(401, 'Refresh token이 없습니다');

    const userId = await validateRefreshToken(refreshToken);
    const user = await findUserForToken(userId);
    if (!user) throw resCustom(404, '사용자를 찾을 수 없습니다');

    const plainUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        groups: user.groups,
    };
    const { accessToken, refreshToken: newRefreshToken } = await generateTokenPair(plainUser);
    if (!accessToken) throw resCustom(500, 'Access token 생성 실패');
    if (!newRefreshToken) throw resCustom(500, 'Refresh token 생성 실패');

    return { token: { accessToken, refreshToken: newRefreshToken } };
};

export const logout = async (userId: number) => {
    await invalidateRefreshToken(userId);
};
