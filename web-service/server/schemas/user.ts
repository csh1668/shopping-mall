import { z } from 'zod'

// 사용자 메타데이터 업데이트 스키마
export const updateUserMetadataSchema = z.object({
  fullName: z.string()
    .min(1, '이름은 필수입니다.')
    .max(50, '이름은 50자 이하여야 합니다.')
    .trim()
    .optional(),
  phone: z.string()
    .regex(/^[0-9-]+$/, '올바른 전화번호 형식을 입력해주세요.')
    .min(10, '전화번호는 최소 10자 이상이어야 합니다.')
    .max(15, '전화번호는 최대 15자까지 입력 가능합니다.')
    .trim()
    .optional(),
})
  .refine((data) => {
    // 최소 하나의 필드는 업데이트되어야 함
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: '업데이트할 정보를 입력해주세요.',
    path: ['fullName'], // 에러를 표시할 필드
  })

// 스키마 타입 추출
export type UpdateUserMetadataSchema = z.infer<typeof updateUserMetadataSchema>

// 사용자 메타데이터 응답 스키마
export const userMetadataResponseSchema = z.object({
  id: z.string(),
  fullName: z.string().nullable(),
  phone: z.string().nullable(),
  role: z.array(z.enum(['CUSTOMER', 'ADMIN', 'SELLER'])),
})

// 업데이트 성공 응답 스키마
export const updateUserMetadataResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: userMetadataResponseSchema,
}) 