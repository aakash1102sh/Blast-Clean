"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import {
  ShoppingCart,
  PlusIcon,
  Minus,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  Trash2Icon,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import type { Product, Order } from "@/lib/types"

interface OrdersPageProps {
  orders: Order[]
  products: Product[]
  setOrders: (orders: Order[]) => void
  setProducts: (products: Product[]) => void
  showNotification: (type: "success" | "error", message: string) => void
  fetchData: () => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
}

export function OrdersPage({
  orders,
  products,
  setOrders,
  setProducts,
  showNotification,
  fetchData,
  loading,
  setLoading,
}: OrdersPageProps) {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    storeName: "",
    address: "",
    phone: "",
    email: "",
    products: [{ productId: "", productName: "", quantity: 1 }],
  })

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!orderForm.customerName.trim()) {
      showNotification("error", "Customer name is required")
      return
    }
    if (!orderForm.storeName.trim()) {
      showNotification("error", "Store name is required")
      return
    }
    if (!orderForm.address.trim()) {
      showNotification("error", "Address is required")
      return
    }
    if (!orderForm.phone.trim()) {
      showNotification("error", "Phone number is required")
      return
    }
    if (!orderForm.email.trim()) {
      showNotification("error", "Email is required")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(orderForm.email)) {
      showNotification("error", "Please enter a valid email address")
      return
    }

    // Validate products
    const validProducts = orderForm.products.filter((p) => p.productId && p.productName && p.quantity > 0)
    if (validProducts.length === 0) {
      showNotification("error", "Please select at least one product")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderForm,
          products: validProducts,
        }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        showNotification("success", result.message || "Order created successfully!")
        setOrderForm({
          customerName: "",
          storeName: "",
          address: "",
          phone: "",
          email: "",
          products: [{ productId: "", productName: "", quantity: 1 }],
        })
        setShowOrderForm(false)
        await fetchData()
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Order creation error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to create order")
    } finally {
      setLoading(false)
    }
  }

  const addProductToOrder = () => {
    setOrderForm((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", productName: "", quantity: 1 }],
    }))
  }

  const removeProductFromOrder = (index: number) => {
    setOrderForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  const updateOrderProduct = (index: number, field: string, value: any) => {
    setOrderForm((prev) => ({
      ...prev,
      products: prev.products.map((product, i) => (i === index ? { ...product, [field]: value } : product)),
    }))
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        showNotification("success", result.message || "Order updated successfully!")
        await fetchData()
      } else {
        throw new Error(result.error || "Failed to update order")
      }
    } catch (error) {
      console.error("Order update error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to update order")
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (response.ok && result.success) {
        showNotification("success", result.message || "Order deleted successfully!")
        await fetchData()
      } else {
        throw new Error(result.error || "Failed to delete order")
      }
    } catch (error) {
      console.error("Order deletion error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to delete order")
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  // Group orders by date
  const groupOrdersByDate = (orders: Order[]) => {
    const grouped: { [key: string]: Order[] } = {}
    orders.forEach((order) => {
      const date = order.createdAt ? new Date(order.createdAt).toDateString() : "Unknown Date"
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(order)
    })
    return grouped
  }

  const groupedOrders = groupOrdersByDate(orders)

  return (
    <div className="space-y-6">
      {/* Header with Add Order Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-muted-foreground">Manage customer orders and track their status</p>
        </div>
        <Button
          onClick={() => setShowOrderForm(true)}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          size="lg"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Order
        </Button>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedOrders).map(([date, dateOrders]) => (
            <Card key={date}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{date}</CardTitle>
                  <Badge variant="outline">{dateOrders.length} orders</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dateOrders.map((order) => (
                    <div key={order._id} className="border rounded-lg">
                      {/* Order Header - Always Visible */}
                      <div className="p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col space-y-2 sm:space-y-1">
                              <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 space-y-1 xs:space-y-0">
                                <h3 className="text-base sm:text-lg font-semibold truncate">{order.customerName}</h3>
                                <Badge
                                  variant={order.status === "completed" ? "default" : "secondary"}
                                  className="self-start xs:self-center"
                                >
                                  {order.status || "pending"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{order.storeName}</p>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <span>{order.products.length} products</span>
                                <span className="hidden xs:inline">•</span>
                                <span className="truncate max-w-[200px] sm:max-w-none">{order.email}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline">{order.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleOrderExpansion(order._id!)}
                              className="bg-transparent text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <EyeIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden xs:inline">
                                {expandedOrders.has(order._id!) ? "Hide" : "View"}
                              </span>
                              <span className="xs:hidden">{expandedOrders.has(order._id!) ? "Hide" : "View"}</span>
                              {expandedOrders.has(order._id!) ? (
                                <ChevronUpIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <ChevronDownIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>

                            <Select
                              value={order.status || "pending"}
                              onValueChange={(value) => updateOrderStatus(order._id!, value)}
                            >
                              <SelectTrigger className="w-20 xs:w-24 sm:w-32 text-xs sm:text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteOrder(order._id!)}
                              className="text-red-500 hover:bg-red-50 bg-transparent p-1 sm:p-2"
                              disabled={loading}
                            >
                              <Trash2Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Order Details */}
                      <Collapsible open={expandedOrders.has(order._id!)}>
                        <CollapsibleContent>
                          <div className="border-t px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-muted/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              {/* Customer Information */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-primary text-sm sm:text-base border-b pb-2">
                                  Customer Information
                                </h4>
                                <div className="space-y-2 text-xs sm:text-sm">
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-muted-foreground">Name:</span>
                                    <span className="col-span-2 break-words">{order.customerName}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-muted-foreground">Store:</span>
                                    <span className="col-span-2 break-words">{order.storeName}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-muted-foreground">Email:</span>
                                    <span className="col-span-2 break-all">{order.email}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-muted-foreground">Phone:</span>
                                    <span className="col-span-2">{order.phone}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-muted-foreground">Address:</span>
                                    <span className="col-span-2 break-words">{order.address}</span>
                                  </div>
                                  {order.createdAt && (
                                    <div className="grid grid-cols-3 gap-2">
                                      <span className="font-medium text-muted-foreground">Date:</span>
                                      <span className="col-span-2 text-xs">
                                        {new Date(order.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Products Information */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-primary text-sm sm:text-base border-b pb-2">
                                  Products Ordered
                                </h4>
                                <div className="space-y-2 sm:space-y-3">
                                  {order.products.map((product, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col xs:flex-row xs:justify-between xs:items-center p-2 sm:p-3 bg-background rounded-lg space-y-1 xs:space-y-0"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium text-sm truncate">{product.productName}</div>
                                        <div className="text-xs text-muted-foreground">Qty: {product.quantity}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first order</p>
              <Button onClick={() => setShowOrderForm(true)} className="bg-primary hover:bg-primary/90" size="lg">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add First Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Order Dialog */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add New Order</DialogTitle>
            <DialogDescription className="text-sm">Create a new order for a customer</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOrderSubmit} className="space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-primary border-b pb-2 text-sm sm:text-base">Customer Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="customerName" className="text-sm">
                    Customer Name *
                  </Label>
                  <Input
                    id="customerName"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                    placeholder="e.g., John Doe"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="storeName" className="text-sm">
                    Store Name *
                  </Label>
                  <Input
                    id="storeName"
                    value={orderForm.storeName}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, storeName: e.target.value }))}
                    required
                    placeholder="e.g., ABC Store"
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm">
                  Address *
                </Label>
                <Input
                  id="address"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  placeholder="Complete address"
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="Phone number"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="Email address"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-primary border-b pb-2 text-sm sm:text-base">Products</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProductToOrder}
                  className="bg-transparent text-xs sm:text-sm"
                >
                  <PlusIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add
                </Button>
              </div>

              {orderForm.products.map((product, index) => (
                <div
                  key={index}
                  className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-end p-3 border rounded-lg"
                >
                  <div className="sm:col-span-7">
                    <Label htmlFor={`product-${index}`} className="text-sm">
                      Product
                    </Label>
                    <Select
                      value={product.productId}
                      onValueChange={(value) => {
                        const selectedProduct = products.find((p) => p._id === value)
                        updateOrderProduct(index, "productId", value)
                        updateOrderProduct(index, "productName", selectedProduct?.name || "")
                      }}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p._id} value={p._id!} className="text-sm">
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-3">
                    <Label htmlFor={`quantity-${index}`} className="text-sm">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateOrderProduct(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      placeholder="1"
                      className="text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    {orderForm.products.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProductFromOrder(index)}
                        className="w-full sm:w-auto text-red-500 bg-transparent text-xs sm:text-sm"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOrderForm(false)}
                className="flex-1 bg-transparent text-sm"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-sm" disabled={loading}>
                <PlusIcon className="mr-2 h-4 w-4" />
                {loading ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
