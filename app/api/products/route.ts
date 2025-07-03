import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    const products = await db.collection<Product>("products").find({}).sort({ createdAt: -1 }).toArray()

    // Convert ObjectId to string for JSON serialization
    const serializedProducts = products.map((product) => ({
      ...product,
      _id: product._id?.toString(),
    }))

    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error("Database error in GET /api/products:", error)
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes("Failed to connect to database")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please ensure MongoDB is running." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
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
    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // Get database connection
    const db = await getDatabase()

    // Create product object
    const product: Omit<Product, "_id"> = {
      name: body.name.trim(),
      image: body.image?.trim() || "/placeholder.svg?height=200&width=300",
      description: body.description.trim(),
      createdAt: new Date(),
    }

    // Insert product
    const result = await db.collection("products").insertOne(product)

    if (!result.insertedId) {
      throw new Error("Failed to insert product")
    }

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: "Product added successfully",
    })
  } catch (error) {
    console.error("Database error in POST /api/products:", error)

    // Return specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Failed to connect to database")) {
        return NextResponse.json({ 
          error: "Database connection failed. Please ensure MongoDB is running." 
        }, { status: 503 })
      }
      if (error.message.includes("connect")) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Database operation timed out" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Database error in DELETE /api/products:", error)
    
    if (error instanceof Error && error.message.includes("Failed to connect to database")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please ensure MongoDB is running." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}