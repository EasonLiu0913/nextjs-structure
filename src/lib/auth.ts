import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/schemas/auth-schema'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 驗證輸入格式
        const result = loginSchema.safeParse(credentials)
        if (!result.success) {
          return null
        }

        // 這裡應該查詢資料庫驗證使用者
        // 暫時使用模擬資料 - 使用預先生成的密碼雜湊
        const mockUser = {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          hashedPassword: '$2a$12$rYDW5NOZcnbgkCZUbiYnFeDY71LQdIjhjs1GOQ64C7oGL7D65GHZu' // password123
        }

        if (credentials.email === mockUser.email) {
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            mockUser.hashedPassword
          )

          if (isValidPassword) {
            return {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name
            }
          }
        }

        return null
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : [])
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour for better WebKit compatibility
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Remove domain setting for better cross-browser compatibility
        domain: undefined
      }
    },
    // Add explicit cookie settings for better WebKit support
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      try {
        // Extract locale from the URL if present
        const urlObj = new URL(url, baseUrl)
        const pathSegments = urlObj.pathname.split('/').filter(Boolean)
        const possibleLocale = pathSegments[0]
        
        // Check if first segment is a valid locale
        const validLocales = ['en', 'zh']
        let locale = validLocales.includes(possibleLocale) ? possibleLocale : 'en'
        
        // Try to extract locale from the callback URL if it's present in the URL
        const callbackUrl = urlObj.searchParams.get('callbackUrl')
        if (callbackUrl) {
          try {
            const callbackSegments = callbackUrl.split('/').filter(Boolean)
            const callbackLocale = callbackSegments[0]
            if (validLocales.includes(callbackLocale)) {
              locale = callbackLocale
            }
          } catch (e) {
            // Ignore callback URL parsing errors
            console.warn('Error parsing callback URL:', e)
          }
        }
        
        // If URL starts with /, ensure it includes locale and return full URL
        if (url.startsWith('/')) {
          // If URL already has locale, use it as-is
          if (validLocales.includes(pathSegments[0])) {
            return `${baseUrl}${url}`
          }
          // If URL doesn't have locale, add detected/default locale
          return `${baseUrl}/${locale}${url}`
        }
        
        // For absolute URLs, check if they're on the same origin
        if (urlObj.origin === baseUrl) {
          return url
        }
        
        // Default redirect to dashboard with preserved locale
        return `${baseUrl}/${locale}/dashboard`
      } catch (error) {
        // Fallback for any URL parsing errors - especially important for WebKit
        console.warn('Error in redirect callback:', error)
        return `${baseUrl}/en/dashboard`
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
}