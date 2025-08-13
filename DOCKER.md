# 🐳 Docker 容器化指南

這個文檔說明如何使用 Docker 來建置、測試和部署 Next.js 企業級應用。

## 📋 目錄

- [快速開始](#快速開始)
- [Docker 文件說明](#docker-文件說明)
- [本地開發](#本地開發)
- [生產部署](#生產部署)
- [CI/CD 整合](#cicd-整合)
- [故障排除](#故障排除)

## 🚀 快速開始

### 建置 Docker 映像

```bash
# 使用預設設定建置
./scripts/docker-build.sh

# 或使用 Docker 命令
docker build -t nextjs-enterprise-app .
```

### 執行容器

```bash
# 基本執行
docker run -p 3000:3000 nextjs-enterprise-app

# 使用環境變數
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APP_NAME="My App" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  nextjs-enterprise-app
```

### 使用 Docker Compose

```bash
# 啟動完整的開發環境
docker-compose -f docker-compose.dev.yml up

# 啟動生產環境
docker-compose up
```

## 📁 Docker 文件說明

### 核心文件

- **`Dockerfile`** - 生產環境多階段建置
- **`Dockerfile.dev`** - 開發環境建置
- **`docker-compose.yml`** - 生產環境服務編排
- **`docker-compose.dev.yml`** - 開發環境服務編排
- **`.dockerignore`** - 排除不需要的文件
- **`healthcheck.js`** - 容器健康檢查腳本

### 輔助文件

- **`scripts/docker-build.sh`** - 建置腳本
- **`k8s/deployment.yaml`** - Kubernetes 部署配置

## 🛠️ 本地開發

### 開發環境設置

```bash
# 建置開發映像
docker build -f Dockerfile.dev -t nextjs-app-dev .

# 或使用腳本
./scripts/docker-build.sh --dev

# 啟動開發環境
docker-compose -f docker-compose.dev.yml up
```

### 開發環境特色

- 🔄 熱重載支援
- 📧 Mailhog 郵件測試
- 🗄️ PostgreSQL 資料庫
- 💾 Redis 快取
- 📁 原始碼掛載

### 訪問服務

- **應用程式**: http://localhost:3000
- **Mailhog**: http://localhost:8025
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🚀 生產部署

### 建置生產映像

```bash
# 建置並推送到 GitHub Container Registry
./scripts/docker-build.sh \
  --name nextjs-enterprise-app \
  --tag v1.0.0 \
  --registry ghcr.io/your-username \
  --push

# 多架構建置
./scripts/docker-build.sh \
  --multi-arch \
  --push \
  --registry ghcr.io/your-username
```

### 部署選項

#### 1. Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name nextjs-app \
  --image ghcr.io/your-username/nextjs-enterprise-app:latest \
  --dns-name-label nextjs-app \
  --ports 3000 \
  --environment-variables \
    NODE_ENV=production \
    NEXT_PUBLIC_APP_NAME="My App" \
  --secure-environment-variables \
    NEXTAUTH_SECRET="your-secret"
```

#### 2. Azure Container Apps

```bash
az containerapp up \
  --name nextjs-app \
  --resource-group myResourceGroup \
  --location eastus \
  --environment nextjs-env \
  --image ghcr.io/your-username/nextjs-enterprise-app:latest \
  --target-port 3000 \
  --ingress external
```

#### 3. Kubernetes

```bash
# 更新映像標籤
sed -i "s|IMAGE_TAG|v1.0.0|g" k8s/deployment.yaml

# 部署到 Kubernetes
kubectl apply -f k8s/

# 檢查部署狀態
kubectl rollout status deployment/nextjs-app
```

## 🔄 CI/CD 整合

### GitHub Actions 工作流程

我們提供了完整的 CI/CD 工作流程：

1. **`docker-build.yml`** - 自動建置和推送 Docker 映像
2. **`deploy-docker.yml`** - 自動部署容器到雲端平台

### 觸發條件

- **Push 到 main/develop** - 自動建置和部署
- **Pull Request** - 建置和測試
- **Tag 推送** - 建置發布版本
- **手動觸發** - 支援手動部署

### 功能特色

- ✅ 多架構建置 (AMD64, ARM64)
- 🔍 安全性掃描 (Trivy)
- 📊 SBOM 生成
- 🧪 容器測試
- 📢 Slack 通知

## 🔧 環境變數

### 必要變數

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### 可選變數

```bash
# OAuth 設定
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 監控設定
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"

# 資料庫設定
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
```

## 🐛 故障排除

### 常見問題

#### 1. 容器啟動失敗

```bash
# 檢查容器日誌
docker logs <container-id>

# 進入容器除錯
docker exec -it <container-id> /bin/sh
```

#### 2. 健康檢查失敗

```bash
# 手動執行健康檢查
docker exec <container-id> node healthcheck.js

# 檢查應用程式狀態
curl http://localhost:3000/api/health
```

#### 3. 建置失敗

```bash
# 清理 Docker 快取
docker system prune -a

# 重新建置不使用快取
docker build --no-cache -t nextjs-enterprise-app .
```

#### 4. 權限問題

```bash
# 檢查文件權限
ls -la

# 修復腳本權限
chmod +x scripts/*.sh
```

### 效能優化

#### 1. 映像大小優化

- 使用 Alpine Linux 基礎映像
- 多階段建置移除不必要文件
- 使用 `.dockerignore` 排除文件

#### 2. 建置速度優化

- 使用 Docker BuildKit
- 啟用建置快取
- 並行建置多架構

#### 3. 執行時優化

- 設定適當的資源限制
- 使用健康檢查
- 配置重啟策略

## 📊 監控和日誌

### 容器監控

```bash
# 檢查容器狀態
docker ps

# 監控資源使用
docker stats

# 檢查容器健康狀態
docker inspect <container-id> | grep Health
```

### 日誌管理

```bash
# 查看容器日誌
docker logs -f <container-id>

# 限制日誌大小
docker run --log-opt max-size=10m --log-opt max-file=3 <image>
```

## 🔐 安全性最佳實踐

1. **使用非 root 使用者執行**
2. **定期更新基礎映像**
3. **掃描安全漏洞**
4. **使用 secrets 管理敏感資料**
5. **限制容器權限**
6. **使用 HTTPS**
7. **設定防火牆規則**

## 📚 參考資源

- [Docker 官方文檔](https://docs.docker.com/)
- [Next.js Docker 部署](https://nextjs.org/docs/deployment#docker-image)
- [Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/)
- [Kubernetes 文檔](https://kubernetes.io/docs/)

## 🤝 貢獻

如果你發現任何問題或有改進建議，請：

1. 建立 Issue
2. 提交 Pull Request
3. 更新文檔

---

**注意**: 請確保在生產環境中使用適當的 secrets 管理和安全配置。