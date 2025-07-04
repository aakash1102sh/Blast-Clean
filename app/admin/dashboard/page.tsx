"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { OrdersPage } from "@/components/admin/orders-page"
import { CustomersPage } from "@/components/admin/customers-page"
import { ProductsPage } from "@/components/admin/products-page"
import { SettingsPage } from "@/components/admin/settings-page"
import { LoadingOverlay } from "@/components/admin/loading-overlay"
import { NotificationAlert } from "@/components/admin/notification-alert"
import type { Product, Order, Customer, DatabaseStatus, NotificationType } from "@/lib/types"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<NotificationType | null>(null)
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("adminLoggedIn")) {
      router.push("/admin/login")
      return
    }
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    setLoading(true)
    try {
      await checkDatabaseStatus()
      await fetchData()
      showNotification("success", "Dashboard loaded successfully!")
    } catch (error) {
      console.error("Dashboard initialization error:", error)
      showNotification("error", "Failed to initialize dashboard. Please check your database connection.")
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/customers", { cache: "no-store" }),
      ])

      const productsData = productsRes.ok ? await productsRes.json() : []
      const ordersData = ordersRes.ok ? await ordersRes.json() : []
      const customersData = customersRes.ok ? await customersRes.json() : []

      setProducts(Array.isArray(productsData) ? productsData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setCustomers(Array.isArray(customersData) ? customersData : [])

      if (!productsRes.ok || !ordersRes.ok || !customersRes.ok) {
        showNotification("error", "Some data could not be loaded. Please check your database connection.")
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      showNotification("error", "Failed to fetch data. Please check your database connection.")
      setProducts([])
      setOrders([])
      setCustomers([])
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
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

  const handleRepeatOrder = (customer: Customer) => {
    // Find the last order for this customer
    const customerOrders = orders.filter((order) => order.email === customer.email)
    if (customerOrders.length > 0) {
      const lastOrder = customerOrders[0]
      // Switch to orders tab and trigger the order form with pre-filled data
      setActiveTab("orders")
      setSidebarOpen(false)
      // You can add logic here to pre-fill the order form if needed
      showNotification("success", `Switched to orders for ${customer.name}`)
    } else {
      showNotification("error", "No previous orders found for this customer")
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "orders":
        return (
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
        )
      case "customers":
        return <CustomersPage customers={customers} orders={orders} onRepeatOrder={handleRepeatOrder} />
      case "products":
        return (
          <ProductsPage
            products={products}
            setProducts={setProducts}
            showNotification={showNotification}
            fetchData={fetchData}
            checkDatabaseStatus={checkDatabaseStatus}
            loading={loading}
            setLoading={setLoading}
          />
        )
      case "settings":
        return (
          <SettingsPage
            dbStatus={dbStatus}
            loading={loading}
            showNotification={showNotification}
            checkDatabaseStatus={checkDatabaseStatus}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        dbStatus={dbStatus}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          activeTab={activeTab}
          dbStatus={dbStatus}
          loading={loading}
          onMenuClick={() => setSidebarOpen(true)}
          onRefreshDatabase={checkDatabaseStatus}
        />

        <div className="flex-1 overflow-auto">
          <NotificationAlert notification={notification} />
          <div className="p-4 sm:p-6">{renderActiveTab()}</div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />
    </div>
  )
}
