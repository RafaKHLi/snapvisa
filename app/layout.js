export const metadata = {
  title: 'SnapVisa — Instant Visa & Passport Photos Online',
  description: 'AI-powered visa and passport photos for 21+ countries. Background removed, sized to spec. Download in seconds.',
  keywords: 'visa photo, passport photo, online, AI, UK, US, Schengen, Hong Kong, Thailand',
  openGraph: {
    title: 'SnapVisa — Instant Visa & Passport Photos',
    description: 'AI-powered visa photos for 21+ countries. Upload a photo, we handle the rest.',
    url: 'https://snapvisa.co.uk',
    siteName: 'SnapVisa',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
