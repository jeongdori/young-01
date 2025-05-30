// DOMAIN MODEL
export type User = {
  id: number;
  email: string | null;
  name: string | null;
};

export type Group = {
  id: number;
  name: string;
};

export type UserGroupMap = {
  user_id: number;
  group_id: number;
};

// DTO
export type UserRegisterDto = {
  id?: number;
  email: string;
  password: string;
  name: string;
};

export type UserLoginInputDto = {
  email: string;
  password: string;
};

export type UserLoginDto = User & {
  password: string;
  groups: string[];
};

export type UserResponseDto = User & {
  groups: string[];
};

export type UserExistsDto = {
  id: number;
};

export type UserUpdateDto = {
  name?: string;
  email?: string;
};
