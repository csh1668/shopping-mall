"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
	placeholder?: string;
	className?: HTMLAttributes<HTMLFormElement>["className"];
	onSearch?: (query: string) => void;
	showButton?: boolean;
	size?: "sm" | "md" | "lg";
	defaultValue?: string;
}

export function SearchBar({
	placeholder = "원하는 상품을 검색해보세요...",
	className = "",
	onSearch,
	showButton = true,
	size = "md",
	defaultValue = "",
}: SearchBarProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState(defaultValue);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!searchQuery.trim()) return;

		if (onSearch) {
			onSearch(searchQuery.trim());
		} else {
			// 기본 검색 페이지로 이동
			const params = new URLSearchParams();
			params.set("q", searchQuery.trim());
			router.push(`/search?${params.toString()}`);
		}
	};

	const sizeClasses = {
		sm: "h-8 text-sm",
		md: "h-10 text-base",
		lg: "h-12 text-lg",
	};

	return (
		<form onSubmit={handleSubmit} className={`${className}`}>
			<div className="relative w-full">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
				<Input
					type="search"
					placeholder={placeholder}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className={`pl-12 pr-4 ${sizeClasses[size]}`}
				/>
				{showButton && (
					<Button
						type="submit"
						size="sm"
						className="absolute right-2 top-1/2 transform -translate-y-1/2"
					>
						검색
					</Button>
				)}
			</div>
		</form>
	);
}
