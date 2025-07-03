"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import type { Product } from "@/lib/models"

export default function ProductsPage() {
  /* ---------- state ---------- */
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
  })

  /* ---------- helpers ---------- */
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = res.ok ? await res.json() : []
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch products failed:", err)
      setProducts([])
    }
  }

  /* ---------- effects ---------- */
  useEffect(() => {
    fetchProducts()
  }, [])

  /* ---------- handlers ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.description) {
      alert("Name, Category and Description are required")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: form.image || "/placeholder.svg?height=300&width=300",
          features: [],
          benefits: [],
          usageInstructions: [],
          warnings: [],
          specifications: {},
          tags: [],
          isActive: true,
        }),
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || "Add failed")
      setForm({ name: "", description: "", category: "", image: "" })
      await fetchProducts()
      alert("Product added")
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Add failed")
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || "Delete failed")
      await fetchProducts()
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      {/* --- Add product form --- */}
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Basic details only (name, category, description, image)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="floor-cleaners">Floor Cleaners</SelectItem>
                  <SelectItem value="surface-cleaners">Surface Cleaners</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                required
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- product list --- */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Current catalogue</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No products yet.</p>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p._id} className="flex items-start gap-4 border rounded-lg p-4 hover:bg-muted/50">
                  <img
                    src={p.image || "/placeholder.svg?height=64&width=64"}
                    alt={p.name}
                    className="h-16 w-16 object-contain rounded bg-muted"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{p.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <Badge variant="outline">{p.category}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteProduct(p._id!)}
                    disabled={loading}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
