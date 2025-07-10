"use client";

import Link from "next/link";
import { AnimatedCard } from "@/components/ui/animated-card";

// 카테고리별 아이콘과 색상 매핑
const categoryStyles: Record<string, { icon: string; color: string }> = {
	fashion: { icon: "👕", color: "bg-pink-100" },
	electronics: { icon: "📱", color: "bg-blue-100" },
	home: { icon: "🏠", color: "bg-green-100" },
	beauty: { icon: "💄", color: "bg-purple-100" },
	sports: { icon: "⚽", color: "bg-orange-100" },
	books: { icon: "📚", color: "bg-yellow-100" },
	default: { icon: "🛍️", color: "bg-gray-100" },
};

interface CategoriesProps {
	data: Array<{
		id: string;
		name: string;
		slug: string;
		description: string | null;
		isActive: boolean;
		productCount: number;
	}>;
}

export default function Categories({ data }: CategoriesProps) {
	if (!data || data.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
			{/* 전체 카테고리 */}
			<Link href="/c/all">
				<AnimatedCard className="p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
					<div className="text-center">
						<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
							<span className="text-2xl">🌟</span>
						</div>
						<h3 className="font-medium text-sm group-hover:text-primary transition-colors">
							전체
						</h3>
						<p className="text-xs text-muted-foreground mt-1">
							모든 상품
						</p>
					</div>
				</AnimatedCard>
			</Link>

			{/* 카테고리 목록 */}
			{data.map((category, index) => {
				const style = categoryStyles[category.slug] || categoryStyles.default;
				
				return (
					<Link key={category.id} href={`/c/${category.slug}`}>
						<AnimatedCard 
							className="p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
							delay={index * 50}
						>
							<div className="text-center">
								<div className={`w-16 h-16 ${style.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform`}>
									<span className="text-2xl">{style.icon}</span>
								</div>
								<h3 className="font-medium text-sm group-hover:text-primary transition-colors">
									{category.name}
								</h3>
								<p className="text-xs text-muted-foreground mt-1">
									{category.productCount}개 상품
								</p>
							</div>
						</AnimatedCard>
					</Link>
				);
			})}
		</div>
	);
} 