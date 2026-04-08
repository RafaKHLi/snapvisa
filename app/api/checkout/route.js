import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const PRICES = {
  single: {
    GBP:{amount:199,currency:'gbp'},USD:{amount:249,currency:'usd'},EUR:{amount:229,currency:'eur'},
    HKD:{amount:1900,currency:'hkd'},TWD:{amount:6500,currency:'twd'},AUD:{amount:399,currency:'aud'},
    CAD:{amount:349,currency:'cad'},SGD:{amount:349,currency:'sgd'},INR:{amount:19900,currency:'inr'},
    JPY:{amount:299,currency:'jpy'},NZD:{amount:399,currency:'nzd'},
  }
}
export async function POST(request) {
  try {
    const { priceId, currency } = await request.json()
    const curr = currency?.toUpperCase() || 'GBP'
    const price = PRICES.single[curr] || PRICES.single.GBP
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: price.currency, product_data: { name: 'SnapVisa — Photo Download', description: 'Print-ready visa/passport photo' }, unit_amount: price.amount }, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://www.snapvisa.co.uk/index.html?paid=1',
      cancel_url: 'https://www.snapvisa.co.uk',
    })
    return Response.json({ url: session.url })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
