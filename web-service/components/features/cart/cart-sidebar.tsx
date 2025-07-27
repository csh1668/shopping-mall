"use client";

import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";

export function CartSidebar() {
	const {
		items,
		isOpen,
		closeCart,
		updateQuantity,
		removeItem,
		getTotalPrice,
		getOriginalTotalPrice,
		getTotalItems,
	} = useCartStore();

	const totalPrice = getTotalPrice();
	const originalTotalPrice = getOriginalTotalPrice();
	const totalSavings = originalTotalPrice - totalPrice;

	return (
		<Sheet open={isOpen} onOpenChange={closeCart}>
			<SheetContent className="w-full sm:max-w-lg">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<LucideIcon name="ShoppingBag" className="h-5 w-5" />
						장바구니 ({getTotalItems()}개)
					</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col h-full">
					{items.length === 0 ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center">
								<LucideIcon
									name="ShoppingBag"
									className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
								/>
								<h3 className="text-lg font-medium mb-2">
									장바구니가 비어있습니다
								</h3>
								<p className="text-muted-foreground mb-4">
									원하는 상품을 담아보세요!
								</p>
								<Button onClick={closeCart}>쇼핑 계속하기</Button>
							</div>
						</div>
					) : (
						<>
							{/* Cart Items */}
							<div className="flex-1 overflow-y-auto py-4">
								<div className="space-y-4">
									{items.map((item) => (
										<div key={item.id} className="flex gap-4">
											<div className="relative w-16 h-16 flex-shrink-0">
												<Image
													src={
														item.image || "/placeholder.svg?height=64&width=64"
													}
													alt={item.name}
													fill
													className="object-cover rounded-lg"
												/>
											</div>

											<div className="flex-1 min-w-0">
												<h4 className="font-medium text-sm line-clamp-2">
													{item.name}
												</h4>
												<p className="text-xs text-muted-foreground">
													{item.brand}
												</p>

												<div className="flex items-center justify-between mt-2">
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">
															{item.price.toLocaleString()}원
														</span>
														{item.originalPrice &&
															item.originalPrice > item.price && (
																<span className="text-xs text-muted-foreground line-through">
																	{item.originalPrice.toLocaleString()}원
																</span>
															)}
													</div>

													<div className="flex items-center gap-1">
														<Button
															variant="outline"
															size="icon"
															className="h-6 w-6 bg-transparent"
															onClick={() =>
																updateQuantity(item.id, item.quantity - 1)
															}
														>
															<LucideIcon name="Minus" className="h-3 w-3" />
														</Button>
														<span className="w-8 text-center text-sm">
															{item.quantity}
														</span>
														<Button
															variant="outline"
															size="icon"
															className="h-6 w-6 bg-transparent"
															onClick={() =>
																updateQuantity(item.id, item.quantity + 1)
															}
														>
															<LucideIcon name="Plus" className="h-3 w-3" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6 ml-2"
															onClick={() => removeItem(item.id)}
														>
															<LucideIcon name="Trash2" className="h-3 w-3" />
														</Button>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Cart Summary */}
							<div className="py-4 space-y-4">
								<div className="space-y-2">
									{totalSavings > 0 && (
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">원래 가격</span>
											<span className="line-through text-muted-foreground">
												{originalTotalPrice.toLocaleString()}원
											</span>
										</div>
									)}
									{totalSavings > 0 && (
										<div className="flex justify-between text-sm">
											<span className="text-green-600">할인 금액</span>
											<span className="text-green-600 font-medium">
												-{totalSavings.toLocaleString()}원
											</span>
										</div>
									)}
									<div className="flex justify-between text-lg font-bold">
										<span>총 결제금액</span>
										<span>{totalPrice.toLocaleString()}원</span>
									</div>
								</div>

								<div className="space-y-2">
									<Link href="/cart" onClick={closeCart}>
										<Button variant="outline" className="w-full bg-transparent">
											장바구니 보기
										</Button>
									</Link>
								</div>
							</div>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
