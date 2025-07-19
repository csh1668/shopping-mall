"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LucideIcon from "@/components/lucide-icon";
import { SearchBar } from "@/components/search";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { CartSidebar } from "../cart-sidebar";
import { UserMenu } from "../user-menu";

const categories = [
	{ name: "패션", href: "/c/fashion" },
	{ name: "전자제품", href: "/c/electronics" },
	{ name: "홈&리빙", href: "/c/home" },
	{ name: "뷰티", href: "/c/beauty" },
	{ name: "스포츠", href: "/c/sports" },
	{ name: "도서", href: "/c/books" },
];

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const { toggleCart, getTotalItems } = useCartStore();
	const totalItems = getTotalItems();

	useEffect(() => {
		const controlHeader = () => {
			const currentScrollY = window.scrollY;

			// 스크롤이 100px 이상일 때만 헤더 숨김/보임 적용
			if (currentScrollY > 100) {
				if (currentScrollY > lastScrollY && isHeaderVisible) {
					// 아래로 스크롤 - 헤더 숨김
					setIsHeaderVisible(false);
				} else if (currentScrollY < lastScrollY && !isHeaderVisible) {
					// 위로 스크롤 - 헤더 보임
					setIsHeaderVisible(true);
				}
			} else {
				// 상단 근처에서는 항상 헤더 보임
				setIsHeaderVisible(true);
			}

			setLastScrollY(currentScrollY);
		};

		const throttledControlHeader = () => {
			requestAnimationFrame(controlHeader);
		};

		window.addEventListener("scroll", throttledControlHeader);
		return () => window.removeEventListener("scroll", throttledControlHeader);
	}, [lastScrollY, isHeaderVisible]);

	return (
		<>
			<header
				className={`fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${
					isHeaderVisible ? "translate-y-0" : "-translate-y-full"
				}`}
			>
				<div className="container mx-auto px-4">
					{/* 메인 헤더 */}
					<div className="flex h-16 items-center justify-between">
						{/* 로고 */}
						<Link href="/" className="flex items-center space-x-2 hover-scale">
							<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									SM
								</span>
							</div>
							<span className="font-bold text-xl hidden sm:block">
								ShopMall
							</span>
						</Link>

						{/* 검색바 (데스크톱) */}
						<SearchBar className="hidden md:flex flex-1 max-w-md mx-8" />

						{/* 우측 메뉴 */}
						<div className="flex items-center space-x-2">
							{/* 검색 버튼 (모바일) */}
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="md:hidden hover-scale"
									>
										<LucideIcon name="Search" className="h-5 w-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="top" className="h-auto">
									<SearchBar className="mt-4" />
								</SheetContent>
							</Sheet>

							{/* 다크모드 토글 */}
							<ThemeToggle />

							{/* 장바구니 */}
							<Button
								variant="ghost"
								size="icon"
								className="relative hover-scale"
								onClick={toggleCart}
							>
								<LucideIcon name="ShoppingCart" className="h-5 w-5" />
								{totalItems > 0 && (
									<Badge
										variant="destructive"
										className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-in"
									>
										{totalItems > 99 ? "99+" : totalItems}
									</Badge>
								)}
							</Button>

							{/* 사용자 메뉴 */}
							<UserMenu />

							{/* 모바일 메뉴 */}
							<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
								<SheetTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="md:hidden hover-scale"
									>
										<LucideIcon name="Menu" className="h-5 w-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-80">
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-lg font-semibold">메뉴</h2>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setIsMenuOpen(false)}
										>
											<LucideIcon name="X" className="h-4 w-4" />
										</Button>
									</div>
									<nav className="space-y-4">
										{categories.map((category, index) => (
											<Link
												key={category.name}
												href={category.href}
												onClick={() => setIsMenuOpen(false)}
												className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors animate-slide-up"
												style={{ animationDelay: `${index * 50}ms` }}
											>
												{category.name}
											</Link>
										))}
									</nav>
								</SheetContent>
							</Sheet>
						</div>
					</div>

					{/* 카테고리 네비게이션 (데스크톱) */}
					<nav className="hidden md:flex h-12 items-center space-x-6 border-t">
						{categories.map((category) => (
							<Link
								key={category.name}
								href={category.href}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover-lift"
							>
								{category.name}
							</Link>
						))}
					</nav>
				</div>
			</header>

			{/* 헤더 공간 확보를 위한 패딩 */}
			<div className="h-16 md:h-28" />

			{/* 장바구니 사이드바 */}
			<CartSidebar />
		</>
	);
}
