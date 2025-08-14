"use client";

import { CheckCircle, Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
		async function handleSuccessFlow() {
			if (isProcessed || !paymentKey || !orderId || !amount) {
				if (!paymentKey || !orderId || !amount) {
					router.push("/cart");
				}
				return;
			}

			setIsProcessed(true);
			setIsConfirming(true);

			try {
				// 1) 선확인: 이미 PAID면 승인 생략
				const pre = await refetch();
				if (pre.data && pre.data.status === "PAID") {
					setIsConfirming(false);
					return;
				}

				// 2) 승인 시도
				await confirmPaymentMutation.mutateAsync({
					paymentKey,
					orderId,
					amount: Number(amount),
				});

				await refetch();
			} catch (err: unknown) {
				const anyErr = err as {
					data?: { code?: string };
					shape?: { data?: { code?: string } };
				};
				const code = anyErr?.data?.code || anyErr?.shape?.data?.code;
				if (code === "UNAUTHORIZED") {
					router.push(
						`/auth?redirect=/payment/success?orderId=${orderId}&paymentKey=${paymentKey}&amount=${amount}`,
					);
					return;
				}
				// 3) 폴백: 짧은 폴링으로 상태 재확인
				try {
					for (let i = 0; i < 3; i++) {
						const r = await refetch();
						if (r.data && r.data.status === "PAID") break;
						await new Promise((res) => setTimeout(res, 800));
					}
				} catch {
					// ignore
				}

				const latest = await refetch();
				if (!latest.data || latest.data.status !== "PAID") {
					router.push(
						`/payment/fail?orderId=${orderId}&message=결제 승인에 실패했습니다&code=${encodeURIComponent(code || "UNKNOWN")}`,
					);
				}
			} finally {
				setIsConfirming(false);
			}
		}

		void handleSuccessFlow();
	}, []);

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

	const receiptUrl: string | null = (() => {
		const raw = paymentData?.rawData as unknown;
		if (
			raw &&
			typeof raw === "object" &&
			"receipt" in (raw as Record<string, unknown>)
		) {
			const r = (raw as { receipt?: { url?: string } }).receipt;
			return r?.url ?? null;
		}
		return null;
	})();

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
								<p>{String(paymentData.method || "카드") as string}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">결제 금액</p>
								<p className="text-lg font-semibold">
									{Number(paymentData.amount).toLocaleString()}원
								</p>
							</div>
						</div>

						{!!paymentData.approvedAt && (
							<div>
								<p className="text-sm text-muted-foreground">결제 완료 시간</p>
								<p>{paymentData.approvedAt.toLocaleString()}</p>
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
							{paymentData.order.items.map((item) => (
								<div
									key={item.id}
									className="flex justify-between items-center"
								>
									<div className="flex items-center space-x-4">
										{item.product?.previewImage && (
											<div className="w-12 h-12 rounded overflow-hidden bg-muted">
												<Image
													src={item.product?.previewImage || ""}
													alt={item.product?.name || ""}
													width={48}
													height={48}
													className="object-cover"
												/>
											</div>
										)}
										<div>
											<h4 className="font-medium">
												{item.product?.name || item.name}
											</h4>
											<p className="text-sm text-muted-foreground">
												수량: {item.quantity}개
											</p>
										</div>
									</div>
									<p className="font-semibold">
										{(
											(item.product?.price ?? item.price ?? 0) * item.quantity
										).toLocaleString()}
										원
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* 영수증 링크 */}
				{receiptUrl && (
					<Card>
						<CardHeader>
							<CardTitle>영수증</CardTitle>
						</CardHeader>
						<CardContent>
							<Link
								href={receiptUrl}
								className="text-primary underline"
								target="_blank"
							>
								영수증 확인하기
							</Link>
						</CardContent>
					</Card>
				)}

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
