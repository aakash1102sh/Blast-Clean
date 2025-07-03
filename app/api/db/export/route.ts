import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Fetch all data from collections
    const [products, orders, customers] = await Promise.all([
      db.collection("products").find({}).toArray(),
      db.collection("orders").find({}).toArray(),
      db.collection("customers").find({}).toArray(),
    ])

    // Convert ObjectIds to strings for JSON serialization
    const exportData = {
      products: products.map((item) => ({ ...item, _id: item._id?.toString() })),
      orders: orders.map((item) => ({ ...item, _id: item._id?.toString() })),
      customers: customers.map((item) => ({ ...item, _id: item._id?.toString() })),
      exportDate: new Date().toISOString(),
      version: "1.0.0",
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error("Database export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
