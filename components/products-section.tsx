"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  Calendar,
  Eye,
  ShoppingCart,
} from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/types"

interface ProductsSectionProps {
  products: Product[]
}

interface ProductDetailModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-base">Complete product information from admin form</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-140px)] pr-4">
          <div className="space-y-8">
            {/* Hero Section - Product Image and Key Info */}
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Product Image */}
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={product.image || "/placeholder.svg?height=500&width=500"}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=500&width=500"
                    }}
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order Now
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Overview - Form Data Display */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-3">{product.name}</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Key Metrics Grid - Form Data */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {product.category && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Category</p>
                      <Badge variant="outline" className="text-sm font-medium">
                        {product.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </div>
                  )}

                  {product.price && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Price</p>
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-xl font-bold text-green-600">${product.price}</span>
                      </div>
                    </div>
                  )}

                  {product.stockQuantity !== undefined && (
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                        Stock Quantity
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Package className="h-5 w-5 text-purple-600" />
                        <span className="text-xl font-bold text-purple-600">{product.stockQuantity}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Features Preview - Form Data */}
                {product.features && product.features.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Product Features (From Admin Form)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {product.features.length > 4 && (
                        <div className="text-sm text-blue-600 font-medium">
                          +{product.features.length - 4} more features below
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            {/* Form Data Sections */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6" />
                Product Information from Admin Form
              </h2>
              <p className="text-blue-700 mb-6">All data entered through the product management form</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm font-medium text-gray-600">Product Name</p>
                      <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <p className="text-base text-gray-900">
                        {product.category
                          ? product.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                          : "Not specified"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-600">Price</p>
                        <p className="text-base font-semibold text-green-600">
                          {product.price ? `$${product.price}` : "Not specified"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-600">Stock Quantity</p>
                        <p className="text-base font-semibold text-purple-600">
                          {product.stockQuantity !== undefined ? `${product.stockQuantity} units` : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
                    Product Description
                  </h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Features Section - Form Data */}
            {product.features && product.features.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Product Features</h3>
                    <p className="text-gray-600">Features entered in the admin form</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Form Data Sections */}
            {product.benefits && product.benefits.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Product Benefits</h3>
                    <p className="text-gray-600">Benefits entered in the admin form</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                    >
                      <Award className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Usage Instructions Section */}
            {product.usageInstructions && product.usageInstructions.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Usage Instructions</h3>
                    <p className="text-gray-600">Instructions entered in the admin form</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {product.usageInstructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-indigo-50 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow"
                    >
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800 leading-relaxed">{instruction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Warnings Section */}
            {product.warnings && product.warnings.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Warnings & Precautions</h3>
                    <p className="text-gray-600">Safety warnings entered in the admin form</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {product.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow"
                    >
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-1 shrink-0" />
                      <span className="text-sm font-medium text-red-800 leading-relaxed">{warning}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Technical Specifications Section */}
            {product.specifications &&
              Object.keys(product.specifications).some(
                (key) => product.specifications![key as keyof typeof product.specifications],
              ) && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Settings className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Technical Specifications</h3>
                      <p className="text-gray-600">Specifications entered in the admin form</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) =>
                      value ? (
                        <div
                          key={key}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-lg font-semibold text-gray-800">{value}</p>
                        </div>
                      ) : null,
                    )}
                  </div>
                </section>
              )}

            {/* Tags Section */}
            {product.tags && product.tags.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Tag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Product Tags</h3>
                    <p className="text-gray-600">Tags entered in the admin form</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm px-4 py-2 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Product Metadata */}
            {(product.createdAt || product.updatedAt) && (
              <section className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Product Information</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {product.createdAt && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">Created:</span>
                      <span className="text-gray-800">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {product.updatedAt && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">Last Updated:</span>
                      <span className="text-gray-800">{new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

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
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col h-full group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg?height=200&width=200"}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
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
                  </div>

                  {/* Product Content */}
                  <CardHeader className="pb-3 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg leading-tight line-clamp-2">
                          {product.name}
                        </CardTitle>
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
                    <Button
                      variant="outline"
                      className="w-full text-sm bg-transparent hover:bg-primary hover:text-white transition-colors"
                      onClick={() => handleViewDetails(product)}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
              <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
          </>
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
