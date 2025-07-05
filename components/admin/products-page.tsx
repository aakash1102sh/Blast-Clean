"use client"

import type React from "react"

import { useState } from "react"
import { Package, PlusIcon, Minus, Trash2Icon, Upload, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/types"

interface ProductsPageProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  showNotification: (type: "success" | "error", message: string) => void
  fetchData: () => Promise<void>
  checkDatabaseStatus: () => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
}

export function ProductsPage({
  products,
  setProducts,
  showNotification,
  fetchData,
  checkDatabaseStatus,
  loading,
  setLoading,
}: ProductsPageProps) {
  const [productForm, setProductForm] = useState({
    name: "",
    image: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
    features: [""],
    benefits: [""],
    usageInstructions: [""],
    warnings: [""],
    specifications: {
      size: "",
      weight: "",
      fragrance: "",
      type: "",
    },
    tags: [""],
    isActive: true,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">("url")

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification("error", "Please select a valid image file")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("error", "Image size should be less than 5MB")
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setProductForm(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImageFile = () => {
    setImageFile(null)
    setImagePreview("")
    setProductForm(prev => ({ ...prev, image: "" }))
  }

  const addArrayItem = (field: keyof typeof productForm, value = "") => {
    if (Array.isArray(productForm[field])) {
      setProductForm((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value],
      }))
    }
  }

  const removeArrayItem = (field: keyof typeof productForm, index: number) => {
    if (Array.isArray(productForm[field])) {
      setProductForm((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }))
    }
  }

  const updateArrayItem = (field: keyof typeof productForm, index: number, value: string) => {
    if (Array.isArray(productForm[field])) {
      setProductForm((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).map((item, i) => (i === index ? value : item)),
      }))
    }
  }

  const updateSpecification = (key: string, value: string) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }))
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productForm.name.trim()) {
      showNotification("error", "Product name is required")
      return
    }
    if (!productForm.description.trim()) {
      showNotification("error", "Product description is required")
      return
    }
    if (!productForm.category.trim()) {
      showNotification("error", "Product category is required")
      return
    }

    const cleanedForm = {
      ...productForm,
      features: productForm.features.filter((f) => f.trim()),
      benefits: productForm.benefits.filter((b) => b.trim()),
      usageInstructions: productForm.usageInstructions.filter((u) => u.trim()),
      warnings: productForm.warnings.filter((w) => w.trim()),
      tags: productForm.tags.filter((t) => t.trim()),
      price: productForm.price ? Number.parseFloat(productForm.price) : undefined,
      stockQuantity: productForm.stockQuantity ? Number.parseInt(productForm.stockQuantity) : undefined,
    }

    setLoading(true)
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedForm),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        showNotification("success", result.message || "Product added successfully!")
        setProductForm({
          name: "",
          image: "",
          description: "",
          category: "",
          price: "",
          stockQuantity: "",
          features: [""],
          benefits: [""],
          usageInstructions: [""],
          warnings: [""],
          specifications: { size: "", weight: "", fragrance: "", type: "" },
          tags: [""],
          isActive: true,
        })
        setImageFile(null)
        setImagePreview("")
        await fetchData()
        await checkDatabaseStatus()
      } else {
        throw new Error(result.error || "Failed to add product")
      }
    } catch (error) {
      console.error("Product creation error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (response.ok && result.success) {
        showNotification("success", result.message || "Product deleted successfully!")
        await fetchData()
        await checkDatabaseStatus()
      } else {
        throw new Error(result.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Product deletion error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Product Form */}
        <Card className="lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Add a comprehensive product with detailed information</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleProductSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-primary border-b pb-2">Basic Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={productForm.name}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="e.g., BLAST CLEAN Floor Cleaner"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory">Category *</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="floor-cleaners">Floor Cleaners</SelectItem>
                        <SelectItem value="surface-cleaners">Surface Cleaners</SelectItem>
                        <SelectItem value="bathroom-cleaners">Bathroom Cleaners</SelectItem>
                        <SelectItem value="kitchen-cleaners">Kitchen Cleaners</SelectItem>
                        <SelectItem value="glass-cleaners">Glass Cleaners</SelectItem>
                        <SelectItem value="disinfectants">Disinfectants</SelectItem>
                        <SelectItem value="detergents">Detergents</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productPrice">Price (Optional)</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity (Optional)</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, stockQuantity: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active Product</Label>
                </div>

                {/* Product Image Section */}
                <div className="space-y-4">
                  <Label>Product Image</Label>
                  <Tabs value={imageUploadMethod} onValueChange={(value) => setImageUploadMethod(value as "url" | "upload")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url">Image URL</TabsTrigger>
                      <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-3">
                      <Input
                        value={productForm.image}
                        onChange={(e) => {
                          setProductForm((prev) => ({ ...prev, image: e.target.value }))
                          setImagePreview("")
                          setImageFile(null)
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                      {productForm.image && !imagePreview && (
                        <div className="mt-2">
                          <img
                            src={productForm.image || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="upload" className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="imageUpload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                          </div>
                          <input
                            id="imageUpload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageFileChange}
                          />
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                            onClick={removeImageFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <Label htmlFor="productDescription">Product Description *</Label>
                  <Textarea
                    id="productDescription"
                    value={productForm.description}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    placeholder="Brief description of the product"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary border-b pb-2">Product Features</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("features")}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {productForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem("features", index, e.target.value)}
                      placeholder="e.g., Extra Power Formula"
                      className="flex-1"
                    />
                    {productForm.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("features", index)}
                        className="text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Benefits Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary border-b pb-2">Product Benefits</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("benefits")}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {productForm.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateArrayItem("benefits", index, e.target.value)}
                      placeholder="e.g., Removes tough stains"
                      className="flex-1"
                    />
                    {productForm.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("benefits", index)}
                        className="text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Usage Instructions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary border-b pb-2">Usage Instructions</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("usageInstructions")}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {productForm.usageInstructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={instruction}
                      onChange={(e) => updateArrayItem("usageInstructions", index, e.target.value)}
                      placeholder="e.g., Apply directly to surface"
                      className="flex-1"
                    />
                    {productForm.usageInstructions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("usageInstructions", index)}
                        className="text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Warnings Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary border-b pb-2">Warnings & Precautions</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("warnings")}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {productForm.warnings.map((warning, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={warning}
                      onChange={(e) => updateArrayItem("warnings", index, e.target.value)}
                      placeholder="e.g., Keep away from children"
                      className="flex-1"
                    />
                    {productForm.warnings.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("warnings", index)}
                        className="text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Specifications Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-primary border-b pb-2">Technical Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specSize">Size</Label>
                    <Input
                      id="specSize"
                      value={productForm.specifications.size}
                      onChange={(e) => updateSpecification("size", e.target.value)}
                      placeholder="e.g., 500ml"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specWeight">Weight</Label>
                    <Input
                      id="specWeight"
                      value={productForm.specifications.weight}
                      onChange={(e) => updateSpecification("weight", e.target.value)}
                      placeholder="e.g., 600g"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specFragrance">Fragrance</Label>
                    <Input
                      id="specFragrance"
                      value={productForm.specifications.fragrance}
                      onChange={(e) => updateSpecification("fragrance", e.target.value)}
                      placeholder="e.g., Lemon Fresh"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specType">Type</Label>
                    <Input
                      id="specType"
                      value={productForm.specifications.type}
                      onChange={(e) => updateSpecification("type", e.target.value)}
                      placeholder="e.g., Liquid"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary border-b pb-2">Product Tags</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tags")}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {productForm.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateArrayItem("tags", index, e.target.value)}
                      placeholder="e.g., eco-friendly"
                      className="flex-1"
                    />
                    {productForm.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("tags", index)}
                        className="text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={loading}>
                <PlusIcon className="mr-2 h-4 w-4" />
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Manage your comprehensive product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col space-y-4">
                      {/* Product Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline">{product.category || "Uncategorized"}</Badge>
                            {product.price && <span className="text-sm font-medium">${product.price}</span>}
                            {product.stockQuantity !== undefined && (
                              <span className="text-sm text-muted-foreground">Stock: {product.stockQuantity}</span>
                            )}
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:bg-red-50 self-start bg-transparent"
                          onClick={() => deleteProduct(product._id!)}
                          disabled={loading}
                        >
                          <Trash2Icon className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* Product Image */}
                      {product.image && (
                        <div className="w-full h-32 sm:h-40 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      )}

                      {/* Features & Benefits */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {product.features && product.features.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-2">Features:</h4>
                            <ul className="text-sm space-y-1">
                              {product.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {product.benefits && product.benefits.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-2">Benefits:</h4>
                            <ul className="text-sm space-y-1">
                              {product.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-600 mr-2">✓</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Products Yet</h3>
                <p className="text-muted-foreground">Add your first product with comprehensive details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
