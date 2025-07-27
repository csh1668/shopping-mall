import { z } from "zod";

// 주문 생성 스키마
export const createOrderSchema = z.object({
	addressId: z.string(),
	items: z.array(
		z.object({
			productId: z.string(),
			quantity: z.number().int().positive(),
			selectedOptions: z.record(z.string()).optional(),
		}),
	),
	notes: z.string().optional(),
});

// 주문 상태 업데이트 스키마
export const updateOrderStatusSchema = z.object({
	orderId: z.string(),
	status: z.enum([
		"PENDING",
		"CONFIRMED",
		"PROCESSING",
		"SHIPPED",
		"DELIVERED",
		"CANCELLED",
		"REFUNDED",
	]),
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
