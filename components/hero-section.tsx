"use client"

import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void
}

export function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative w-full gradient-primary backdrop-blur supports-[backdrop-filter]:bg-background/60 py-20"
    >
      <div className="container mx-auto px-4 space-y-12">
        {/* Top Row: Left Content + Right Image */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 text-white space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <Star className="h-4 w-4 mr-2 text-yellow-100" />
              <span className="text-sm font-medium">Trusted by 1000+ Businesses</span>
            </div>
    
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Professional{" "}
              <span className="block text-white">Cleaning Solutions</span>
              for Your Business
            </h1>
    
            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/90">
              Transform your workspace with our premium cleaning products and exceptional service.
            </p>
    
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="text-primary bg-white hover:text-white
                 px-8 py-4"
                onClick={() => scrollToSection("products")}
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className=" text-primary bg-white hover:text-white  px-8 py-4"
                onClick={() => scrollToSection("contact")}
              >
                Get Quote
              </Button>
            </div>
          </div>
    
          {/* Right Column: Image beside content */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/banner-1.png" // 🔁 Replace with your actual image
              alt="Cleaning Product Showcase"
              className="max-w-full h-auto rounded-lg shadow-xl object-cover"
            />
          </div>
        </div>
    
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Happy Clients", value: "1000+" },
            { label: "Years Experience", value: "10+" },
            { label: "Support", value: "24/7" },
            { label: "Satisfaction", value: "100%" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
