"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Customer, Order } from "@/lib/models"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers)
      .catch(() => setCustomers([]))

    fetch("/api/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders([]))
  }, [])

  const handleRepeatOrder = (customer: Customer) => {
    // Find the last order for this customer
    const customerOrders = orders.filter((order) => order.email === customer.email)
    if (customerOrders.length > 0) {
      // Navigate to orders page with customer data
      router.push("/admin/dashboard")
    }
  }

  const getCustomerOrderCount = (customerEmail: string) => {
    return orders.filter((order) => order.email === customerEmail).length
  }

  const getCustomerLastOrderDate = (customerEmail: string) => {
    const customerOrders = orders.filter((order) => order.email === customerEmail)
    if (customerOrders.length === 0) return "No orders"

    const lastOrder = customerOrders.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    )[0]

    return new Date(lastOrder.createdAt || 0).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-muted-foreground text-sm">No customers.</p>
          ) : (
            <ul className="space-y-4">
              {customers.map((c) => (
                <li key={c._id} className="flex justify-between border rounded p-4">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                  </div>
                  <Badge variant="outline">{c.ordersCount ?? 0} orders</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Customer Statistics */}
      {customers.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter((customer) => getCustomerOrderCount(customer.email) > 0).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter((customer) => getCustomerOrderCount(customer.email) > 1).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
