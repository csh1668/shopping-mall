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
import type React from "react";
import { useMemo, useState } from "react";
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

// import { useCartStore } from "@/lib/stores"

// 카테고리 매핑
const categoryNames: Record<string, string> = {
	fashion: "패션",
	electronics: "전자제품",
	home: "홈&리빙",
	beauty: "뷰티",
	sports: "스포츠",
	books: "도서",
};

// 임시 상품 데이터
const allProducts = [
	{
		id: 1,
		name: "프리미엄 무선 이어폰",
		price: 129000,
		originalPrice: 159000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.8,
		reviews: 1234,
		brand: "TechPro",
		category: "electronics",
		badge: "베스트셀러",
		inStock: true,
	},
	{
		id: 2,
		name: "스마트 워치 프로",
		price: 299000,
		originalPrice: 349000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.9,
		reviews: 856,
		brand: "SmartTech",
		category: "electronics",
		badge: "신상품",
		inStock: true,
	},
	{
		id: 3,
		name: "미니멀 백팩",
		price: 89000,
		originalPrice: 119000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.7,
		reviews: 432,
		brand: "UrbanStyle",
		category: "fashion",
		badge: "25% 할인",
		inStock: true,
	},
	{
		id: 4,
		name: "블루투스 스피커",
		price: 79000,
		originalPrice: 99000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.6,
		reviews: 678,
		brand: "SoundMax",
		category: "electronics",
		badge: "특가",
		inStock: false,
	},
	{
		id: 5,
		name: "캐주얼 티셔츠",
		price: 29000,
		originalPrice: 39000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.4,
		reviews: 234,
		brand: "ComfortWear",
		category: "fashion",
		badge: "",
		inStock: true,
	},
	{
		id: 6,
		name: "스킨케어 세트",
		price: 89000,
		originalPrice: 120000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.7,
		reviews: 567,
		brand: "GlowBeauty",
		category: "beauty",
		badge: "인기",
		inStock: true,
	},
	{
		id: 7,
		name: "요가 매트",
		price: 45000,
		originalPrice: 60000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.5,
		reviews: 189,
		brand: "FitLife",
		category: "sports",
		badge: "",
		inStock: true,
	},
	{
		id: 8,
		name: "프로그래밍 도서",
		price: 35000,
		originalPrice: 40000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.8,
		reviews: 123,
		brand: "TechBooks",
		category: "books",
		badge: "",
		inStock: true,
	},
	{
		id: 9,
		name: "LED 스탠드",
		price: 65000,
		originalPrice: 85000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.3,
		reviews: 345,
		brand: "HomeLight",
		category: "home",
		badge: "",
		inStock: true,
	},
	{
		id: 10,
		name: "운동화",
		price: 120000,
		originalPrice: 150000,
		image: "/placeholder.svg?height=300&width=300",
		rating: 4.6,
		reviews: 789,
		brand: "SportMax",
		category: "sports",
		badge: "20% 할인",
		inStock: true,
	},
];

const brands = [
	"TechPro",
	"SmartTech",
	"UrbanStyle",
	"SoundMax",
	"ComfortWear",
	"GlowBeauty",
	"FitLife",
	"TechBooks",
	"HomeLight",
	"SportMax",
];

const sortOptions = [
	{ value: "popular", label: "인기순" },
	{ value: "price-low", label: "낮은 가격순" },
	{ value: "price-high", label: "높은 가격순" },
	{ value: "rating", label: "평점순" },
	{ value: "newest", label: "최신순" },
];

