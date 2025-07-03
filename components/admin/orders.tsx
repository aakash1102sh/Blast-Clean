import { Order, Product } from "@/lib/models"
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { PlusIcon, CalendarIcon, EyeIcon, ChevronUpIcon, ChevronDownIcon, Trash2Icon, ShoppingCart } from "lucide-react"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { DialogHeader } from "../ui/dialog"
import { Textarea } from "../ui/textarea"

export function OrdersPage({
  orders,
  products,
  setOrders,
  setProducts,
  showNotification,
  fetchData,
  loading,
  setLoading,
}: {
  orders: Order[]
  products: Product[]
  setOrders: (orders: Order[]) => void
  setProducts: (products: Product[]) => void
  showNotification: (type: "success" | "error", message: string) => void
  fetchData: () => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
}) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Order Management</h2>
          <Button onClick={() => setShowOrderForm(true)} className="bg-primary hover:bg-primary/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Order Form Dialog */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Add a new order for a customer</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={orderForm.customerName}
                  onChange={(e: { target: { value: any } }) => setOrderForm((prev) => ({ ...prev, customerName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={orderForm.storeName}
                  onChange={(e: { target: { value: any } }) => setOrderForm((prev) => ({ ...prev, storeName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={orderForm.address}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={orderForm.phone}
                  onChange={(e: { target: { value: any } }) => setOrderForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={orderForm.email}
                  onChange={(e: { target: { value: any } }) => setOrderForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Products *</Label>
              {orderForm.products.map((product, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                  <Select
                    value={product.productId}
                    onValueChange={(value) => {
                      const selectedProduct = products.find((p) => p._id === value)
                      updateOrderProduct(index, "productId", value)
                      updateOrderProduct(index, "productName", selectedProduct?.name || "")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id!}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    min="1"
                    value={product.quantity}
                    onChange={(e: { target: { value: string } }) => updateOrderProduct(index, "quantity", Number.parseInt(e.target.value) || 1)}
                  />
                  {orderForm.products.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProductFromOrder(index)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProductToOrder}
                className="mt-2 bg-transparent"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowOrderForm(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Creating..." : "Save Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Orders List by Date */}
      <div className="space-y-6">
        {orders.length > 0 ? (
          Object.entries(groupOrdersByDate(orders)).map(([date, dateOrders]) => (
            <Card key={date}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{date}</CardTitle>
                  <Badge variant="secondary" className="ml-auto">
                    {dateOrders.length} orders
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dateOrders.map((order) => (
                    <div key={order._id} className="border rounded-lg">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">{order.storeName}</p>
                              </div>
                              <Badge
                                variant={order.status === "pending" ? "secondary" : "default"}
                                className={
                                  order.status === "pending" ? "bg-secondary text-white" : "bg-primary text-white"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => toggleOrderExpansion(order._id!)}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View More
                              {expandedOrders.has(order._id!) ? (
                                <ChevronUpIcon className="ml-2 h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteOrder(order._id!)}
                              disabled={loading}
                              className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Collapsible open={expandedOrders.has(order._id!)}>
                        <CollapsibleContent>
                          <div className="border-t p-4 bg-muted/30">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Customer Details</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Name:</span> {order.customerName}
                                  </p>
                                  <p>
                                    <span className="font-medium">Shop:</span> {order.storeName}
                                  </p>
                                  <p>
                                    <span className="font-medium">Phone:</span> {order.phone}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span> {order.email}
                                  </p>
                                  <p>
                                    <span className="font-medium">Address:</span> {order.address}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Products Required</h4>
                                <div className="space-y-1 text-sm">
                                  {order.products.map((product, index) => (
                                    <p key={index}>
                                      <span className="font-medium">{product.productName}</span> - Qty:{" "}
                                      {product.quantity}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {order.status === "pending" && (
                              <div className="mt-4 pt-4 border-t flex space-x-2">
                                <Button
                                  onClick={() => updateOrderStatus(order._id!, "completed")}
                                  disabled={loading}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Mark as Complete
                                </Button>
                                <Button
                                  onClick={() => updateOrderStatus(order._id!, "cancelled")}
                                  disabled={loading}
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  Cancel Order
                                </Button>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first order</p>
              <Button onClick={() => setShowOrderForm(true)} className="bg-primary hover:bg-primary/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create First Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}