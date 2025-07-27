"use client";
import { ProductCard } from "./product-card";

interface ProductGridProps {
	data: {
		// TODO: 타입 올바르게
		// biome-ignore lint/suspicious/noExplicitAny: 실제 타입은 tRPC에서 자동 생성됨
		products: any[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	};
}

export function ProductGrid({ data }: ProductGridProps) {
	if (!data || data.products.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">아직 등록된 상품이 없습니다.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{data.products.map((product, index) => (
				<ProductCard key={product.id} product={product} index={index} />
			))}
		</div>
	);
}
