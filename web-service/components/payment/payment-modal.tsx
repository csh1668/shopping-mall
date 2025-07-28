"use client";

import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTossPayments } from "@/hooks/use-toss-payments";
import { usePaymentStore } from "@/stores/payment-store";

export function PaymentModal() {
	const {
		isPaymentModalOpen,
		paymentData,
		closePaymentModal,
		resetPaymentState,
	} = usePaymentStore();
	const { toast } = useToast();

	const {
		isWidgetLoading,
		isProcessing,
		initializePaymentWidget,
		renderPaymentMethods,
		renderAgreement,
		requestPayment,
		cleanupPaymentWidget,
	} = useTossPayments();
	const hasRendered = useRef(false);

	const initializeWidget = useCallback(async () => {
		if (!paymentData) return;

		try {
			await initializePaymentWidget(
				paymentData.customerKey,
				paymentData.amount,
			);
		} catch (error) {
			console.error("결제 위젯 초기화 실패:", error);
		}
	}, [paymentData, initializePaymentWidget]);

	useEffect(() => {
		async function render() {
			await renderPaymentMethods("#payment-methods");
			await renderAgreement("#agreement");
			hasRendered.current = true;
		}

		render();
	}, [renderPaymentMethods, renderAgreement]);

	// 모달이 열릴 때 결제 위젯 초기화
	// biome-ignore lint/correctness/useExhaustiveDependencies: 무한 루프 방지를 위해 함수 의존성 제외
	useEffect(() => {
		if (isPaymentModalOpen && paymentData && !hasRendered.current) {
			initializeWidget();
		}

		// 모달이 닫힐 때 정리
		return () => {
			if (!isPaymentModalOpen) {
				cleanupPaymentWidget();
				hasRendered.current = false;
			}
		};
	}, [isPaymentModalOpen, paymentData]);

	const handlePaymentRequest = async () => {
		if (!paymentData) return;

		try {
			await requestPayment(paymentData);
		} catch (error) {
			console.error("결제 요청 실패:", error);
			toast({
				title: "결제 요청에 실패했습니다. 다시 시도해주세요.",
				description: `${error}`,
				variant: "destructive",
			});
		}
	};

	const handleClose = () => {
		if (isProcessing) return; // 결제 진행 중에는 닫기 방지

		closePaymentModal();
		resetPaymentState();
	};

	if (!paymentData) return null;

	return (
		<Dialog open={isPaymentModalOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="text-xl font-bold">결제하기</DialogTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClose}
						disabled={isProcessing}
					>
						<X className="h-4 w-4" />
					</Button>
				</DialogHeader>

				<div className="space-y-6">
					{/* 결제 정보 */}
					<Card>
						<CardHeader>
							<CardTitle>결제 정보</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">주문명</p>
									<p className="font-medium">{paymentData.orderName}</p>
								</div>
								<div>
									<p className="text-muted-foreground">결제 금액</p>
									<p className="font-medium text-lg">
										{paymentData.amount.toLocaleString()}원
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 결제 수단 */}
					<Card>
						<CardHeader>
							<CardTitle>결제 수단</CardTitle>
						</CardHeader>
						<CardContent>
							{isWidgetLoading ? (
								<div className="flex items-center justify-center h-48">
									<Loader2 className="h-8 w-8 animate-spin" />
									<span className="ml-2">결제 수단을 불러오는 중...</span>
								</div>
							) : (
								<div id="payment-methods" className="min-h-[200px]" />
							)}
						</CardContent>
					</Card>

					{/* 약관 동의 */}
					<Card>
						<CardHeader>
							<CardTitle>약관 동의</CardTitle>
						</CardHeader>
						<CardContent>
							{isWidgetLoading ? (
								<div className="flex items-center justify-center h-24">
									<Loader2 className="h-6 w-6 animate-spin" />
									<span className="ml-2">약관을 불러오는 중...</span>
								</div>
							) : (
								<div id="agreement" className="min-h-[100px]" />
							)}
						</CardContent>
					</Card>

					{/* 결제 버튼 */}
					<Button
						onClick={handlePaymentRequest}
						disabled={isProcessing || isWidgetLoading}
						className="w-full h-12 text-lg"
					>
						{isProcessing ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin mr-2" />
								결제 처리 중...
							</>
						) : (
							`${paymentData.amount.toLocaleString()}원 결제하기`
						)}
					</Button>

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
			</DialogContent>
		</Dialog>
	);
}
