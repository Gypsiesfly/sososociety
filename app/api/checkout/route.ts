import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Social Media Management",
              description: `Plan for ${body.businessType} with ${body.platforms.split(",").length} platforms`,
            },
            unit_amount: Math.round(body.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        countryCode: body.countryCode,
        businessType: body.businessType,
        platforms: body.platforms,
        videoEditing: body.videoEditing.toString(),
        postFrequency: body.postFrequency.toString(),
        price: body.price.toString(),
        priceNGN: body.priceNGN.toString(),
        paymentFrequency: body.paymentFrequency,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    )
  }
}
