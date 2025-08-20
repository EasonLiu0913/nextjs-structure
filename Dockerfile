# 多階段建置 Dockerfile for Next.js 企業級應用

# ===== 基礎映像 =====
FROM node:20-alpine AS base

# 安裝必要的系統依賴
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# ===== 依賴安裝階段 =====
FROM base AS deps

# 安裝所有依賴 (包括 devDependencies)
RUN npm ci

# ===== 建置階段 =====
FROM base AS builder

# 複製依賴
COPY --from=deps /app/node_modules ./node_modules

# 複製原始碼
COPY . .

# 設定建置環境變數
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 設定建置時需要的環境變數 (使用預設值)
ARG NEXT_PUBLIC_APP_NAME="NextJS Enterprise App"
ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ARG NEXTAUTH_URL="http://localhost:3000"

ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
# NEXTAUTH_SECRET 將在運行時設定，不在建置時暴露

# 建置應用程式
RUN npm run build

# ===== 生產依賴階段 =====
FROM base AS prod-deps

# 只安裝生產依賴
RUN npm ci --only=production && npm cache clean --force

# ===== 執行階段 =====
FROM node:20-alpine AS runner

# 設定工作目錄
WORKDIR /app

# 建立非 root 使用者
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製必要的檔案
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 複製建置結果
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 設定環境變數
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 切換到非 root 使用者
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# 啟動應用程式
CMD ["node", "server.js"]