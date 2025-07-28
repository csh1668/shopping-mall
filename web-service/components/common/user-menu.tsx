"use client";

import { Heart, LogOut, MapPin, Package, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/server/client";

export function UserMenu() {
	const { user, signOut } = useAuth();

	// tRPC Hook 사용 - 자동 캐싱, 리팩토링, 로딩 상태 관리
	const { data: metadata, isLoading } = trpc.user.getUserMetadata.useQuery(
		undefined,
		{ enabled: !!user }, // 로그인된 경우만 쿼리 실행
	);

	if (!user) {
		return (
			<div className="flex items-center gap-2">
				<Link href="/auth">
					<Button variant="ghost" size="sm">
						로그인
					</Button>
				</Link>
			</div>
		);
	}

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={user.user_metadata?.avatar_url || "/placeholder.svg"}
							alt={metadata?.fullName || ""}
						/>
						<AvatarFallback>
							{isLoading ? (
								<Skeleton className="h-8 w-8 rounded-full" />
							) : (
								metadata?.fullName?.charAt(0) ||
								user.email?.charAt(0).toUpperCase()
							)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<div className="text-sm font-medium leading-none">
							{isLoading ? (
								<Skeleton className="h-4 w-20" />
							) : (
								metadata?.fullName || "사용자"
							)}
						</div>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/profile">
						<User className="mr-2 h-4 w-4" />
						<span>프로필</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/orders">
						<Package className="mr-2 h-4 w-4" />
						<span>주문 내역</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/wishlist">
						<Heart className="mr-2 h-4 w-4" />
						<span>찜한 상품</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/addresses">
						<MapPin className="mr-2 h-4 w-4" />
						<span>배송지 관리</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/settings">
						<Settings className="mr-2 h-4 w-4" />
						<span>설정</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>로그아웃</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
