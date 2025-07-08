import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/stores/order-store";

interface OrderStatusBadgeProps {
	status: Order["status"];
	className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
	const getStatusConfig = (status: Order["status"]) => {
		const configs = {
			pending: {
				label: "결제 대기",
				className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
			},
			paid: {
				label: "결제 완료",
				className: "bg-green-100 text-green-800 hover:bg-green-100",
			},
			preparing: {
				label: "상품 준비중",
				className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
			},
			shipped: {
				label: "배송중",
				className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
			},
			delivered: {
				label: "배송 완료",
				className: "bg-green-100 text-green-800 hover:bg-green-100",
			},
			cancelled: {
				label: "주문 취소",
				className: "bg-red-100 text-red-800 hover:bg-red-100",
			},
		};
		return configs[status];
	};

	const config = getStatusConfig(status);

	return (
		<Badge className={`${config.className} ${className}`}>{config.label}</Badge>
	);
}
