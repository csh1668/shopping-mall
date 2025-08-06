export function RelatedProductsSkeleton() {
	return (
		<div className="mt-16 animate-pulse">
			<div className="h-8 bg-muted rounded mb-6" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[...Array(4).keys()].map((i) => (
					<div key={i} className="space-y-4">
						<div className="aspect-square bg-muted rounded-lg" />
						<div className="h-4 bg-muted rounded" />
						<div className="h-4 bg-muted rounded w-3/4" />
					</div>
				))}
			</div>
		</div>
	);
}
