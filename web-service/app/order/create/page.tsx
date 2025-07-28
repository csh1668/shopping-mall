import { Suspense } from "react";
import { CreateOrderPageContent } from "./create-order-content";

export default function CreateOrderPage() {
	return (
		<Suspense
			fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}
		>
			<CreateOrderPageContent />
		</Suspense>
	);
}
