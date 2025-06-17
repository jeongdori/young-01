import { Prisma } from './prisma';

export function isPrismaError(
    error: unknown,
): error is
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientUnknownRequestError
    | Prisma.PrismaClientInitializationError
    | Prisma.PrismaClientRustPanicError
    | Prisma.PrismaClientValidationError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientValidationError
    );
}

export function classifyPrismaError(
    error: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError,
) {
    switch (true) {
        case error instanceof Prisma.PrismaClientValidationError:
            return {
                message: '[PRISMA ERROR] 입력 값이 잘못되었습니다.',
                status: 400,
                error,
            };
        case error instanceof Prisma.PrismaClientKnownRequestError:
            switch (error.code) {
                case 'P2002':
                    return {
                        message: '[PRISMA ERROR] 이미 존재하는 항목입니다.',
                        status: 409,
                        error,
                    };
                case 'P2025':
                    return {
                        message: '[PRISMA ERROR] 존재하지 않는 항목입니다.',
                        status: 404,
                        error,
                    };
                default:
                    return {
                        message: '[PRISMA ERROR] 데이터베이스 오류가 발생했습니다.',
                        status: 500,
                        error,
                    };
            }
        default:
            return {
                message:
                    '[PRISMA ERROR] 데이터베이스 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
                status: 500,
                error,
            };
    }
}
