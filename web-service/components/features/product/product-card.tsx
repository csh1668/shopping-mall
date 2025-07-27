"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LucideIcon from "@/components/common/lucide-icon";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

interface ProductCardProps {
	// biome-ignore lint/suspicious/noExplicitAny: 실제 타입은 tRPC에서 자동 생성됨
	product: any;
	index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
	const [isWishlisted, setIsWishlisted] = useState(false);

	const discountRate = product.originalPrice
		? Math.round(
				((product.originalPrice - product.price) / product.originalPrice) * 100,
			)
		: 0;

	return (
		<AnimatedCard
			className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
			delay={index * 100}
		>
			<CardContent className="p-0">
				<div className="relative overflow-hidden rounded-t-lg">
					<Link href={`/p/${product.slug}`}>
						<Image
							src={product.previewImage || "/placeholder.svg"}
							alt={product.name}
							width={300}
							height={300}
							className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					</Link>

					{/* 할인 배지 */}
					{discountRate > 0 && (
						<Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
							{discountRate}% OFF
						</Badge>
					)}

					{/* 찜하기 버튼 */}
					<Button
						variant="ghost"
						size="sm"
						className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
						onClick={() => setIsWishlisted(!isWishlisted)}
					>
						<LucideIcon
							name="Heart"
							className={`h-4 w-4 ${
								isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
							}`}
						/>
					</Button>

					{/* 상품 상태 배지 */}
					<div className="absolute bottom-2 left-2 flex gap-1">
						{product.isFeatured && (
							<Badge variant="secondary" className="text-xs">
								<LucideIcon name="Star" className="h-3 w-3 mr-1" />
								추천
							</Badge>
						)}
						{product.isNew && (
							<Badge className="text-xs bg-green-500 hover:bg-green-600">
								<LucideIcon name="Zap" className="h-3 w-3 mr-1" />
								NEW
							</Badge>
						)}
						{product.isBestseller && (
							<Badge className="text-xs bg-orange-500 hover:bg-orange-600">
								<LucideIcon name="TrendingUp" className="h-3 w-3 mr-1" />
								베스트
							</Badge>
						)}
					</div>
				</div>

				<div className="p-4 space-y-3">
					<div className="space-y-1">
						<Link href={`/p/${product.slug}`}>
							<h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
								{product.name}
							</h3>
						</Link>
						<p className="text-xs text-muted-foreground">
							{product.category.name}
						</p>
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-bold text-lg">
									{product.price.toLocaleString()}원
								</span>
								{product.originalPrice &&
									product.originalPrice > product.price && (
										<span className="text-sm text-muted-foreground line-through">
											{product.originalPrice.toLocaleString()}원
										</span>
									)}
							</div>
							<div className="flex items-center gap-1">
								<div className="flex">
									{[...Array(5).keys()].map((starIndex) => (
										<LucideIcon
											key={`rating-${product.id}-${starIndex}`}
											name="Star"
											className={`h-3 w-3 ${
												starIndex < Math.floor(product.averageRating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="text-xs text-muted-foreground">
									({product.reviewCount})
								</span>
							</div>
						</div>
					</div>

					<Button className="w-full" size="sm">
						<LucideIcon name="ShoppingCart" className="h-4 w-4 mr-2" />
						장바구니
					</Button>
				</div>
			</CardContent>
		</AnimatedCard>
	);
}
