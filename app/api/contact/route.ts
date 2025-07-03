import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Here you would typically send an email
    // For now, we'll just log the contact form data
    console.log("Contact form submission:", body)

    return NextResponse.json({ success: true, message: "Message sent successfully!" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
