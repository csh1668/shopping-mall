import type { inferRouterOutputs } from "@trpc/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	ProductClient,
	ProductDetail,
	ProductInfo,
	RelatedProducts,
	RelatedProductsSkeleton,
} from "@/components/features/product";
import type { AppRouter } from "@/server/router";
import { sTrpc } from "@/server/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProductGetBySlug = RouterOutput["product"]["getBySlug"];

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

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	try {
		const product = await sTrpc.product.getBySlug.fetch({ slug });
		return {
			title: `${product.name} - ShopMall`,
			description: product.description,
			openGraph: {
				title: `${product.name} - ShopMall`,
				description: product.description,
				images: [product.previewImage || "/placeholder.svg"],
				type: "website",
				other: {
					"product:price:amount": product.price,
					"product:price:currency": "KRW",
				},
			},
			twitter: {
				card: "summary_large_image",
				title: `${product.name} - ShopMall`,
				description: product.description,
				images: [product.previewImage || "/placeholder.svg"],
			},
		};
	} catch (_error) {
		return {
			title: "ShopMall",
			description: "상품을 찾을 수 없습니다.",
		};
	}
}

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	let product: ProductGetBySlug;

	try {
		product = await sTrpc.product.getBySlug.fetch({ slug });
	} catch (_error) {
		notFound();
	}

	return (
		<div className="container px-4 py-8">
			<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
				<ProductInfo product={product} />
				<ProductClient product={product} />
			</div>
			<ProductDetail product={product} />

			<Suspense fallback={<RelatedProductsSkeleton />}>
				<RelatedProducts
					categoryId={product.categoryId}
					currentProductId={product.id}
				/>
			</Suspense>
		</div>
	);
}
