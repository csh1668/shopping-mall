"use client";

import { Home, RefreshCw, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentFail() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const orderId = searchParams.get("orderId");
	const message = searchParams.get("message") || "결제에 실패했습니다";
	const code = searchParams.get("code");

	const handleRetry = () => {
		router.push("/cart");
	};

	const getErrorMessage = () => {
		// 토스페이먼츠 에러 코드에 따른 메시지 매핑
		const errorMessages: Record<string, string> = {
			PAY_PROCESS_CANCELED: "사용자가 결제를 취소했습니다",
			PAY_PROCESS_ABORTED: "결제 진행 중 오류가 발생했습니다",
			REJECT_CARD_COMPANY: "카드사에서 결제를 거부했습니다",
			REJECT_ISSUER: "카드 발급사에서 결제를 거부했습니다",
			INVALID_CARD_EXPIRATION: "카드 유효기간이 잘못되었습니다",
			INVALID_STOPPED_CARD: "정지된 카드입니다",
			EXCEED_MAX_DAILY_PAYMENT_COUNT: "일일 결제 한도를 초과했습니다",
			EXCEED_MAX_ONE_DAY_PAYMENT_AMOUNT: "일일 결제 금액을 초과했습니다",
			NOT_ENOUGH_BALANCE: "계좌 잔액이 부족합니다",
			INVALID_ACCOUNT_INFO: "계좌 정보가 올바르지 않습니다",
		};

		return code && errorMessages[code] ? errorMessages[code] : message;
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-md mx-auto space-y-6">
				{/* 실패 헤더 */}
				<Card>
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<XCircle className="h-16 w-16 text-red-500" />
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-bold text-red-600">결제 실패</h1>
							<p className="text-muted-foreground">
								결제 처리 중 문제가 발생했습니다.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* 에러 정보 */}
				<Card>
					<CardHeader>
						<CardTitle>실패 사유</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-800 font-medium">{getErrorMessage()}</p>
							</div>

							{orderId && (
								<div>
									<p className="text-sm text-muted-foreground">주문번호</p>
									<p className="font-mono text-sm">{orderId}</p>
								</div>
							)}

							{code && (
								<div>
									<p className="text-sm text-muted-foreground">에러 코드</p>
									<p className="font-mono text-sm">{code}</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* 해결 방법 안내 */}
				<Card>
					<CardHeader>
						<CardTitle>해결 방법</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 text-sm">
							<div className="flex items-start space-x-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
								<p>카드 정보를 다시 확인해주세요</p>
							</div>
							<div className="flex items-start space-x-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
								<p>카드 한도나 잔액을 확인해주세요</p>
							</div>
							<div className="flex items-start space-x-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
								<p>다른 결제 수단을 이용해보세요</p>
							</div>
							<div className="flex items-start space-x-2">
								<div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
								<p>문제가 지속되면 고객센터로 문의해주세요</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 액션 버튼 */}
				<div className="space-y-3">
					<Button onClick={handleRetry} className="w-full" size="lg">
						<RefreshCw className="h-4 w-4 mr-2" />
						다시 결제하기
					</Button>

					<Button
						variant="outline"
						onClick={() => router.push("/")}
						className="w-full"
						size="lg"
					>
						<Home className="h-4 w-4 mr-2" />
						홈으로 돌아가기
					</Button>
				</div>

				{/* 고객센터 안내 */}
				<Card>
					<CardContent className="text-center p-4">
						<p className="text-sm text-muted-foreground">
							결제 문제가 해결되지 않나요?
						</p>
						<Button variant="link" className="p-0 h-auto">
							고객센터 문의하기
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
