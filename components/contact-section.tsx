"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Phone, Mail, MapPin, Award, Plus, Minus, ExternalLink, Navigation } from "lucide-react"
import type { Product } from "@/lib/types"

interface ContactFormData {
  name: string
  phone: string
  address: string
  companyName: string
  companyAddress: string
  products: {
    productId: string
    productName: string
    quantity: number
  }[]
}

interface ContactSectionProps {
  products: Product[]
}

export function ContactSection({ products }: ContactSectionProps) {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    address: "",
    companyName: "",
    companyAddress: "",
    products: [{ productId: "", productName: "", quantity: 1 }],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addProductToForm = () => {
    setContactForm((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", productName: "", quantity: 1 }],
    }))
  }

  const removeProductFromForm = (index: number) => {
    if (contactForm.products.length > 1) {
      setContactForm((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }))
    }
  }

  const updateFormProduct = (index: number, field: string, value: any) => {
    setContactForm((prev) => ({
      ...prev,
      products: prev.products.map((product, i) => (i === index ? { ...product, [field]: value } : product)),
    }))
  }

  const generateWhatsAppMessage = () => {
    const { name, phone, address, companyName, companyAddress, products } = contactForm

    // Filter out empty products
    const validProducts = products.filter((p) => p.productId && p.productName && p.quantity > 0)

    let message = `🏢 *New Business Inquiry*\n\n`
    message += `👤 *Personal Details:*\n`
    message += `• Name: ${name}\n`
    message += `• Phone: ${phone}\n`
    message += `• Address: ${address}\n\n`

    message += `🏭 *Company Details:*\n`
    message += `• Company Name: ${companyName}\n`
    message += `• Company Address: ${companyAddress}\n\n`

    if (validProducts.length > 0) {
      message += `📦 *Products Required:*\n`
      validProducts.forEach((product, index) => {
        message += `${index + 1}. ${product.productName} - Qty: ${product.quantity}\n`
      })
      message += `\n`
    }

    message += `📞 Please contact me for pricing and availability.\n`
    message += `\n*Sent via BlastClean Website*`

    return encodeURIComponent(message)
  }

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!contactForm.name.trim()) {
      alert("Please enter your name")
      return
    }
    if (!contactForm.phone.trim()) {
      alert("Please enter your phone number")
      return
    }
    if (!contactForm.companyName.trim()) {
      alert("Please enter your company name")
      return
    }

    // Check if at least one product is selected
    const validProducts = contactForm.products.filter((p) => p.productId && p.productName && p.quantity > 0)
    if (validProducts.length === 0) {
      alert("Please select at least one product")
      return
    }

    setIsSubmitting(true)

    try {
      const whatsappNumber = "918002938263" // Updated: removed the + sign for direct WhatsApp redirect
      const message = generateWhatsAppMessage()
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

      // Direct redirect to WhatsApp
      window.location.href = whatsappUrl

      // Reset form after successful submission
      setContactForm({
        name: "",
        phone: "",
        address: "",
        companyName: "",
        companyAddress: "",
        products: [{ productId: "", productName: "", quantity: 1 }],
      })

      // Show success message
      setTimeout(() => {
        alert("Redirecting to WhatsApp! Your inquiry has been prepared.")
      }, 100)
    } catch (error) {
      console.error("Error generating WhatsApp message:", error)
      alert("Failed to generate WhatsApp message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openWhatsApp = () => {
    const phoneNumber = "918002938263" // Updated: removed the + sign for direct WhatsApp redirect
    const message = "Hello! I would like to inquire about your products."
    // Direct redirect to WhatsApp
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }

  const openGoogleMaps = () => {
    window.open("https://maps.app.goo.gl/rfZYkdiioDkW72ZL6?g_st=ipcAttachment", "_blank")
  }

  return (
    <section id="contact" className="py-20">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
          <p className="text-xl text-muted-foreground">Ready to elevate your cleaning standards? Contact us today!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+91 8002938263</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">aakash1102sh@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    Road No - 31, Adityapur-2
                    <br />
                    Jamshedpur, Jharkhand 831013
                  </p>
                </div>
              </div>
            </div>

            {/* Location Section with Interactive Map */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Our Location
                </CardTitle>
                <CardDescription>Visit us at our main office in Jamshedpur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Interactive Google Maps Embed */}
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.8234567890123!2d86.18456789012345!3d22.78901234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31ed6d4c5d7%3A0x8b2c3d4e5f6a7b8c!2sRoad%20No%20-%2031%2C%20Adityapur-2%2C%20Jamshedpur%2C%20Jharkhand%20831013!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      title="BlastClean Office Location"
                    />

                    {/* Overlay with Get Directions Button */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        onClick={openGoogleMaps}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                        size="sm"
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                  </div>

                  {/* Location Details and Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={openGoogleMaps}
                        variant="outline"
                        size="sm"
                        className="text-white gradient-primary backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-transparent"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Maps
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">Business Hours:</p>
                      <div className="space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>

                    {/* Quick Contact Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      
                      <Button
                        onClick={() => window.open("tel:+918002938263")}
                        variant="outline"
                        size="sm"
                        className="text-white gradient-primary backdrop-blur supports-[backdrop-filter]:bg-background/60"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Business Inquiry Form</CardTitle>
              <CardDescription>
                Fill out the form below with your requirements and we'll contact you via WhatsApp with a personalized
                quote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-primary">Personal Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Personal Address</Label>
                    <Textarea
                      id="address"
                      value={contactForm.address}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your personal address"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-primary">Company Details</h4>
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={contactForm.companyName}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, companyName: e.target.value }))}
                      required
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={contactForm.companyAddress}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, companyAddress: e.target.value }))}
                      placeholder="Enter your company address"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Products Required */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-primary">Products Required *</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addProductToForm}
                      className="bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>

                  {contactForm.products.map((product, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Product {index + 1}</span>
                        {contactForm.products.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeProductFromForm(index)}
                            className="text-red-500 hover:bg-red-50 bg-transparent"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <Label>Select Product</Label>
                          <Select
                            value={product.productId}
                            onValueChange={(value) => {
                              const selectedProduct = products.find((p) => p._id === value)
                              updateFormProduct(index, "productId", value)
                              updateFormProduct(index, "productName", selectedProduct?.name || "")
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.length > 0 ? (
                                products.map((p) => (
                                  <SelectItem key={p._id} value={p._id!}>
                                    {p.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-products" disabled>
                                  No products available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateFormProduct(index, "quantity", Number.parseInt(e.target.value) || 1)}
                            placeholder="Qty"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No products available. Please contact us directly.
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Preparing WhatsApp Message..." : "Send Inquiry via WhatsApp"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Required fields. Your inquiry will be sent via WhatsApp with all the details you've provided.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
