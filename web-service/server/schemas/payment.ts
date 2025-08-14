import { z } from "zod";

// 결제 요청 스키마
export const createPaymentSchema = z.object({
	orderId: z.string(),
	customerKey: z.string().optional(), // 사용자 ID, 없으면 ANONYMOUS 사용
});

// 결제 승인 스키마
export const confirmPaymentSchema = z.object({
	paymentKey: z.string(),
	orderId: z.string(),
	amount: z.number().int().positive(),
});

// 결제 취소/환불 스키마
export const cancelPaymentSchema = z.object({
	paymentKey: z.string(),
	cancelReason: z.string(),
	cancelAmount: z.number().int().positive().optional(), // 부분 취소시 사용
});

// 결제 상태 조회 스키마
export const getPaymentSchema = z
	.object({
		paymentKey: z.string().optional(),
		orderId: z.string().optional(),
	})
	.refine((data) => data.paymentKey || data.orderId, {
		message: "paymentKey 또는 orderId 중 하나는 필수입니다",
	});

// 토스페이먼츠 웹훅 데이터 스키마
export const tossPaymentsWebhookSchema = z.object({
	eventType: z.enum(["PAYMENT_CONFIRMED", "PAYMENT_CANCELLED"]),
	createdAt: z.string(),
	secret: z.string().optional(), // 웹훅 시크릿 (설정한 경우)
	data: z.object({
		paymentKey: z.string(),
		orderId: z.string(),
		status: z.enum(["DONE", "CANCELED", "PARTIAL_CANCELED"]),
		totalAmount: z.number(),
		method: z.string().optional(),
		approvedAt: z.string().optional(),
		requestedAt: z.string().optional(),
	}),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;
export type GetPaymentInput = z.infer<typeof getPaymentSchema>;
export type TossPaymentsWebhookInput = z.infer<
	typeof tossPaymentsWebhookSchema
>;
