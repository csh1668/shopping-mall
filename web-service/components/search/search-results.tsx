"use client";

import { Grid, List, Search, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "./search-bar";
import { SearchFilters } from "./search-filters";
import { SearchSuggestions } from "./search-suggestions";

export interface SearchResult {
	id: number;
	name: string;
	price: number;
	salePrice?: number;
	brand: string;
	category: string;
	images: string[];
	rating: number;
	reviews: number;
	inStock: boolean;
	onSale: boolean;
}

// 임시 데이터
const mockResults: SearchResult[] = [
	{
		id: 1,
		name: "스마트폰 Pro Max",
		price: 1200000,
		salePrice: 1000000,
		brand: "TechPro",
		category: "electronics",
		images: ["/placeholder.svg?height=300&width=300"],
		rating: 4.8,
		reviews: 234,
		inStock: true,
		onSale: true,
	},
	{
		id: 2,
		name: "무선 노이즈 캔슬링 이어폰",
		price: 250000,
		salePrice: 200000,
		brand: "SoundMax",
		category: "electronics",
		images: ["/placeholder.svg?height=300&width=300"],
		rating: 4.6,
		reviews: 156,
		inStock: true,
		onSale: true,
	},
	{
		id: 3,
		name: "게이밍 노트북",
		price: 1800000,
		brand: "SmartTech",
		category: "electronics",
		images: ["/placeholder.svg?height=300&width=300"],
		rating: 4.9,
		reviews: 89,
		inStock: false,
		onSale: false,
	},
];

interface SearchResultsProps {
	initialQuery?: string;
	className?: string;
}

export function SearchResults({
	initialQuery = "",
	className = "",
}: SearchResultsProps) {
	const [query, setQuery] = useState(initialQuery);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const performSearch = useCallback(async (searchQuery: string) => {
		setLoading(true);

		// 실제로는 API 호출
		setTimeout(() => {
			const filteredResults = mockResults.filter(
				(result) =>
					result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					result.brand.toLowerCase().includes(searchQuery.toLowerCase()),
			);
			setResults(filteredResults);
			setLoading(false);
		}, 1000);
	}, []);

	useEffect(() => {
		if (query.trim()) {
			performSearch(query);
		}
	}, [query, performSearch]);

	const handleSearch = (searchQuery: string) => {
		setQuery(searchQuery);
		setShowSuggestions(false);
	};

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		setShowSuggestions(false);
	};

	// biome-ignore lint/suspicious/noExplicitAny: 임시
	const handleFiltersChange = (filters: any) => {
		// 필터 적용 로직
		console.log("Filters changed:", filters);
	};

	const formatPrice = (price: number) => {
		return `₩${price.toLocaleString()}`;
	};

	const calculateDiscount = (originalPrice: number, salePrice: number) => {
		return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
	};

	return (
		<div className={`space-y-6 ${className}`}>
			{/* 검색 헤더 */}
			<div className="space-y-4">
				<SearchBar
					placeholder="상품명, 브랜드, 카테고리로 검색..."
					defaultValue={query}
					onSearch={handleSearch}
					showButton={true}
					size="lg"
				/>

				{showSuggestions && (
					<SearchSuggestions
						query={query}
						onSuggestionClick={handleSuggestionClick}
					/>
				)}
			</div>

			{/* 검색 결과 헤더 */}
			{query && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h2 className="text-lg font-semibold">"{query}" 검색 결과</h2>
						<Badge variant="secondary">
							{loading ? "검색 중..." : `${results.length}개 상품`}
						</Badge>
					</div>

					<div className="flex items-center gap-2">
						<SearchFilters onFiltersChange={handleFiltersChange} />

						<div className="flex items-center border rounded-md">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid className="h-4 w-4" />
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
			)}

			{/* 검색 결과 */}
			{loading ? (
				<div
					className={`grid gap-4 ${
						viewMode === "grid"
							? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
							: "grid-cols-1"
					}`}
				>
					{[...Array(8).keys()].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 임시
						<Card key={i} className={viewMode === "list" ? "flex" : ""}>
							<CardContent
								className={viewMode === "list" ? "flex gap-4 p-4" : "p-4"}
							>
								<Skeleton className="h-48 w-full" />
								<div className="space-y-2 mt-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-4 w-1/4" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : results.length > 0 ? (
				<div
					className={`grid gap-4 ${
						viewMode === "grid"
							? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
							: "grid-cols-1"
					}`}
				>
					{results.map((result) => (
						<Card
							key={result.id}
							className={
								viewMode === "list"
									? "flex"
									: "group hover:shadow-lg transition-shadow"
							}
						>
							<CardContent
								className={viewMode === "list" ? "flex gap-4 p-4" : "p-4"}
							>
								<div
									className={viewMode === "list" ? "w-32 flex-shrink-0" : ""}
								>
									{/** biome-ignore lint/performance/noImgElement: 임시 */}
									<img
										src={result.images[0]}
										alt={result.name}
										className={`w-full object-cover rounded-md ${
											viewMode === "list" ? "h-24" : "h-48"
										}`}
									/>
								</div>

								<div className="flex-1 space-y-2">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="font-medium line-clamp-2">
												{result.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												{result.brand}
											</p>
										</div>
										{result.onSale && (
											<Badge variant="destructive" className="ml-2">
												{calculateDiscount(result.price, result.salePrice ?? 0)}
												% 할인
											</Badge>
										)}
									</div>

									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<span className="text-sm font-medium">{result.rating}</span>
										<span className="text-sm text-muted-foreground">
											({result.reviews})
										</span>
									</div>

									<div className="flex items-center gap-2">
										{result.salePrice ? (
											<>
												<span className="text-lg font-bold text-red-600">
													{formatPrice(result.salePrice)}
												</span>
												<span className="text-sm text-muted-foreground line-through">
													{formatPrice(result.price)}
												</span>
											</>
										) : (
											<span className="text-lg font-bold">
												{formatPrice(result.price)}
											</span>
										)}
									</div>

									{!result.inStock && <Badge variant="secondary">품절</Badge>}
								</div>
							</CardContent>

							<CardFooter
								className={viewMode === "list" ? "flex-shrink-0" : ""}
							>
								<Button className="w-full" disabled={!result.inStock}>
									{result.inStock ? "장바구니 담기" : "품절"}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			) : query ? (
				<div className="text-center py-12">
					<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
					<p className="text-muted-foreground">
						"{query}"에 대한 검색 결과를 찾을 수 없습니다.
					</p>
				</div>
			) : (
				<div className="text-center py-12">
					<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">검색어를 입력해주세요</h3>
					<p className="text-muted-foreground">
						상품명, 브랜드, 카테고리로 검색해보세요.
					</p>
				</div>
			)}
		</div>
	);
}
