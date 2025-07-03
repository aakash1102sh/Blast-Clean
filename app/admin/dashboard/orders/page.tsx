"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Order } from "@/lib/models"
import { useNotification } from "@/components/admin/notification"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { success, error } = useNotification()

  const getOrders = async () => {
    const res = await fetch("/api/orders", { cache: "no-store" })
    setOrders(res.ok ? await res.json() : [])
  }

  useEffect(() => {
    getOrders()
  }, [])

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return
    const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" })
    const json = await res.json()
    if (res.ok && json.success) {
      success("Order deleted")
      getOrders()
    } else {
      error(json.error || "Delete failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o._id} className="flex items-center justify-between border rounded p-4">
                <div>
                  <p className="font-medium">#{o._id?.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">{o.customerName}</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => deleteOrder(o._id!)} aria-label="Delete order">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
