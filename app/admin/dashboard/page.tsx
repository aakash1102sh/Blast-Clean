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
  PlusIcon,
  RotateCcw,
  Menu,
  X,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  CheckCircle,
  AlertCircle,
  Trash2Icon,
  Database,
  Wifi,
  WifiOff,
  Minus,
} from "lucide-react"
import type { Product, Order, Customer } from "@/lib/models"
import { OrdersPage } from "@/components/admin/orders"

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
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean
    stats?: { products: number; orders: number; customers: number }
    error?: string
  } | null>(null)

  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    storeName: "",
    address: "",
    phone: "",
    email: "",
    products: [{ productId: "", productName: "", quantity: 1 }],
  })

  // Product form state - Replace the existing productForm state
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

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminLoggedIn")) {
      router.push("/admin/login")
      return
    }

    // Initialize dashboard
    initializeDashboard()
  }, [])

  // Initialize dashboard with database connection check
  const initializeDashboard = async () => {
    setLoading(true)
    try {
      // First check database status
      await checkDatabaseStatus()

      // Then fetch data
      await fetchData()

      showNotification("success", "Dashboard loaded successfully!")
    } catch (error) {
      console.error("Dashboard initialization error:", error)
      showNotification("error", "Failed to initialize dashboard. Please check your database connection.")
    } finally {
      setLoading(false)
    }
  }

  // Update the fetchData function:
  const fetchData = async () => {
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
        await checkDatabaseStatus() // Update stats
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

  // Helper functions for managing arrays
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

  // Update handleProductSubmit with better validation - replace the existing function
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
    if (!productForm.category.trim()) {
      showNotification("error", "Product category is required")
      return
    }

    // Filter out empty arrays
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
        headers: {
          "Content-Type": "application/json",
        },
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
          specifications: {
            size: "",
            weight: "",
            fragrance: "",
            type: "",
          },
          tags: [""],
          isActive: true,
        })
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

  // Add order deletion function:
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
        await checkDatabaseStatus() // Update stats
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
        await checkDatabaseStatus() // Update stats
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

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/db/status")
      const status = await response.json()
      setDbStatus(status)

      if (!status.connected) {
        showNotification("error", "Database connection failed. Please check your MongoDB connection.")
      }
    } catch (error) {
      console.error("Failed to check database status:", error)
      setDbStatus({ connected: false, error: "Failed to check database status" })
      showNotification("error", "Unable to connect to database. Please check your connection.")
    }
  }

  const initializeDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db/init")
      const result = await response.json()

      if (result.success) {
        showNotification("success", "Database initialized successfully!")
        await checkDatabaseStatus()
        await fetchData()
      } else {
        throw new Error(result.error || "Failed to initialize database")
      }
    } catch (error) {
      console.error("Database initialization error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to initialize database")
    } finally {
      setLoading(false)
    }
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

        {/* Database Status Indicator */}
        <div className="mt-4 flex items-center space-x-">
          {dbStatus?.connected ? (
            <Wifi className="h-4 w-4 text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-400" />
          )}
          <span className={`text-xs ${dbStatus?.connected ? "text-green-200" : "text-red-200"}`}>
            {dbStatus?.connected ? "Database Connected" : "Database Disconnected"}
          </span>
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
          {dbStatus?.stats && (
            <Badge variant="outline" className="ml-auto text-xs">
              {dbStatus.stats.orders}
            </Badge>
          )}
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
          {dbStatus?.stats && (
            <Badge variant="outline" className="ml-auto text-xs">
              {dbStatus.stats.customers}
            </Badge>
          )}
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
          {dbStatus?.stats && (
            <Badge variant="outline" className="ml-auto text-xs">
              {dbStatus.stats.products}
            </Badge>
          )}
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
              {/* Database Status in Header */}
              <div className="flex items-center space-x-2">
                {dbStatus?.connected ? (
                  <div className="flex items-center space-x-1">
                    <Database className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600 hidden sm:inline">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Database className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-red-600 hidden sm:inline">Disconnected</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
              <Button variant="outline" size="sm" onClick={checkDatabaseStatus} disabled={loading}>
                <Database className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
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
              <OrdersPage
                orders={orders}
                products={products}
                setOrders={setOrders}
                setProducts={setProducts}
                showNotification={showNotification}
                fetchData={fetchData}
                loading={loading}
                setLoading={setLoading}
              />
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
                                    className="border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
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
                  {/* Add Product Form - Replace the existing form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Product</CardTitle>
                      <CardDescription>Add a comprehensive product with detailed information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProductSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-primary border-b pb-2">Basic Information</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <div className="flex items-center space-x-2 pt-6">
                              <input
                                type="checkbox"
                                id="isActive"
                                checked={productForm.isActive}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="isActive">Active Product</Label>
                            </div>
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
                              rows={3}
                              placeholder="Brief description of the product"
                            />
                          </div>
                        </div>

                        {/* Features Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-primary border-b pb-2">Product Features</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem("features")}
                              className="bg-transparent"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add Feature
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
                                  className="text-red-500 bg-transparent"
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
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem("benefits")}
                              className="bg-transparent"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add Benefit
                            </Button>
                          </div>

                          {productForm.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={benefit}
                                onChange={(e) => updateArrayItem("benefits", index, e.target.value)}
                                placeholder="e.g., Remove Tough Stains"
                                className="flex-1"
                              />
                              {productForm.benefits.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem("benefits", index)}
                                  className="text-red-500 bg-transparent"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Usage Instructions */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-primary border-b pb-2">Usage Instructions</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem("usageInstructions")}
                              className="bg-transparent"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add Instruction
                            </Button>
                          </div>

                          {productForm.usageInstructions.map((instruction, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={instruction}
                                onChange={(e) => updateArrayItem("usageInstructions", index, e.target.value)}
                                placeholder="e.g., Shake well before use"
                                className="flex-1"
                              />
                              {productForm.usageInstructions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem("usageInstructions", index)}
                                  className="text-red-500 bg-transparent"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Warnings/Precautions */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-primary border-b pb-2">Warnings & Precautions</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem("warnings")}
                              className="bg-transparent"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add Warning
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
                                  className="text-red-500 bg-transparent"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Specifications */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-primary border-b pb-2">Product Specifications</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="size">Size/Volume</Label>
                              <Input
                                id="size"
                                value={productForm.specifications.size}
                                onChange={(e) => updateSpecification("size", e.target.value)}
                                placeholder="e.g., 500ml, 1L, 5L"
                              />
                            </div>
                            <div>
                              <Label htmlFor="weight">Weight</Label>
                              <Input
                                id="weight"
                                value={productForm.specifications.weight}
                                onChange={(e) => updateSpecification("weight", e.target.value)}
                                placeholder="e.g., 500g, 1kg"
                              />
                            </div>
                            <div>
                              <Label htmlFor="fragrance">Fragrance</Label>
                              <Input
                                id="fragrance"
                                value={productForm.specifications.fragrance}
                                onChange={(e) => updateSpecification("fragrance", e.target.value)}
                                placeholder="e.g., Lemon, Lavender, Fresh"
                              />
                            </div>
                            <div>
                              <Label htmlFor="type">Product Type</Label>
                              <Input
                                id="type"
                                value={productForm.specifications.type}
                                onChange={(e) => updateSpecification("type", e.target.value)}
                                placeholder="e.g., Liquid, Powder, Gel"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-primary border-b pb-2">Tags (for search)</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem("tags")}
                              className="bg-transparent"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add Tag
                            </Button>
                          </div>

                          {productForm.tags.map((tag, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={tag}
                                onChange={(e) => updateArrayItem("tags", index, e.target.value)}
                                placeholder="e.g., floor, cleaner, hygienic"
                                className="flex-1"
                              />
                              {productForm.tags.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem("tags", index)}
                                  className="text-red-500 bg-transparent"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90"
                          size="lg"
                          disabled={loading}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          {loading ? "Adding Product..." : "Add Product"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Products List - Replace the existing products display */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Catalog</CardTitle>
                      <CardDescription>Manage your comprehensive product catalog</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {products.length > 0 ? (
                        <div className="space-y-6">
                          {products.map((product) => (
                            <div key={product._id} className="border rounded-lg p-6">
                              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                                {/* Product Image */}
                                <div className="w-full lg:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.image || "/placeholder.svg?height=128&width=128"}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-2"
                                  />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 space-y-4">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold">{product.name}</h3>
                                      <p className="text-sm text-muted-foreground">{product.description}</p>
                                      <div className="flex items-center space-x-4 mt-2">
                                        <Badge variant="outline">{product.category || "Uncategorized"}</Badge>
                                        {product.price && <span className="text-sm font-medium">${product.price}</span>}
                                        {product.stockQuantity !== undefined && (
                                          <span className="text-sm text-muted-foreground">
                                            Stock: {product.stockQuantity}
                                          </span>
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

                                  {/* Features & Benefits */}
                                  <div className="grid md:grid-cols-2 gap-4">
                                    {product.features && product.features.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-medium text-primary mb-2">Features:</h4>
                                        <ul className="text-sm space-y-1">
                                          {product.features.map((feature: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
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
                                          {product.benefits.map((benefit: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                                            <li key={index} className="flex items-start">
                                              <span className="text-green-600 mr-2">✓</span>
                                              {benefit}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>

                                  {/* Usage Instructions & Warnings */}
                                  {((product.usageInstructions && product.usageInstructions.length > 0) ||
                                    (product.warnings && product.warnings.length > 0)) && (
                                    <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                                      {product.usageInstructions && product.usageInstructions.length > 0 && (
                                        <div>
                                          <h4 className="text-sm font-medium text-blue-600 mb-2">
                                            Usage Instructions:
                                          </h4>
                                          <ul className="text-sm space-y-1">
                                            {product.usageInstructions.map((instruction: string, index: number) => (
                                              <li key={index} className="flex items-start">
                                                <span className="text-blue-600 mr-2">{index + 1}.</span>
                                                {instruction}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {product.warnings && product.warnings.length > 0 && (
                                        <div>
                                          <h4 className="text-sm font-medium text-red-600 mb-2">Warnings:</h4>
                                          <ul className="text-sm space-y-1">
                                            {product.warnings.map((warning: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                                              <li key={index} className="flex items-start">
                                                <span className="text-red-600 mr-2">⚠</span>
                                                {warning}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Specifications */}
                                  {product.specifications && Object.values(product.specifications).some((v) => v) && (
                                    <div className="pt-2 border-t">
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                        Specifications:
                                      </h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                        {product.specifications.size && (
                                          <div>
                                            <span className="font-medium">Size:</span> {product.specifications.size}
                                          </div>
                                        )}
                                        {product.specifications.weight && (
                                          <div>
                                            <span className="font-medium">Weight:</span> {product.specifications.weight}
                                          </div>
                                        )}
                                        {product.specifications.fragrance && (
                                          <div>
                                            <span className="font-medium">Fragrance:</span>{" "}
                                            {product.specifications.fragrance}
                                          </div>
                                        )}
                                        {product.specifications.type && (
                                          <div>
                                            <span className="font-medium">Type:</span> {product.specifications.type}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Tags */}
                                  {product.tags && product.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {product.tags.map((tag: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Products Yet</h3>
                          <p className="text-muted-foreground">Add your first product with comprehensive details</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <SettingsPage
                dbStatus={dbStatus}
                loading={loading}
                showNotification={showNotification}
                checkDatabaseStatus={checkDatabaseStatus}
                initializeDatabase={initializeDatabase}
              />
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

// Orders Page Component
  <OrdersPage orders={[]} products={[]} setOrders={function (orders: Order[]): void {
    throw new Error("Function not implemented.")
  } } setProducts={function (products: Product[]): void {
    throw new Error("Function not implemented.")
  } } showNotification={function (type: "success" | "error", message: string): void {
    throw new Error("Function not implemented.")
  } } fetchData={function (): Promise<void> {
    throw new Error("Function not implemented.")
  } } loading={false} setLoading={function (loading: boolean): void {
    throw new Error("Function not implemented.")
  } } />

// Settings Page Component
function SettingsPage({
  dbStatus,
  loading,
  showNotification,
  checkDatabaseStatus,
  initializeDatabase,
}: {
  dbStatus: {
    connected: boolean
    stats?: { products: number; orders: number; customers: number }
    error?: string
  } | null
  loading: boolean
  showNotification: (type: "success" | "error", message: string) => void
  checkDatabaseStatus: () => Promise<void>
  initializeDatabase: () => Promise<void>
}) {
  const [businessSettings, setBusinessSettings] = useState({
    whatsappNumber: "",
    businessEmail: "",
    businessAddress: "",
    companyName: "",
    website: "",
  })

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("businessSettings")
    if (savedSettings) {
      setBusinessSettings(JSON.parse(savedSettings))
    }
  }, [])

  const saveBusinessSettings = () => {
    localStorage.setItem("businessSettings", JSON.stringify(businessSettings))
    showNotification("success", "Business settings saved successfully!")
  }

  const exportData = async () => {
    try {
      const response = await fetch("/api/db/export")
      const data = await response.json()

      if (response.ok) {
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `blastclean-data-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showNotification("success", "Data exported successfully!")
      } else {
        throw new Error(data.error || "Failed to export data")
      }
    } catch (error) {
      console.error("Export error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to export data")
    }
  }

  const clearAllData = async () => {
    if (
      !confirm(
        "Are you sure you want to clear ALL data? This will delete all products, orders, and customers. This action cannot be undone!",
      )
    )
      return

    if (!confirm("This is your final warning. ALL DATA WILL BE PERMANENTLY DELETED. Continue?")) return

    try {
      const response = await fetch("/api/db/clear", { method: "POST" })
      const result = await response.json()

      if (response.ok && result.success) {
        showNotification("success", "All data cleared successfully!")
        await checkDatabaseStatus()
      } else {
        throw new Error(result.error || "Failed to clear data")
      }
    } catch (error) {
      console.error("Clear data error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to clear data")
    }
  }

  return (
    <div className="space-y-6">
      {/* Database Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Database Status</CardTitle>
          <CardDescription>Monitor your database connection and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dbStatus ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className={`font-medium ${dbStatus.connected ? "text-green-700" : "text-red-700"}`}>
                    {dbStatus.connected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                {dbStatus.connected && dbStatus.stats && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dbStatus.stats.products}</div>
                      <div className="text-sm text-muted-foreground">Products</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dbStatus.stats.orders}</div>
                      <div className="text-sm text-muted-foreground">Orders</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dbStatus.stats.customers}</div>
                      <div className="text-sm text-muted-foreground">Customers</div>
                    </div>
                  </div>
                )}

                {dbStatus.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{dbStatus.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Checking database status...</p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={checkDatabaseStatus} variant="outline" disabled={loading}>
                Refresh Status
              </Button>
              <Button onClick={initializeDatabase} className="bg-primary hover:bg-primary/90" disabled={loading}>
                Initialize Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Configure your business details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={businessSettings.companyName}
                  onChange={(e) => setBusinessSettings((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder="BlastClean"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={businessSettings.website}
                  onChange={(e) => setBusinessSettings((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://blastclean.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={businessSettings.whatsappNumber}
                  onChange={(e) => setBusinessSettings((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This number will be used for WhatsApp contact integration
                </p>
              </div>
              <div>
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={businessSettings.businessEmail}
                  onChange={(e) => setBusinessSettings((prev) => ({ ...prev, businessEmail: e.target.value }))}
                  placeholder="info@blastclean.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                value={businessSettings.businessAddress}
                onChange={(e) => setBusinessSettings((prev) => ({ ...prev, businessAddress: e.target.value }))}
                placeholder="Enter your complete business address"
                rows={3}
              />
            </div>

            <Button onClick={saveBusinessSettings} className="bg-primary hover:bg-primary/90">
              Save Business Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export, import, and manage your application data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Export Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Download all your data as a JSON file for backup or migration purposes.
                </p>
                <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                  Export All Data
                </Button>
              </div>

              <div className="p-4 border rounded-lg border-red-200">
                <h4 className="font-medium mb-2 text-red-700">Clear All Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Permanently delete all products, orders, and customers. This action cannot be undone.
                </p>
                <Button
                  onClick={clearAllData}
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Application and environment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Application Version</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Environment</span>
              <span className="text-muted-foreground">{process.env.NODE_ENV || "development"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Last Updated</span>
              <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Database Type</span>
              <span className="text-muted-foreground">MongoDB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
