"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/models"

// Import all components
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()

    // Refetch products every 30 seconds to show new products
    const interval = setInterval(fetchProducts, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        cache: "no-store", // Ensure fresh data
      })
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      // Set empty array on error so the "no products" message shows
      setProducts([])
    }
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <FeaturesSection />
      <ProductsSection products={products} />
      <AboutSection />
      <ContactSection products={products} />
      <Footer />
    </div>
  )
}
