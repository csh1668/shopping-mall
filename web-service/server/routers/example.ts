import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "@/server";
import { commonSchemas } from "@/server/schemas";

export const exampleRouter = router({
	// 누구나 접근 가능한 공개 API
	public: publicProcedure
		.input(
			z.object({
				message: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			return {
				message:
					input.message || "안녕하세요! 누구나 접근할 수 있는 API입니다.",
				timestamp: new Date().toISOString(),
			};
		}),

	// 인증된 사용자만 접근 가능한 보호된 API
	protected: protectedProcedure
		.input(
			z.object({
				userId: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			// ctx.user는 인증된 사용자 정보를 포함합니다
			return {
				message: "인증된 사용자만 접근할 수 있는 API입니다.",
				user: {
					id: ctx.user.id,
					email: ctx.user.email,
				},
				requestedUserId: input.userId,
				timestamp: new Date().toISOString(),
			};
		}),

	// 인증된 사용자만 접근 가능한 뮤테이션
	updateProfile: protectedProcedure
		.input(
			z.object({
				fullName: z.string().min(1, "이름을 입력해주세요.").optional(),
				phone: z
					.string()
					.regex(/^[0-9-]+$/, "올바른 전화번호 형식을 입력해주세요.")
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// 여기서 실제 데이터베이스 업데이트 로직을 구현할 수 있습니다
			return {
				message: "프로필이 업데이트되었습니다.",
				userId: ctx.user.id,
				updatedFields: input,
				timestamp: new Date().toISOString(),
			};
		}),

	// 페이지네이션 예시
	paginated: publicProcedure
		.input(
			commonSchemas.pagination.extend({
				category: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const { page, limit, category } = input;

			// 여기서 실제 데이터베이스 쿼리를 구현할 수 있습니다
			return {
				items: [
					{ id: 1, name: "상품 1", category: "전자제품" },
					{ id: 2, name: "상품 2", category: "의류" },
				],
				pagination: {
					page,
					limit,
					total: 100,
					totalPages: Math.ceil(100 / limit),
					hasNext: page * limit < 100,
					hasPrev: page > 1,
				},
				category,
			};
		}),

	// UUID 검증 예시
	getById: publicProcedure
		.input(commonSchemas.uuid)
		.query(async ({ input }) => {
			return {
				id: input.id,
				name: "상품명",
				description: "상품 설명",
				timestamp: new Date().toISOString(),
			};
		}),
});
