"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-muted/30 border-t">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* 회사 정보 */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									SM
								</span>
							</div>
							<span className="font-bold text-xl">ShopMall</span>
						</div>
						<p className="text-sm text-muted-foreground">
							최고의 쇼핑 경험을 제공하는 온라인 쇼핑몰입니다.
						</p>
						<div className="flex space-x-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Facebook className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Twitter className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Instagram className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Youtube className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* 고객 서비스 */}
					<div className="space-y-4">
						<h3 className="font-semibold">고객 서비스</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									고객센터
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									배송 안내
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									반품/교환
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* 쇼핑 정보 */}
					<div className="space-y-4">
						<h3 className="font-semibold">쇼핑 정보</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									이용약관
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									개인정보처리방침
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									쿠폰/적립금
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground"
								>
									멤버십
								</Link>
							</li>
						</ul>
					</div>

					{/* 연락처 */}
					<div className="space-y-4">
						<h3 className="font-semibold">연락처</h3>
						<div className="space-y-2 text-sm text-muted-foreground">
							<p>고객센터: 1588-1234</p>
							<p>평일 09:00 - 18:00</p>
							<p>주말/공휴일 휴무</p>
							<p>이메일: support@shopmall.com</p>
						</div>
					</div>
				</div>

				<div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; 2024 ShopMall. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
