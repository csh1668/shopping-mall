"use client";

import { motion } from "framer-motion";
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

// 애니메이션 설정
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.98,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
	},
};

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
		<motion.div
			className="space-y-6"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			{/* 제품명과 별점 */}
			<motion.div variants={itemVariants}>
				<h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
				<div className="flex items-center gap-4 mb-4">
					<div className="flex items-center gap-1">
						<div className="flex">
							{[...Array(5).keys()].map((i) => (
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
			</motion.div>

			{/* 가격 정보 */}
			<motion.div className="space-y-2" variants={itemVariants}>
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
			</motion.div>

			{/* 색상 선택 */}
			{product.productVariants.some(
				(v: { type: string }) => v.type === "COLOR",
			) && (
				<motion.div className="space-y-3" variants={itemVariants}>
					<h3 className="font-medium">색상: {selectedColor.name}</h3>
					<div className="flex gap-2">
						{colors.map((color, index) => (
							<motion.button
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
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								initial={{ scale: 0, opacity: 0 }}
								animate={{
									scale: 1,
									opacity: 1,
									transition: { delay: 0.6 + index * 0.1 },
								}}
							/>
						))}
					</div>
				</motion.div>
			)}

			{/* 사이즈 선택 */}
			{product.productVariants.some(
				(v: { type: string }) => v.type === "SIZE",
			) && (
				<motion.div className="space-y-3" variants={itemVariants}>
					<h3 className="font-medium">사이즈: {selectedSize}</h3>
					<div className="flex gap-2">
						{sizes.map((size, index) => (
							<motion.div
								key={size}
								initial={{ scale: 0, opacity: 0 }}
								animate={{
									scale: 1,
									opacity: 1,
									transition: { delay: 0.8 + index * 0.1 },
								}}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant={selectedSize === size ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedSize(size)}
								>
									{size}
								</Button>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* 수량 선택 */}
			<motion.div className="space-y-3" variants={itemVariants}>
				<h3 className="font-medium">수량</h3>
				<div className="flex items-center gap-3">
					<motion.div
						className="flex items-center border rounded-lg"
						whileHover={{ scale: 1.02 }}
					>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleQuantityChange(-1)}
							disabled={quantity <= 1}
						>
							<Minus className="h-4 w-4" />
						</Button>
						<motion.span
							className="px-4 py-2 min-w-[3rem] text-center"
							key={quantity}
							initial={{ scale: 1.2 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.2 }}
						>
							{quantity}
						</motion.span>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleQuantityChange(1)}
							disabled={quantity >= product.stock}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</motion.div>
					<span className="text-sm text-muted-foreground">
						재고: {product.stock}개
					</span>
				</div>
			</motion.div>

			{/* 액션 버튼들 */}
			<motion.div className="space-y-3" variants={itemVariants}>
				<div className="flex gap-3">
					<motion.div
						className="flex-1"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<Button
							size="lg"
							className="w-full"
							disabled={product.stock === 0}
							onClick={() => {
								// TODO: 장바구니 추가 기능
							}}
						>
							<ShoppingCart className="mr-2 h-5 w-5" />
							장바구니 담기
						</Button>
					</motion.div>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Button
							variant="secondary"
							size="icon"
							onClick={() => setIsWishlisted(!isWishlisted)}
						>
							<Heart
								className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
							/>
						</Button>
					</motion.div>
				</div>
				<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
					<Button
						size="lg"
						variant="outline"
						className="w-full"
						disabled={product.stock === 0}
					>
						바로 구매하기
					</Button>
				</motion.div>
			</motion.div>

			{/* 기능 안내 */}
			<motion.div
				className="grid grid-cols-3 gap-4 pt-6 border-t"
				variants={itemVariants}
			>
				{[
					{ icon: Truck, title: "무료배송", desc: "5만원 이상" },
					{ icon: Shield, title: "품질보증", desc: "1년 A/S" },
					{ icon: RotateCcw, title: "무료반품", desc: "7일 이내" },
				].map((feature, index) => (
					<motion.div
						key={feature.title}
						className="text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.2 + index * 0.1 }}
						whileHover={{ scale: 1.05, y: -2 }}
					>
						<feature.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
						<p className="text-sm font-medium">{feature.title}</p>
						<p className="text-xs text-muted-foreground">{feature.desc}</p>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
}
