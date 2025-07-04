"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  scrollToSection: (sectionId: string) => void
}

export function Header({ scrollToSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY

        // Set scrolled state for blur effect
        setIsScrolled(currentScrollY > 10)

        // Mobile: Hide header when scrolling down (except at top)
        // Desktop: Always show header
        const isMobile = window.innerWidth < 768

        if (isMobile) {
          if (currentScrollY < 10) {
            setIsVisible(true)
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
          }
        } else {
          // Desktop: always visible
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      window.addEventListener("resize", controlNavbar) // Handle resize events
      return () => {
        window.removeEventListener("scroll", controlNavbar)
        window.removeEventListener("resize", controlNavbar)
      }
    }
  }, [lastScrollY])

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsOpen(false) // Close mobile menu after navigation
  }

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "products", label: "Products" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white/95 backdrop-blur-sm"}`}
    >
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo-1.png"
            alt="BlastClean Logo"
            className="h-12 w-12 sm:h-16 sm:w-16"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=60&width=60"
            }}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-lg font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Admin Button */}
        <div className="hidden md:block">
          <Link href="/admin/login">
            <Button
              variant="outline"
              className="border-primary text-primary border-2 text-lg hover:text-white hover:bg-primary/90 bg-transparent"
            >
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Admin Button */}
          <Link href="/admin/login">
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary border-2 hover:text-white hover:bg-primary/90 bg-transparent"
            >
              Admin
            </Button>
          </Link>

          {/* Mobile Hamburger Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2" aria-label="Toggle menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b">
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg?height=40&width=40" alt="BlastClean Logo" className="h-10 w-10" />
                    <span className="text-xl font-bold text-primary">BlastClean</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="p-2">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4 py-6 flex-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="text-left text-xl font-semibold text-primary hover:text-primary/80 transition-colors py-3 px-2 rounded-lg hover:bg-primary/5"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Footer */}
                <div className="border-t pt-6">
                  <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90" size="lg">
                      Admin Panel
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
