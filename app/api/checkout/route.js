// v2
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  single: {
    GBP: { amount: 199,   currency: 'gbp', name: 'SnapVisa — Single Photo' },
    USD: { amount: 249,   currency: 'usd', name: 'SnapVisa — Single Photo' },
    EUR: { amount: 229,   currency: 'eur', name: 'SnapVisa — Single Photo' },
    HKD: { amount: 1900,  currency: 'hkd', name: 'SnapVisa — Single Photo' },
    TWD: { amount: 6500,  currency: 'twd', name: 'SnapVisa — Single Photo' },
    AUD: { amount: 399,   currency: 'aud', name: 'SnapVisa — Single Photo' },
    CAD: { amount: 349,   currency: 'cad', name: 'SnapVisa — Single Photo' },
    SGD: { amount: 349,   currency: 'sgd', name: 'SnapVisa — Single Photo' },
    INR: { amount: 19900, currency: 'inr', name: 'SnapVisa — Single Photo' },
    JPY: { amount: 299,   currency: 'jpy', name: 'SnapVisa — Single Photo' },
    NZD: { amount: 399,   currency: 'nzd', name: 'SnapVisa — Single Photo' },
  },
}

export async function POST(request) {
  try {
    const { priceId, currency } = await request.json()
    const currencyKey = currency?.toUpperCase() || 'GBP'
    const priceData = PRICES.single[currencyKey] || PRICES.single['GBP']
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://snapvisa.co.uk'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: priceData.currency,
          product_data: {
            name: priceData.name,
            description: 'Full-resolution JPG — print at any photo lab worldwide',
          },
          unit_amount: priceData.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://www.snapvisa.co.uk/index.html?paid=1',
      cancel_url: `${baseUrl}`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
