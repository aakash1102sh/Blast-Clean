"use client"

export function AboutSection() {
  return (
    <section id="about" className="py-20 gradient-primary-light">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">About BlastClean</h2>
            <p className="text-lg text-muted-foreground">
              With over a decade of experience in the cleaning industry, BlastClean has established itself as a trusted
              partner for businesses of all sizes. We understand that cleanliness is not just about appearance—it's
              about creating healthy, productive environments.
            </p>
            <p className="text-lg text-muted-foreground">
              Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for
              thousands of businesses worldwide. From small offices to large industrial facilities, we have the
              expertise and products to meet your unique cleaning needs.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
          <div className="aspect-square bg-muted rounded-lg">
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="About BlastClean"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
