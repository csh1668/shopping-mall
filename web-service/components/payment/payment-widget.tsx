"use client";

import {
	loadTossPayments,
	type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/public-env";

interface PaymentWidgetProps {
	orderId: string;
	orderName: string;
	amount: number;
	customerKey: string;
	onPaymentRequest: (paymentData: {
		paymentKey: string;
		orderId: string;
		amount: number;
	}) => void;
	successUrl: string;
	failUrl: string;
}

export function PaymentWidget({
	orderId,
	orderName,
	amount,
	customerKey,
	onPaymentRequest,
	successUrl,
	failUrl,
}: PaymentWidgetProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [paymentWidget, setPaymentWidget] =
		useState<TossPaymentsWidgets | null>(null);

	useEffect(() => {
		async function initializePaymentWidget() {
			try {
				setIsLoading(true);

				// 토스페이먼츠 SDK 로드
				const tossPayments = await loadTossPayments(
					publicEnv.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY,
				);

				// 결제 위젯 생성
				const widget = tossPayments.widgets({
					customerKey,
				});

				setPaymentWidget(widget);

				// 결제 금액 설정
				await widget.setAmount({
					currency: "KRW",
					value: amount,
				});
			} catch (error) {
				console.error("결제 위젯 초기화 실패:", error);
			} finally {
				setIsLoading(false);
			}
		}

		initializePaymentWidget();
	}, [amount, customerKey]);

	useEffect(() => {
		async function renderPaymentMethods() {
			try {
				Promise.all([
					paymentWidget?.renderPaymentMethods({
						selector: "#payment-methods",
						variantKey: "DEFAULT",
					}),
					paymentWidget?.renderAgreement({
						selector: "#agreement",
						variantKey: "AGREEMENT",
					}),
				]);
			} catch (error) {
				console.error("결제 위젯 렌더링 실패:", error);
			}
		}

		renderPaymentMethods();
	}, [paymentWidget]);

	const handlePaymentRequest = async () => {
		if (!paymentWidget) {
			console.error("결제 위젯이 초기화되지 않았습니다.");
			return;
		}

		try {
			setIsProcessing(true);

			// 결제 요청
			await paymentWidget.requestPayment({
				orderId,
				orderName,
				successUrl,
				failUrl,
				customerEmail: undefined, // 선택사항
				customerName: undefined, // 선택사항
				customerMobilePhone: undefined, // 선택사항
			});
		} catch (error) {
			console.error("결제 요청 실패:", error);
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center p-8">
					<Loader2 className="h-8 w-8 animate-spin" />
					<span className="ml-2">결제 위젯을 로드하는 중...</span>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>결제 정보</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-muted-foreground">주문명</p>
							<p className="font-medium">{orderName}</p>
						</div>
						<div>
							<p className="text-muted-foreground">결제 금액</p>
							<p className="font-medium text-lg">{amount.toLocaleString()}원</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>결제 수단</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="min-h-[200px]" id="payment-methods" />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>약관 동의</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="min-h-[100px]" id="agreement" />
				</CardContent>
			</Card>

			<Button
				onClick={handlePaymentRequest}
				disabled={isProcessing}
				className="w-full h-12 text-lg"
			>
				{isProcessing ? (
					<>
						<Loader2 className="h-5 w-5 animate-spin mr-2" />
						결제 처리 중...
					</>
				) : (
					`${amount.toLocaleString()}원 결제하기`
				)}
			</Button>
		</div>
	);
}
