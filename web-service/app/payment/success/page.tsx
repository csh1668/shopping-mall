import { Suspense } from "react";
import { PaymentSuccess } from "@/components/payment/payment-success";

export default function PaymentSuccessPage() {
	return (
		<Suspense
			fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}
		>
			<PaymentSuccess />
		</Suspense>
	);
}
