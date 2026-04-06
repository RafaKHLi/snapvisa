import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id

  let session = null
  let error = null

  if (sessionId) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
    } catch (e) {
      error = 'Could not verify payment.'
    }
  }

  const paid = session?.payment_status === 'paid'

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Payment Confirmed — SnapVisa</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; background: #F7F4EE; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
          .card { background: white; border-radius: 20px; padding: 3rem 2rem; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .icon { font-size: 48px; margin-bottom: 1rem; }
          h1 { font-family: 'DM Serif Display', serif; font-size: 28px; margin-bottom: 0.5rem; color: #1A7A4A; }
          p { color: #8A8880; font-size: 14px; line-height: 1.6; margin-bottom: 1.5rem; }
          .btn { display: inline-block; background: #2B5CE6; color: white; padding: 13px 32px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 15px; }
          .btn:hover { opacity: 0.9; }
          .note { font-size: 12px; color: #aaa; margin-top: 1rem; }
        `}</style>
      </head>
      <body>
        <div className="card">
          {paid ? (
            <>
              <div className="icon">✅</div>
              <h1>Payment confirmed!</h1>
              <p>Your photo is ready to download. Go back to SnapVisa — your download link is waiting.</p>
              <a href="/" className="btn">← Back to SnapVisa</a>
              <div className="note">Order ID: {sessionId?.slice(-8).toUpperCase()}</div>
            </>
          ) : (
            <>
              <div className="icon">⚠️</div>
              <h1>Something went wrong</h1>
              <p>{error || 'We could not verify your payment. Please contact support if you were charged.'}</p>
              <a href="/" className="btn">← Back to SnapVisa</a>
            </>
          )}
        </div>
      </body>
    </html>
  )
}
