"use client";

import { Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
	id: string;
	text: string;
	type: "trending" | "recent" | "popular";
	count?: number;
}

interface SearchSuggestionsProps {
	query: string;
	onSuggestionClick: (suggestion: string) => void;
	className?: string;
}

export function SearchSuggestions({
	query,
	onSuggestionClick,
	className = "",
}: SearchSuggestionsProps) {
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [loading, setLoading] = useState(false);
	console.log(loading);

	// 임시 데이터 - 실제로는 API에서 가져와야 함
	const mockSuggestions: SearchSuggestion[] = [
		{ id: "1", text: "스마트폰", type: "trending", count: 1234 },
		{ id: "2", text: "노트북", type: "trending", count: 856 },
		{ id: "3", text: "무선 이어폰", type: "trending", count: 567 },
		{ id: "4", text: "스마트워치", type: "recent" },
		{ id: "5", text: "태블릿", type: "recent" },
		{ id: "6", text: "게이밍 마우스", type: "popular" },
	];

	useEffect(() => {
		if (!query.trim()) {
			setSuggestions([]);
			return;
		}

		setLoading(true);

		// 실제로는 API 호출
		const filteredSuggestions = mockSuggestions.filter((suggestion) =>
			suggestion.text.toLowerCase().includes(query.toLowerCase()),
		);

		setTimeout(() => {
			setSuggestions(filteredSuggestions.slice(0, 6));
			setLoading(false);
		}, 300);
	}, [query]);

	if (!query.trim() || suggestions.length === 0) {
		return null;
	}

	return (
		<div
			className={`bg-background border rounded-lg shadow-lg p-4 ${className}`}
		>
			<div className="space-y-2">
				{suggestions.map((suggestion) => (
					<Button
						key={suggestion.id}
						variant="ghost"
						className="w-full justify-start h-auto p-2"
						onClick={() => onSuggestionClick(suggestion.text)}
					>
						<div className="flex items-center gap-3 w-full">
							{suggestion.type === "trending" ? (
								<TrendingUp className="h-4 w-4 text-orange-500" />
							) : (
								<Search className="h-4 w-4 text-muted-foreground" />
							)}
							<span className="flex-1 text-left">{suggestion.text}</span>
							{suggestion.count && (
								<Badge variant="secondary" className="text-xs">
									{suggestion.count}
								</Badge>
							)}
						</div>
					</Button>
				))}
			</div>
		</div>
	);
}
