"use client";

import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WishlistPage() {
	// TODO: 실제 찜한 상품 데이터 연동
	return (
		<div className="max-w-4xl mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Heart className="h-5 w-5" />
						찜한 상품
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-center py-8">
						아직 찜한 상품이 없습니다.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
