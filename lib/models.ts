export interface Product {
  [x: string]: ReactNode
  _id?: string
  name: string
  image: string
  description: string
  createdAt?: Date
}

export interface Customer {
  ordersCount: number
  _id?: string
  name: string
  email: string
  phone: string
  address: string
  storeName: string
  createdAt?: Date
}

export interface Order {
  _id?: string
  customerId: string
  customerName: string
  storeName: string
  address: string
  phone: string
  email: string
  products: {
    productId: string
    productName: string
    quantity: number
  }[]
  status: "pending" | "completed" | "cancelled"
  createdAt?: Date
}
