"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeaderProps {
  scrollToSection: (sectionId: string) => void
}

export function Header({ scrollToSection }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b gradient-primary backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-22 items-center justify-between">
          <div className="flex items-center">
            {/* Logo placeholder - replace with your actual logo */}
            <img src="/logo-1.png" alt="BlastClean Logo" className="h-20 w-20" />
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Contact
            </button>
          </nav>

          <Link href="/admin/login">
            <Button variant="outline" className="border-white text-primary  hover:text-white hover:bg-primary/90">
              Admin
            </Button>
          </Link>
        </div>
      </header>
  )
}
