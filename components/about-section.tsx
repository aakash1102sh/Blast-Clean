"use client"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-blue-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Mobile: Image first, Desktop: Image on left */}
          <div className="order-1 lg:order-1">
            <div className="aspect-[4/3] bg-white rounded-lg border border-gray-200 shadow-sm mx-auto max-w-md lg:max-w-none">
              <img
                src="/photo-2.png"
                alt="About BlastClean"
                className="w-full h-full object-contain p-4 lg:p-6 rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=300&width=400"
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 order-2 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center lg:text-left">About BlastClean</h2>
            <p className="text-base sm:text-lg text-muted-foreground text-center lg:text-left">
              With over a decade of experience in the cleaning industry, BlastClean has established itself as a trusted
              partner for businesses of all sizes. We understand that cleanliness is not just about appearance—it's
              about creating healthy, productive environments.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground text-center lg:text-left">
              Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for
              thousands of businesses worldwide. From small offices to large industrial facilities, we have the
              expertise and products to meet your unique cleaning needs.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:max-w-none lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary">1000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary">1000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Stock Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
