import { OrderStatus } from "@prisma/client";
import { z } from "zod";

// 주문 생성 스키마
export const createOrderSchema = z.object({
	addressId: z.string(),
	items: z.array(
		z.object({
			productId: z.string(),
			quantity: z.number().int().positive(),
			// selectedOptions는 variant type을 키로, variant value를 값으로 하는 레코드
			// 예: { "color": "빨강", "size": "L" } (frontend에서 lowercase로 전송됨)
			// 런타임에서 ProductVariant 테이블과 대조하여 검증됨
			selectedOptions: z.record(z.string(), z.string()).optional(),
		}),
	),
	notes: z.string().optional(),
});

// 주문 상태 업데이트 스키마
export const updateOrderStatusSchema = z.object({
	orderId: z.string(),
	status: z.nativeEnum(OrderStatus),
	notes: z.string().optional(),
	trackingNumber: z.string().optional(),
});

// 주문 조회 스키마
export const getOrderSchema = z.object({
	orderId: z.string(),
});

// 주문 목록 조회 스키마
export const getOrdersSchema = z.object({
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
	status: z
		.enum([
			"PENDING",
			"CONFIRMED",
			"PROCESSING",
			"SHIPPED",
			"DELIVERED",
			"CANCELLED",
			"REFUNDED",
		])
		.optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type GetOrderInput = z.infer<typeof getOrderSchema>;
export type GetOrdersInput = z.infer<typeof getOrdersSchema>;
