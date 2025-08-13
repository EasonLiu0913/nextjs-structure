# E2E Testing Guide

這個目錄包含了使用 Playwright 的端到端測試。

## 📁 測試結構

```
tests/
├── e2e/                    # E2E 測試檔案
│   ├── auth/              # 認證相關測試
│   ├── dashboard/         # 儀表板測試
│   ├── profile/           # 個人資料測試
│   ├── i18n/              # 國際化測試
│   └── navigation/        # 導航測試
├── support/               # 測試輔助工具
│   ├── page-objects/      # 頁面物件模式
│   └── commands.ts        # 自定義命令
├── fixtures/              # 測試資料
│   ├── users.json         # 使用者測試資料
│   └── auth.json          # 認證測試資料
├── global-setup.ts        # 全域測試設定
└── global-teardown.ts     # 全域測試清理
```

## 🚀 執行測試

### 基本命令

```bash
# 執行所有 E2E 測試
npm run test:e2e

# 使用 UI 模式執行測試
npm run test:e2e:ui

# 有頭模式執行（可以看到瀏覽器）
npm run test:e2e:headed

# 除錯模式
npm run test:e2e:debug

# 查看測試報告
npm run test:e2e:report
```

### 分類測試

```bash
# 只執行認證測試
npm run test:e2e:auth

# 只執行儀表板測試
npm run test:e2e:dashboard

# 只執行個人資料測試
npm run test:e2e:profile

# 只執行國際化測試
npm run test:e2e:i18n

# 只執行導航測試
npm run test:e2e:navigation
```

### 進階選項

```bash
# 在特定瀏覽器執行
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# 在行動裝置執行
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"

# 執行特定測試檔案
npx playwright test tests/e2e/auth/login.spec.ts

# 執行特定測試案例
npx playwright test -g "should login successfully"

# 並行執行
npx playwright test --workers=4

# 重試失敗的測試
npx playwright test --retries=2
```

## 📝 測試撰寫指南

### 1. 使用頁面物件模式

```typescript
import { LoginPage } from '../support/page-objects/login-page'

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.loginWithValidCredentials()
  await loginPage.waitForRedirect()
})
```

### 2. 使用測試命令

```typescript
import { TestCommands } from '../support/commands'

test('should access dashboard after login', async ({ page }) => {
  const commands = new TestCommands(page)
  await commands.login()
  await commands.waitForPageLoad()
})
```

### 3. 使用測試資料

```typescript
import userData from '../fixtures/users.json'

test('should register new user', async ({ page }) => {
  const { newUser } = userData
  await page.fill('input[name="name"]', newUser.name)
  await page.fill('input[name="email"]', newUser.email)
  // ...
})
```

## 🎯 測試最佳實踐

### 1. 測試隔離
- 每個測試都應該是獨立的
- 使用 `test.beforeEach` 設定初始狀態
- 避免測試間的依賴關係

### 2. 等待策略
```typescript
// ✅ 好的做法
await expect(page.locator('text=Dashboard')).toBeVisible()

// ❌ 避免使用固定等待
await page.waitForTimeout(5000)
```

### 3. 選擇器策略
```typescript
// ✅ 優先使用語義化選擇器
await page.click('text=Login')
await page.click('button[type="submit"]')

// ✅ 使用 data-testid 屬性
await page.click('[data-testid="login-button"]')

// ❌ 避免使用脆弱的 CSS 選擇器
await page.click('.btn.btn-primary.login-btn')
```

### 4. 斷言策略
```typescript
// ✅ 使用具體的斷言
await expect(page).toHaveURL(/\/dashboard/)
await expect(page.locator('h1')).toHaveText('Dashboard')

// ❌ 避免模糊的斷言
await expect(page.locator('div')).toBeVisible()
```

## 🐛 除錯技巧

### 1. 視覺除錯
```bash
# 使用有頭模式查看測試執行
npm run test:e2e:headed

# 使用除錯模式逐步執行
npm run test:e2e:debug
```

### 2. 截圖和錄影
```typescript
// 手動截圖
await page.screenshot({ path: 'debug.png' })

// 錄製測試過程
// 在 playwright.config.ts 中設定 video: 'on'
```

### 3. 追蹤檔案
```typescript
// 在 playwright.config.ts 中設定 trace: 'on'
// 然後查看追蹤檔案
npx playwright show-trace trace.zip
```

## 📊 測試報告

測試完成後，可以查看詳細的 HTML 報告：

```bash
npm run test:e2e:report
```

報告包含：
- 測試結果摘要
- 失敗測試的截圖
- 測試執行影片
- 追蹤檔案
- 效能指標

## 🔧 CI/CD 整合

在 CI 環境中執行測試：

```bash
# 安裝 Playwright 瀏覽器
npx playwright install --with-deps

# 執行測試
npm run test:e2e

# 上傳測試報告
# (根據你的 CI 系統配置)
```

## 📚 更多資源

- [Playwright 官方文件](https://playwright.dev/)
- [測試最佳實踐](https://playwright.dev/docs/best-practices)
- [頁面物件模式](https://playwright.dev/docs/pom)
- [測試生成器](https://playwright.dev/docs/codegen)