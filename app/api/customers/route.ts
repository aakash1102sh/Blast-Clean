import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Customer } from "@/lib/models"

export async function GET() {
  try {
    const db = await getDatabase()
    const customers = await db.collection<Customer>("customers").find({}).sort({ createdAt: -1 }).toArray()

    // Convert ObjectId to string for JSON serialization
    const serializedCustomers = customers.map((customer) => ({
      ...customer,
      _id: customer._id?.toString(),
    }))

    return NextResponse.json(serializedCustomers)
  } catch (error) {
    console.error("Database error in GET /api/customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
