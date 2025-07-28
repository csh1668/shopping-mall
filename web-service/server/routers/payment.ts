import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/server-env";
import { createLogger } from "../../lib/logger";
import { protectedProcedure, publicProcedure, router } from "../index";
import {
	cancelPaymentSchema,
	confirmPaymentSchema,
	createPaymentSchema,
	getPaymentSchema,
} from "../schemas/payment";

const logger = createLogger("PaymentRouter");

// 지연 함수
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// 재시도 가능한 에러인지 확인
function isRetryableError(error: unknown, status?: number): boolean {
	// 네트워크 에러
	if (error instanceof TypeError && error.message.includes("fetch")) {
		return true;
	}

	// 타임아웃 에러
	if (error instanceof Error && error.name === "AbortError") {
		return true;
	}

	// 5xx 서버 에러
	if (status && status >= 500) {
		return true;
	}

	// 429 Too Many Requests
	if (status === 429) {
		return true;
	}

	return false;
}

// 토스페이먼츠 API 클라이언트 함수
async function tossPaymentsRequest(
	endpoint: string,
	method: string = "GET",
	body?: Record<string, unknown>,
	options: {
		timeout?: number;
		maxRetries?: number;
		retryDelay?: number;
	} = {},
) {
	const {
		timeout = 10000, // 10초 타임아웃
		maxRetries = 3,
		retryDelay = 1000, // 1초 지연
	} = options;

	const secretKey = serverEnv.TOSS_PAYMENTS_SECRET_KEY;
	const url = `https://api.tosspayments.com/v1/${endpoint}`;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		const abortController = new AbortController();
		const timeoutId = setTimeout(() => abortController.abort(), timeout);

		try {
			const requestOptions: RequestInit = {
				method,
				headers: {
					Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
					"Content-Type": "application/json",
				},
				signal: abortController.signal,
			};

			if (body && method !== "GET") {
				requestOptions.body = JSON.stringify(body);
			}

			logger.info("Toss Payments API request", {
				attempt: attempt + 1,
				endpoint,
				method,
				timeout,
			});

			const response = await fetch(url, requestOptions);
			clearTimeout(timeoutId);

			const data = await response.json();

			if (!response.ok) {
				const error = new Error(
					`Toss Payments API error: ${data.message || response.statusText}`,
				);

				logger.error("Toss Payments API error", {
					attempt: attempt + 1,
					status: response.status,
					error: data,
					endpoint,
					method,
				});

				// 재시도 불가능한 에러이거나 마지막 시도인 경우 에러 던지기
				if (
					!isRetryableError(error, response.status) ||
					attempt === maxRetries
				) {
					throw error;
				}

				// 재시도 가능한 에러인 경우 다음 시도 진행
				if (attempt < maxRetries) {
					const delayMs = retryDelay * 2 ** attempt; // 지수 백오프
					logger.warn("Retrying Toss Payments API request", {
						attempt: attempt + 1,
						nextAttemptIn: delayMs,
						status: response.status,
					});
					await delay(delayMs);
					continue;
				}
			}

			logger.info("Toss Payments API request successful", {
				attempt: attempt + 1,
				endpoint,
				method,
				status: response.status,
			});

			return data;
		} catch (error) {
			clearTimeout(timeoutId);

			logger.error("Toss Payments API request failed", {
				attempt: attempt + 1,
				endpoint,
				method,
				error: error instanceof Error ? error.message : error,
			});

			// 재시도 불가능한 에러이거나 마지막 시도인 경우 에러 던지기
			if (!isRetryableError(error) || attempt === maxRetries) {
				throw error;
			}

			// 재시도 가능한 에러인 경우 다음 시도 진행
			if (attempt < maxRetries) {
				const delayMs = retryDelay * 2 ** attempt; // 지수 백오프
				logger.warn("Retrying Toss Payments API request after error", {
					attempt: attempt + 1,
					nextAttemptIn: delayMs,
					error: error instanceof Error ? error.message : error,
				});
				await delay(delayMs);
			}
		}
	}

	// 이 코드에 도달하면 안 되지만, 타입스크립트를 위해 추가
	throw new Error("Maximum retry attempts exceeded");
}

export const paymentRouter = router({
	// 결제 요청 생성
	create: publicProcedure
		.input(createPaymentSchema)
		.mutation(async ({ input, ctx }) => {
			const {
				orderId,
				customerKey: inputCustomerKey,
				successUrl,
				failUrl,
			} = input;

			try {
				// 주문 정보 조회
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
						successUrl,
						failUrl,
					};
				}

				// customerKey 설정 (로그인 사용자 또는 ANONYMOUS)
				const customerKey = inputCustomerKey || ctx.user?.id || "ANONYMOUS";

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
					successUrl,
					failUrl,
				};
			} catch (error) {
				logger.error("Failed to create payment", { orderId, error });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "결제 요청 생성에 실패했습니다",
				});
			}
		}),

	// 결제 승인
	confirm: publicProcedure
		.input(confirmPaymentSchema)
		.mutation(async ({ input, ctx }) => {
			const { paymentKey, orderId, amount } = input;

			try {
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

				// 금액 검증
				if (payment.amount !== amount) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "결제 금액이 일치하지 않습니다",
					});
				}

				// 토스페이먼츠 결제 승인 요청
				const tossResponse = await tossPaymentsRequest(
					"payments/confirm",
					"POST",
					{
						paymentKey,
						orderId,
						amount,
					},
				);

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
							rawData: tossResponse,
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
					paymentKey,
					orderId,
					amount,
				});

				return {
					success: true,
					payment: updatedPayment,
					tossResponse,
				};
			} catch (error) {
				logger.error("Failed to confirm payment", {
					paymentKey,
					orderId,
					error,
				});

				// 결제 실패 상태 업데이트
				await prisma.payment.update({
					where: { orderId },
					data: {
						status: PaymentStatus.FAILED,
						failReason:
							error instanceof Error ? error.message : "결제 승인 실패",
					},
				});

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "결제 승인에 실패했습니다",
				});
			}
		}),

	// 결제 취소/환불
	cancel: protectedProcedure
		.input(cancelPaymentSchema)
		.mutation(async ({ input, ctx }) => {
			const { paymentKey, cancelReason, cancelAmount } = input;

			try {
				// 기존 결제 정보 조회
				const payment = await prisma.payment.findUnique({
					where: { paymentKey },
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

				// 토스페이먼츠 결제 취소 요청
				const cancelData: { cancelReason: string; cancelAmount?: number } = {
					cancelReason,
				};
				if (cancelAmount) {
					cancelData.cancelAmount = cancelAmount;
				}

				const tossResponse = await tossPaymentsRequest(
					`payments/${paymentKey}/cancel`,
					"POST",
					cancelData,
				);

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
							rawData: tossResponse,
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
					paymentKey,
					cancelReason,
					cancelAmount,
				});

				return {
					success: true,
					payment: updatedPayment,
					tossResponse,
				};
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

	// 결제 정보 조회
	get: publicProcedure.input(getPaymentSchema).query(async ({ input, ctx }) => {
		const { paymentKey, orderId } = input;

		try {
			const payment = await prisma.payment.findFirst({
				where: paymentKey ? { paymentKey } : { orderId },
				include: {
					order: {
						include: {
							user: {
								select: {
									id: true,
									email: true,
									fullName: true,
								},
							},
							items: {
								include: {
									product: true,
								},
							},
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
		if (!ctx.user) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "로그인이 필요합니다",
			});
		}

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
