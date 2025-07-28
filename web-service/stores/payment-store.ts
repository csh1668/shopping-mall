import type { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface PaymentData {
	orderId: string;
	orderName: string;
	amount: number;
	customerKey: string;
	successUrl: string;
	failUrl: string;
}

interface PaymentState {
	// 결제 위젯 관련
	paymentWidget: TossPaymentsWidgets | null;
	isWidgetLoading: boolean;
	isProcessing: boolean;

	// 결제 데이터
	paymentData: PaymentData | null;

	// 모달 상태
	isPaymentModalOpen: boolean;

	// 액션들
	setPaymentWidget: (widget: TossPaymentsWidgets | null) => void;
	setWidgetLoading: (loading: boolean) => void;
	setProcessing: (processing: boolean) => void;
	setPaymentData: (data: PaymentData | null) => void;
	openPaymentModal: (data: PaymentData) => void;
	closePaymentModal: () => void;
	resetPaymentState: () => void;
}

export const usePaymentStore = create<PaymentState>()(
	immer((set) => ({
		// 초기 상태
		paymentWidget: null,
		isWidgetLoading: false,
		isProcessing: false,
		paymentData: null,
		isPaymentModalOpen: false,

		// 액션들
		setPaymentWidget: (widget) =>
			set((state) => {
				state.paymentWidget = widget;
			}),

		setWidgetLoading: (loading) =>
			set((state) => {
				state.isWidgetLoading = loading;
			}),

		setProcessing: (processing) =>
			set((state) => {
				state.isProcessing = processing;
			}),

		setPaymentData: (data) =>
			set((state) => {
				state.paymentData = data;
			}),

		openPaymentModal: (data) =>
			set((state) => {
				state.paymentData = data;
				state.isPaymentModalOpen = true;
			}),

		closePaymentModal: () =>
			set((state) => {
				state.isPaymentModalOpen = false;
				state.isProcessing = false;
			}),

		resetPaymentState: () =>
			set((state) => {
				state.paymentWidget = null;
				state.isWidgetLoading = false;
				state.isProcessing = false;
				state.paymentData = null;
				state.isPaymentModalOpen = false;
			}),
	})),
);
