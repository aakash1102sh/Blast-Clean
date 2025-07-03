import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const db = await getDatabase()

    // Clear all collections
    await Promise.all([
      db.collection("products").deleteMany({}),
      db.collection("orders").deleteMany({}),
      db.collection("customers").deleteMany({}),
    ])

    return NextResponse.json({
      success: true,
      message: "All data cleared successfully",
    })
  } catch (error) {
    console.error("Database clear error:", error)
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 })
  }
}
