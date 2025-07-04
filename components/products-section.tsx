"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Award,
  Package,
  Star,
  Info,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Tag,
  DollarSign,
} from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/types"

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <section id="products" className="py-20">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Products</h2>
          <p className="text-xl text-muted-foreground">
            Discover our comprehensive range of professional cleaning solutions
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
              >
                {/* Product Image */}
                <div className="relative h-48 sm:h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                  {product.price && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                      ${product.price}
                    </div>
                  )}
                  {!product.isActive && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Inactive
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <CardHeader className="pb-3 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg leading-tight line-clamp-2">{product.name}</CardTitle>
                      {product.category && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {product.category.replace("-", " ")}
                        </Badge>
                      )}
                    </div>

                    <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>

                    {/* Quick Info */}
                    <div className="space-y-2">
                      {product.features && product.features.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-primary">Key Features:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                            {product.features.length > 2 && (
                              <li className="text-primary text-xs">+{product.features.length - 2} more features</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {product.stockQuantity !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Stock: {product.stockQuantity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Action Button */}
                <CardContent className="pt-0 pb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-sm bg-transparent hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          {product.name}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Complete product information and specifications
                        </DialogDescription>
                      </DialogHeader>

                      <ScrollArea className="max-h-[calc(95vh-120px)] pr-4">
                        <div className="space-y-8">
                          {/* Basic Information Section */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Product Image */}
                            <div className="space-y-4">
                              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={product.image || "/placeholder.svg?height=400&width=400"}
                                  alt={product.name}
                                  className="w-full h-full object-contain p-4"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=400&width=400"
                                  }}
                                />
                              </div>
                            </div>

                            {/* Basic Product Info */}
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-bold text-2xl mb-2 text-primary">{product.name}</h3>
                                <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
                              </div>

                              {/* Product Details Grid */}
                              <div className="grid grid-cols-2 gap-4">
                                {product.category && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                      Category
                                    </p>
                                    <Badge variant="outline" className="text-sm">
                                      {product.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Badge>
                                  </div>
                                )}

                                {product.price && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                      Price
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4 text-green-600" />
                                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                                    </div>
                                  </div>
                                )}

                                {product.stockQuantity !== undefined && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                      Stock Quantity
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4 text-blue-600" />
                                      <span className="font-semibold text-blue-600">{product.stockQuantity} units</span>
                                    </div>
                                  </div>
                                )}

                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                    Status
                                  </p>
                                  <Badge variant={product.isActive ? "default" : "secondary"} className="text-sm">
                                    {product.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Features Section */}
                          {product.features && product.features.length > 0 && (
                            <div>
                              <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Product Features
                              </h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {product.features.map((feature, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                                  >
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Benefits Section */}
                          {product.benefits && product.benefits.length > 0 && (
                            <div>
                              <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Product Benefits
                              </h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {product.benefits.map((benefit, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                                  >
                                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Usage Instructions Section */}
                          {product.usageInstructions && product.usageInstructions.length > 0 && (
                            <div>
                              <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Usage Instructions
                              </h4>
                              <div className="space-y-3">
                                {product.usageInstructions.map((instruction, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                  >
                                    <div className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm font-medium leading-relaxed">{instruction}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Warnings Section */}
                          {product.warnings && product.warnings.length > 0 && (
                            <div>
                              <h4 className="font-bold text-xl text-red-600 mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Warnings & Precautions
                              </h4>
                              <div className="space-y-3">
                                {product.warnings.map((warning, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
                                  >
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium text-red-800 leading-relaxed">{warning}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Specifications Section */}
                          {product.specifications &&
                            Object.keys(product.specifications).some(
                              (key) => product.specifications![key as keyof typeof product.specifications],
                            ) && (
                              <div>
                                <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                                  <Settings className="h-5 w-5" />
                                  Technical Specifications
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {Object.entries(product.specifications).map(([key, value]) =>
                                    value ? (
                                      <div
                                        key={key}
                                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border"
                                      >
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                          {key.replace(/([A-Z])/g, " $1").trim()}
                                        </p>
                                        <p className="text-base font-semibold text-primary">{value}</p>
                                      </div>
                                    ) : null,
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Tags Section */}
                          {product.tags && product.tags.length > 0 && (
                            <div>
                              <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Product Tags
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-sm px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Product Metadata */}
                          {(product.createdAt || product.updatedAt) && (
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <h4 className="font-semibold text-muted-foreground mb-3">Product Information</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {product.createdAt && (
                                  <div>
                                    <span className="font-medium text-muted-foreground">Created:</span>
                                    <span className="ml-2">{new Date(product.createdAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {product.updatedAt && (
                                  <div>
                                    <span className="font-medium text-muted-foreground">Last Updated:</span>
                                    <span className="ml-2">{new Date(product.updatedAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardContent>
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
