"use client";

import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateOrderForm } from "@/components/order/create-order-form";
import { PaymentModal } from "@/components/payment/payment-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/stores/cart-store";

export function CreateOrderPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { items } = useCart();

	const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [shippingFee, setShippingFee] = useState(0);

	useEffect(() => {
		const itemsParam = searchParams.get("items");
		if (!itemsParam) return;

		const selectedIds = itemsParam.split(",").filter((id) => id.trim());

		if (selectedIds.length === 0 || items.length === 0) {
			return;
		}

		// 선택된 아이템들만 필터링
		const selected = items.filter((item) =>
			selectedIds.includes(item.id.toString()),
		);

		if (selected.length === 0) {
			return;
		}

		// 총 금액 계산
		const total = selected.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);

		// 배송비 계산 (50000원 이상 무료배송)
		const shipping = total >= 50000 ? 0 : 3000;

		setSelectedItems(selected);
		setTotalAmount(total);
		setShippingFee(shipping);
	}, [searchParams, items]);

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<ShoppingCart className="h-12 w-12 text-muted-foreground" />
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold">장바구니가 비어있습니다</h2>
							<p className="text-muted-foreground">
								상품을 먼저 장바구니에 담아주세요.
							</p>
						</div>
						<Button onClick={() => router.push("/")}>쇼핑하러 가기</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (selectedItems.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<ShoppingCart className="h-12 w-12 text-muted-foreground" />
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold">선택된 상품이 없습니다</h2>
							<p className="text-muted-foreground">
								장바구니에서 주문할 상품을 선택해주세요.
							</p>
						</div>
						<Button onClick={() => router.push("/cart")}>
							장바구니로 이동
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.push("/cart")}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">주문하기</h1>
						<p className="text-muted-foreground">
							배송지와 결제 정보를 확인해주세요.
						</p>
					</div>
				</div>

				{/* Order Form */}
				<CreateOrderForm
					selectedItems={selectedItems}
					totalAmount={totalAmount}
					shippingFee={shippingFee}
				/>
			</div>

			{/* Payment Modal */}
			<PaymentModal />
		</div>
	);
}
