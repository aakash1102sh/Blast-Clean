"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, Download, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean
    stats?: { products: number; orders: number; customers: number }
    error?: string
  } | null>(null)

  const [businessSettings, setBusinessSettings] = useState({
    whatsappNumber: "",
    businessEmail: "",
    businessAddress: "",
    companyName: "",
    website: "",
  })

  useEffect(() => {
    checkDatabaseStatus()
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("businessSettings")
    if (savedSettings) {
      setBusinessSettings(JSON.parse(savedSettings))
    }
  }, [])

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

  const initializeDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db/init")
      const result = await response.json()

      if (result.success) {
        showNotification("success", "Database initialized successfully!")
        await checkDatabaseStatus()
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

    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
                <Database className="mr-2 h-4 w-4" />
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
                  placeholder="+1234567890"
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
                  <Download className="mr-2 h-4 w-4" />
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
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
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
