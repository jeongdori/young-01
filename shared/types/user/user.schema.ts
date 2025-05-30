import { z, requiredString } from "@shared/types/zod";

export const loginSchema = z.object({
  email: requiredString("이메일").email("이메일 형식이 아닙니다"),
  password: requiredString("비밀번호"),
});

export const registerSchema = z.object({
  email: requiredString("이메일").email("이메일 형식이 아닙니다"),
  password: requiredString("비밀번호")
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다")
    .max(20, "비밀번호는 최대 20자리까지 가능합니다")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다"
    ),
  name: requiredString("이름").min(2, "이름은 최소 2자리 이상이어야 합니다"),
  // address: z.object({
  //   zip: z.string()
  //     .regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다'),
  //   city: z.string({ required_error: '도시는 필수 입력입니다' }),
  //   street: z.string({ required_error: '도로명은 필수 입력입니다' }),
  // }).required({ message: '주소 정보는 필수입니다' }),
});

export const updateSchema = z.object({
  email: requiredString("이메일").email("이메일 형식이 아닙니다"),
  name: requiredString("이름").min(2, "이름은 최소 2자리 이상이어야 합니다"),
  // address: z.object({
  //   zip: z.string()
  //     .regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다'),
  //   city: z.string({ required_error: '도시는 필수 입력입니다' }),
  //   street: z.string({ required_error: '도로명은 필수 입력입니다' }),
  // }),
});
