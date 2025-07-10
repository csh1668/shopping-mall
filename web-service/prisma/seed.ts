import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";

// .env 파일 로드 (.env 파일 경로를 명시적으로 지정)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	// 카테고리 생성
	const categories = await Promise.all([
		prisma.category.create({
			data: {
				name: "패션",
				slug: "fashion",
				description: "최신 트렌드 패션 아이템",
				sortOrder: 1,
			},
		}),
		prisma.category.create({
			data: {
				name: "전자제품",
				slug: "electronics",
				description: "최신 전자제품과 가젯",
				sortOrder: 2,
			},
		}),
		prisma.category.create({
			data: {
				name: "홈&리빙",
				slug: encodeURIComponent("홈-리빙"),
				description: "집을 더 아름답게",
				sortOrder: 3,
			},
		}),
		prisma.category.create({
			data: {
				name: "뷰티",
				slug: "beauty",
				description: "아름다움을 위한 모든 것",
				sortOrder: 4,
			},
		}),
		prisma.category.create({
			data: {
				name: "스포츠",
				slug: "sports",
				description: "건강한 라이프스타일",
				sortOrder: 5,
			},
		}),
		prisma.category.create({
			data: {
				name: "도서",
				slug: "books",
				description: "지식과 즐거움을 위한 책",
				sortOrder: 6,
			},
		}),
	]);

	console.log(`✅ Created ${categories.length} categories`);

	// 상품 생성 (예시)
	const products = await Promise.all([
		prisma.product.create({
			data: {
				name: "프리미엄 무선 이어폰",
				slug: "premium-wireless-earbuds",
				description: "최고급 노이즈 캔슬링 기능을 갖춘 프리미엄 무선 이어폰입니다.",
				shortDescription: "노이즈 캔슬링 무선 이어폰",
				price: 129000,
				originalPrice: 159000,
				categoryId: categories[1].id, // 전자제품
				brand: "TechPro",
				sku: "TWE-001",
				previewImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
				images: [
					"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
				],
				stock: 50,
				minStock: 10,
				tags: ["무선", "이어폰", "노이즈캔슬링"],
			},
		}),
		prisma.product.create({
			data: {
				name: "스마트 워치 프로",
				slug: "smart-watch-pro",
				description: "건강 관리와 피트니스 추적을 위한 최고의 스마트 워치입니다.",
				shortDescription: "피트니스 스마트 워치",
				price: 299000,
				originalPrice: 349000,
				categoryId: categories[1].id, // 전자제품
				brand: "FitTech",
				sku: "SWP-001",
				previewImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
				images: [
					"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
				],
				stock: 30,
				minStock: 5,
				tags: ["스마트워치", "피트니스", "건강"],
			},
		}),
		prisma.product.create({
			data: {
				name: "미니멀 백팩",
				slug: "minimal-backpack",
				description: "심플하고 실용적인 디자인의 데일리 백팩입니다.",
				shortDescription: "데일리 백팩",
				price: 89000,
				originalPrice: 119000,
				categoryId: categories[0].id, // 패션
				brand: "Urban Style",
				sku: "BAG-001",
				previewImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
				images: [
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
				],
				stock: 100,
				minStock: 20,
				tags: ["백팩", "가방", "패션"],
			},
		}),
		prisma.product.create({
			data: {
				name: "블루투스 스피커",
				slug: "bluetooth-speaker",
				description: "강력한 사운드와 긴 배터리 수명을 자랑하는 포터블 스피커입니다.",
				shortDescription: "포터블 블루투스 스피커",
				price: 79000,
				originalPrice: 99000,
				categoryId: categories[1].id, // 전자제품
				brand: "SoundMax",
				sku: "SPK-001",
				previewImage: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
				images: [
					"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
				],
				stock: 75,
				minStock: 15,
				tags: ["스피커", "블루투스", "음향"],
			},
		}),
		prisma.product.create({
			data: {
				name: "한글 테스트 상품",
				slug: encodeURIComponent("한글-테스트-상품"),
				description: "한글 slug가 올바르게 작동하는지 테스트하기 위한 상품입니다.",
				shortDescription: "한글 slug 테스트",
				price: 50000,
				originalPrice: 60000,
				categoryId: categories[0].id, // 패션
				brand: "테스트 브랜드",
				sku: "TEST-001",
				previewImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
				images: [
					"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
				],
				stock: 10,
				minStock: 2,
				tags: ["테스트", "한글"],
			},
		}),
	]);

	console.log(`✅ Created ${products.length} products`);

	console.log("✨ Seeding completed!");
}

main()
	.catch((e) => {
		console.error("❌ Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	}); 