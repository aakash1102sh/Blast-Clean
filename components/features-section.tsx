"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Award } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose BlastClean?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We deliver excellence through quality products, expert service, and unwavering commitment to your success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <Award className="h-16 w-16 text-primary mb-4 mx-auto" />
              <CardTitle className="text-primary text-xl">Premium Quality</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                We source only the finest cleaning products to ensure exceptional results for your business operations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-secondary mb-4 mx-auto" />
              <CardTitle className="text-secondary text-xl">Expert Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Our experienced team provides personalized recommendations and ongoing support for all your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <Award className="h-16 w-16 text-primary mb-4 mx-auto" />
              <CardTitle className="text-primary text-xl">Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Quick and reliable delivery service to keep your business operations running smoothly without delays.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
