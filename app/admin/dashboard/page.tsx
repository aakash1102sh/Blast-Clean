"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingBag,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Plus,
  RotateCcw,
  Menu,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { Product, Order, Customer } from "@/lib/models"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const router = useRouter()

  // Add these state variables after the existing ones:
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    storeName: "",
    address: "",
    phone: "",
    email: "",
    products: [{ productId: "", productName: "", quantity: 1 }],
  })

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    image: "",
    description: "",
  })

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminLoggedIn")) {
      router.push("/admin/login")
      return
    }

    fetchData()
  }, [])

  // Update the fetchData function:
  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/customers", { cache: "no-store" }),
      ])

      // Handle individual response errors
      const productsData = productsRes.ok ? await productsRes.json() : []
      const ordersData = ordersRes.ok ? await ordersRes.json() : []
      const customersData = customersRes.ok ? await customersRes.json() : []

      setProducts(Array.isArray(productsData) ? productsData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setCustomers(Array.isArray(customersData) ? customersData : [])

      // Show error if any fetch failed
      if (!productsRes.ok || !ordersRes.ok || !customersRes.ok) {
        showNotification("error", "Some data could not be loaded. Please check your database connection.")
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      showNotification("error", "Failed to fetch data. Please check your database connection.")
      // Set empty arrays as fallback
      setProducts([])
      setOrders([])
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // Add notification helper:
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Update handleOrderSubmit with better validation:
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

  // Update handleProductSubmit with better validation:
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!productForm.name.trim()) {
      showNotification("error", "Product name is required")
      return
    }
    if (!productForm.description.trim()) {
      showNotification("error", "Product description is required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showNotification("success", result.message || "Product added successfully!")
        setProductForm({ name: "", image: "", description: "" })
        await fetchData()
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

  // Add order status update function:
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

  // Add product deletion function:
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

  const handleRepeatOrder = (customer: Customer) => {
    // Find the last order for this customer
    const customerOrders = orders.filter((order) => order.email === customer.email)
    if (customerOrders.length > 0) {
      const lastOrder = customerOrders[0]
      setOrderForm({
        customerName: customer.name,
        storeName: customer.storeName,
        address: customer.address,
        phone: customer.phone,
        email: customer.email,
        products: lastOrder.products,
      })
      setActiveTab("orders")
      setShowOrderForm(true)
      setSidebarOpen(false) // Close sidebar when navigating
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false) // Close sidebar when tab changes
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

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full gradient-primary">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={activeTab === "orders" ? "secondary" : "ghost"}
          className={`w-full justify-start ${
            activeTab === "orders" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => handleTabChange("orders")}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Orders
        </Button>
        <Button
          variant={activeTab === "customers" ? "secondary" : "ghost"}
          className={`w-full justify-start ${
            activeTab === "customers" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => handleTabChange("customers")}
        >
          <Users className="mr-2 h-4 w-4" />
          Customers
        </Button>
        <Button
          variant={activeTab === "products" ? "secondary" : "ghost"}
          className={`w-full justify-start ${
            activeTab === "products" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => handleTabChange("products")}
        >
          <Package className="mr-2 h-4 w-4" />
          Products
        </Button>
        <Button
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          className={`w-full justify-start ${
            activeTab === "settings" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => handleTabChange("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>

      <div className="p-4 border-t border-white/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-200 hover:text-red-100 hover:bg-red-500/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 gradient-primary border-r">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            </div>
            <div className="flex items-center space-x-2">
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {notification && (
            <Alert
              className={`fixed top-4 right-4 z-50 w-96 ${
                notification.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
                {notification.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold">Order Management</h2>
                    <Button onClick={() => setShowOrderForm(true)} className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
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
                            onChange={(e) => setOrderForm((prev) => ({ ...prev, customerName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="storeName">Store Name *</Label>
                          <Input
                            id="storeName"
                            value={orderForm.storeName}
                            onChange={(e) => setOrderForm((prev) => ({ ...prev, storeName: e.target.value }))}
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
                            onChange={(e) => setOrderForm((prev) => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={orderForm.email}
                            onChange={(e) => setOrderForm((prev) => ({ ...prev, email: e.target.value }))}
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
                              onChange={(e) =>
                                updateOrderProduct(index, "quantity", Number.parseInt(e.target.value) || 1)
                              }
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
                        <Button type="button" variant="outline" size="sm" onClick={addProductToOrder} className="mt-2">
                          <Plus className="mr-2 h-4 w-4" />
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
                            <Calendar className="h-5 w-5 text-primary" />
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
                                            order.status === "pending"
                                              ? "bg-secondary text-white"
                                              : "bg-primary text-white"
                                          }
                                        >
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => toggleOrderExpansion(order._id!)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View More
                                      {expandedOrders.has(order._id!) ? (
                                        <ChevronUp className="ml-2 h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                      )}
                                    </Button>
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
                                        <div className="mt-4 pt-4 border-t">
                                          <Button
                                            onClick={() => updateOrderStatus(order._id!, "completed")}
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            Mark as Complete
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
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Order
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === "customers" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>Manage your customers and their order history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {customers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Name</th>
                              <th className="text-left p-2 hidden sm:table-cell">Store</th>
                              <th className="text-left p-2">Email</th>
                              <th className="text-left p-2 hidden md:table-cell">Phone</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customers.map((customer) => (
                              <tr key={customer._id} className="border-b">
                                <td className="p-2 font-medium">{customer.name}</td>
                                <td className="p-2 hidden sm:table-cell">{customer.storeName}</td>
                                <td className="p-2">{customer.email}</td>
                                <td className="p-2 hidden md:table-cell">{customer.phone}</td>
                                <td className="p-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                                    onClick={() => handleRepeatOrder(customer)}
                                  >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Repeat Order</span>
                                    <span className="sm:hidden">Repeat</span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Customers Yet</h3>
                        <p className="text-muted-foreground">Customers will appear here when you create orders</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Add Product Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Product</CardTitle>
                      <CardDescription>Add a new product to your catalog</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="productName">Product Name *</Label>
                          <Input
                            id="productName"
                            value={productForm.name}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="productImage">Product Image URL</Label>
                          <Input
                            id="productImage"
                            value={productForm.image}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productDescription">Product Description *</Label>
                          <Textarea
                            id="productDescription"
                            value={productForm.description}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                          <Plus className="mr-2 h-4 w-4" />
                          {loading ? "Adding..." : "Add Product"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Products List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Catalog</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {products.length > 0 ? (
                        <div className="space-y-4">
                          {products.map((product) => (
                            <div key={product._id} className="border rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="w-full sm:w-16 h-32 sm:h-16 bg-muted rounded-lg overflow-hidden">
                                  <img
                                    src={product.image || "/placeholder.svg?height=64&width=64"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-500 hover:bg-red-50 self-start"
                                  onClick={() => deleteProduct(product._id!)}
                                  disabled={loading}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Products Yet</h3>
                          <p className="text-muted-foreground">Add your first product to get started</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Configure your application settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>WhatsApp Number</Label>
                        <Input placeholder="+1234567890" />
                        <p className="text-sm text-muted-foreground mt-1">
                          This number will be used for WhatsApp contact integration
                        </p>
                      </div>
                      <div>
                        <Label>Business Email</Label>
                        <Input placeholder="info@blastclean.com" />
                      </div>
                      <div>
                        <Label>Business Address</Label>
                        <Textarea placeholder="Enter your business address" />
                      </div>
                      <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}
