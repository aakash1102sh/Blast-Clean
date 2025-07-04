export interface Product {
  _id?: string
  name: string
  image?: string
  description: string
  category: string
  price?: number
  stockQuantity?: number
  features?: string[]
  benefits?: string[]
  usageInstructions?: string[]
  warnings?: string[]
  specifications?: {
    size?: string
    weight?: string
    fragrance?: string
    type?: string
  }
  tags?: string[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  _id?: string
  customerName: string
  storeName: string
  address: string
  phone: string
  email: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
  }>
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface Customer {
  _id?: string
  name: string
  storeName: string
  address: string
  phone: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface DatabaseStatus {
  connected: boolean
  stats?: {
    products: number
    orders: number
    customers: number
  }
  error?: string
}

export interface NotificationType {
  type: "success" | "error"
  message: string
}
