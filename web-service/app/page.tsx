import { Gift, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { sTrpc } from "@/server/server";
import Products from "@/app/components/Products";
import Categories from "@/app/components/Categories";

export default async function HomePage() {
	// 서버에서 데이터 미리 fetch - 병렬 처리로 성능 최적화
	const [productsData, categoriesData] = await Promise.all([
		sTrpc.product.list.fetch({
			page: 1,
			limit: 8,
			isActive: true,
			sortBy: "createdAt",
			sortOrder: "desc",
		}).catch(() => ({ 
			products: [], 
			pagination: { total: 0, page: 1, limit: 8, totalPages: 0 } 
		})),
		sTrpc.category.list.fetch({
			isActive: true,
		}).catch(() => []),
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

			{/* 카테고리 - 서버에서 미리 fetch한 데이터 사용 */}
			<section className="space-y-6">
				<h2 className="text-2xl font-bold text-center">카테고리</h2>
				<Categories data={categoriesData} />
			</section>

			{/* 특징 */}
			<section className="grid md:grid-cols-3 gap-6">
				<AnimatedCard className="p-6 text-center" delay={0}>
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<TrendingUp className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-semibold mb-2">트렌디한 상품</h3>
					<p className="text-sm text-muted-foreground">
						최신 트렌드를 반영한 다양한 상품들을 만나보세요
					</p>
				</AnimatedCard>

				<AnimatedCard className="p-6 text-center" delay={100}>
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Zap className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-semibold mb-2">빠른 배송</h3>
					<p className="text-sm text-muted-foreground">
						전국 어디든 빠르고 안전한 배송 서비스를 제공합니다
					</p>
				</AnimatedCard>

				<AnimatedCard className="p-6 text-center" delay={200}>
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Gift className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-semibold mb-2">특별 혜택</h3>
					<p className="text-sm text-muted-foreground">
						회원만을 위한 특별한 할인과 이벤트를 놓치지 마세요
					</p>
				</AnimatedCard>
			</section>

			{/* 인기 상품 - 서버에서 미리 fetch한 데이터 사용 */}
			<section className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">인기 상품</h2>
					<Link href="/products">
						<Button variant="outline">전체 보기</Button>
					</Link>
				</div>

				<Products data={productsData} />
			</section>

			<section className="text-center space-y-6 py-12 bg-muted/30 rounded-lg">
				<h2 className="text-3xl font-bold">지금 시작하세요!</h2>
				<p className="text-muted-foreground max-w-md mx-auto">
					ShopMall에서 최고의 쇼핑 경험을 만나보세요
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link href="/auth">
						<Button size="lg" className="w-full sm:w-auto">
							회원가입하기
						</Button>
					</Link>
					<Link href="/products">
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto bg-transparent"
						>
							상품 둘러보기
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
