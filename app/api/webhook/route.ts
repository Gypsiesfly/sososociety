import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Initialize nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check if this is a purchase event
    if (body.type === "purchase.created" || body.type === "purchase.updated") {
      const purchase = body.data
      
      // Extract form data from metadata
      const customerDetails = purchase.metadata as {
        fullName: string
        email: string
        phone: string
        countryCode: string
        businessType: string
        platforms: string
        videoEditing: string
        postFrequency: string
        price: string
        priceNGN: string
        paymentFrequency: string
      }

      // Convert platforms string back to array
      const platforms = customerDetails.platforms.split(",")

      // Create receipt details
      const receipt = {
        customer: {
          name: customerDetails.fullName,
          email: customerDetails.email,
          phone: `${customerDetails.countryCode}${customerDetails.phone}`,
          businessType: customerDetails.businessType.charAt(0).toUpperCase() + customerDetails.businessType.slice(1)
        },
        services: {
          platforms,
          postFrequency: parseInt(customerDetails.postFrequency),
          videoEditing: customerDetails.videoEditing === "true",
          paymentFrequency: customerDetails.paymentFrequency
        },
        pricing: {
          price: parseFloat(customerDetails.price),
          priceNGN: parseFloat(customerDetails.priceNGN),
          currency: purchase.currency.toUpperCase(),
          paymentFrequency: customerDetails.paymentFrequency
        }
      }

      // Send email to customer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerDetails.email,
        subject: "Your Social Media Management Subscription Receipt",
        html: generateReceiptHTML(receipt, "customer")
      })

      // Send email to admin
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL!,
        subject: "New Social Media Management Subscription",
        html: generateReceiptHTML(receipt, "admin")
      })
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Webhook error:", err)
    return new NextResponse(JSON.stringify({ error: "Webhook error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}

function generateReceiptHTML(receipt: any, type: "customer" | "admin") {
  const isCustomer = type === "customer"
  const title = isCustomer ? "Your Subscription Receipt" : "New Subscription Notification"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1A73E9; text-align: center;">${title}</h1>

      ${isCustomer ? `
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h2 style="color: #1A73E9;">Customer Details</h2>
          <p><strong>Name:</strong> ${receipt.customer.name}</p>
          <p><strong>Email:</strong> ${receipt.customer.email}</p>
          <p><strong>Phone:</strong> ${receipt.customer.phone}</p>
          <p><strong>Business Type:</strong> ${receipt.customer.businessType}</p>
        </div>
      ` : ``}

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2 style="color: #1A73E9;">Services Selected</h2>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Platforms:</strong> ${receipt.services.platforms.join(", ")}</li>
          <li><strong>Post Frequency:</strong> ${receipt.services.postFrequency} times/week</li>
          <li><strong>Video Editing:</strong> ${receipt.services.videoEditing ? "Yes" : "No"}</li>
          <li><strong>Payment Frequency:</strong> ${receipt.services.paymentFrequency}</li>
        </ul>
      </div>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2 style="color: #1A73E9;">Pricing Details</h2>
        <p><strong>Total Price:</strong> ${receipt.pricing.currency} ${receipt.pricing.price}</p>
        <p><strong>NGN Equivalent:</strong> ₦${receipt.pricing.priceNGN}</p>
        <p><strong>Currency:</strong> ${receipt.pricing.currency}</p>
      </div>

      ${isCustomer ? `
        <p style="text-align: center; margin-top: 20px;">
          Thank you for choosing our social media management services! We'll be in touch soon to get started.
        </p>
      ` : ``}
    </div>
  `
}
