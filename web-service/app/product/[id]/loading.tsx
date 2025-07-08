import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
	return (
		<div className="min-h-screen bg-background">
			{/* Breadcrumb Skeleton */}
			<div className="border-b">
				<div className="container px-4 py-4">
					<div className="flex items-center space-x-2">
						<Skeleton className="h-4 w-8" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-20" />
					</div>
				</div>
			</div>

			<div className="container px-4 py-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Image Skeleton */}
					<div className="space-y-4">
						<Skeleton className="aspect-square w-full rounded-lg" />
						<div className="grid grid-cols-4 gap-2">
							{[...Array(4)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: 임시
								<Skeleton key={i} className="aspect-square rounded-lg" />
							))}
						</div>
					</div>

					{/* Product Info Skeleton */}
					<div className="space-y-6">
						<div className="space-y-4">
							<Skeleton className="h-8 w-3/4" />
							<div className="flex items-center gap-4">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-16" />
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<Skeleton className="h-8 w-24" />
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-6 w-16" />
							</div>
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</div>

						{/* Options Skeleton */}
						<div className="space-y-4">
							<div className="space-y-2">
								<Skeleton className="h-4 w-16" />
								<div className="flex gap-2">
									{[...Array(3)].map((_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: 임시
										<Skeleton key={i} className="w-10 h-10 rounded-full" />
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Skeleton className="h-4 w-16" />
								<div className="flex gap-2">
									{[...Array(4)].map((_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: 임시
										<Skeleton key={i} className="h-8 w-12 rounded" />
									))}
								</div>
							</div>
						</div>

						{/* Buttons Skeleton */}
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
