"use client";

import { CheckCircle, Loader2, Package } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/server/client";

export function PaymentSuccess() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isConfirming, setIsConfirming] = useState(true);
	const [isProcessed, setIsProcessed] = useState(false);

	const paymentKey = searchParams.get("paymentKey");
	const orderId = searchParams.get("orderId");
	const amount = searchParams.get("amount");

	const confirmPaymentMutation = trpc.payment.confirm.useMutation();

	const { data: paymentData, refetch } = trpc.payment.get.useQuery(
		{ orderId: orderId || "" },
		{ enabled: false },
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 중복 실행 방지를 위해 최소한의 의존성만 포함
	useEffect(() => {
		async function confirmPayment() {
			// 이미 처리되었거나 필수 파라미터가 없는 경우 중단
			if (isProcessed || !paymentKey || !orderId || !amount) {
				if (!paymentKey || !orderId || !amount) {
					console.error("필수 파라미터가 누락되었습니다.");
					router.push("/cart");
				}
				return;
			}

			// 처리 플래그 설정으로 중복 실행 방지
			setIsProcessed(true);

			try {
				setIsConfirming(true);

				// 결제 승인 요청
				await confirmPaymentMutation.mutateAsync({
					paymentKey,
					orderId,
					amount: Number(amount),
				});

				// 결제 정보 다시 조회
				await refetch();
			} catch (error) {
				console.error("결제 승인 실패:", error);
				router.push(
					`/payment/fail?orderId=${orderId}&message=결제 승인에 실패했습니다`,
				);
			} finally {
				setIsConfirming(false);
			}
		}

		// 2초 지연 후 실행
		const timer = setTimeout(() => {
			confirmPayment();
		}, 2000);

		// 클린업 함수로 타이머 정리
		return () => clearTimeout(timer);
	}, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

	if (isConfirming) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
						<h2 className="text-xl font-semibold">결제를 확인하는 중...</h2>
						<p className="text-muted-foreground text-center">
							잠시만 기다려주세요. 결제 처리를 완료하고 있습니다.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!paymentData) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<p className="text-muted-foreground">
							결제 정보를 불러올 수 없습니다.
						</p>
						<Button onClick={() => router.push("/orders")}>
							주문 내역 보기
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto space-y-6">
				{/* 성공 헤더 */}
				<Card>
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<CheckCircle className="h-16 w-16 text-green-500" />
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-bold">결제가 완료되었습니다</h1>
							<p className="text-muted-foreground">
								주문이 성공적으로 처리되었습니다.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* 결제 정보 */}
				<Card>
					<CardHeader>
						<CardTitle>결제 정보</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">주문번호</p>
								<p className="font-mono">{paymentData.order.orderNumber}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">결제 상태</p>
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-800"
								>
									결제 완료
								</Badge>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">결제 수단</p>
								<p>{paymentData.method || "카드"}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">결제 금액</p>
								<p className="text-lg font-semibold">
									{paymentData.amount.toLocaleString()}원
								</p>
							</div>
						</div>

						{paymentData.approvedAt && (
							<div>
								<p className="text-sm text-muted-foreground">결제 완료 시간</p>
								<p>{new Date(paymentData.approvedAt).toLocaleString()}</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* 주문 상품 정보 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="h-5 w-5" />
							주문 상품
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{paymentData.order.items.map((item: any) => (
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
						</div>
					</CardContent>
				</Card>

				{/* 배송 정보 */}
				{paymentData.order.address && (
					<Card>
						<CardHeader>
							<CardTitle>배송 정보</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p className="font-medium">{paymentData.order.address.name}</p>
								<p className="text-muted-foreground">
									{paymentData.order.address.address}
								</p>
								{paymentData.order.address.detailAddress && (
									<p className="text-muted-foreground">
										{paymentData.order.address.detailAddress}
									</p>
								)}
								<p className="text-muted-foreground">
									{paymentData.order.address.zipCode}
								</p>
							</div>
						</CardContent>
					</Card>
				)}

				{/* 액션 버튼 */}
				<div className="flex gap-4">
					<Button onClick={() => router.push("/orders")} className="flex-1">
						주문 내역 확인
					</Button>
					<Button
						variant="outline"
						onClick={() => router.push("/")}
						className="flex-1"
					>
						쇼핑 계속하기
					</Button>
				</div>
			</div>
		</div>
	);
}
