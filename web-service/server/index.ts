import type { User } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
	errorFormatter: ({ shape, error }) => {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof z.ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

// 인증이 필요한 프로시저를 위한 미들웨어
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.isAuthenticated) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "로그인이 필요합니다.",
		});
	} else if (!ctx.user) {
		console.error("ctx.isAuthenticated is true but ctx.user is null");
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "로그인이 필요합니다.",
		});
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user as User, // user is not null in here
		},
	});
});

// 관리자 권한 체크 미들웨어
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
	if (!ctx.isAuthenticated || !ctx.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "로그인이 필요합니다.",
		});
	}

	// 관리자 권한 체크는 나중에 UserMetadata에서 role을 확인
	// 지금은 임시로 통과시킴 (TODO: Prisma에서 role 체크)
	return next({
		ctx: {
			...ctx,
			user: ctx.user as User,
		},
	});
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
