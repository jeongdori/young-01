import { prisma, Prisma, PrismaClient } from '@/lib/prisma/prisma';
import {
    User,
    UserLoginDto,
    UserResponseDto,
    UserExistsDto,
    UserRegisterDto,
    Group,
    UserGroupMap,
} from '@shared/types/user/user.types';

export const findUserForLogin = async (email: string): Promise<UserLoginDto | null> => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            userGroupMappings: {
                include: {
                    group: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) return null;

    return {
        id: user.id,
        name: user.name ?? '',
        password: user.password ?? '',
        email: user.email ?? '',
        groups: user.userGroupMappings.map(
            (map: (typeof user.userGroupMappings)[number]) => map.group.name,
        ),
    };
};

export const findUserForToken = async (id: number): Promise<UserResponseDto | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            userGroupMappings: {
                select: {
                    group: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) return null;

    return {
        id: user.id,
        name: user.name ?? '',
        email: user.email ?? '',
        groups: user.userGroupMappings.map(
            (map: (typeof user.userGroupMappings)[number]) => map.group.name,
        ),
    };
};

export const findUserForExists = (email: string): Promise<UserExistsDto | null> => {
    return prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
};

export const createUser = (
    tx: Prisma.TransactionClient | PrismaClient = prisma,
    data: UserRegisterDto,
): Promise<User> => {
    return tx.user.create({ data, select: { id: true, email: true, name: true } });
};

export const findGroup = (
    tx: Prisma.TransactionClient | PrismaClient = prisma,
    name: string,
): Promise<Group | null> => {
    return tx.group.findUnique({ where: { name }, select: { id: true, name: true } });
};
export const createUserGroupMap = (
    tx: Prisma.TransactionClient | PrismaClient = prisma,
    data: UserGroupMap,
): Promise<UserGroupMap | null> => {
    return tx.userGroupMap.create({ data });
};
