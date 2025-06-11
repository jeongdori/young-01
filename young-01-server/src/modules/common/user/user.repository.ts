import { prisma } from '@/lib/prisma/prisma';
import { User, UserUpdateDto } from '@shared/types/user/user.types';

export const findUserAll = (): Promise<User[]> => {
    return prisma.user.findMany({ select: { id: true, name: true, email: true } });
};

export const findUser = (id: number): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });
};

export const updateUser = (id: number, data: UserUpdateDto): Promise<User> => {
    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
};

export const deleteUser = (id: number): Promise<User> => {
    return prisma.user.delete({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
};
