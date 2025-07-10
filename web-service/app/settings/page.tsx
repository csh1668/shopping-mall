"use client";

import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
	// TODO: 실제 설정 기능 구현
	return (
		<div className="max-w-4xl mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						설정
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-center py-8">
						설정 기능은 준비 중입니다.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
