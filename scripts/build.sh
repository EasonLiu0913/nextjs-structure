#!/bin/bash

set -e

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
  echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_info "開始建置 Next.js 專案..."

# 清理舊的建置檔案
log_info "清理舊檔案..."
rm -rf .next
rm -rf out
rm -rf dist

# 安裝依賴
log_info "安裝依賴..."
npm ci

# 類型檢查
log_info "執行 TypeScript 檢查..."
npm run type-check

# 執行 Linting
log_info "執行程式碼檢查..."
npm run lint

# 執行測試
log_info "執行測試..."
npm run test

# 建置專案
log_info "建置專案..."
npm run build

log_success "建置完成！"