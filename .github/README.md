# GitHub Actions CI/CD 工作流程

這個目錄包含了完整的 CI/CD 工作流程配置，為 Next.js 企業級應用提供自動化的建置、測試和部署流程。

## 📋 工作流程概覽

### 1. CI Pipeline (`ci.yml`)
**觸發條件**: Push 到 `main`/`develop` 分支或 Pull Request 到 `main`

**包含的工作**:
- 🔍 程式碼品質檢查 (ESLint, TypeScript)
- 🧪 單元測試 (Vitest + 覆蓋率報告)
- 🏗️ 建置測試
- 🎭 E2E 測試 (Playwright - Chrome & Firefox)
- 🔒 安全性掃描 (npm audit, Snyk)
- 📊 程式碼品質分析 (SonarCloud)
- ⚡ 效能測試 (Lighthouse CI)
- 📢 Slack 通知

### 2. Staging Deployment (`deploy-staging.yml`)
**觸發條件**: Push 到 `develop` 分支

**部署流程**:
- ✅ 執行完整 CI 檢查
- 🚀 部署到 Azure Web App (Staging)
- 🔧 配置環境變數
- 💨 煙霧測試
- 📢 部署結果通知
- 🏷️ 建立 GitHub Release (如果是 tag)

### 3. Production Deployment (`deploy-production.yml`)
**觸發條件**: Push 到 `main` 分支、Release 發布或手動觸發

**部署流程**:
- ✅ 完整 CI 檢查
- 🔍 部署前安全檢查
- 👥 手動批准 (非手動觸發時)
- 🎯 藍綠部署 (使用 Azure Deployment Slots)
- 🧪 生產環境煙霧測試
- 🔄 自動交換到生產環境
- 🔙 失敗時自動回滾
- 📊 部署後完整測試
- 📈 效能審計

### 4. Security Scan (`security-scan.yml`)
**觸發條件**: 每日定時執行、Push 或 Pull Request

**安全檢查**:
- 🔍 npm audit (漏洞掃描)
- 🛡️ Snyk 安全掃描
- 🔎 CodeQL 程式碼分析
- 🔐 Secret 掃描 (TruffleHog)
- 📜 授權檢查

### 5. Dependency Update (`dependency-update.yml`)
**觸發條件**: 每週一定時執行

**自動化更新**:
- 📦 檢查依賴更新
- 🔄 更新 patch 和 minor 版本
- 🧪 執行測試
- 📝 建立 Pull Request

### 6. Cleanup (`cleanup.yml`)
**觸發條件**: 每週日定時執行

**清理作業**:
- 🗑️ 刪除舊的 Artifacts
- 📋 清理工作流程執行記錄
- 💾 清理快取
- 🌿 刪除已合併的分支

## 🔧 設定需求

### GitHub Secrets
在 GitHub Repository Settings > Secrets and variables > Actions 中設定以下 secrets:

#### Azure 部署相關
```
AZURE_CREDENTIALS_STAGING     # Azure 服務主體 (Staging)
AZURE_CREDENTIALS_PROD        # Azure 服務主體 (Production)
AZURE_RESOURCE_GROUP          # Azure 資源群組名稱
```

#### 應用程式環境變數 - Staging
```
STAGING_APP_NAME              # 應用程式名稱
STAGING_APP_URL               # 應用程式 URL
STAGING_API_URL               # API URL
STAGING_NEXTAUTH_SECRET       # NextAuth 密鑰
STAGING_NEXTAUTH_URL          # NextAuth URL
STAGING_GOOGLE_CLIENT_ID      # Google OAuth Client ID
STAGING_GOOGLE_CLIENT_SECRET  # Google OAuth Client Secret
STAGING_SENTRY_DSN            # Sentry DSN
```

#### 應用程式環境變數 - Production
```
PROD_APP_NAME                 # 應用程式名稱
PROD_APP_URL                  # 應用程式 URL
PROD_API_URL                  # API URL
PROD_NEXTAUTH_SECRET          # NextAuth 密鑰
PROD_NEXTAUTH_URL             # NextAuth URL
PROD_GOOGLE_CLIENT_ID         # Google OAuth Client ID
PROD_GOOGLE_CLIENT_SECRET     # Google OAuth Client Secret
PROD_SENTRY_DSN               # Sentry DSN
PROD_SENTRY_ORG               # Sentry 組織
PROD_SENTRY_PROJECT           # Sentry 專案
PROD_SENTRY_AUTH_TOKEN        # Sentry Auth Token
```

#### 第三方服務
```
SNYK_TOKEN                    # Snyk API Token
SONAR_TOKEN                   # SonarCloud Token
LHCI_GITHUB_APP_TOKEN         # Lighthouse CI GitHub App Token
SLACK_WEBHOOK                 # Slack Webhook URL
```

### GitHub Environments
建立以下環境並設定保護規則:

1. **staging** - 測試環境
2. **production** - 生產環境
3. **production-approval** - 生產部署批准

### Azure 設定

#### 建立 Azure Web Apps
```bash
# Staging
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name nextjs-app-staging --runtime "NODE|20-lts"

# Production
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name nextjs-app-production --runtime "NODE|20-lts"
```

#### 建立服務主體
```bash
az ad sp create-for-rbac --name "GitHub-Actions-SP" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth
```

## 📊 監控和通知

### Slack 通知
工作流程會在以下情況發送 Slack 通知:
- ✅ CI 流程成功/失敗
- 🚀 部署成功/失敗
- 🔒 安全問題發現
- 📦 依賴更新可用
- 🧹 清理作業完成

### 監控儀表板
- **GitHub Actions**: 查看工作流程執行狀態
- **SonarCloud**: 程式碼品質分析
- **Snyk**: 安全漏洞監控
- **Azure Portal**: 應用程式效能監控

## 🚀 使用指南

### 開發流程
1. 在 `develop` 分支開發功能
2. 建立 Pull Request 到 `main`
3. CI 流程自動執行
4. 合併後自動部署到 Staging
5. 測試通過後合併到 `main`
6. 自動部署到 Production

### 緊急部署
```bash
# 手動觸發生產部署 (跳過測試)
gh workflow run deploy-production.yml -f skip_tests=true -f environment=hotfix
```

### 查看部署狀態
```bash
# 查看最新的工作流程執行
gh run list --workflow=deploy-production.yml

# 查看特定執行的詳細資訊
gh run view <run-id>
```

## 🔧 故障排除

### 常見問題

1. **部署失敗**: 檢查 Azure 服務狀態和 secrets 配置
2. **測試失敗**: 查看測試報告和日誌
3. **安全掃描失敗**: 更新依賴或修復漏洞
4. **效能測試失敗**: 優化應用程式效能

### 日誌查看
- GitHub Actions 日誌
- Azure Web App 日誌
- Playwright 測試報告
- Lighthouse 效能報告

## 📈 最佳實踐

1. **分支策略**: 使用 GitFlow 或 GitHub Flow
2. **測試覆蓋率**: 維持 80% 以上的測試覆蓋率
3. **安全性**: 定期更新依賴和修復漏洞
4. **效能**: 監控 Lighthouse 分數
5. **監控**: 設定適當的告警和通知

## 🔄 持續改進

定期檢視和優化:
- 工作流程執行時間
- 測試覆蓋率和品質
- 安全性掃描結果
- 部署成功率
- 效能指標