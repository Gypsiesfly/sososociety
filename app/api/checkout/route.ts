import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Redirect to Paystack checkout page
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_PAYSTACK_URL}?data=${encodeURIComponent(JSON.stringify(body))}`
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    )
  }
}
