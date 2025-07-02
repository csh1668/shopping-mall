import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure

// 인증이 필요한 프로시저를 위한 미들웨어
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: '로그인이 필요합니다.',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // 타입 안전성을 위해 명시적으로 전달
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

// 입력 검증을 위한 공통 스키마들
export const schemas = {
  // ID 검증
  id: z.object({
    id: z.string().min(1, 'ID는 필수입니다.'),
  }),

  // UUID 검증
  uuid: z.object({
    id: z.string().uuid('올바른 UUID 형식이 아닙니다.'),
  }),

  // 페이지네이션
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }),

  // 문자열 검색
  search: z.object({
    search: z.string().optional(),
  }),
} 