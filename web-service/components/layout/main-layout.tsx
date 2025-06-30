"use client"

import type React from "react"

import { useEffect } from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { useAuthStore } from "@/lib/stores"
import { initTheme } from "@/lib/theme-config"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
    initTheme()
  }, [initialize])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 animate-fade-in">{children}</div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
