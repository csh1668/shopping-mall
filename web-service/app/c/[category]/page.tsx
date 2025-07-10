import type { inferRouterOutputs } from "@trpc/server";
import { notFound } from "next/navigation";
import type { AppRouter } from "@/server/router";
import { sTrpc } from "@/server/server";
import CategoryClient from "./category-client";

type RouterOutput = inferRouterOutputs<AppRouter>;

interface PageProps {
	params: Promise<{ category: string }>;
	searchParams: Promise<{
		page?: string;
		sort?: string;
		minPrice?: string;
		maxPrice?: string;
		brands?: string;
		search?: string;
	}>;
}

export async function generateStaticParams() {
	try {
		const categories = await sTrpc.category.list.fetch({
			isActive: true,
		});

		// 모든 카테고리 슬러그 반환
		const params = categories.map((category) => ({
			category: category.slug,
		}));

		// 'all' 카테고리 추가
		params.push({ category: "all" });

		return params;
	} catch (error) {
		console.error("generateStaticParams 오류:", error);
		// 기본적으로 'all' 카테고리만 반환
		return [{ category: "all" }];
	}
}

export default async function CategoryPage({
	params,
	searchParams,
}: PageProps) {
	const { category } = await params;
	const searchParamsData = await searchParams;

	// 카테고리 정보 가져오기 (동적 처리)
	type CategoryData = RouterOutput["category"]["getBySlug"];
	let categoryData: CategoryData | null = null;
	let categoryName = "전체"; // 기본값

	if (category !== "all") {
		try {
			categoryData = await sTrpc.category.getBySlug.fetch({ slug: category });
			categoryName = categoryData.name;
		} catch (_error) {
			notFound();
		}
	}

	// 검색 파라미터 파싱
	const page = Number(searchParamsData.page) || 1;
	const limit = 20;
	const sortBy = searchParamsData.sort || "createdAt";
	const minPrice = searchParamsData.minPrice
		? Number(searchParamsData.minPrice)
		: undefined;
	const maxPrice = searchParamsData.maxPrice
		? Number(searchParamsData.maxPrice)
		: undefined;
	const search = searchParamsData.search || "";

	// 상품 목록 가져오기
	type ProductListResult = RouterOutput["product"]["list"];

	let productListResult: ProductListResult = {
		products: [],
		pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
	};

	try {
		productListResult = await sTrpc.product.list.fetch({
			page,
			limit,
			search,
			categoryId: categoryData?.id,
			minPrice,
			maxPrice,
			isActive: true,
			sortBy: sortBy as "createdAt" | "price" | "name",
			sortOrder: sortBy === "price" ? "asc" : "desc",
		});
	} catch (error) {
		console.error("상품 목록 가져오기 오류:", error);
	}

	// 브랜드 목록 가져오기 (필터용)
	let brands: string[] = [];
	try {
		brands = await sTrpc.product.getBrands.fetch({
			categoryId: categoryData?.id,
		});
	} catch (error) {
		console.error("브랜드 목록 가져오기 오류:", error);
		brands = [];
	}

	return (
		<div className="container px-4 py-8">
			<CategoryClient
				category={category}
				categoryName={categoryName}
				products={productListResult.products}
				pagination={productListResult.pagination}
				brands={brands}
				initialFilters={{
					search,
					minPrice,
					maxPrice,
					sort: sortBy,
				}}
			/>
		</div>
	);
}
