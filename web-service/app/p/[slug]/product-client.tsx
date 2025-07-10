"use client";

import {
	Heart,
	Minus,
	Plus,
	RotateCcw,
	Share2,
	Shield,
	ShoppingCart,
	Star,
	Truck,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductClientProps {
	// biome-ignore lint/suspicious/noExplicitAny: 실제 타입은 tRPC에서 자동 생성됨
	product: any;
	discountRate: number;
}

export default function ProductClient({
	product,
	discountRate,
}: ProductClientProps) {
	const [quantity, setQuantity] = useState(1);
	const [isWishlisted, setIsWishlisted] = useState(false);

	// 임시 색상 및 사이즈 데이터 (실제로는 productVariants 사용)
	const colors = [
		{ name: "블랙", value: "black", hex: "#000000" },
		{ name: "화이트", value: "white", hex: "#FFFFFF" },
		{ name: "실버", value: "silver", hex: "#C0C0C0" },
	];
	const sizes = ["S", "M", "L", "XL"];

	const [selectedColor, setSelectedColor] = useState(colors[0]);
	const [selectedSize, setSelectedSize] = useState(sizes[0]);

	const handleQuantityChange = (change: number) => {
		const newQuantity = quantity + change;
		if (newQuantity >= 1 && newQuantity <= product.stock) {
			setQuantity(newQuantity);
		}
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: product.name,
					text: product.shortDescription || product.description,
					url: window.location.href,
				});
			} catch (error) {
				console.error("Error sharing:", error);
			}
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
				<div className="flex items-center gap-4 mb-4">
					<div className="flex items-center gap-1">
						<div className="flex">
							{[...Array(5)].map((i) => (
								<Star
									key={`rating-${product.id}-${i}`}
									className={`h-4 w-4 ${
										i < Math.floor(product.rating)
											? "fill-yellow-400 text-yellow-400"
											: "text-muted-foreground"
									}`}
								/>
							))}
						</div>
						<span className="text-sm font-medium">
							{product.rating.toFixed(1)}
						</span>
						<span className="text-sm text-muted-foreground">
							({product.reviewCount}개 리뷰)
						</span>
					</div>
					<Button variant="ghost" size="sm" onClick={handleShare}>
						<Share2 className="h-4 w-4 mr-2" />
						공유
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<span className="text-3xl font-bold">
						{product.price.toLocaleString()}원
					</span>
					{product.originalPrice > product.price && (
						<>
							<span className="text-lg text-muted-foreground line-through">
								{product.originalPrice.toLocaleString()}원
							</span>
							<Badge variant="destructive">{discountRate}% 할인</Badge>
						</>
					)}
				</div>
				{product.shortDescription && (
					<p className="text-muted-foreground">{product.shortDescription}</p>
				)}
			</div>

			{/* Variants - 실제로는 productVariants 데이터 사용 */}
			{product.productVariants.some(
				(v: { type: string }) => v.type === "COLOR",
			) && (
				<div className="space-y-3">
					<h3 className="font-medium">색상: {selectedColor.name}</h3>
					<div className="flex gap-2">
						{colors.map((color) => (
							<button
								type="button"
								key={color.value}
								onClick={() => setSelectedColor(color)}
								className={`w-10 h-10 rounded-full border-2 transition-colors ${
									selectedColor.value === color.value
										? "border-primary"
										: "border-muted"
								}`}
								style={{ backgroundColor: color.hex }}
								title={color.name}
							/>
						))}
					</div>
				</div>
			)}

			{product.productVariants.some(
				(v: { type: string }) => v.type === "SIZE",
			) && (
				<div className="space-y-3">
					<h3 className="font-medium">사이즈: {selectedSize}</h3>
					<div className="flex gap-2">
						{sizes.map((size) => (
							<Button
								key={size}
								variant={selectedSize === size ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedSize(size)}
							>
								{size}
							</Button>
						))}
					</div>
				</div>
			)}

			{/* Quantity */}
			<div className="space-y-3">
				<h3 className="font-medium">수량</h3>
				<div className="flex items-center gap-3">
					<div className="flex items-center border rounded-lg">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleQuantityChange(-1)}
							disabled={quantity <= 1}
						>
							<Minus className="h-4 w-4" />
						</Button>
						<span className="px-4 py-2 min-w-[3rem] text-center">
							{quantity}
						</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleQuantityChange(1)}
							disabled={quantity >= product.stock}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					<span className="text-sm text-muted-foreground">
						재고: {product.stock}개
					</span>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="space-y-3">
				<div className="flex gap-3">
					<Button
						size="lg"
						className="flex-1"
						disabled={product.stock === 0}
						onClick={() => {
							// TODO: 장바구니 추가 기능
						}}
					>
						<ShoppingCart className="mr-2 h-5 w-5" />
						장바구니 담기
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={() => setIsWishlisted(!isWishlisted)}
					>
						<Heart
							className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
						/>
					</Button>
				</div>
				<Button
					size="lg"
					variant="outline"
					className="w-full"
					disabled={product.stock === 0}
				>
					바로 구매하기
				</Button>
			</div>

			{/* Features */}
			<div className="grid grid-cols-3 gap-4 pt-6 border-t">
				<div className="text-center">
					<Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
					<p className="text-sm font-medium">무료배송</p>
					<p className="text-xs text-muted-foreground">5만원 이상</p>
				</div>
				<div className="text-center">
					<Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
					<p className="text-sm font-medium">품질보증</p>
					<p className="text-xs text-muted-foreground">1년 A/S</p>
				</div>
				<div className="text-center">
					<RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
					<p className="text-sm font-medium">무료반품</p>
					<p className="text-xs text-muted-foreground">7일 이내</p>
				</div>
			</div>
		</div>
	);
}
