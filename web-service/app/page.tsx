"use client";

import { Gift, Heart, ShoppingCart, Star, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

// 임시 데이터
const featuredProducts = [
	{
		id: 1,
		name: "프리미엄 무선 이어폰",
		price: 129000,
		originalPrice: 159000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.8,
		reviews: 1234,
		badge: "베스트셀러",
		inStock: true,
	},
	{
		id: 2,
		name: "스마트 워치 프로",
		price: 299000,
		originalPrice: 349000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.9,
		reviews: 856,
		badge: "신상품",
		inStock: true,
	},
	{
		id: 3,
		name: "미니멀 백팩",
		price: 89000,
		originalPrice: 119000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.7,
		reviews: 432,
		badge: "25% 할인",
		inStock: true,
	},
	{
		id: 4,
		name: "블루투스 스피커",
		price: 79000,
		originalPrice: 99000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.6,
		reviews: 678,
		badge: "특가",
		inStock: true,
	},
];

const categories = [
	{ name: "패션", href: "/category/fashion", icon: "👕", color: "bg-pink-100" },
	{
		name: "전자제품",
		href: "/category/electronics",
		icon: "📱",
		color: "bg-blue-100",
	},
	{
		name: "홈&리빙",
		href: "/category/home",
		icon: "🏠",
		color: "bg-green-100",
	},
	{
		name: "뷰티",
		href: "/category/beauty",
		icon: "💄",
		color: "bg-purple-100",
	},
	{
		name: "스포츠",
		href: "/category/sports",
		icon: "⚽",
		color: "bg-orange-100",
	},
	{ name: "도서", href: "/category/books", icon: "📚", color: "bg-yellow-100" },
];

export default function HomePage() {
	return (
		<div className="space-y-12 py-8">
			{/* 히어로 섹션 */}
			<section className="text-center space-y-6">
				<div className="space-y-4">
					<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary/80 bg-clip-text text-transparent">
						ShopMall
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						최고의 상품을 합리적인 가격에 만나보세요
					</p>
				</div>
			</section>

			{/* 카테고리 */}
			<section className="space-y-6">
				<h2 className="text-2xl font-bold text-center">카테고리</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{categories.map((category, index) => (
						<Link key={category.name} href={category.href}>
							<AnimatedCard
								className="p-6 text-center cursor-pointer group"
								delay={index * 100}
							>
								<div
									className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform`}
								>
									{category.icon}
								</div>
								<h3 className="font-medium transition-colors">
									{category.name}
								</h3>
							</AnimatedCard>
						</Link>
					))}
				</div>
			</section>

			{/* 특징 */}
			<section className="grid md:grid-cols-3 gap-6">
				<AnimatedCard className="p-6 text-center" delay={0}>
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<TrendingUp className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-semibold mb-2">트렌디한 상품</h3>
					<p className="text-sm text-muted-foreground">
						최신 트렌드를 반영한 다양한 상품들을 만나보세요
					</p>
				</AnimatedCard>

				<AnimatedCard className="p-6 text-center" delay={100}>
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Zap className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-semibold mb-2">빠른 배송</h3>
					<p className="text-sm text-muted-foreground">
						전국 어디든 빠르고 안전한 배송 서비스를 제공합니다
					</p>
				</AnimatedCard>

				<AnimatedCard className="p-6 text-center" delay={200}>
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Gift className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-semibold mb-2">특별 혜택</h3>
					<p className="text-sm text-muted-foreground">
						회원만을 위한 특별한 할인과 이벤트를 놓치지 마세요
					</p>
				</AnimatedCard>
			</section>

			{/* 인기 상품 */}
			<section className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">인기 상품</h2>
					<Link href="/category/all">
						<Button variant="outline">전체 보기</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{featuredProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} index={index} />
					))}
				</div>
			</section>

			{/* CTA 섹션 */}
			<section className="text-center space-y-6 py-12 bg-muted/30 rounded-lg">
				<h2 className="text-3xl font-bold">지금 시작하세요!</h2>
				<p className="text-muted-foreground max-w-md mx-auto">
					ShopMall에서 최고의 쇼핑 경험을 만나보세요
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link href="/auth">
						<Button size="lg" className="w-full sm:w-auto">
							회원가입하기
						</Button>
					</Link>
					<Link href="/category/all">
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto bg-transparent"
						>
							상품 둘러보기
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}

// biome-ignore lint/suspicious/noExplicitAny: 임시
function ProductCard({ product, index }: { product: any; index: number }) {
	const [isWishlisted, setIsWishlisted] = useState(false);

	return (
		<Link href={`/product/${product.id}`}>
			<AnimatedCard className="group cursor-pointer" delay={index * 100}>
				<CardContent className="p-0">
					<div className="relative overflow-hidden rounded-t-lg">
						<Image
							src={product.image || "/placeholder.svg"}
							alt={product.name}
							width={300}
							height={300}
							className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						{product.badge && (
							<Badge className="absolute top-3 left-3">{product.badge}</Badge>
						)}
						<Button
							variant="secondary"
							size="icon"
							className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={(e) => {
								e.preventDefault();
								setIsWishlisted(!isWishlisted);
							}}
						>
							<Heart
								className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
							/>
						</Button>
					</div>
					<div className="p-4">
						<h3 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
							{product.name}
						</h3>
						<div className="flex items-center gap-1 mb-2">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="text-sm font-medium">{product.rating}</span>
							<span className="text-sm text-muted-foreground">
								({product.reviews})
							</span>
						</div>
						<div className="flex items-center gap-2 mb-3">
							<span className="text-lg font-bold">
								{product.price.toLocaleString()}원
							</span>
							{product.originalPrice > product.price && (
								<span className="text-sm text-muted-foreground line-through">
									{product.originalPrice.toLocaleString()}원
								</span>
							)}
						</div>
						<Button
							size="sm"
							className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={(e) => {
								e.preventDefault();
								// TODO: addItem
							}}
						>
							<ShoppingCart className="h-4 w-4 mr-2" />
							장바구니 담기
						</Button>
					</div>
				</CardContent>
			</AnimatedCard>
		</Link>
	);
}
