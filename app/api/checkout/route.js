import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  single: {
    GBP: { amount: 199, currency: 'gbp', name: 'SnapVisa - Single Photo' },
    USD: { amount: 249, currency: 'usd', name: 'SnapVisa - Single Photo' },
    EUR: { amount: 229, currency: 'eur', name: 'SnapVisa - Single Photo' },
    HKD: { amount: 1900, currency: 'hkd', name: 'SnapVisa - Single Photo' },
    AUD: { amount: 399, currency: 'aud', name: 'SnapVisa - Single Photo' },
    CAD: { amount: 349, currency: 'cad', name: 'SnapVisa - Single Photo' },
    SGD: { amount: 349, currency: 'sgd', name: 'SnapVisa - Single Photo' },
    JPY: { amount: 299, currency: 'jpy', name: 'SnapVisa - Single Photo' },
    NZD: { amount: 399, currency: 'nzd', name: 'SnapVisa - Single Photo' },
  },
  bundle: {
    GBP: { amount: 499, currency: 'gbp', name: 'SnapVisa - 5-Photo Bundle' },
    USD: { amount: 649, currency: 'usd', name: 'SnapVisa - 5-Photo Bundle' },
    EUR: { amount: 599, currency: 'eur', name: 'SnapVisa - 5-Photo Bundle' },
    HKD: { amount: 4900, currency: 'hkd', name: 'SnapVisa - 5-Photo Bundle' },
    AUD: { amount: 999, currency: 'aud', name: 'SnapVisa - 5-Photo Bundle' },
    CAD: { amount: 899, currency: 'cad', name: 'SnapVisa - 5-Photo Bundle' },
    SGD: { amount: 899, currency: 'sgd', name: 'SnapVisa - 5-Photo Bundle' },
    JPY: { amount: 749, currency: 'jpy', name: 'SnapVisa - 5-Photo Bundle' },
    NZD: { amount: 999, currency: 'nzd', name: 'SnapVisa - 5-Photo Bundle' },
  }
}

export async function POST(request) {
  try {
    const { priceId, currency } = await request.json()
    const priceKey = priceId === 'bundle' ? 'bundle' : 'single'
    const currencyKey = currency?.toUpperCase() || 'GBP'
    const priceData = PRICES[priceKey]?.[currencyKey] || PRICES[priceKey]['GBP']
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://snapvisa.co.uk'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: priceData.currency, product_data: { name: priceData.name }, unit_amount: priceData.amount }, quantity: 1 }],
      mode: 'payment',
      success_url: `${baseUrl}/?paid=1`,
      cancel_url: `${baseUrl}`,
    })
    return Response.json({ url: session.url })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
