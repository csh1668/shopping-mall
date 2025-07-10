import Image from "next/image";
import { notFound } from "next/navigation";
import { vTrpc } from "@/server/client";
import { sTrpc } from "@/server/server";
import ProductClient from "./product-client"
import RelatedProducts from "./related-products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export async function generateStaticParams() {
	const products = await sTrpc.product.list.fetch({
		page: 1,
		limit: 100,
		isActive: true,
	});

	return products.products.map((product) => ({
		slug: product.slug,
	}));
}

export default async function ProductDetailPage({ 
	params 
}: { 
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params;
	let product;
	
	try {
		product = await sTrpc.product.getBySlug.fetch({ slug });
	} catch (error) {
		notFound();
	}

	// 할인율 계산
	const discountRate = product.originalPrice
		? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
		: 0;

	// 평점 분포 (실제 데이터가 없으므로 임시)
	const ratingDistribution = [
		{ stars: 5, count: Math.floor(product.reviewCount * 0.69), percentage: 69 },
		{ stars: 4, count: Math.floor(product.reviewCount * 0.20), percentage: 20 },
		{ stars: 3, count: Math.floor(product.reviewCount * 0.07), percentage: 7 },
		{ stars: 2, count: Math.floor(product.reviewCount * 0.03), percentage: 3 },
		{ stars: 1, count: Math.floor(product.reviewCount * 0.01), percentage: 1 },
	];

	return (
		<div className="container px-4 py-8">
			<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
				{/* Product Images */}
				<div className="space-y-4">
					<div className="relative aspect-square overflow-hidden rounded-lg border">
						<Image
							src={product.previewImage || "/placeholder.svg"}
							alt={product.name}
							fill
							className="object-cover"
							priority
						/>
					</div>
					{product.images.length > 0 && (
						<div className="grid grid-cols-4 gap-2">
							{product.images.slice(0, 4).map((image, index) => (
								<div
									key={index}
									className="relative aspect-square overflow-hidden rounded-lg border-2 border-muted"
								>
									<Image
										src={image || "/placeholder.svg"}
										alt={`${product.name} ${index + 1}`}
										fill
										className="object-cover"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Product Info - Client Component */}
				<ProductClient 
					product={product} 
					discountRate={discountRate}
				/>
			</div>

			{/* Product Details Tabs */}
			<div className="mt-16">
				<Tabs defaultValue="description" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="description">상품상세</TabsTrigger>
						<TabsTrigger value="reviews">
							리뷰 ({product.reviewCount})
						</TabsTrigger>
						<TabsTrigger value="specs">상품정보</TabsTrigger>
					</TabsList>

					<TabsContent value="description" className="mt-8">
						<Card>
							<CardContent className="p-8">
								<h3 className="text-xl font-bold mb-6">상품 설명</h3>
								<p className="whitespace-pre-wrap">{product.description}</p>
								
								{product.tags.length > 0 && (
									<div className="mt-6">
										<h4 className="font-medium mb-3">태그</h4>
										<div className="flex flex-wrap gap-2">
											{product.tags.map((tag) => (
												<Badge key={tag} variant="secondary">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="reviews" className="mt-8">
						<Card>
							<CardContent className="p-8">
								<div className="flex items-center justify-between mb-8">
									<div>
										<h3 className="text-xl font-bold mb-2">고객 리뷰</h3>
										<div className="flex items-center gap-2">
											<div className="flex">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-5 w-5 ${
															i < Math.floor(product.rating)
																? "fill-yellow-400 text-yellow-400"
																: "text-muted-foreground"
														}`}
													/>
												))}
											</div>
											<span className="text-lg font-medium">
												{product.rating.toFixed(1)}
											</span>
											<span className="text-muted-foreground">
												({product.reviewCount}개 리뷰)
											</span>
										</div>
									</div>
								</div>

								{/* 리뷰 목록 */}
								{product.reviews.length > 0 ? (
									<div className="space-y-6">
										{product.reviews.map((review) => (
											<div key={review.id} className="border-t pt-6">
												<div className="flex items-start justify-between mb-4">
													<div className="flex items-center gap-3">
														<Avatar className="h-10 w-10">
															<AvatarFallback>
																{review.user.fullName?.[0] || "U"}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">
																{review.user.fullName || "익명"}
															</p>
															<p className="text-sm text-muted-foreground">
																{new Date(review.createdAt).toLocaleDateString()}
															</p>
														</div>
													</div>
													<div className="flex">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-4 w-4 ${
																	i < review.rating
																		? "fill-yellow-400 text-yellow-400"
																		: "text-muted-foreground"
																}`}
															/>
														))}
													</div>
												</div>
												{review.title && (
													<h4 className="font-medium mb-2">{review.title}</h4>
												)}
												<p className="text-muted-foreground">{review.content}</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-center text-muted-foreground py-8">
										아직 리뷰가 없습니다.
									</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="specs" className="mt-8">
						<Card>
							<CardContent className="p-8">
								<h3 className="text-xl font-bold mb-6">상품 정보</h3>
								<div className="grid gap-4">
									<div className="grid grid-cols-3 py-3 border-b">
										<span className="font-medium text-muted-foreground">
											브랜드
										</span>
										<span className="col-span-2">{product.brand}</span>
									</div>
									{product.sku && (
										<div className="grid grid-cols-3 py-3 border-b">
											<span className="font-medium text-muted-foreground">
												상품코드
											</span>
											<span className="col-span-2">{product.sku}</span>
										</div>
									)}
									{product.weight && (
										<div className="grid grid-cols-3 py-3 border-b">
											<span className="font-medium text-muted-foreground">
												무게
											</span>
											<span className="col-span-2">{product.weight}g</span>
										</div>
									)}
									{product.dimensions && (
										<div className="grid grid-cols-3 py-3 border-b">
											<span className="font-medium text-muted-foreground">
												크기
											</span>
											<span className="col-span-2">{product.dimensions}</span>
										</div>
									)}
									<div className="grid grid-cols-3 py-3 border-b">
										<span className="font-medium text-muted-foreground">
											카테고리
										</span>
										<span className="col-span-2">{product.category.name}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			{/* Related Products */}
			<RelatedProducts 
				categoryId={product.categoryId} 
				currentProductId={product.id} 
			/>
		</div>
	);
}
