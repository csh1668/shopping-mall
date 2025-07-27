"use client";

import { CreditCard, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { publicEnv } from "@/public-env";
import { trpc } from "@/server/client";
import { usePaymentStore } from "@/stores/payment-store";

interface CreateOrderFormProps {
	selectedItems: any[];
	totalAmount: number;
	shippingFee: number;
}

export function CreateOrderForm({
	selectedItems,
	totalAmount,
	shippingFee,
}: CreateOrderFormProps) {
	const router = useRouter();
	const { openPaymentModal } = usePaymentStore();

	const [selectedAddressId, setSelectedAddressId] = useState("");
	const [notes, setNotes] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	// 사용자 주소 목록 조회
	const { data: addresses, isLoading: isLoadingAddresses } =
		trpc.user.getAddresses.useQuery();

	const createOrderMutation = trpc.order.create.useMutation();

	const handleCreateOrder = async () => {
		if (!selectedAddressId) {
			alert("배송지를 선택해주세요.");
			return;
		}

		if (selectedItems.length === 0) {
			alert("주문할 상품을 선택해주세요.");
			return;
		}

		try {
			setIsCreating(true);

			// 주문 생성
			const order = await createOrderMutation.mutateAsync({
				addressId: selectedAddressId,
				items: selectedItems.map((item) => ({
					productId: item.productId || item.id.toString(),
					quantity: item.quantity,
					selectedOptions: {
						color: item.selectedColor,
						size: item.selectedSize,
					},
				})),
				notes: notes || undefined,
			});

			// 주문명 생성
			const orderName =
				selectedItems.length === 1
					? selectedItems[0].name
					: `${selectedItems[0].name} 외 ${selectedItems.length - 1}건`;

			// 결제 모달 열기
			openPaymentModal({
				orderId: order.id,
				orderName,
				amount: totalAmount + shippingFee,
				customerKey: "ANONYMOUS", // 또는 사용자 ID
				successUrl: `${publicEnv.NEXT_PUBLIC_SITE_URL}/payment/success`,
				failUrl: `${publicEnv.NEXT_PUBLIC_SITE_URL}/payment/fail`,
			});
		} catch (error) {
			console.error("주문 생성 실패:", error);
			alert("주문 생성에 실패했습니다. 다시 시도해주세요.");
		} finally {
			setIsCreating(false);
		}
	};

	if (isLoadingAddresses) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center p-8">
					<Loader2 className="h-8 w-8 animate-spin" />
					<span className="ml-2">배송지 정보를 불러오는 중...</span>
				</CardContent>
			</Card>
		);
	}

	if (!addresses || addresses.length === 0) {
		return (
			<Card>
				<CardContent className="text-center p-8">
					<MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
					<h3 className="text-lg font-semibold mb-2">
						등록된 배송지가 없습니다
					</h3>
					<p className="text-muted-foreground mb-4">
						주문을 위해 배송지를 먼저 등록해주세요.
					</p>
					<Button onClick={() => router.push("/addresses")}>
						배송지 등록하기
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* 배송지 선택 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MapPin className="h-5 w-5" />
						배송지 선택
					</CardTitle>
				</CardHeader>
				<CardContent>
					<RadioGroup
						value={selectedAddressId}
						onValueChange={setSelectedAddressId}
					>
						{addresses.map((address) => (
							<div key={address.id} className="flex items-start space-x-2">
								<RadioGroupItem value={address.id} id={address.id} />
								<Label htmlFor={address.id} className="flex-1 cursor-pointer">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{address.name}</span>
											{address.isDefault && (
												<span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
													기본배송지
												</span>
											)}
										</div>
										<p className="text-sm text-muted-foreground">
											{address.address}
										</p>
										{address.detailAddress && (
											<p className="text-sm text-muted-foreground">
												{address.detailAddress}
											</p>
										)}
										<p className="text-sm text-muted-foreground">
											{address.zipCode}
										</p>
									</div>
								</Label>
							</div>
						))}
					</RadioGroup>

					<div className="mt-4">
						<Button variant="outline" onClick={() => router.push("/addresses")}>
							새 배송지 추가
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* 주문 상품 목록 */}
			<Card>
				<CardHeader>
					<CardTitle>주문 상품 ({selectedItems.length}개)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{selectedItems.map((item) => (
							<div key={item.id} className="flex items-center gap-4">
								<div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
									{item.image && (
										<Image
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover rounded-lg"
											width={64}
											height={64}
										/>
									)}
								</div>
								<div className="flex-1">
									<h4 className="font-medium">{item.name}</h4>
									<div className="text-sm text-muted-foreground">
										{item.selectedColor && (
											<span>색상: {item.selectedColor} </span>
										)}
										{item.selectedSize && (
											<span>사이즈: {item.selectedSize}</span>
										)}
									</div>
									<p className="text-sm">수량: {item.quantity}개</p>
								</div>
								<div className="text-right">
									<p className="font-semibold">
										{(item.price * item.quantity).toLocaleString()}원
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* 주문 메모 */}
			<Card>
				<CardHeader>
					<CardTitle>주문 메모</CardTitle>
				</CardHeader>
				<CardContent>
					<Textarea
						placeholder="배송 시 요청사항을 입력해주세요 (선택사항)"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={3}
					/>
				</CardContent>
			</Card>

			{/* 결제 금액 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						결제 정보
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span>상품금액</span>
							<span>{totalAmount.toLocaleString()}원</span>
						</div>
						<div className="flex justify-between">
							<span>배송비</span>
							<span>
								{shippingFee === 0 ? (
									<span className="text-green-600">무료</span>
								) : (
									`${shippingFee.toLocaleString()}원`
								)}
							</span>
						</div>
						<Separator />
						<div className="flex justify-between text-lg font-bold">
							<span>총 결제금액</span>
							<span>{(totalAmount + shippingFee).toLocaleString()}원</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 결제하기 버튼 */}
			<Button
				onClick={handleCreateOrder}
				disabled={
					!selectedAddressId || selectedItems.length === 0 || isCreating
				}
				className="w-full h-12 text-lg"
			>
				{isCreating ? (
					<>
						<Loader2 className="h-5 w-5 animate-spin mr-2" />
						주문 생성 중...
					</>
				) : (
					`${(totalAmount + shippingFee).toLocaleString()}원 결제하기`
				)}
			</Button>
		</div>
	);
}
