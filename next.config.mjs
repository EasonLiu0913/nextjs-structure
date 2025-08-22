import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure 部署優化
  output: 'standalone',
  trailingSlash: true,
  
  // 圖片優化
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  }
}

export default withNextIntl(nextConfig)