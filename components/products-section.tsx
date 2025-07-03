"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import type { Product } from "@/lib/models"

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section id="products" className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Products</h2>
          <p className="text-xl text-muted-foreground">
            Discover our comprehensive range of professional cleaning solutions
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square bg-muted">
                  <img
                    src={product.image || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Products Available</h3>
            <p className="text-muted-foreground">
              Our product catalog is being updated. Please check back soon or contact us for more information.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
