import Link from "next/link";
import LucideIcon, {
	type LucideIconName,
} from "@/components/common/lucide-icon";
// Categories 컴포넌트 import 제거
import { ProductGrid } from "@/components/features/product";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sTrpc } from "@/server/server";

// 더미 프로모션 데이터
const promotions = [
	{
		id: 1,
		title: "신년 특가 세일",
		description: "모든 상품 최대 70% 할인",
		discount: "70%",
		endDate: "2024-01-31",
		bgColor: "bg-gradient-to-r from-red-500 to-pink-500",
		textColor: "text-white",
	},
	{
		id: 2,
		title: "무료배송 이벤트",
		description: "3만원 이상 구매시 무료배송",
		discount: "무료배송",
		endDate: "2024-02-15",
		bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
		textColor: "text-white",
	},
	{
		id: 3,
		title: "첫 구매 혜택",
		description: "신규 회원 15% 추가 할인",
		discount: "15%",
		endDate: "2024-12-31",
		bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
		textColor: "text-white",
	},
];

const features: {
	id: number;
	icon: LucideIconName;
	title: string;
	description: string;
}[] = [
	{
		id: 1,
		icon: "TrendingUp",
		title: "트렌디한 상품",
		description: "최신 트렌드를 반영한 다양한 상품들을 만나보세요",
	},
	{
		id: 2,
		icon: "Zap",
		title: "빠른 배송",
		description: "전국 어디든 빠르고 안전한 배송 서비스를 제공합니다",
	},
	{
		id: 3,
		icon: "Gift",
		title: "특별 혜택",
		description: "회원만을 위한 특별한 할인과 이벤트를 놓치지 마세요",
	},
];

// 섹션 헤더 컴포넌트
interface SectionHeaderProps {
	title: string;
	icon?: LucideIconName;
	iconColor?: string;
	badge?: {
		text: string;
		variant?: "outline" | "default" | "destructive" | "secondary";
		className?: string;
	};
	linkHref?: string;
	linkText?: string;
}

function SectionHeader({
	title,
	icon,
	iconColor,
	badge,
	linkHref,
	linkText = "전체 보기",
}: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				{icon && (
					<LucideIcon
						name={icon}
						className={`h-6 w-6 ${iconColor || "text-primary"}`}
					/>
				)}
				<h2 className="text-2xl font-bold">{title}</h2>
				{badge && (
					<Badge
						variant={badge.variant || "outline"}
						className={badge.className}
					>
						{badge.text}
					</Badge>
				)}
			</div>
			{linkHref && (
				<Link href={linkHref}>
					<Button variant="outline">{linkText}</Button>
				</Link>
			)}
		</div>
	);
}

export default async function HomePage() {
	// 서버에서 데이터 미리 fetch - 핫한 상품용 추가 데이터도 fetch
	const [productsData, hotProductsData] = await Promise.all([
		sTrpc.product.list
			.fetch({
				page: 1,
				limit: 8,
				isActive: true,
				sortBy: "createdAt",
				sortOrder: "desc",
			})
			.catch(() => ({
				products: [],
				pagination: { total: 0, page: 1, limit: 8, totalPages: 0 },
			})),
		sTrpc.product.list
			.fetch({
				page: 1,
				limit: 4,
				isActive: true,
				sortBy: "createdAt",
				sortOrder: "desc",
			})
			.catch(() => ({
				products: [],
				pagination: { total: 0, page: 1, limit: 4, totalPages: 0 },
			})),
	]);

	return (
		<div className="space-y-12 py-8">
			{/* 히어로 섹션 */}
			<section className="text-center space-y-6">
				<div className="space-y-4">
					<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary/80 bg-clip-text text-transparent">
						ShopMall
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						최고의 상품을 합리적인 가격에 만나보세요
					</p>
				</div>
			</section>

			{/* 프로모션 섹션 */}
			<section className="space-y-6">
				<h2 className="text-2xl font-bold text-center">특별 혜택</h2>
				<div className="grid md:grid-cols-3 gap-6">
					{promotions.map((promo, index) => (
						<AnimatedCard
							key={promo.id}
							className={`p-6 ${promo.bgColor} ${promo.textColor} relative overflow-hidden`}
							delay={index * 100}
						>
							<div className="relative z-10">
								<div className="flex items-center justify-between mb-4">
									<Badge
										variant="secondary"
										className="bg-white/20 text-white border-0"
									>
										{promo.discount} OFF
									</Badge>
									<LucideIcon name="Gift" className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-bold mb-2">{promo.title}</h3>
								<p className="text-sm opacity-90 mb-4">{promo.description}</p>
								<div className="flex items-center justify-between">
									<span className="text-xs opacity-75">
										~{promo.endDate}까지
									</span>
									<Button
										variant="secondary"
										size="sm"
										className="bg-white/20 hover:bg-white/30 text-white border-0"
									>
										자세히 보기
									</Button>
								</div>
							</div>
							<div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
						</AnimatedCard>
					))}
				</div>
			</section>

			{/* 오늘 핫한 상품 섹션 - 실제 데이터 연결 */}
			<section className="space-y-6">
				<SectionHeader
					title="오늘 핫한 상품"
					icon="TrendingUp"
					iconColor="text-orange-500"
					badge={{
						text: "실시간 인기",
						variant: "outline",
						className: "text-orange-500 border-orange-500",
					}}
					linkHref="/products"
				/>

				<ProductGrid products={hotProductsData.products} />
			</section>

			{/* 특징 */}
			<section className="grid md:grid-cols-3 gap-6">
				{features.map((feature) => (
					<AnimatedCard
						key={feature.id}
						className="p-6 text-center"
						delay={feature.id * 100}
					>
						<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<LucideIcon
								name={feature.icon}
								className="h-6 w-6 text-primary"
							/>
						</div>
						<h3 className="font-semibold mb-2">{feature.title}</h3>
						<p className="text-sm text-muted-foreground">
							{feature.description}
						</p>
					</AnimatedCard>
				))}
			</section>

			{/* 인기 상품 - 서버에서 미리 fetch한 데이터 사용 */}
			<section className="space-y-6">
				<SectionHeader
					title="인기 상품"
					icon="TrendingUp"
					iconColor="text-primary"
					linkHref="/products"
				/>

				<ProductGrid products={productsData.products} />
			</section>
		</div>
	);
}
