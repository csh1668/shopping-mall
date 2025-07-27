"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentWidget } from "@/components/payment/payment-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/public-env";
import { trpc } from "@/server/client";

export function CheckoutPageContent() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");
	const [paymentData, setPaymentData] = useState<any>(null);

	const createPaymentMutation = trpc.payment.create.useMutation();

	// 주문 정보 조회
	const { data: orderData, isLoading } = trpc.order.get.useQuery(
		{ orderId: orderId || "" },
		{ enabled: !!orderId },
	);

	// 기존 결제 정보 확인
	const { data: existingPayment } = trpc.payment.get.useQuery(
		{ orderId: orderId || "" },
		{ enabled: !!orderId },
	);

	useEffect(() => {
		async function initializePayment() {
			if (!orderId || !orderData) return;

			try {
				// 기존 결제 정보가 있으면 사용, 없으면 새로 생성
				if (existingPayment) {
					setPaymentData({
						orderId: existingPayment.orderId,
						orderName: existingPayment.orderName,
						amount: existingPayment.amount,
						customerKey: existingPayment.customerKey,
					});
				} else {
					// 새 결제 생성
					const result = await createPaymentMutation.mutateAsync({
						orderId,
						successUrl: `${publicEnv.NEXT_PUBLIC_SITE_URL}/payment/success`,
						failUrl: `${publicEnv.NEXT_PUBLIC_SITE_URL}/payment/fail`,
					});

					setPaymentData(result);
				}
			} catch (error) {
				console.error("결제 초기화 실패:", error);
			}
		}

		if (!isLoading && orderData) {
			initializePayment();
		}
	}, [
		orderId,
		orderData,
		existingPayment,
		isLoading,
		createPaymentMutation.mutateAsync,
	]);

	if (!orderId) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<ShoppingCart className="h-12 w-12 text-muted-foreground" />
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold">주문 정보가 없습니다</h2>
							<p className="text-muted-foreground">
								올바른 주문 정보로 다시 접근해주세요.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading || !paymentData) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold">결제 준비 중...</h2>
							<p className="text-muted-foreground">
								결제 정보를 불러오고 있습니다.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handlePaymentRequest = async (paymentRequestData: {
		paymentKey: string;
		orderId: string;
		amount: number;
	}) => {
		// 결제 요청은 PaymentWidget에서 토스페이먼츠 SDK를 통해 처리됨
		// 여기서는 추가적인 로직이 필요한 경우 구현
		console.log("Payment request:", paymentRequestData);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold">결제하기</h1>
					<p className="text-muted-foreground">
						안전하고 간편한 결제를 위해 토스페이먼츠를 사용합니다.
					</p>
				</div>

				{/* 주문 요약 */}
				{orderData && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ShoppingCart className="h-5 w-5" />
								주문 요약
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-sm text-muted-foreground">
									주문번호: {orderData.orderNumber}
								</div>

								{orderData.items.map((item: any) => (
									<div
										key={item.id}
										className="flex justify-between items-center"
									>
										<div className="flex items-center space-x-4">
											{item.image && (
												<img
													src={item.image}
													alt={item.name}
													className="w-12 h-12 object-cover rounded"
												/>
											)}
											<div>
												<h4 className="font-medium">{item.name}</h4>
												<p className="text-sm text-muted-foreground">
													수량: {item.quantity}개
												</p>
											</div>
										</div>
										<p className="font-semibold">
											{(item.price * item.quantity).toLocaleString()}원
										</p>
									</div>
								))}

								<div className="border-t pt-4 space-y-2">
									<div className="flex justify-between">
										<span>상품금액</span>
										<span>
											{(
												orderData.totalAmount + orderData.shippingFee
											).toLocaleString()}
											원
										</span>
									</div>
									<div className="flex justify-between">
										<span>배송비</span>
										<span>
											{orderData.shippingFee === 0 ? (
												<span className="text-green-600">무료</span>
											) : (
												`${orderData.shippingFee.toLocaleString()}원`
											)}
										</span>
									</div>
									<div className="flex justify-between text-lg font-semibold">
										<span>총 결제 금액</span>
										<span>
											{(
												orderData.totalAmount + orderData.shippingFee
											).toLocaleString()}
											원
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* 결제 위젯 */}
				<PaymentWidget
					orderId={paymentData.orderId}
					orderName={paymentData.orderName}
					amount={paymentData.amount}
					customerKey={paymentData.customerKey}
					onPaymentRequest={handlePaymentRequest}
					successUrl={`${publicEnv.NEXT_PUBLIC_SITE_URL}/payment/success`}
					failUrl={`${publicEnv.NEXT_PUBLIC_SITE_URL}/payment/fail`}
				/>

				{/* 안내 사항 */}
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-muted-foreground space-y-2">
							<h4 className="font-medium text-foreground">결제 안내</h4>
							<ul className="space-y-1">
								<li>• 결제는 SSL 보안 연결을 통해 안전하게 처리됩니다.</li>
								<li>• 결제 완료 후 주문 확인 메일이 발송됩니다.</li>
								<li>• 결제 관련 문의는 고객센터로 연락해주세요.</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
