/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'locahost',
      'bootcamp-richard.s3.us-east-2.amazonaws.com',
      'bootcamp-richard.s3.amazonaws.com'
    ]
  }
}

module.exports = nextConfig
