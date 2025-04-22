import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Prepare Paystack API call
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      return NextResponse.json({ error: "Missing Paystack secret key" }, { status: 500 })
    }

    // Construct payload for Paystack
    const { email, amount, ...rest } = body
    if (!email || !amount) {
      return NextResponse.json({ error: "Missing required fields: email or amount" }, { status: 400 })
    }

    const paystackBody = {
      email,
      amount: Number(amount), // Already in kobo from frontend
      ...rest
    }

    // Call Paystack initialize endpoint
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paystackBody)
    })

    const paystackData = await paystackRes.json()

    if (!paystackRes.ok || !paystackData.data?.authorization_url) {
      console.error("Paystack error:", paystackData)
      return NextResponse.json({ error: paystackData.message || "Paystack error" }, { status: 500 })
    }

    // Return the authorization_url to the frontend
    return NextResponse.json({ url: paystackData.data.authorization_url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    )
  }
}
