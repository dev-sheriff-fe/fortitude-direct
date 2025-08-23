import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil' // Use a stable API version
});

// Minimum charge amounts in smallest currency unit
const MINIMUM_CHARGES = {
  usd: 50,    // 50 cents
  eur: 50,    // 50 cents  
  gbp: 30,    // 30 pence
  ngn: 3000,  // 30 naira (3000 kobo)
  // Add more currencies as needed
} as const;

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      );
    }

    const currencyLower = currency.toLowerCase();
    
    // Convert amount to smallest unit (e.g., dollars to cents, naira to kobo)
    const amountInSmallestUnit = Math.round(amount * 100);
    
    // Check minimum charge requirement
    const minimumCharge = MINIMUM_CHARGES[currencyLower as keyof typeof MINIMUM_CHARGES];
    if (minimumCharge && amountInSmallestUnit < minimumCharge) {
      const minimumAmount = minimumCharge / 100;
      return NextResponse.json(
        { 
          error: `Amount must be at least ${minimumAmount} ${currency.toUpperCase()} (${minimumCharge} in smallest unit)` 
        },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currencyLower,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(paymentIntent);
    

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: amountInSmallestUnit,
      currency: currencyLower
    });
  } catch (err: any) {
    console.error('Stripe Payment Intent Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create payment intent' }, 
      { status: 500 }
    );
  }
}