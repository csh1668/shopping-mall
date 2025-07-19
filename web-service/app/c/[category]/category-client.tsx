"use client";

import {
	Filter,
	Grid3X3,
	Heart,
	List,
	Search,
	SlidersHorizontal,
	Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

interface CategoryClientProps {
	category: string;
	categoryName: string;
	// biome-ignore lint/suspicious/noExplicitAny: 실제 타입은 tRPC에서 자동 생성됨
	products: any[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	brands: string[];
	initialFilters: {
		search?: string;
		minPrice?: number;
		maxPrice?: number;
		sort?: string;
	};
}

const sortOptions = [
	{ value: "createdAt", label: "최신순" },
	{ value: "price", label: "낮은 가격순" },
	{ value: "price-high", label: "높은 가격순" },
	{ value: "rating", label: "평점순" },
];

export default function CategoryClient({
	category,
	categoryName,
	products,
	pagination,
	brands,
	initialFilters,
}: CategoryClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [priceRange, setPriceRange] = useState([
		initialFilters.minPrice || 0,
		initialFilters.maxPrice || 500000,
	]);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");

	// biome-ignore lint/suspicious/noExplicitAny: 실제 타입은 tRPC에서 자동 생성됨
	const updateFilters = (updates: Record<string, any>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (value === undefined || value === "" || value === null) {
				params.delete(key);
			} else {
				params.set(key, String(value));
			}
		});

		// 필터 변경 시 첫 페이지로
		params.delete("page");

		router.push(`/c/${category}?${params.toString()}`);
	};

	const handleBrandChange = (brand: string, checked: boolean) => {
		const newBrands = checked
			? [...selectedBrands, brand]
			: selectedBrands.filter((b) => b !== brand);

		setSelectedBrands(newBrands);
		updateFilters({ brands: newBrands.join(",") });
	};

	const clearFilters = () => {
		setPriceRange([0, 500000]);
		setSelectedBrands([]);
		setSearchQuery("");
		router.push(`/c/${category}`);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateFilters({ search: searchQuery });
	};

	const FilterContent = () => (
		<div className="space-y-6">
			{/* 검색 */}
			<div>
				<h3 className="font-medium mb-4">상품 검색</h3>
				<form onSubmit={handleSearch} className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="상품명, 브랜드 검색..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</form>
			</div>

			<Separator />

			{/* 가격 필터 */}
			<div>
				<h3 className="font-medium mb-4">가격</h3>
				<div className="space-y-4">
					<Slider
						value={priceRange}
						onValueChange={setPriceRange}
						onValueCommit={(value) => {
							updateFilters({ minPrice: value[0], maxPrice: value[1] });
						}}
						max={500000}
						step={10000}
						className="w-full"
					/>
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<span>{priceRange[0].toLocaleString()}원</span>
						<span>{priceRange[1].toLocaleString()}원</span>
					</div>
				</div>
			</div>

			<Separator />

			{/* 브랜드 필터 */}
			<div>
				<h3 className="font-medium mb-4">브랜드</h3>
				<div className="space-y-3 max-h-48 overflow-y-auto">
					{brands.map((brand) => (
						<div key={brand} className="flex items-center space-x-2">
							<Checkbox
								id={brand}
								checked={selectedBrands.includes(brand)}
								onCheckedChange={(checked) =>
									handleBrandChange(brand, checked as boolean)
								}
							/>
							<Label htmlFor={brand} className="text-sm cursor-pointer">
								{brand}
							</Label>
						</div>
					))}
				</div>
			</div>

			<Button variant="outline" onClick={clearFilters} className="w-full">
				필터 초기화
			</Button>
		</div>
	);

	return (
		<div className="flex gap-8">
			{/* Desktop Filters */}
			<div className="hidden lg:block w-64 flex-shrink-0">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-semibold">필터</h2>
							<Filter className="h-4 w-4" />
						</div>
						<FilterContent />
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<div className="flex-1">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold mb-2">{categoryName}</h1>
						<p className="text-muted-foreground">{pagination.total}개 상품</p>
					</div>

					<div className="flex items-center gap-4">
						{/* Mobile Filter Button */}
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" size="sm" className="lg:hidden">
									<SlidersHorizontal className="h-4 w-4 mr-2" />
									필터
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-80">
								<SheetHeader>
									<SheetTitle>필터</SheetTitle>
								</SheetHeader>
								<div className="mt-6">
									<FilterContent />
								</div>
							</SheetContent>
						</Sheet>

						{/* Sort */}
						<Select
							value={initialFilters.sort || "createdAt"}
							onValueChange={(value) => updateFilters({ sort: value })}
						>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* View Mode */}
						<div className="hidden sm:flex border rounded-lg">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Products Grid/List */}
				{products.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-muted-foreground mb-4">
							조건에 맞는 상품이 없습니다.
						</p>
						<Button onClick={clearFilters}>필터 초기화</Button>
					</div>
				) : (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
								: "space-y-4"
						}
					>
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								viewMode={viewMode}
							/>
						))}
					</div>
				)}

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className="flex justify-center mt-12">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={pagination.page === 1}
								onClick={() => updateFilters({ page: pagination.page - 1 })}
							>
								이전
							</Button>

							{[...Array(Math.min(5, pagination.totalPages)).keys()].map(
								(_, i) => {
									const pageNum = i + 1;
									return (
										<Button
											key={pageNum}
											variant={
												pageNum === pagination.page ? "default" : "outline"
											}
											size="sm"
											onClick={() => updateFilters({ page: pageNum })}
										>
											{pageNum}
										</Button>
									);
								},
							)}

							<Button
								variant="outline"
								size="sm"
								disabled={pagination.page === pagination.totalPages}
								onClick={() => updateFilters({ page: pagination.page + 1 })}
							>
								다음
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function ProductCard({
	product,
	viewMode,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: 실제 타입은 tRPC에서 자동 생성됨
	product: any;
	viewMode: "grid" | "list";
}) {
	const [isWishlisted, setIsWishlisted] = useState(false);

	// 할인율 계산
	const discountRate = product.originalPrice
		? Math.round(
				((product.originalPrice - product.price) / product.originalPrice) * 100,
			)
		: 0;

	if (viewMode === "list") {
		return (
			<Card className="group hover:shadow-lg transition-all duration-300">
				<CardContent className="p-0">
					<div className="flex gap-4 p-4">
						<div className="relative w-32 h-32 flex-shrink-0">
							<Image
								src={product.previewImage || "/placeholder.svg"}
								alt={product.name}
								fill
								className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
							/>
							{discountRate > 0 && (
								<Badge className="absolute top-2 left-2 text-xs">
									{discountRate}% 할인
								</Badge>
							)}
							{product.stock === 0 && (
								<div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
									<span className="text-white text-sm font-medium">품절</span>
								</div>
							)}
						</div>
						<div className="flex-1 space-y-2">
							<div className="flex items-start justify-between">
								<div>
									<Link href={`/p/${product.slug}`}>
										<h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
											{product.name}
										</h3>
									</Link>
									<p className="text-sm text-muted-foreground">
										{product.brand}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsWishlisted(!isWishlisted)}
								>
									<Heart
										className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
									/>
								</Button>
							</div>
							<div className="flex items-center gap-1">
								<div className="flex">
									{[...Array(5).keys()].map((i) => (
										<Star
											key={`rating-${product.id}-${i}`}
											className={`h-3 w-3 ${
												i < Math.floor(product.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-muted-foreground"
											}`}
										/>
									))}
								</div>
								<span className="text-sm font-medium">
									{product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
								</span>
								<span className="text-sm text-muted-foreground">
									({product.reviewCount || 0})
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-lg font-bold">
									{product.price.toLocaleString()}원
								</span>
								{product.originalPrice > product.price && (
									<span className="text-sm text-muted-foreground line-through">
										{product.originalPrice.toLocaleString()}원
									</span>
								)}
							</div>
							<div className="flex gap-2 pt-2">
								<Button
									size="sm"
									disabled={product.stock === 0}
									onClick={(e) => {
										e.preventDefault();
										// TODO: 장바구니 추가
									}}
								>
									장바구니
								</Button>
								<Button
									size="sm"
									variant="outline"
									disabled={product.stock === 0}
								>
									바로구매
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Link href={`/p/${product.slug}`}>
			<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
				<CardContent className="p-0">
					<div className="relative overflow-hidden rounded-t-lg">
						<Image
							src={product.previewImage || "/placeholder.svg"}
							alt={product.name}
							width={300}
							height={300}
							className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						{discountRate > 0 && (
							<Badge className="absolute top-3 left-3">
								{discountRate}% 할인
							</Badge>
						)}
						<Button
							variant="secondary"
							size="icon"
							className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={(e) => {
								e.preventDefault();
								setIsWishlisted(!isWishlisted);
							}}
						>
							<Heart
								className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
							/>
						</Button>
						{product.stock === 0 && (
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
								<span className="text-white font-medium">품절</span>
							</div>
						)}
					</div>
					<div className="p-4">
						<p className="text-xs text-muted-foreground mb-1">
							{product.brand}
						</p>
						<h3 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
							{product.name}
						</h3>
						<div className="flex items-center gap-1 mb-2">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="text-sm font-medium">
								{product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
							</span>
							<span className="text-sm text-muted-foreground">
								({product.reviewCount || 0})
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-lg font-bold">
								{product.price.toLocaleString()}원
							</span>
							{product.originalPrice > product.price && (
								<span className="text-sm text-muted-foreground line-through">
									{product.originalPrice.toLocaleString()}원
								</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
