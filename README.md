# Next.js 15 Enterprise Application

A modern, full-stack enterprise application built with Next.js 15, featuring authentication, internationalization, monitoring, and comprehensive testing.

## 🚀 Features

- **Next.js 15** with App Router and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for modern UI
- **NextAuth.js** for authentication
- **Zustand** for state management
- **next-intl** for internationalization
- **Framer Motion** for animations
- **React Hook Form** + **Zod** for form handling
- **Vitest** + **Playwright** for testing
- **Sentry** for error tracking
- **Vercel Analytics** for insights
- **Husky** + **Commitizen** for Git workflow

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   └── monitoring/        # Error tracking components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── actions/               # Server Actions
├── schemas/               # Zod validation schemas
├── stores/                # Zustand stores
├── config/                # Configuration files
├── env/                   # Environment validation
└── __tests__/             # Unit tests
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run commit` - Interactive commit with Commitizen

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:ui      # With UI
npm run test:coverage # With coverage
```

### E2E Tests
```bash
npm run test:e2e
npm run test:e2e:ui  # With UI
```

## 🌍 Internationalization

The app supports multiple languages:
- English (en)
- Chinese (zh)

Language files are located in `messages/` directory.

## 🔐 Authentication

Authentication is handled by NextAuth.js with support for:
- Credentials provider
- OAuth providers (Google, etc.)
- JWT sessions

## 📊 Monitoring

- **Error Tracking**: Sentry for comprehensive error monitoring
- **Analytics**: Vercel Analytics for user insights
- **Performance**: Built-in performance monitoring

## 🚀 Deployment

### Azure App Service

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy using the provided scripts:
   ```bash
   ./scripts/deploy.sh --environment production
   ```

### Environment Variables

Required environment variables:
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Application URL
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Commit using: `npm run commit`
6. Push and create a Pull Request

## 📄 License

This project is licensed under the MIT License.