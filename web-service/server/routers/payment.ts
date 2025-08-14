import type { Prisma } from "@prisma/client";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { cancelTossPayment, confirmTossPayment } from "@/lib/toss-payments";
import { serverEnv } from "@/server-env";
import { createLogger } from "../../lib/logger";
import { protectedProcedure, router } from "../index";
import {
	cancelPaymentSchema,
	confirmPaymentSchema,
	createPaymentSchema,
	getPaymentSchema,
} from "../schemas/payment";

const logger = createLogger("PaymentRouter");

// (old retry helpers removed; retries are handled upstream if needed)

export const paymentRouter = router({
	// 결제 요청 생성 (인증 필요)
	create: protectedProcedure
		.input(createPaymentSchema)
		.mutation(async ({ input, ctx }) => {
			const { orderId } = input;

			try {
				// 주문 정보 조회 및 소유자 검증
				const order = await prisma.order.findUnique({
					where: { id: orderId },
					include: {
						user: true,
						items: {
							include: {
								product: true,
							},
						},
					},
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "주문을 찾을 수 없습니다",
					});
				}

				if (order.userId !== ctx.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "해당 주문에 대한 결제 권한이 없습니다",
					});
				}

				// 이미 결제가 생성된 경우 확인
				const existingPayment = await prisma.payment.findUnique({
					where: { orderId },
				});

				if (existingPayment && existingPayment.status === PaymentStatus.PAID) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "이미 결제가 완료된 주문입니다",
					});
				}

				// 이미 결제가 있는 경우 해당 결제 정보 반환
				if (
					existingPayment &&
					existingPayment.status === PaymentStatus.PENDING
				) {
					return {
						paymentId: existingPayment.id,
						orderId,
						orderName: existingPayment.orderName,
						amount: existingPayment.amount,
						customerKey: existingPayment.customerKey,
						successUrl: `${serverEnv.NEXT_PUBLIC_SITE_URL}/payment/success`,
						failUrl: `${serverEnv.NEXT_PUBLIC_SITE_URL}/payment/fail`,
					};
				}

				// customerKey는 서버에서 신뢰 가능한 값으로 설정 (현재 사용자 ID 고정)
				const customerKey = ctx.user.id;

				// 주문명 생성
				const orderName =
					order.items.length === 1
						? order.items[0].name
						: `${order.items[0].name} 외 ${order.items.length - 1}건`;

				// 결제 정보 생성 또는 업데이트
				const payment = await prisma.payment.upsert({
					where: { orderId },
					create: {
						orderId,
						orderName,
						amount: order.totalAmount + order.shippingFee,
						customerKey,
						status: PaymentStatus.PENDING,
						requestedAt: new Date(),
					},
					update: {
						orderName,
						amount: order.totalAmount + order.shippingFee,
						customerKey,
						status: PaymentStatus.PENDING,
						requestedAt: new Date(),
						paymentKey: null, // 새로운 결제 요청시 기존 키 초기화
					},
				});

				logger.info("Payment created", {
					paymentId: payment.id,
					orderId,
					amount: payment.amount,
				});

				return {
					paymentId: payment.id,
					orderId,
					orderName: payment.orderName,
					amount: payment.amount,
					customerKey: payment.customerKey,
					successUrl: `${serverEnv.NEXT_PUBLIC_SITE_URL}/payment/success`,
					failUrl: `${serverEnv.NEXT_PUBLIC_SITE_URL}/payment/fail`,
				};
			} catch (error) {
				logger.error("Failed to create payment", { orderId, error });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "결제 요청 생성에 실패했습니다",
				});
			}
		}),

	// 결제 승인 (인증 필요)
	confirm: protectedProcedure
		.input(confirmPaymentSchema)
		.mutation(async ({ input, ctx }) => {
			const { paymentKey, orderId, amount } = input;

			try {
				// 주문 소유자 검증
				const orderOwner = await prisma.order.findUnique({
					where: { id: orderId },
					select: { userId: true },
				});

				if (!orderOwner) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "주문을 찾을 수 없습니다",
					});
				}

				if (orderOwner.userId !== ctx.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "해당 주문에 대한 결제 권한이 없습니다",
					});
				}

				// 기존 결제 정보 조회
				const payment = await prisma.payment.findUnique({
					where: { orderId },
				});

				if (!payment) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "결제 정보를 찾을 수 없습니다",
					});
				}

				// 이미 결제가 완료된 경우, 외부 승인 요청을 생략하고 빠르게 반환 (멱등성 강화)
				if (payment.status === PaymentStatus.PAID) {
					logger.info("Payment already confirmed, skipping confirm call", {
						orderId,
						paymentKey,
					});
					return {
						success: true,
						payment,
						tossResponse: null,
					};
				}

				// 금액 검증
				if (payment.amount !== amount) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "결제 금액이 일치하지 않습니다",
					});
				}

				// 토스페이먼츠 결제 승인 요청
				const tossResponse = await confirmTossPayment({
					paymentKey,
					orderId,
					amount,
				});

				// PaymentMethod 매핑
				let paymentMethod: PaymentMethod | null = null;
				if (tossResponse.method) {
					const methodMap: Record<string, PaymentMethod> = {
						카드: PaymentMethod.CARD,
						계좌이체: PaymentMethod.TRANSFER,
						가상계좌: PaymentMethod.VIRTUAL_ACCOUNT,
						휴대폰: PaymentMethod.MOBILE,
						카카오페이: PaymentMethod.KAKAOPAY,
						네이버페이: PaymentMethod.NAVERPAY,
						토스페이: PaymentMethod.TOSSPAY,
					};
					paymentMethod = methodMap[tossResponse.method] || PaymentMethod.CARD;
				}

				// 결제 정보 업데이트, 주문 상태 업데이트, 주문 상태 이력 추가를 트랜잭션으로 처리
				const [updatedPayment] = await prisma.$transaction([
					prisma.payment.update({
						where: { orderId },
						data: {
							paymentKey,
							transactionId: tossResponse.transactionKey,
							status: PaymentStatus.PAID,
							method: paymentMethod,
							approvedAt: new Date(tossResponse.approvedAt),
							rawData: tossResponse as unknown as Prisma.InputJsonValue,
						},
					}),
					prisma.order.update({
						where: { id: orderId },
						data: { status: "CONFIRMED" },
					}),
					prisma.orderStatusHistory.create({
						data: {
							orderId,
							status: "CONFIRMED",
							notes: "결제 완료",
						},
					}),
				]);

				logger.info("Payment confirmed", {
					paymentId: updatedPayment.id,
					paymentKey,
					orderId,
					amount,
				});

				return { success: true, payment: updatedPayment };
			} catch (error) {
				logger.error("Failed to confirm payment", {
					paymentKey,
					orderId,
					error,
				});

				// 결제 실패 상태 업데이트: 일시 오류 고려하여 FAILED로 마킹하지 않음
				try {
					await prisma.payment.update({
						where: { orderId },
						data: {
							failReason:
								error instanceof Error ? error.message : "결제 승인 실패",
						},
					});
				} catch {}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "결제 승인에 실패했습니다",
				});
			}
		}),

	// 결제 취소/환불 (인증 필요)
	cancel: protectedProcedure
		.input(cancelPaymentSchema)
		.mutation(async ({ input, ctx }) => {
			const { paymentKey, cancelReason, cancelAmount } = input;

			try {
				// 기존 결제 정보 조회 및 소유자 검증
				const payment = await prisma.payment.findUnique({
					where: { paymentKey },
					include: { order: true },
				});

				if (!payment) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "결제 정보를 찾을 수 없습니다",
					});
				}

				if (payment.status !== PaymentStatus.PAID) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "결제 완료 상태가 아닙니다",
					});
				}

				if (payment.order.userId !== ctx.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "해당 결제에 대한 취소 권한이 없습니다",
					});
				}

				// 토스페이먼츠 결제 취소 요청
				const cancelData: { cancelReason: string; cancelAmount?: number } = {
					cancelReason,
				};
				if (cancelAmount) {
					cancelData.cancelAmount = cancelAmount;
				}

				const { raw: cancelRaw } = await cancelTossPayment({
					paymentKey,
					cancelReason,
					cancelAmount,
				});

				// 트랜잭션 사용
				const updatedPayment = await prisma.$transaction(async (tx) => {
					// 결제 상태 업데이트
					const newStatus = cancelAmount
						? PaymentStatus.PARTIALLY_REFUNDED
						: PaymentStatus.REFUNDED;

					const updatedPayment = await tx.payment.update({
						where: { paymentKey },
						data: {
							status: newStatus,
							cancelReason,
							refundAmount:
								(payment.refundAmount || 0) + (cancelAmount || payment.amount),
							rawData: cancelRaw as unknown as Prisma.InputJsonValue,
						},
					});

					// 주문 상태 업데이트
					if (!cancelAmount) {
						await tx.order.update({
							where: { id: payment.orderId },
							data: { status: "REFUNDED" },
						});
					}

					await tx.orderStatusHistory.create({
						data: {
							orderId: payment.orderId,
							status: "REFUNDED",
							notes: cancelReason,
						},
					});

					return updatedPayment;
				});

				logger.info("Payment cancelled", {
					paymentId: updatedPayment.id,
					paymentKey,
					cancelReason,
					cancelAmount,
				});

				return { success: true, payment: updatedPayment };
			} catch (error) {
				logger.error("Failed to cancel payment", {
					paymentKey,
					cancelReason,
					error,
				});

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "결제 취소에 실패했습니다",
				});
			}
		}),

	// 결제 정보 조회 (인증 필요)
	get: protectedProcedure
		.input(getPaymentSchema)
		.query(async ({ input, ctx }) => {
			const { paymentKey, orderId } = input;

			try {
				const payment = paymentKey
					? await prisma.payment.findUnique({
							where: { paymentKey },
							include: {
								order: {
									include: {
										user: { select: { id: true, email: true, fullName: true } },
										items: { include: { product: true } },
										address: true,
									},
								},
							},
						})
					: await prisma.payment.findUnique({
							where: { orderId: orderId as string },
							include: {
								order: {
									include: {
										user: { select: { id: true, email: true, fullName: true } },
										items: { include: { product: true } },
										address: true,
									},
								},
							},
						});

				if (!payment) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "결제 정보를 찾을 수 없습니다",
					});
				}

				// 소유자 검증
				if (payment.order.userId !== ctx.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "해당 결제에 접근할 수 없습니다",
					});
				}

				return payment;
			} catch (error) {
				logger.error("Failed to get payment", { paymentKey, orderId, error });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "결제 정보 조회에 실패했습니다",
				});
			}
		}),

	// 내 결제 목록 조회 (인증 필요)
	getMyPayments: protectedProcedure.query(async ({ ctx }) => {
		try {
			const payments = await prisma.payment.findMany({
				where: {
					order: {
						userId: ctx.user.id,
					},
				},
				include: {
					order: {
						include: {
							items: {
								include: {
									product: true,
								},
							},
							address: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return payments;
		} catch (error) {
			logger.error("Failed to get user payments", {
				userId: ctx.user.id,
				error,
			});
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "결제 목록 조회에 실패했습니다",
			});
		}
	}),
});
