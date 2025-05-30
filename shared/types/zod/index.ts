import {
  z,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodArray,
  ZodObject,
  ZodTypeAny,
  ZodRawShape,
} from "zod";

/**
 * 필수 문자열 필드
 */
export const requiredString = (fieldName: string): ZodString =>
  z
    .string({
      required_error: `${fieldName}은(는) 필수 입력입니다`,
      invalid_type_error: `${fieldName}은(는) 문자열이어야 합니다`,
    })
    .min(1, `${fieldName}은(는) 빈 값일 수 없습니다`);

/**
 * 필수 숫자 필드
 */
export const requiredNumber = (fieldName: string): ZodNumber =>
  z.number({
    required_error: `${fieldName}은(는) 필수 입력입니다`,
    invalid_type_error: `${fieldName}은(는) 숫자여야 합니다`,
  });

/**
 * 필수 불리언 필드
 */
export const requiredBoolean = (fieldName: string): ZodBoolean =>
  z.boolean({
    required_error: `${fieldName}은(는) 필수 입력입니다`,
    invalid_type_error: `${fieldName}은(는) true/false 여야 합니다`,
  });

/**
 * 필수 배열 필드
 */
export const requiredArray = <T extends z.ZodTypeAny>(
  fieldName: string,
  schema: T
): ZodArray<T> =>
  z
    .array(schema, {
      required_error: `${fieldName}은(는) 필수 입력입니다`,
      invalid_type_error: `${fieldName}은(는) 배열이어야 합니다`,
    })
    .min(1, `${fieldName}은(는) 최소 1개 이상이어야 합니다`);

/**
 * 필수 객체 필드
 */
export const requiredObject = <T extends z.ZodRawShape>(
  fieldName: string,
  shape: T
): ZodObject<T> =>
  z.object(shape, {
    required_error: `${fieldName}은(는) 필수 입력입니다`,
    invalid_type_error: `${fieldName}은(는) 객체여야 합니다`,
  });

export { z };
