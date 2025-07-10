import { z } from "zod";

// 상품 생성 스키마
export const createProductSchema = z.object({
	name: z
		.string()
		.min(1, "상품명은 필수입니다.")
		.max(200, "상품명은 200자 이하여야 합니다."),
	slug: z.string().min(1).max(200).optional(), // 자동 생성 가능
	description: z.string().min(1, "상품 설명은 필수입니다."),
	shortDescription: z.string().max(500).optional(),
	price: z.number().int().positive("가격은 양수여야 합니다."),
	originalPrice: z.number().int().positive().optional(),
	categoryId: z.string().min(1, "카테고리는 필수입니다."),
	brand: z.string().min(1, "브랜드는 필수입니다.").max(100),
	sku: z.string().optional(),
	previewImage: z.string().url("올바른 이미지 URL을 입력해주세요."),
	images: z.array(z.string().url()).default([]),
	stock: z.number().int().min(0).default(0),
	minStock: z.number().int().min(0).default(0),
	weight: z.number().positive().optional(),
	dimensions: z.string().optional(),
	isActive: z.boolean().default(true),
	tags: z.array(z.string()).default([]),
	metaTitle: z.string().max(60).optional(),
	metaDescription: z.string().max(160).optional(),
});

// 상품 수정 스키마 (모든 필드 선택적)
export const updateProductSchema = createProductSchema.partial();

// 상품 목록 조회 스키마
export const listProductsSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20),
	search: z.string().optional(),
	categoryId: z.string().optional(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	brand: z.string().optional(),
	isActive: z.boolean().optional(),
	sortBy: z.enum(["createdAt", "price", "name", "stock"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// 상품 ID 스키마
export const productIdSchema = z.object({
	id: z.string().min(1, "상품 ID는 필수입니다."),
});

// 상품 옵션 생성 스키마
export const createProductVariantSchema = z.object({
	productId: z.string().min(1),
	type: z.enum(["COLOR", "SIZE", "MATERIAL", "OTHER"]),
	value: z.string().min(1),
	price: z.number().int().positive().optional(),
	stock: z.number().int().min(0).default(0),
	sku: z.string().optional(),
	image: z.string().url().optional(),
	isActive: z.boolean().default(true),
});

// 타입 추출
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;
export type CreateProductVariantInput = z.infer<
	typeof createProductVariantSchema
>;
