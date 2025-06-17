import axios from '@/api/axios';

import { User, UserUpdateDto } from '@shared/types/user/user.types';

const defaultPath = '/user';
const userService = {
    findMe: () => axios.get(`${defaultPath}/me`),
    updateMe: (data: UserUpdateDto) => axios.put(`${defaultPath}/me`, data),
    deleteMe: () => axios.patch(`${defaultPath}/me`, {}),

    findAll: async (): Promise<Array<User>> => axios.get(`${defaultPath}`),
    findById: (id: number) => axios.get(`${defaultPath}/${id}`),
    update: (id: number, data: UserUpdateDto) => axios.put(`${defaultPath}/${id}`, data),
    delete: (id: number) => axios.patch(`${defaultPath}/${id}`, {}),
};
export default userService;
