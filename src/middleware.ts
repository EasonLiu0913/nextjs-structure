import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. 國際化路由處理
  const locales = ['en', 'zh']
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  if (pathnameIsMissingLocale) {
    // 偵測使用者偏好語言
    const locale = getLocale(request) || 'en'
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
  
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
      const locale = pathname.split('/')[1]
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      )
    }
  }
  
  // 3. API 限流 (簡單實作)
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown'
    // 這裡可以實作更複雜的限流邏輯
    console.log(`API request from ${ip} to ${pathname}`)
  }
  
  return NextResponse.next()
}

function getLocale(request: NextRequest): string {
  // 從 Accept-Language header 偵測語言
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage?.includes('zh')) return 'zh'
  return 'en'
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ]
}