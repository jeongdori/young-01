import { UserResponseDto } from '@shared/types/user/user.types';

declare global {
    namespace Express {
        interface Request {
            user: UserResponseDto;
        }
    }
}

export {};
