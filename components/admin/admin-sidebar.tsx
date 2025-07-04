"use client"

import { ShoppingBag, ShoppingCart, Users, Package, Settings, LogOut, X, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { DatabaseStatus } from "@/lib/types"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  dbStatus: DatabaseStatus | null
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  dbStatus,
}: AdminSidebarProps) {
  const SidebarContent = () => (
    <div className="flex flex-col h-full gradient-primary">
      <div className="p-4 sm:p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            <span className="text-lg sm:text-xl font-bold text-white">Admin Panel</span>
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

        <div className="mt-3 sm:mt-4 flex items-center space-x-2">
          {dbStatus?.connected ? (
            <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          ) : (
            <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
          )}
          <span className={`text-xs ${dbStatus?.connected ? "text-green-200" : "text-red-200"}`}>
            {dbStatus?.connected ? "Database Connected" : "Database Disconnected"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
        <Button
          variant={activeTab === "orders" ? "secondary" : "ghost"}
          className={`w-full justify-start text-sm sm:text-base ${
            activeTab === "orders" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => onTabChange("orders")}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span className="truncate">Orders</span>
          {dbStatus?.stats && (
            <Badge variant="outline" className="ml-auto text-xs">
              {dbStatus.stats.orders}
            </Badge>
          )}
        </Button>

        <Button
          variant={activeTab === "customers" ? "secondary" : "ghost"}
          className={`w-full justify-start text-sm sm:text-base ${
            activeTab === "customers" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => onTabChange("customers")}
        >
          <Users className="mr-2 h-4 w-4" />
          <span className="truncate">Customers</span>
          {dbStatus?.stats && (
            <Badge variant="outline" className="ml-auto text-xs">
              {dbStatus.stats.customers}
            </Badge>
          )}
        </Button>

        <Button
          variant={activeTab === "products" ? "secondary" : "ghost"}
          className={`w-full justify-start text-sm sm:text-base ${
            activeTab === "products" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => onTabChange("products")}
        >
          <Package className="mr-2 h-4 w-4" />
          <span className="truncate">Products</span>
          {dbStatus?.stats && (
            <Badge variant="outline" className="ml-auto text-xs">
              {dbStatus.stats.products}
            </Badge>
          )}
        </Button>

        <Button
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          className={`w-full justify-start text-sm sm:text-base ${
            activeTab === "settings" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"
          }`}
          onClick={() => onTabChange("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span className="truncate">Settings</span>
        </Button>
      </nav>

      <div className="p-3 sm:p-4 border-t border-white/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-200 hover:text-red-100 hover:bg-red-500/20 text-sm sm:text-base"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="truncate">Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 sm:w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 lg:w-72 gradient-primary border-r">
        <SidebarContent />
      </div>
    </>
  )
}
