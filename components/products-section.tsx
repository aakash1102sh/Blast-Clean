"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Award,
  Eye,
  Star,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  DollarSign,
  Package,
  Info,
  X,
} from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
  }

  return (
    <section id="products" className="py-20 bg-blue-50">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">OUR PRODUCTS</h2>
          <p className="text-xl text-muted-foreground">
            Discover our comprehensive range of professional cleaning solutions
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[4/3] bg-muted">
                  <img
                    src={product.image || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 sm:p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=300&width=300"
                    }}
                  />
                </div>
                <CardHeader className="p-3 sm:p-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <CardTitle className="text-sm sm:text-lg line-clamp-2">{product.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3">
                      {product.category && (
                        <Badge variant="outline" className="text-xs">
                          {product.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      )}
                      {product.price && (
                        <span className="text-xs sm:text-sm font-semibold text-green-600">${product.price}</span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openProductModal(product)}
                      className="w-full bg-transparent gradient-primary backdrop-blur supports-[backdrop-filter]:bg-background/60 text-white text-xs sm:text-sm"
                    >
                      <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      View More
                    </Button>
                  </div>
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

        {/* Product Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] p-0 overflow-hidden">
            {/* Custom Header with Single Close Button */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary">Product Details</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Complete product information and specifications
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeProductModal}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {selectedProduct && (
              <ScrollArea className="max-h-[calc(95vh-120px)] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  {/* Mobile Layout - Stacked */}
                  <div className="block lg:hidden space-y-6">
                    {/* Product Image */}
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={selectedProduct.image || "/placeholder.svg?height=400&width=400"}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain p-4 sm:p-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=400&width=400"
                          }}
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                      {/* Product Name */}
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-blue-800">Product Name</h3>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{selectedProduct.name}</p>
                      </div>

                      {/* Category */}
                      <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-purple-800">Category</h3>
                        </div>
                        <Badge variant="outline" className="text-sm sm:text-base px-2 sm:px-3 py-1">
                          {selectedProduct.category
                            ? selectedProduct.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                            : "Not specified"}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-green-800">Price</h3>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-green-700">
                          {selectedProduct.price ? `$${selectedProduct.price}` : "Contact for pricing"}
                        </p>
                      </div>

                      {/* Stock Quantity */}
                      <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-orange-800">Stock Quantity</h3>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-orange-700">
                          {selectedProduct.stockQuantity !== undefined
                            ? `${selectedProduct.stockQuantity} units available`
                            : "Contact for availability"}
                        </p>
                      </div>

                      {/* Product Description */}
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Product Description</h3>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {selectedProduct.description}
                        </p>
                      </div>

                      {/* Product Features */}
                      {selectedProduct.features && selectedProduct.features.length > 0 && (
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <h3 className="text-base sm:text-lg font-semibold text-green-800">Product Features</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedProduct.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 shrink-0" />
                                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Product Benefits */}
                      {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <h3 className="text-base sm:text-lg font-semibold text-blue-800">Product Benefits</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedProduct.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5 shrink-0" />
                                <span className="text-sm sm:text-base text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Usage Instructions */}
                      {selectedProduct.usageInstructions && selectedProduct.usageInstructions.length > 0 && (
                        <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border border-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                            <h3 className="text-base sm:text-lg font-semibold text-indigo-800">Usage Instructions</h3>
                          </div>
                          <div className="space-y-3">
                            {selectedProduct.usageInstructions.map((instruction, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="bg-indigo-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-sm sm:text-base text-gray-700">{instruction}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings & Precautions */}
                      {selectedProduct.warnings && selectedProduct.warnings.length > 0 && (
                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                            <h3 className="text-base sm:text-lg font-semibold text-red-800">Warnings & Precautions</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedProduct.warnings.map((warning, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mt-0.5 shrink-0" />
                                <span className="text-sm sm:text-base text-red-800 font-medium">{warning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Specifications */}
                      {selectedProduct.specifications &&
                        Object.keys(selectedProduct.specifications).some(
                          (key) => selectedProduct.specifications![key as keyof typeof selectedProduct.specifications],
                        ) && (
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                                Technical Specifications
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {Object.entries(selectedProduct.specifications).map(([key, value]) =>
                                value ? (
                                  <div key={key} className="bg-white p-3 rounded-lg border">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-800">{value}</p>
                                  </div>
                                ) : null,
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Desktop Layout - Side by Side */}
                  <div className="hidden lg:grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Product Image */}
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-md aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={selectedProduct.image || "/placeholder.svg?height=500&width=500"}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain p-8"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=500&width=500"
                          }}
                        />
                      </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="space-y-6">
                      {/* Product Name */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-blue-800">Product Name</h3>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{selectedProduct.name}</p>
                      </div>

                      {/* Category */}
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg font-semibold text-purple-800">Category</h3>
                        </div>
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {selectedProduct.category
                            ? selectedProduct.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                            : "Not specified"}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-800">Price</h3>
                        </div>
                        <p className="text-xl font-bold text-green-700">
                          {selectedProduct.price ? `$${selectedProduct.price}` : "Contact for pricing"}
                        </p>
                      </div>

                      {/* Stock Quantity */}
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-orange-600" />
                          <h3 className="text-lg font-semibold text-orange-800">Stock Quantity</h3>
                        </div>
                        <p className="text-xl font-bold text-orange-700">
                          {selectedProduct.stockQuantity !== undefined
                            ? `${selectedProduct.stockQuantity} units available`
                            : "Contact for availability"}
                        </p>
                      </div>

                      {/* Product Description */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-800">Product Description</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                      </div>

                      {/* Product Features */}
                      {selectedProduct.features && selectedProduct.features.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-800">Product Features</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedProduct.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Product Benefits */}
                      {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-blue-800">Product Benefits</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedProduct.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Award className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                <span className="text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Usage Instructions */}
                      {selectedProduct.usageInstructions && selectedProduct.usageInstructions.length > 0 && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-indigo-800">Usage Instructions</h3>
                          </div>
                          <div className="space-y-3">
                            {selectedProduct.usageInstructions.map((instruction, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-gray-700">{instruction}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings & Precautions */}
                      {selectedProduct.warnings && selectedProduct.warnings.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="text-lg font-semibold text-red-800">Warnings & Precautions</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedProduct.warnings.map((warning, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                <span className="text-red-800 font-medium">{warning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Specifications */}
                      {selectedProduct.specifications &&
                        Object.keys(selectedProduct.specifications).some(
                          (key) => selectedProduct.specifications![key as keyof typeof selectedProduct.specifications],
                        ) && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Settings className="h-5 w-5 text-gray-600" />
                              <h3 className="text-lg font-semibold text-gray-800">Technical Specifications</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(selectedProduct.specifications).map(([key, value]) =>
                                value ? (
                                  <div key={key} className="bg-white p-3 rounded-lg border">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">{value}</p>
                                  </div>
                                ) : null,
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
