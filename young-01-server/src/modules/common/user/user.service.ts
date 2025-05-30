import { findUserAll, findUser, updateUser, deleteUser } from './user.repository';
import { UserUpdateDto } from '@shared/types/user/user.types';

export const findAll = () => findUserAll();
export const findById = (id: number) => findUser(id);
export const update = (id: number, data: UserUpdateDto) => updateUser(id, data);
export const deleteById = (id: number) => deleteUser(id);
