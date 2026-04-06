/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow large image uploads to the API routes
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
