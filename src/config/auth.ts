export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  
  // Session 設定
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // OAuth 提供者
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  // 頁面路由
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
  }
} as const