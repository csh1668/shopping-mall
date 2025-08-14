"use client";

import type { inferRouterOutputs } from "@trpc/server";
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
import { useCart } from "@/hooks/use-cart";
import type { AppRouter } from "@/server/router";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProductInfo = RouterOutput["product"]["getBySlug"];

interface ProductClientProps {
	product: ProductInfo;
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

export function ProductClient({ product }: ProductClientProps) {
	// 할인율 계산
	const discountRate = product.originalPrice
		? Math.round(
				((product.originalPrice - product.price) / product.originalPrice) * 100,
			)
		: 0;
	const [quantity, setQuantity] = useState(1);
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { addItem } = useCart();

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
					{product.originalPrice && product.originalPrice > product.price && (
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
			{/* TODO: productVariants 추가 후 수정 */}

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
								addItem({
									id: product.id,
									name: product.name,
									price: product.price,
									originalPrice: product.originalPrice || product.price,
									image: product.images[0],
									brand: product.brand,
									inStock: product.stock > 0,
								});
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
