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
        // 暫時使用模擬資料
        const mockUser = {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          hashedPassword: await bcrypt.hash('password123', 12)
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
    strategy: 'jwt'
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
      if (token) {
        (session.user as any).id = token.id as string
      }
      return session
    }
  }
}