"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/components/search";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/auth-store";
import { UserMenu } from "../user-menu";

const categories = [
	{ name: "패션", href: "/category/fashion" },
	{ name: "전자제품", href: "/category/electronics" },
	{ name: "홈&리빙", href: "/category/home" },
	{ name: "뷰티", href: "/category/beauty" },
	{ name: "스포츠", href: "/category/sports" },
	{ name: "도서", href: "/category/books" },
];

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user } = useAuthStore();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
						<span className="font-bold text-xl hidden sm:block">ShopMall</span>
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
									<Search className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="top" className="h-auto">
								<SearchBar className="mt-4" />
							</SheetContent>
						</Sheet>

						{/* 다크모드 토글 */}
						<ThemeToggle />

						{/* 장바구니 */}
						{/* <Button variant="ghost" size="icon" className="relative hover-scale" onClick={toggleCart}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-in"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button> */}

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
									<Menu className="h-5 w-5" />
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
										<X className="h-4 w-4" />
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
	);
}
