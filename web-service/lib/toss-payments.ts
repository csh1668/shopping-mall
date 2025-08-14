import { createLogger } from "@/lib/logger";
import { serverEnv } from "@/server-env";

const logger = createLogger("TossPaymentsClient");

// 입력 타입
export interface ConfirmPaymentRequest {
	paymentKey: string;
	orderId: string;
	amount: number;
}

export interface CancelPaymentRequest {
	paymentKey: string;
	cancelReason: string;
	cancelAmount?: number;
}

// 응답 타입 (필요한 필드만 엄격히 정의 + 나머지는 유연성 보장)
export type TossPaymentMethodString =
	| "카드"
	| "계좌이체"
	| "가상계좌"
	| "휴대폰"
	| "카카오페이"
	| "네이버페이"
	| "토스페이"
	| string;

export interface ConfirmPaymentResponse {
	// 공통 식별/상태
	paymentKey: string;
	orderId: string;
	orderName: string;
	status: "DONE" | string;
	requestedAt: string;
	transactionKey: string;
	approvedAt: string;
	totalAmount: number;

	// 결제 수단/영수증
	method?: TossPaymentMethodString;
	receipt?: {
		url?: string;
	};

	// 간편결제 정보(있는 경우)
	easyPay?: {
		provider?: string; // 예: KAKAOPAY, NAVERPAY, TOSSPAY 등
	};

	// 카드 결제 상세(카드인 경우)
	card?: {
		number?: string; // 마스킹된 카드번호
		approveNo?: string; // 승인번호
		issuerCode?: string; // 발급사 코드
		acquirerCode?: string; // 매입사 코드
		installmentPlanMonths?: number;
		isInterestFree?: boolean;
	};

	// 가상계좌 결제 상세(가상계좌인 경우)
	virtualAccount?: {
		accountNumber?: string;
		bankCode?: string;
		customerName?: string;
		dueDate?: string;
	};

	[key: string]: unknown;
}

export interface CancelPaymentResponse {
	// 식별/상태
	paymentKey?: string;
	orderId?: string;
	status: "CANCELED" | "PARTIAL_CANCELED" | "DONE" | string;

	// 취소 관련 정보
	cancelReason?: string;
	canceledAt?: string;
	cancelAmount?: number;

	[key: string]: unknown;
}

async function requestTossApi<TReq, TRes>(
	endpoint: string,
	method: "POST" | "GET",
	body?: TReq,
): Promise<TRes> {
	const secretKey = serverEnv.TOSS_PAYMENTS_SECRET_KEY;
	const url = `https://api.tosspayments.com/v1/${endpoint}`;

	const requestInit: RequestInit = {
		method,
		headers: {
			Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
			"Content-Type": "application/json",
		},
	};

	if (body && method !== "GET") {
		requestInit.body = JSON.stringify(body);
	}

	logger.info("Toss API request", { endpoint, method });

	// 타임아웃 + 최대 2회 재시도(총 3회) 지수 백오프
	const maxAttempts = 3;
	let lastError: unknown;
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		const controller = new AbortController();
		const timeoutMs = 10000; // 10s
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		try {
			const res = await fetch(url, {
				...requestInit,
				signal: controller.signal,
			});
			const data = (await res.json()) as TRes | { message?: string };
			clearTimeout(timer);
			if (!res.ok) {
				logger.error("Toss API error", {
					endpoint,
					method,
					status: res.status,
					data,
				});
				const errorMessage =
					(data as { message?: string }).message || res.statusText;
				throw new Error(`Toss Payments API error: ${errorMessage}`);
			}
			return data as TRes;
		} catch (error) {
			clearTimeout(timer);
			lastError = error;
			const isAbort = error instanceof Error && error.name === "AbortError";
			// 네트워크/타임아웃류에 한해 재시도
			if (attempt < maxAttempts && (isAbort || error instanceof TypeError)) {
				const backoff = 2 ** (attempt - 1) * 300; // 300ms, 600ms
				await new Promise((r) => setTimeout(r, backoff));
				continue;
			}
			throw error;
		}
	}
	throw lastError instanceof Error
		? lastError
		: new Error("Unknown Toss API error");
}

export async function confirmTossPayment(
	input: ConfirmPaymentRequest,
): Promise<ConfirmPaymentResponse> {
	return requestTossApi<ConfirmPaymentRequest, ConfirmPaymentResponse>(
		"payments/confirm",
		"POST",
		input,
	);
}

export async function cancelTossPayment(
	input: CancelPaymentRequest,
): Promise<CancelPaymentResponse> {
	const { paymentKey, cancelReason, cancelAmount } = input;
	const body: { cancelReason: string; cancelAmount?: number } = {
		cancelReason,
	};
	if (typeof cancelAmount === "number") body.cancelAmount = cancelAmount;

	return requestTossApi<typeof body, CancelPaymentResponse>(
		`payments/${paymentKey}/cancel`,
		"POST",
		body,
	);
}
