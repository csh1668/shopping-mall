"use client"

import type React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SocialButtonProps extends ButtonProps {
  provider: "google" | "kakao" | "naver"
  children: React.ReactNode
}

const providerStyles = {
  google: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300",
  kakao: "bg-[#FEE500] hover:bg-[#FDD835] text-gray-900",
  naver: "bg-[#03C75A] hover:bg-[#02B351] text-white",
}

const providerIcons = {
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  kakao: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
    </svg>
  ),
  naver: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
    </svg>
  ),
}

export function SocialButton({ provider, children, className, ...props }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full h-12 text-sm font-medium transition-colors", providerStyles[provider], className)}
      {...props}
    >
      <div className="flex items-center justify-center gap-3">
        {providerIcons[provider]}
        {children}
      </div>
    </Button>
  )
}
