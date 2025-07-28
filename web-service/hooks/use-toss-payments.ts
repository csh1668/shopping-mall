"use client";

import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useCallback } from "react";
import { publicEnv } from "@/public-env";
import { trpc } from "@/server/client";
import { type PaymentData, usePaymentStore } from "@/stores/payment-store";

export function useTossPayments() {
	const {
		paymentWidget,
		isWidgetLoading,
		isProcessing,
		paymentData,
		setPaymentWidget,
		setWidgetLoading,
		setProcessing,
	} = usePaymentStore();

	const createPaymentMutation = trpc.payment.create.useMutation();

	// 토스페이먼츠 SDK 초기화
	const initializePaymentWidget = useCallback(
		async (customerKey: string, amount: number) => {
			try {
				setWidgetLoading(true);

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

				return widget;
			} catch (error) {
				console.error("결제 위젯 초기화 실패:", error);
				throw error;
			} finally {
				setWidgetLoading(false);
			}
		},
		[setPaymentWidget, setWidgetLoading],
	);

	// 결제 UI 렌더링
	const renderPaymentMethods = useCallback(
		async (selector: string) => {
			if (!paymentWidget) return;

			try {
				await paymentWidget.renderPaymentMethods({
					selector,
					variantKey: "DEFAULT",
				});
			} catch (error) {
				console.error("결제 수단 렌더링 실패:", error);
				throw error;
			}
		},
		[paymentWidget],
	);

	// 약관 동의 UI 렌더링
	const renderAgreement = useCallback(
		async (selector: string) => {
			if (!paymentWidget) return;

			try {
				await paymentWidget.renderAgreement({
					selector,
					variantKey: "AGREEMENT",
				});
			} catch (error) {
				console.error("약관 동의 렌더링 실패:", error);
				throw error;
			}
		},
		[paymentWidget],
	);

	// 결제 요청
	const requestPayment = useCallback(
		async (data: PaymentData) => {
			if (!paymentWidget) {
				throw new Error("결제 위젯이 초기화되지 않았습니다.");
			}

			try {
				setProcessing(true);

				// 결제 데이터 생성 (서버에서)
				await createPaymentMutation.mutateAsync({
					orderId: data.orderId,
					successUrl: data.successUrl,
					failUrl: data.failUrl,
				});

				// 토스페이먼츠 결제 요청
				await paymentWidget.requestPayment({
					orderId: data.orderId,
					orderName: data.orderName,
					successUrl: data.successUrl,
					failUrl: data.failUrl,
					customerEmail: undefined, // 선택사항
					customerName: undefined, // 선택사항
					customerMobilePhone: undefined, // 선택사항
				});
			} catch (error) {
				console.error("결제 요청 실패:", error);
				setProcessing(false);
				throw error;
			}
		},
		[paymentWidget, setProcessing, createPaymentMutation],
	);

	// 결제 위젯 정리
	const cleanupPaymentWidget = useCallback(() => {
		setPaymentWidget(null);
	}, [setPaymentWidget]);

	return {
		// 상태
		paymentWidget,
		isWidgetLoading,
		isProcessing,
		paymentData,

		// 메서드
		initializePaymentWidget,
		renderPaymentMethods,
		renderAgreement,
		requestPayment,
		cleanupPaymentWidget,
	};
}
