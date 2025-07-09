"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Award, Truck, Shield, Clock } from "lucide-react"

export function FeaturesSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "We source only the finest cleaning products to ensure exceptional results for your business operations.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our experienced team provides personalized recommendations and ongoing support for all your needs.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery service to keep your business operations running smoothly without delays.",
    },
    {
      icon: Shield,
      title: "Trusted Brand",
      description:
        "Years of experience and thousands of satisfied customers make us a reliable choice for your business.",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round-the-clock customer service and support to address your queries and concerns anytime.",
    },
  ]

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, features.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose BlastClean?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We deliver excellence through quality products, expert service, and unwavering commitment to your success.
          </p>
        </div>

        {/* Mobile Slider View */}
        <div className="block sm:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg bg-white mx-auto max-w-sm">
                      <CardHeader className="text-center pb-4">
                        <IconComponent className="h-16 w-16 text-blue-600 mb-4 mx-auto" />
                        <CardTitle className="text-blue-700 text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center pt-0">
                        <p className="text-muted-foreground text-base">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Animated Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-blue-600 scale-125" : "bg-blue-200 hover:bg-blue-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} of {features.length}
            </span>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className="border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg bg-white"
              >
                <CardHeader className="text-center pb-4">
                  <IconComponent className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-600 mb-3 sm:mb-4 mx-auto" />
                  <CardTitle className="text-blue-700 text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
