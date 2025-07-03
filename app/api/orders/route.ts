import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Order } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    const orders = await db.collection<Order>("orders").find({}).sort({ createdAt: -1 }).toArray()

    // Convert ObjectId to string for JSON serialization
    const serializedOrders = orders.map((order) => ({
      ...order,
      _id: order._id?.toString(),
    }))

    return NextResponse.json(serializedOrders)
  } catch (error) {
    console.error("Database error in GET /api/orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = ["customerName", "storeName", "address", "phone", "email", "products"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate products array
    if (!Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json({ error: "At least one product is required" }, { status: 400 })
    }

    // Validate each product
    for (const product of body.products) {
      if (!product.productId || !product.productName || !product.quantity || product.quantity < 1) {
        return NextResponse.json({ error: "Invalid product data" }, { status: 400 })
      }
    }

    // Get database connection
    const db = await getDatabase()

    // Create or update customer
    const customer = {
      name: body.customerName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      storeName: body.storeName.trim(),
      updatedAt: new Date(),
    }

    const customerResult = await db.collection("customers").updateOne(
      { email: customer.email },
      {
        $set: customer,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    )

    // Create order
    const order: Omit<Order, "_id"> = {
      customerId: customerResult.upsertedId?.toString() || customer.email,
      customerName: body.customerName.trim(),
      storeName: body.storeName.trim(),
      address: body.address.trim(),
      phone: body.phone.trim(),
      email: body.email.trim().toLowerCase(),
      products: body.products.map((p: any) => ({
        productId: p.productId,
        productName: p.productName.trim(),
        quantity: Number.parseInt(p.quantity),
      })),
      status: "pending",
      createdAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(order)

    if (!result.insertedId) {
      throw new Error("Failed to insert order")
    }

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Database error in POST /api/orders:", error)

    // Return specific error messages
    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Database operation timed out" }, { status: 500 })
      }
      if (error.message.includes("duplicate")) {
        return NextResponse.json({ error: "Duplicate entry detected" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    })
  } catch (error) {
    console.error("Database error in PUT /api/orders:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Database error in DELETE /api/orders:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
