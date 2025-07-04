"use client"

import { Users, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Customer, Order } from "@/lib/types"

interface CustomersPageProps {
  customers: Customer[]
  orders: Order[]
  onRepeatOrder: (customer: Customer) => void
}

export function CustomersPage({ customers, orders, onRepeatOrder }: CustomersPageProps) {
  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their order history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Customers Yet</h3>
            <p className="text-muted-foreground">Customers will appear here when you create orders</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their order history</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-4">
            {customers.map((customer) => (
              <div key={customer._id} className="border rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-lg">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.storeName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">{customer.email}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
                  onClick={() => onRepeatOrder(customer)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Repeat Order
                </Button>
              </div>
            ))}
          </div>

          {/* Tablet/Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Store</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Phone</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{customer.name}</td>
                    <td className="p-3 hidden md:table-cell">{customer.storeName}</td>
                    <td className="p-3 text-sm">{customer.email}</td>
                    <td className="p-3 text-sm hidden lg:table-cell">{customer.phone}</td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
                        onClick={() => onRepeatOrder(customer)}
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
        </CardContent>
      </Card>
    </div>
  )
}
