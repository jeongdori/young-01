import axios from '@/api/axios';

import { UserLoginInputDto, UserLoginDto, UserRegisterDto } from '@shared/types/user/user.types';

const defaultPath = '';
const authService = {
    getPublicKey: (): Promise<{ publicKey: string }> => axios.get('/public-key'),
    login: (data: UserLoginInputDto): Promise<UserLoginDto> =>
        axios.post(`${defaultPath}/login`, data, {
            withCredentials: true,
        }),

    register: (data: UserRegisterDto): Promise<null> => axios.post(`${defaultPath}/register`, data),

    refreshAccessToken: (): Promise<null> => axios.post(`${defaultPath}/refresh`, {}, { withCredentials: true }),

    logout: (): Promise<null> => axios.post(`${defaultPath}/logout`, {}, { withCredentials: true }),
};
export default authService;
