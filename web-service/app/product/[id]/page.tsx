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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// import { useCartStore } from "@/lib/stores"
import { CartSidebar } from "@/components/cart-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 임시 상품 데이터
const productData = {
	id: 1,
	name: "프리미엄 무선 이어폰 Pro Max",
	price: 129000,
	originalPrice: 159000,
	discount: 19,
	rating: 4.8,
	reviewCount: 1234,
	images: [
		"/placeholder.svg?height=600&width=600",
		"/placeholder.svg?height=600&width=600",
		"/placeholder.svg?height=600&width=600",
		"/placeholder.svg?height=600&width=600",
	],
	colors: [
		{ name: "블랙", value: "black", hex: "#000000" },
		{ name: "화이트", value: "white", hex: "#FFFFFF" },
		{ name: "실버", value: "silver", hex: "#C0C0C0" },
	],
	sizes: ["S", "M", "L", "XL"],
	stock: 15,
	description:
		"최신 노이즈 캔슬링 기술과 프리미엄 사운드 품질을 자랑하는 무선 이어폰입니다. 최대 30시간의 배터리 수명과 IPX7 방수 등급으로 어떤 환경에서도 완벽한 음악 경험을 제공합니다.",
	features: [
		"액티브 노이즈 캔슬링",
		"30시간 배터리 수명",
		"IPX7 방수 등급",
		"고해상도 오디오 지원",
		"터치 컨트롤",
		"무선 충전 지원",
	],
	specifications: {
		브랜드: "ShopMall",
		모델: "Pro Max",
		연결: "블루투스 5.3",
		배터리: "30시간 (케이스 포함)",
		방수등급: "IPX7",
		무게: "5.4g (이어폰 1개)",
	},
};

const reviews = [
	{
		id: 1,
		user: "김**",
		rating: 5,
		date: "2024.01.15",
		content:
			"음질이 정말 좋고 노이즈 캔슬링 기능이 뛰어납니다. 배터리도 오래가서 만족스러워요!",
		helpful: 24,
	},
	{
		id: 2,
		user: "이**",
		rating: 4,
		date: "2024.01.12",
		content:
			"디자인이 세련되고 착용감이 편안합니다. 가격 대비 성능이 우수해요.",
		helpful: 18,
	},
	{
		id: 3,
		user: "박**",
		rating: 5,
		date: "2024.01.10",
		content: "운동할 때 사용하는데 흘러내리지 않고 방수도 잘 됩니다. 추천!",
		helpful: 15,
	},
];

const relatedProducts = [
	{
		id: 2,
		name: "스마트 워치 프로",
		price: 299000,
		originalPrice: 349000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.9,
	},
	{
		id: 3,
		name: "미니멀 백팩",
		price: 89000,
		originalPrice: 119000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.7,
	},
	{
		id: 4,
		name: "블루투스 스피커",
		price: 79000,
		originalPrice: 99000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.6,
	},
	{
		id: 5,
		name: "무선 충전패드",
		price: 45000,
		originalPrice: 59000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.5,
	},
];

