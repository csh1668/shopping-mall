import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { sTrpc } from "@/server/server";

interface RelatedProductsProps {
	categoryId: string;
	currentProductId: string;
}

export async function RelatedProducts({
	categoryId,
	// biome-ignore lint/correctness/noUnusedFunctionParameters: 추후 사용 예정
	currentProductId,
}: RelatedProductsProps) {
	// TODO: 현재 상품 제외 기능 추가

	const relatedProducts = await sTrpc.product.list.fetch({
		page: 1,
		limit: 5,
		categoryId,
		isActive: true,
	});

	if (!relatedProducts || relatedProducts.products.length === 0) {
		return null;
	}

	return (
		<div className="mt-16">
			<h2 className="text-2xl font-bold mb-8">관련 상품</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{relatedProducts.products.map((product) => (
					<Link key={product.id} href={`/p/${product.slug}`}>
						<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
							<CardContent className="p-0">
								<div className="relative overflow-hidden rounded-t-lg">
									<Image
										src={product.previewImage || "/placeholder.svg"}
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
											{product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-lg font-bold">
											{product.price.toLocaleString()}원
										</span>
										{product.originalPrice &&
											product.originalPrice > product.price && (
												<span className="text-sm text-muted-foreground line-through">
													{product.originalPrice.toLocaleString()}원
												</span>
											)}
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
