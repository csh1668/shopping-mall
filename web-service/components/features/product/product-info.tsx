import type { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import type { AppRouter } from "@/server/router";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProductInfo = RouterOutput["product"]["getBySlug"];

interface ProductInfoProps {
	product: ProductInfo;
}

export function ProductInfo({ product }: ProductInfoProps) {
	return (
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
					{product.images.slice(0, 4).map((image) => (
						<div
							key={image}
							className="relative aspect-square overflow-hidden rounded-lg border-2 border-muted"
						>
							<Image
								src={image || "/placeholder.svg"}
								alt={`${product.name} ${image}`}
								fill
								className="object-cover"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
