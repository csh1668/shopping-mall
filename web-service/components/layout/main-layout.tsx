"use client"

import type React from "react"

import { Header } from "./header"
import { Footer } from "./footer"
import { CartSidebar } from "@/components/cart-sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {

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
