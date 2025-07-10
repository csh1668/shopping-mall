import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminProcedure, publicProcedure, router } from "@/server";

// 카테고리 생성/수정 스키마
const categorySchema = z.object({
	name: z.string().min(1, "카테고리명은 필수입니다.").max(50),
	slug: z.string().min(1).max(50).optional(),
	description: z.string().max(500).optional(),
	image: z.string().url().optional().nullable(),
	parentId: z.string().optional().nullable(),
	isActive: z.boolean().default(true),
	sortOrder: z.number().int().min(0).default(0),
});

export const categoryRouter = router({
	// 카테고리 조회
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const category = await prisma.category.findUnique({
				where: { slug: input.slug },
				include: {
					parent: true,
					children: {
						where: { isActive: true },
					},
					_count: {
						select: {
							products: true,
						},
					},
				},
			});

			if (!category) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "카테고리를 찾을 수 없습니다.",
				});
			}

			return {
				...category,
				productCount: category._count.products,
			};
		}),

	// 카테고리 목록 조회 (공개)
	list: publicProcedure
		.input(
			z.object({
				parentId: z.string().optional().nullable(),
				isActive: z.boolean().optional(),
			}).optional(),
		)
		.query(async ({ input }) => {
			const where = {
				...(input?.parentId !== undefined && { parentId: input.parentId }),
				...(input?.isActive !== undefined && { isActive: input.isActive }),
			};

			const categories = await prisma.category.findMany({
				where,
				include: {
					parent: true,
					children: {
						where: input?.isActive !== undefined ? { isActive: input.isActive } : undefined,
					},
					_count: {
						select: {
							products: true,
						},
					},
				},
				orderBy: [
					{ sortOrder: "asc" },
					{ name: "asc" },
				],
			});

			return categories.map((category) => ({
				...category,
				productCount: category._count.products,
			}));
		}),

	// 카테고리 트리 조회 (공개)
	tree: publicProcedure.query(async () => {
		// 최상위 카테고리부터 조회
		const rootCategories = await prisma.category.findMany({
			where: {
				parentId: null,
				isActive: true,
			},
			include: {
				children: {
					where: { isActive: true },
					include: {
						children: {
							where: { isActive: true },
						},
					},
				},
			},
			orderBy: [
				{ sortOrder: "asc" },
				{ name: "asc" },
			],
		});

		return rootCategories;
	}),

	// 카테고리 생성 (관리자 전용)
	create: adminProcedure
		.input(categorySchema)
		.mutation(async ({ input }) => {
			// slug 자동 생성
			const slug = input.slug || encodeURIComponent(
				input.name
					.replace(/\s+/g, "-") // 띄어쓰기를 하이픈으로 변경
					.replace(/(^-|-$)/g, "") // 시작과 끝의 하이픈 제거
			);

			// 중복 체크
			const existing = await prisma.category.findUnique({
				where: { slug },
			});

			if (existing) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "이미 존재하는 카테고리 URL입니다.",
				});
			}

			// 부모 카테고리 확인
			if (input.parentId) {
				const parent = await prisma.category.findUnique({
					where: { id: input.parentId },
				});

				if (!parent) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "상위 카테고리를 찾을 수 없습니다.",
					});
				}
			}

			const category = await prisma.category.create({
				data: {
					...input,
					slug,
				},
			});

			return category;
		}),

	// 카테고리 수정 (관리자 전용)
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				data: categorySchema.partial(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, data } = input;

			// 존재 여부 확인
			const existing = await prisma.category.findUnique({
				where: { id },
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "카테고리를 찾을 수 없습니다.",
				});
			}

			// slug 변경 시 중복 체크
			if (data.slug && data.slug !== existing.slug) {
				const duplicate = await prisma.category.findUnique({
					where: { slug: data.slug },
				});

				if (duplicate) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "이미 존재하는 카테고리 URL입니다.",
					});
				}
			}

			// 자기 자신을 부모로 설정하는지 체크
			if (data.parentId === id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "카테고리는 자기 자신을 상위 카테고리로 설정할 수 없습니다.",
				});
			}

			const category = await prisma.category.update({
				where: { id },
				data,
			});

			return category;
		}),

	// 카테고리 삭제 (관리자 전용)
	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			// 하위 카테고리 확인
			const childCount = await prisma.category.count({
				where: { parentId: input.id },
			});

			if (childCount > 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "하위 카테고리가 있는 카테고리는 삭제할 수 없습니다.",
				});
			}

			// 연결된 상품 확인
			const productCount = await prisma.product.count({
				where: { categoryId: input.id },
			});

			if (productCount > 0) {
				// 상품이 있는 경우 비활성화만 진행
				const category = await prisma.category.update({
					where: { id: input.id },
					data: { isActive: false },
				});

				return {
					...category,
					message: "상품이 등록된 카테고리는 비활성화 처리되었습니다.",
				};
			}

			// 완전 삭제
			await prisma.category.delete({
				where: { id: input.id },
			});

			return { success: true, message: "카테고리가 삭제되었습니다." };
		}),
}); 