export default function CategoryPage({
	params,
}: {
	params: { category: string };
}) {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState("popular");
	const [priceRange, setPriceRange] = useState([0, 500000]);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [minRating, setMinRating] = useState(0);
	const [showInStockOnly, setShowInStockOnly] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const categoryName = categoryNames[params.category] || "전체";

	// 필터링된 상품들
	const filteredProducts = useMemo(() => {
		const filtered = allProducts.filter((product) => {
			// 카테고리 필터
			if (params.category !== "all" && product.category !== params.category)
				return false;

			// 검색 필터
			if (
				searchQuery &&
				!product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!product.brand.toLowerCase().includes(searchQuery.toLowerCase())
			)
				return false;

			// 기타 필터들
			if (product.price < priceRange[0] || product.price > priceRange[1])
				return false;
			if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
				return false;
			if (product.rating < minRating) return false;
			if (showInStockOnly && !product.inStock) return false;
			return true;
		});

		// 정렬
		switch (sortBy) {
			case "price-low":
				filtered.sort((a, b) => a.price - b.price);
				break;
			case "price-high":
				filtered.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case "newest":
				filtered.sort((a, b) => b.id - a.id);
				break;
			default:
				filtered.sort((a, b) => b.reviews - a.reviews);
		}

		return filtered;
	}, [
		params.category,
		searchQuery,
		priceRange,
		selectedBrands,
		minRating,
		showInStockOnly,
		sortBy,
	]);

	const handleBrandChange = (brand: string, checked: boolean) => {
		if (checked) {
			setSelectedBrands([...selectedBrands, brand]);
		} else {
			setSelectedBrands(selectedBrands.filter((b) => b !== brand));
		}
	};

	const clearFilters = () => {
		setPriceRange([0, 500000]);
		setSelectedBrands([]);
		setMinRating(0);
		setShowInStockOnly(false);
		setSearchQuery("");
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// 검색은 실시간으로 처리됨
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

			<Separator />

			{/* 평점 필터 */}
			<div>
				<h3 className="font-medium mb-4">평점</h3>
				<div className="space-y-2">
					{[4, 3, 2, 1].map((rating) => (
						<div key={rating} className="flex items-center space-x-2">
							<Checkbox
								id={`rating-${rating}`}
								checked={minRating === rating}
								onCheckedChange={(checked) =>
									setMinRating(checked ? rating : 0)
								}
							/>
							<Label
								htmlFor={`rating-${rating}`}
								className="flex items-center space-x-1 cursor-pointer"
							>
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											// biome-ignore lint/suspicious/noArrayIndexKey: 임시
											key={i}
											className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
										/>
									))}
								</div>
								<span className="text-sm">이상</span>
							</Label>
						</div>
					))}
				</div>
			</div>

			<Separator />

			{/* 재고 필터 */}
			<div className="flex items-center space-x-2">
				<Checkbox
					id="in-stock"
					checked={showInStockOnly}
					onCheckedChange={(checked) =>
						setShowInStockOnly(
							checked === "indeterminate" ? false : (checked as boolean),
						)
					}
				/>
				<Label htmlFor="in-stock" className="text-sm cursor-pointer">
					재고 있는 상품만
				</Label>
			</div>

			<Button
				variant="outline"
				onClick={clearFilters}
				className="w-full bg-transparent"
			>
				필터 초기화
			</Button>
		</div>
	);

	return (
		<div className="py-8">
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
							<p className="text-muted-foreground">
								{filteredProducts.length}개 상품
							</p>
						</div>

						<div className="flex items-center gap-4">
							{/* Mobile Filter Button */}
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="lg:hidden bg-transparent"
									>
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
							<Select value={sortBy} onValueChange={setSortBy}>
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
					{filteredProducts.length === 0 ? (
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
							{filteredProducts.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									viewMode={viewMode}
								/>
							))}
						</div>
					)}

					{/* Pagination */}
					{filteredProducts.length > 0 && (
						<div className="flex justify-center mt-12">
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" disabled>
									이전
								</Button>
								<Button variant="default" size="sm">
									1
								</Button>
								<Button variant="outline" size="sm">
									2
								</Button>
								<Button variant="outline" size="sm">
									3
								</Button>
								<Button variant="outline" size="sm">
									다음
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function ProductCard({
	product,
	viewMode,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: 임시
	product: any;
	viewMode: "grid" | "list";
}) {
	const [isWishlisted, setIsWishlisted] = useState(false);

	if (viewMode === "list") {
		return (
			<Card className="group hover:shadow-lg transition-all duration-300">
				<CardContent className="p-0">
					<div className="flex gap-4 p-4">
						<div className="relative w-32 h-32 flex-shrink-0">
							<Image
								src={product.image || "/placeholder.svg"}
								alt={product.name}
								fill
								className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
							/>
							{product.badge && (
								<Badge className="absolute top-2 left-2 text-xs">
									{product.badge}
								</Badge>
							)}
							{!product.inStock && (
								<div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
									<span className="text-white text-sm font-medium">품절</span>
								</div>
							)}
						</div>
						<div className="flex-1 space-y-2">
							<div className="flex items-start justify-between">
								<div>
									<Link href={`/product/${product.id}`}>
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
									{[...Array(5)].map((_, i) => (
										<Star
											// biome-ignore lint/suspicious/noArrayIndexKey: 임시
											key={i}
											className={`h-3 w-3 ${
												i < Math.floor(product.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-muted-foreground"
											}`}
										/>
									))}
								</div>
								<span className="text-sm font-medium">{product.rating}</span>
								<span className="text-sm text-muted-foreground">
									({product.reviews})
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
									disabled={!product.inStock}
									onClick={(e) => {
										e.preventDefault();
										// useCartStore.getState().addItem({
										//   id: product.id,
										//   name: product.name,
										//   price: product.price,
										//   originalPrice: product.originalPrice,
										//   image: product.image,
										//   brand: product.brand,
										//   inStock: product.inStock,
										// })
									}}
								>
									장바구니
								</Button>
								<Button size="sm" variant="outline" disabled={!product.inStock}>
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
		<Link href={`/product/${product.id}`}>
			<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
				<CardContent className="p-0">
					<div className="relative overflow-hidden rounded-t-lg">
						<Image
							src={product.image || "/placeholder.svg"}
							alt={product.name}
							width={300}
							height={300}
							className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						{product.badge && (
							<Badge className="absolute top-3 left-3">{product.badge}</Badge>
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
						{!product.inStock && (
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
							<span className="text-sm font-medium">{product.rating}</span>
							<span className="text-sm text-muted-foreground">
								({product.reviews})
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
