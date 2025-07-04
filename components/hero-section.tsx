"use client"

import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import { useState, useCallback } from "react"

interface HeroSectionProps {
  scrollToSection?: (sectionId: string) => void
}

export function HeroSection({ scrollToSection }: HeroSectionProps) {
  const [imageError, setImageError] = useState(false)

  const handleScrollToProducts = useCallback(() => {
    try {
      if (scrollToSection && typeof scrollToSection === "function") {
        scrollToSection("products")
      } else {
        // Fallback scroll behavior
        const element = document.getElementById("products")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    } catch (error) {
      console.error("Error scrolling to products section:", error)
      // Fallback: try direct scroll
      try {
        const element = document.getElementById("products")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } catch (fallbackError) {
        console.error("Fallback scroll also failed:", fallbackError)
      }
    }
  }, [scrollToSection])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  return (
    <div className="w-full">
      <section id="hero" className="relative w-full bg-blue-50 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 space-y-12">
          {/* Mobile: Image first, then content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-12">
            {/* Right Column: Image - Shows first on mobile */}
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <div className="relative w-full">
                {!imageError ? (
                  <img
                    src="/banner-1.png"
                    alt="Blast Clean Product Showcase"
                    className="w-full h-[200px] sm:h-[250px] lg:h-[350px] lg:min-w-md lg:mx-auto rounded-none sm:rounded-lg shadow-none sm:shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={handleImageError}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="w-full h-[200px] sm:h-[250px] lg:h-[350px] lg:max-w-md lg:mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-none sm:rounded-lg shadow-none sm:shadow-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">Blast Clean</h3>
                      <p className="text-blue-600">Professional Cleaning Solutions</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Left Column: Content - Shows second on mobile */}
            <div className="w-full lg:w-1/2 ml-6 space-y-4 order-2 lg:order-1 px-2 sm:px-0">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-blue-800 border border-blue-200 transition-transform duration-300 hover:scale-105">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm font-medium">Trusted by 1000+ Businesses</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-left">
                <span className="text-blue-600">Blast Clean</span>{" "}
                <span className="block text-blue-700">Professional Cleaning </span>
                <span className="block text-gray-800">Solutions</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center lg:text-left">
                Transform your workspace with our premium cleaning products and exceptional service, designed for a
                spotless environment.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start pt-2">
                <Button
                  size="lg"
                  className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
                  onClick={handleScrollToProducts}
                  type="button"
                >
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 gradient-primary backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">25,356</div>
              <div className="text-sm md:text-base opacity-90">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">6,050</div>
              <div className="text-sm md:text-base opacity-90">Followers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">851</div>
              <div className="text-sm md:text-base opacity-90">Shops</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">95%</div>
              <div className="text-sm md:text-base opacity-90">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
