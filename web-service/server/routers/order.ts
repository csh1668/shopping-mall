import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { createLogger } from "../../lib/logger";
import { adminProcedure, protectedProcedure, router } from "../index";
import {
	createOrderSchema,
	getOrderSchema,
	getOrdersSchema,
	updateOrderStatusSchema,
} from "../schemas/order";

const logger = createLogger("OrderRouter");

// 주문번호 생성 함수
function generateOrderNumber(): string {
	const timestamp = Date.now().toString();
	const random = Math.random().toString(36).substring(2, 8).toUpperCase();
	return `ORD${timestamp}${random}`;
}

export const orderRouter = router({
	// 주문 생성
	create: protectedProcedure
		.input(createOrderSchema)
		.mutation(async ({ input, ctx }) => {
			const { addressId, items, notes } = input;

			try {
				// 주소 유효성 검증
				const address = await prisma.address.findFirst({
					where: {
						id: addressId,
						userId: ctx.user.id,
					},
				});

				if (!address) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "배송지 정보를 찾을 수 없습니다",
					});
				}

				// 상품 정보 조회 및 검증
				const productIds = items.map((item) => item.productId);
				const products = await prisma.product.findMany({
					where: {
						id: { in: productIds },
						isActive: true,
					},
				});

				if (products.length !== productIds.length) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "유효하지 않은 상품이 포함되어 있습니다",
					});
				}

				// 재고 확인
				for (const item of items) {
					const product = products.find((p) => p.id === item.productId);
					if (!product) continue;

					if (product.stock < item.quantity) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: `${product.name}의 재고가 부족합니다 (재고: ${product.stock}개)`,
						});
					}
				}

				// 총 금액 계산
				let totalAmount = 0;
				const orderItems = items.map((item) => {
					const product = products.find((p) => p.id === item.productId)!;
					const itemTotal = product.price * item.quantity;
					totalAmount += itemTotal;

					return {
						productId: item.productId,
						name: product.name,
						price: product.price,
						originalPrice: product.originalPrice,
						quantity: item.quantity,
						image: product.previewImage,
						selectedOptions: item.selectedOptions,
					};
				});

				// 배송비 계산 (예: 50000원 이상 무료배송)
				const shippingFee = totalAmount >= 50000 ? 0 : 3000;

				// 주문 생성
				const order = await prisma.order.create({
					data: {
						orderNumber: generateOrderNumber(),
						userId: ctx.user.id,
						addressId,
						totalAmount,
						shippingFee,
						notes,
						items: {
							create: orderItems,
						},
						statusHistory: {
							create: {
								status: "PENDING",
								notes: "주문 생성",
							},
						},
					},
					include: {
						items: {
							include: {
								product: true,
							},
						},
						address: true,
						statusHistory: true,
					},
				});

				// 재고 차감
				for (const item of items) {
					await prisma.product.update({
						where: { id: item.productId },
						data: {
							stock: {
								decrement: item.quantity,
							},
						},
					});
				}

				// 장바구니에서 주문한 상품들 제거
				await prisma.cartItem.deleteMany({
					where: {
						userId: ctx.user.id,
						productId: { in: productIds },
					},
				});

				logger.info("Order created", {
					orderId: order.id,
					orderNumber: order.orderNumber,
					userId: ctx.user.id,
					totalAmount: order.totalAmount + order.shippingFee,
				});

				return order;
			} catch (error) {
				logger.error("Failed to create order", {
					userId: ctx.user.id,
					items,
					error,
				});

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "주문 생성에 실패했습니다",
				});
			}
		}),

	// 내 주문 목록 조회
	getMyOrders: protectedProcedure
		.input(getOrdersSchema)
		.query(async ({ input, ctx }) => {
			const { page, limit, status } = input;
			const skip = (page - 1) * limit;

			try {
				const where = {
					userId: ctx.user.id,
					...(status && { status }),
				};

				const [orders, total] = await Promise.all([
					prisma.order.findMany({
						where,
						include: {
							items: {
								include: {
									product: {
										select: {
											id: true,
											name: true,
											slug: true,
											previewImage: true,
										},
									},
								},
							},
							address: true,
							payment: {
								select: {
									id: true,
									status: true,
									method: true,
									amount: true,
									approvedAt: true,
								},
							},
						},
						orderBy: {
							createdAt: "desc",
						},
						skip,
						take: limit,
					}),
					prisma.order.count({ where }),
				]);

				return {
					orders,
					pagination: {
						page,
						limit,
						total,
						totalPages: Math.ceil(total / limit),
					},
				};
			} catch (error) {
				logger.error("Failed to get user orders", {
					userId: ctx.user.id,
					error,
				});
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "주문 목록 조회에 실패했습니다",
				});
			}
		}),

	// 주문 상세 조회
	get: protectedProcedure
		.input(getOrderSchema)
		.query(async ({ input, ctx }) => {
			const { orderId } = input;

			try {
				const order = await prisma.order.findFirst({
					where: {
						id: orderId,
						userId: ctx.user.id,
					},
					include: {
						items: {
							include: {
								product: true,
							},
						},
						address: true,
						statusHistory: {
							orderBy: {
								createdAt: "desc",
							},
						},
						payment: true,
					},
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "주문을 찾을 수 없습니다",
					});
				}

				return order;
			} catch (error) {
				logger.error("Failed to get order", {
					orderId,
					userId: ctx.user.id,
					error,
				});

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "주문 조회에 실패했습니다",
				});
			}
		}),

	// 주문 취소
	cancel: protectedProcedure
		.input(getOrderSchema)
		.mutation(async ({ input, ctx }) => {
			const { orderId } = input;

			try {
				const order = await prisma.order.findFirst({
					where: {
						id: orderId,
						userId: ctx.user.id,
					},
					include: {
						items: true,
						payment: true,
					},
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "주문을 찾을 수 없습니다",
					});
				}

				// 취소 가능한 상태인지 확인
				if (!["PENDING", "CONFIRMED"].includes(order.status)) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "취소할 수 없는 주문 상태입니다",
					});
				}

				// 주문 상태 업데이트
				const updatedOrder = await prisma.order.update({
					where: { id: orderId },
					data: { status: "CANCELLED" },
				});

				// 주문 상태 이력 추가
				await prisma.orderStatusHistory.create({
					data: {
						orderId,
						status: "CANCELLED",
						notes: "고객 요청으로 주문 취소",
					},
				});

				// 재고 복구
				for (const item of order.items) {
					await prisma.product.update({
						where: { id: item.productId },
						data: {
							stock: {
								increment: item.quantity,
							},
						},
					});
				}

				logger.info("Order cancelled", {
					orderId,
					orderNumber: order.orderNumber,
					userId: ctx.user.id,
				});

				return updatedOrder;
			} catch (error) {
				logger.error("Failed to cancel order", {
					orderId,
					userId: ctx.user.id,
					error,
				});

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "주문 취소에 실패했습니다",
				});
			}
		}),

	// 관리자용 주문 상태 업데이트
	updateStatus: adminProcedure
		.input(updateOrderStatusSchema)
		.mutation(async ({ input }) => {
			const { orderId, status, notes, trackingNumber } = input;

			try {
				const order = await prisma.order.findUnique({
					where: { id: orderId },
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "주문을 찾을 수 없습니다",
					});
				}

				// 주문 상태 업데이트
				const updatedOrder = await prisma.order.update({
					where: { id: orderId },
					data: {
						status,
						...(trackingNumber && { trackingNumber }),
					},
				});

				// 주문 상태 이력 추가
				await prisma.orderStatusHistory.create({
					data: {
						orderId,
						status,
						notes: notes || `주문 상태가 ${status}로 변경되었습니다`,
					},
				});

				logger.info("Order status updated", {
					orderId,
					status,
					trackingNumber,
				});

				return updatedOrder;
			} catch (error) {
				logger.error("Failed to update order status", {
					orderId,
					status,
					error,
				});

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "주문 상태 업데이트에 실패했습니다",
				});
			}
		}),
});
