import { Suspense } from "react";
import { PaymentFail } from "@/components/payment/payment-fail";

export default function PaymentFailPage() {
	return (
		<Suspense
			fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}
		>
			<PaymentFail />
		</Suspense>
	);
}