export default function ProductDetailPage() {
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
	const [selectedSize, setSelectedSize] = useState(productData.sizes[0]);
	const [quantity, setQuantity] = useState(1);
	const [isWishlisted, setIsWishlisted] = useState(false);

	const handleQuantityChange = (change: number) => {
		const newQuantity = quantity + change;
		if (newQuantity >= 1 && newQuantity <= productData.stock) {
			setQuantity(newQuantity);
		}
	};

	const ratingDistribution = [
		{ stars: 5, count: 856, percentage: 69 },
		{ stars: 4, count: 247, percentage: 20 },
		{ stars: 3, count: 86, percentage: 7 },
		{ stars: 2, count: 31, percentage: 3 },
		{ stars: 1, count: 14, percentage: 1 },
	];

	return (
		<div className="py-8">
			<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
				{/* Product Images */}
				<div className="space-y-4">
					<div className="relative aspect-square overflow-hidden rounded-lg border">
						<Image
							src={productData.images[selectedImage] || "/placeholder.svg"}
							alt={productData.name}
							fill
							className="object-cover"
						/>
						<Button
							variant="secondary"
							size="icon"
							className="absolute top-4 right-4"
							onClick={() => setIsWishlisted(!isWishlisted)}
						>
							<Heart
								className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
							/>
						</Button>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{productData.images.map((image, index) => (
							<button
								type="button"
								// biome-ignore lint/suspicious/noArrayIndexKey: 임시
								key={index}
								onClick={() => setSelectedImage(index)}
								className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
									selectedImage === index ? "border-primary" : "border-muted"
								}`}
							>
								<Image
									src={image || "/placeholder.svg"}
									alt={`${productData.name} ${index + 1}`}
									fill
									className="object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				{/* Product Info */}
				<div className="space-y-6">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold mb-2">
							{productData.name}
						</h1>
						<div className="flex items-center gap-4 mb-4">
							<div className="flex items-center gap-1">
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											// biome-ignore lint/suspicious/noArrayIndexKey: 임시
											key={i}
											className={`h-4 w-4 ${
												i < Math.floor(productData.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-muted-foreground"
											}`}
										/>
									))}
								</div>
								<span className="text-sm font-medium">
									{productData.rating}
								</span>
								<span className="text-sm text-muted-foreground">
									({productData.reviewCount}개 리뷰)
								</span>
							</div>
							<Button variant="ghost" size="sm">
								<Share2 className="h-4 w-4 mr-2" />
								공유
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<span className="text-3xl font-bold">
								{productData.price.toLocaleString()}원
							</span>
							<span className="text-lg text-muted-foreground line-through">
								{productData.originalPrice.toLocaleString()}원
							</span>
							<Badge variant="destructive">{productData.discount}% 할인</Badge>
						</div>
						<p className="text-muted-foreground">{productData.description}</p>
					</div>

					{/* Color Selection */}
					<div className="space-y-3">
						<h3 className="font-medium">색상: {selectedColor.name}</h3>
						<div className="flex gap-2">
							{productData.colors.map((color) => (
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

					{/* Size Selection */}
					<div className="space-y-3">
						<h3 className="font-medium">사이즈: {selectedSize}</h3>
						<div className="flex gap-2">
							{productData.sizes.map((size) => (
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
									disabled={quantity >= productData.stock}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<span className="text-sm text-muted-foreground">
								재고: {productData.stock}개
							</span>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button
							size="lg"
							className="w-full"
							onClick={() => {
								// useCartStore.getState().addItem({
								//   id: productData.id,
								//   name: productData.name,
								//   price: productData.price,
								//   originalPrice: productData.originalPrice,
								//   image: productData.images[0],
								//   brand: "ShopMall",
								//   selectedColor: selectedColor.name,
								//   selectedSize: selectedSize,
								//   inStock: productData.stock > 0,
								// })
								// useCartStore.getState().toggleCart()
							}}
						>
							<ShoppingCart className="mr-2 h-5 w-5" />
							장바구니 담기
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="w-full bg-transparent"
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
			</div>

			{/* Product Details Tabs */}
			<div className="mt-16">
				<Tabs defaultValue="description" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="description">상품상세</TabsTrigger>
						<TabsTrigger value="reviews">
							리뷰 ({productData.reviewCount})
						</TabsTrigger>
						<TabsTrigger value="specs">상품정보</TabsTrigger>
					</TabsList>

					<TabsContent value="description" className="mt-8">
						<Card>
							<CardContent className="p-8">
								<h3 className="text-xl font-bold mb-6">상품 특징</h3>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-medium mb-3">주요 기능</h4>
										<ul className="space-y-2">
											{productData.features.map((feature, index) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: 임시
												<li key={index} className="flex items-center gap-2">
													<div className="w-2 h-2 bg-primary rounded-full" />
													<span className="text-sm">{feature}</span>
												</li>
											))}
										</ul>
									</div>
									<div>
										<Image
											src="/placeholder.svg?height=300&width=400"
											alt="Product features"
											width={400}
											height={300}
											className="rounded-lg"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="reviews" className="mt-8">
						<div className="grid lg:grid-cols-3 gap-8">
							<Card>
								<CardContent className="p-6">
									<div className="text-center mb-6">
										<div className="text-4xl font-bold mb-2">
											{productData.rating}
										</div>
										<div className="flex justify-center mb-2">
											{[...Array(5)].map((_, i) => (
												<Star
													// biome-ignore lint/suspicious/noArrayIndexKey: 임시
													key={i}
													className={`h-5 w-5 ${
														i < Math.floor(productData.rating)
															? "fill-yellow-400 text-yellow-400"
															: "text-muted-foreground"
													}`}
												/>
											))}
										</div>
										<p className="text-sm text-muted-foreground">
											{productData.reviewCount}개 리뷰
										</p>
									</div>
									<div className="space-y-2">
										{ratingDistribution.map((item) => (
											<div
												key={item.stars}
												className="flex items-center gap-2 text-sm"
											>
												<span className="w-2">{item.stars}</span>
												<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
												<Progress
													value={item.percentage}
													className="flex-1 h-2"
												/>
												<span className="w-8 text-right">{item.count}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<div className="lg:col-span-2 space-y-4">
								{reviews.map((review) => (
									<Card key={review.id}>
										<CardContent className="p-6">
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center gap-3">
													<Avatar>
														<AvatarFallback>{review.user[0]}</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-medium">{review.user}</p>
														<div className="flex items-center gap-2">
															<div className="flex">
																{[...Array(5)].map((_, i) => (
																	<Star
																		// biome-ignore lint/suspicious/noArrayIndexKey: 임시
																		key={i}
																		className={`h-3 w-3 ${
																			i < review.rating
																				? "fill-yellow-400 text-yellow-400"
																				: "text-muted-foreground"
																		}`}
																	/>
																))}
															</div>
															<span className="text-sm text-muted-foreground">
																{review.date}
															</span>
														</div>
													</div>
												</div>
											</div>
											<p className="text-sm mb-4">{review.content}</p>
											<div className="flex items-center gap-2">
												<Button variant="ghost" size="sm">
													도움됨 ({review.helpful})
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</TabsContent>

					<TabsContent value="specs" className="mt-8">
						<Card>
							<CardContent className="p-8">
								<h3 className="text-xl font-bold mb-6">상품 정보</h3>
								<div className="grid gap-4">
									{Object.entries(productData.specifications).map(
										([key, value]) => (
											<div key={key} className="grid grid-cols-3 py-3 border-b">
												<span className="font-medium text-muted-foreground">
													{key}
												</span>
												<span className="col-span-2">{value}</span>
											</div>
										),
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			{/* Related Products */}
			<div className="mt-16">
				<h2 className="text-2xl font-bold mb-8">관련 상품</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{relatedProducts.map((product) => (
						<Link key={product.id} href={`/product/${product.id}`}>
							<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
								<CardContent className="p-0">
									<div className="relative overflow-hidden rounded-t-lg">
										<Image
											src={product.image || "/placeholder.svg"}
											alt={product.name}
											width={300}
											height={300}
											className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="p-4">
										<h3 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
											{product.name}
										</h3>
										<div className="flex items-center gap-1 mb-2">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="text-sm font-medium">
												{product.rating}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-lg font-bold">
												{product.price.toLocaleString()}원
											</span>
											<span className="text-sm text-muted-foreground line-through">
												{product.originalPrice.toLocaleString()}원
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
			<CartSidebar />
		</div>
	);
}
