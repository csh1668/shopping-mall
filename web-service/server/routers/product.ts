import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminProcedure, publicProcedure, router } from "@/server";
import {
	createProductSchema,
	createProductVariantSchema,
	listProductsSchema,
	productIdSchema,
	updateProductSchema,
} from "@/server/schemas/product";

export const productRouter = router({
	// 상품 목록 조회 (공개)
	list: publicProcedure.input(listProductsSchema).query(async ({ input }) => {
		const {
			page,
			limit,
			search,
			categoryId,
			minPrice,
			maxPrice,
			brand,
			isActive,
			sortBy,
			sortOrder,
		} = input;

		// 필터 조건 구성
		const where = {
			...(search && {
				OR: [
					{ name: { contains: search, mode: "insensitive" as const } },
					{ description: { contains: search, mode: "insensitive" as const } },
					{ brand: { contains: search, mode: "insensitive" as const } },
				],
			}),
			...(categoryId && { categoryId }),
			...(minPrice !== undefined && { price: { gte: minPrice } }),
			...(maxPrice !== undefined && { price: { lte: maxPrice } }),
			...(brand && {
				brand: { contains: brand, mode: "insensitive" as const },
			}),
			...(isActive !== undefined && { isActive }),
		};

		// 전체 개수 조회
		const total = await prisma.product.count({ where });

		// 상품 목록 조회
		const products = await prisma.product.findMany({
			where,
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
				_count: {
					select: {
						reviews: true,
						orderItems: true,
					},
				},
			},
			orderBy: {
				[sortBy]: sortOrder,
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		// 리뷰 평균 평점 계산 (Grouped Aggregate Query)
		const ratings = await prisma.review.groupBy({
			by: ["productId"],
			_avg: { rating: true },
			where: {
				productId: {
					in: products.map((p) => p.id),
				},
			},
		});

		const ratingsMap = ratings.reduce(
			(acc, curr) => {
				acc[curr.productId] = curr._avg.rating || 0;
				return acc;
			},
			{} as Record<string, number>,
		);

		const productsWithRating = products.map((product) => ({
			...product,
			rating: ratingsMap[product.id] || 0,
			reviewCount: product._count.reviews,
			orderCount: product._count.orderItems,
		}));

		return {
			products: productsWithRating,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	}),

	// 상품 상세 조회 (공개)
	getById: publicProcedure.input(productIdSchema).query(async ({ input }) => {
		const product = await prisma.product.findUnique({
			where: { id: input.id },
			include: {
				category: true,
				productVariants: {
					where: { isActive: true },
				},
				reviews: {
					take: 5,
					orderBy: { createdAt: "desc" },
					include: {
						user: {
							select: {
								fullName: true,
								email: true,
							},
						},
					},
				},
			},
		});

		if (!product) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "상품을 찾을 수 없습니다.",
			});
		}

		// 평균 평점 계산
		const avgRating = await prisma.review.aggregate({
			where: { productId: product.id },
			_avg: { rating: true },
			_count: { _all: true },
		});

		return {
			...product,
			rating: avgRating._avg.rating || 0,
			reviewCount: avgRating._count._all,
		};
	}),

	// 상품 상세 조회 by slug (공개)
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const product = await prisma.product.findUnique({
				where: { slug: input.slug },
				include: {
					category: true,
					productVariants: {
						where: { isActive: true },
					},
					reviews: {
						take: 5,
						orderBy: { createdAt: "desc" },
						include: {
							user: {
								select: {
									fullName: true,
									email: true,
								},
							},
						},
					},
				},
			});

			if (!product) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "상품을 찾을 수 없습니다.",
				});
			}

			// 평균 평점 계산
			const avgRating = await prisma.review.aggregate({
				where: { productId: product.id },
				_avg: { rating: true },
				_count: { _all: true },
			});

			return {
				...product,
				rating: avgRating._avg.rating || 0,
				reviewCount: avgRating._count._all,
			};
		}),

	// 브랜드 목록 조회 (공개)
	getBrands: publicProcedure
		.input(
			z.object({
				categoryId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const where = {
				isActive: true,
				...(input.categoryId && { categoryId: input.categoryId }),
			};

			const brands = await prisma.product.findMany({
				where,
				select: { brand: true },
				distinct: ["brand"],
				orderBy: { brand: "asc" },
			});

			return brands.map((item) => item.brand).filter(Boolean);
		}),

	// 상품 생성 (관리자 전용)
	create: adminProcedure
		.input(createProductSchema)
		.mutation(async ({ input }) => {
			try {
				// slug 자동 생성 (제공되지 않은 경우)
				const slug =
					input.slug ||
					encodeURIComponent(
						input.name
							.replace(/\s+/g, "-") // 띄어쓰기를 하이픈으로 변경
							.replace(/(^-|-$)/g, ""), // 시작과 끝의 하이픈 제거
					);

				// 중복 slug 체크
				const existingProduct = await prisma.product.findUnique({
					where: { slug },
				});

				if (existingProduct) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "이미 존재하는 상품 URL입니다.",
					});
				}

				// SKU 중복 체크 (제공된 경우)
				if (input.sku) {
					const existingSku = await prisma.product.findUnique({
						where: { sku: input.sku },
					});

					if (existingSku) {
						throw new TRPCError({
							code: "CONFLICT",
							message: "이미 존재하는 상품 코드(SKU)입니다.",
						});
					}
				}

				const product = await prisma.product.create({
					data: {
						...input,
						slug,
					},
					include: {
						category: true,
					},
				});

				return product;
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "상품 생성 중 오류가 발생했습니다.",
				});
			}
		}),

	// 상품 수정 (관리자 전용)
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				data: updateProductSchema,
			}),
		)
		.mutation(async ({ input }) => {
			const { id, data } = input;

			// 상품 존재 여부 확인
			const existingProduct = await prisma.product.findUnique({
				where: { id },
			});

			if (!existingProduct) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "상품을 찾을 수 없습니다.",
				});
			}

			// slug 변경 시 중복 체크
			if (data.slug && data.slug !== existingProduct.slug) {
				const duplicateSlug = await prisma.product.findUnique({
					where: { slug: data.slug },
				});

				if (duplicateSlug) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "이미 존재하는 상품 URL입니다.",
					});
				}
			}

			// SKU 변경 시 중복 체크
			if (data.sku && data.sku !== existingProduct.sku) {
				const duplicateSku = await prisma.product.findUnique({
					where: { sku: data.sku },
				});

				if (duplicateSku) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "이미 존재하는 상품 코드(SKU)입니다.",
					});
				}
			}

			const updatedProduct = await prisma.product.update({
				where: { id },
				data,
				include: {
					category: true,
				},
			});

			return updatedProduct;
		}),

	// 상품 삭제 (관리자 전용)
	delete: adminProcedure.input(productIdSchema).mutation(async ({ input }) => {
		// 주문된 상품인지 확인
		const orderCount = await prisma.orderItem.count({
			where: { productId: input.id },
		});

		if (orderCount > 0) {
			// 주문 이력이 있는 상품은 비활성화만 진행
			const product = await prisma.product.update({
				where: { id: input.id },
				data: { isActive: false },
			});

			return {
				...product,
				message: "주문 이력이 있는 상품은 비활성화 처리되었습니다.",
			};
		}

		// 주문 이력이 없는 경우 완전 삭제
		await prisma.product.delete({
			where: { id: input.id },
		});

		return { success: true, message: "상품이 삭제되었습니다." };
	}),

	// 상품 옵션 추가 (관리자 전용)
	addVariant: adminProcedure
		.input(createProductVariantSchema)
		.mutation(async ({ input }) => {
			// 상품 존재 여부 확인
			const product = await prisma.product.findUnique({
				where: { id: input.productId },
			});

			if (!product) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "상품을 찾을 수 없습니다.",
				});
			}

			// 중복 옵션 체크
			const existingVariant = await prisma.productVariant.findFirst({
				where: {
					productId: input.productId,
					type: input.type,
					value: input.value,
				},
			});

			if (existingVariant) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "이미 존재하는 상품 옵션입니다.",
				});
			}

			const variant = await prisma.productVariant.create({
				data: {
					...input,
					type: input.type,
				},
			});

			return variant;
		}),

	// 재고 업데이트 (관리자 전용)
	updateStock: adminProcedure
		.input(
			z.object({
				id: z.string(),
				stock: z.number().int().min(0),
			}),
		)
		.mutation(async ({ input }) => {
			const product = await prisma.product.update({
				where: { id: input.id },
				data: { stock: input.stock },
			});

			// 재고 부족 알림 체크
			if (product.stock <= product.minStock) {
				// TODO: 재고 부족 알림 발송
				console.log(
					`재고 부족 알림: ${product.name} (현재 재고: ${product.stock})`,
				);
			}

			return product;
		}),
});
