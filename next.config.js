const { withSentryConfig } = require('@sentry/nextjs')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure 部署優化
  output: 'standalone',
  trailingSlash: true,
  
  // 實驗性功能
  experimental: {
    serverComponentsExternalPackages: ['@sentry/nextjs']
  },
  
  // 圖片優化
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  }
}

// Sentry 配置選項
const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring/tunnel',
  hideSourceMaps: true,
  disableLogger: true
}

module.exports = withSentryConfig(withNextIntl(nextConfig), sentryWebpackPluginOptions)