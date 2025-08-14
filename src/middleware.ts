import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 建立 next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en'
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. 處理國際化路由
  const response = intlMiddleware(request)
  
  // 2. 認證保護路由
  const protectedPaths = ['/dashboard', '/profile', '/admin']
  const isProtectedPath = protectedPaths.some(path => 
    pathname.includes(path)
  )
  
  if (isProtectedPath) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      )
    }
  }
  
  // 3. API 限流 (簡單實作)
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    console.log(`API request from ${ip} to ${pathname}`)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ]
}