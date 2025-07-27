import { Suspense } from "react";
import { CheckoutPageContent } from "./checkout-content";

export default function CheckoutPage() {
	return (
		<Suspense
			fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}
		>
			<CheckoutPageContent />
		</Suspense>
	);
}
