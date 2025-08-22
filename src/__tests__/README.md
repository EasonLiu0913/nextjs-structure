# Unit Tests Documentation

本文檔詳細說明了專案中所有單元測試的內容和覆蓋範圍。

## 📁 測試結構

```
src/__tests__/
├── components/
│   ├── layout/
│   │   ├── header.test.tsx
│   │   └── footer.test.tsx
│   └── ui/
│       ├── button.test.tsx
│       └── card.test.tsx
├── hooks/
│   ├── use-analytics.test.ts
│   ├── use-auth.test.ts
│   ├── use-mobile-auth.test.ts
│   ├── use-preferences.test.ts
│   └── use-toast.test.ts
└── lib/
    └── utils.test.ts
```

## 🧪 測試覆蓋詳情

### 📦 Components Tests

#### Layout Components

##### `header.test.tsx` - Header 元件測試

**測試內容：**

**結構與樣式**

- ✅ Footer 基本結構和 CSS 類別
- ✅ 響應式網格佈局
- ✅ 語義化 HTML 結構（contentinfo、headings、lists）

**品牌元素**

- ✅ 公司 Logo 和品牌名稱顯示
- ✅ 導航連結渲染（桌面版）

**認證狀態處理**

- ✅ 未登入時顯示登入/註冊按鈕
- ✅ 已登入時顯示用戶資訊和登出按鈕
- ✅ Session 載入狀態顯示

**互動功能**

- ✅ 手機版選單切換功能
- ✅ 當前頁面導航連結高亮
- ✅ 語言切換器渲染

**測試特色：**

- 使用 `vi.mock()` 模擬外部依賴（NextAuth、Next.js router、next-intl）
- 測試不同的認證狀態（未登入、已登入、載入中）
- 測試互動功能（選單切換）
- 測試條件渲染邏輯

##### `footer.test.tsx` - Footer 元件測試

**測試內容：**

**結構與樣式**

- ✅ Footer 基本結構和 CSS 類別
- ✅ 響應式網格佈局
- ✅ 語義化 HTML 結構（contentinfo、headings、lists）

**品牌元素**

- ✅ 公司 Logo 和品牌名稱
- ✅ 公司描述文字

**導航連結**

- ✅ Product 區塊連結（Features、Pricing、Documentation）
- ✅ Company 區塊連結（About、Contact、Careers）
- ✅ Legal 區塊連結（Privacy、Terms、Cookies）

**國際化支援**

- ✅ 不同語言環境的連結適配
- ✅ 翻譯鍵值的正確使用

**動態內容**

- ✅ 當前年份顯示
- ✅ 版權聲明

**互動與樣式**

- ✅ 連結 hover 效果樣式
- ✅ 正確的 href 屬性

**可訪問性**

- ✅ 語義化標籤使用
- ✅ 標題層級結構
- ✅ 列表結構

#### UI Components

##### `button.test.tsx` - Button 元件測試

**測試內容：**

**基本功能**

- ✅ 正確渲染按鈕

**Variant Classes 測試**

- ✅ `default` - 測試 `bg-primary` 和 `text-primary-foreground`
- ✅ `destructive` - 測試 `bg-destructive` 和 `text-destructive-foreground`
- ✅ `outline` - 測試 `border`, `border-input`, `bg-background`
- ✅ `secondary` - 測試 `bg-secondary` 和 `text-secondary-foreground`
- ✅ `ghost` - 測試 `hover:bg-accent` 和 `hover:text-accent-foreground`
- ✅ `link` - 測試 `text-primary`, `underline-offset-4`, `hover:underline`

**Size Classes 測試**

- ✅ `default` - 測試 `h-10`, `px-4`, `py-2`
- ✅ `sm` - 測試 `h-9`, `rounded-md`, `px-3`
- ✅ `lg` - 測試 `h-11`, `rounded-md`, `px-8`
- ✅ `icon` - 測試 `h-10`, `w-10`

**組合測試**

- ✅ Variant + Size 組合測試
- ✅ 不同組合的實際應用場景
- ✅ 複雜組合驗證

**基礎類別測試**

- ✅ 測試所有按鈕共用的基礎 CSS 類別
- ✅ 確保基礎類別在所有變體中都存在

**狀態測試**

- ✅ 禁用狀態處理
- ✅ 禁用狀態下 variant 類別保持

**進階功能測試**

- ✅ 自訂 className 合併測試
- ✅ `asChild` prop 功能測試（Radix UI Slot）

**測試特色：**

- 完整的 Variant 覆蓋 - 測試所有 6 個 variant 樣式
- 完整的 Size 覆蓋 - 測試所有 4 個 size 樣式
- 組合場景測試 - 驗證 variant 和 size 的組合效果
- Class Variance Authority (CVA) 整合測試
- Tailwind CSS 類別應用驗證
- 可訪問性屬性驗證
- Radix UI Slot 功能測試

##### `card.test.tsx` - Card 元件系統測試

**測試內容：**

**個別元件測試**

- ✅ `Card` - 預設樣式、自訂 className、ref 轉發
- ✅ `CardHeader` - 預設樣式和自訂樣式
- ✅ `CardTitle` - h3 標籤、語義角色、樣式類別
- ✅ `CardDescription` - 段落標籤、樣式類別
- ✅ `CardContent` - 預設樣式和自訂樣式
- ✅ `CardFooter` - 預設樣式和自訂樣式

**整合測試**

- ✅ 完整的 Card 結構組合測試
- ✅ 語義結構正確性測試

**測試特色：**

- 測試所有 Tailwind CSS 類別是否正確應用
- 測試自訂 className 是否與預設類別合併
- 測試 React forwardRef 功能
- 測試語義 HTML 結構（h3、p 標籤等）
- 測試元件組合的完整性

### 🎣 Hooks Tests

#### `use-analytics.test.ts` - Analytics Hook 測試

**測試內容：**

**track 函數功能**

- ✅ 當 window.va 可用時正確調用
- ✅ 處理無屬性的事件
- ✅ 安全處理 null/undefined 屬性
- ✅ window.va 不可用時不調用
- ✅ window.va 不是函數時不調用
- ✅ 優雅處理追蹤錯誤
- ✅ 服務端渲染環境兼容

**便捷方法**

- ✅ export trackLogin 方法
- ✅ export trackLogout 方法
- ✅ export trackRegister 方法
- ✅ export trackFeatureUsed 方法
- ✅ export trackButtonClick 方法
- ✅ export trackFormStart 方法
- ✅ export trackFormComplete 方法
- ✅ export trackError 方法

**Hook 穩定性**

- ✅ 跨重新渲染維持 track 函數引用
- ✅ 跨重新渲染維持便捷方法引用

**數據類型處理**

- ✅ 處理字串屬性
- ✅ 處理數字屬性
- ✅ 處理布林屬性
- ✅ 處理混合屬性類型

**測試特色：**

- 完整的瀏覽器 API mocking
- 錯誤處理和恢復測試
- 服務端渲染兼容性測試
- Hook 穩定性驗證

#### `use-auth.test.ts` - 認證 Hook 測試

**測試內容：**

**Session 同步**

- ✅ 同步已認證 session 到 store
- ✅ 處理無 id 的 session
- ✅ 處理無 image 的 session
- ✅ 處理缺失用戶數據的 session
- ✅ 未認證時執行登出
- ✅ 載入狀態時不同步

**返回值**

- ✅ 當 session 和 store 都已認證時返回認證狀態
- ✅ session 未認證時返回未認證狀態
- ✅ session 載入時返回載入狀態
- ✅ session 已認證但 store 未認證時返回 false

**Effect 依賴**

- ✅ session 變化時重新同步
- ✅ 狀態變化時重新同步

**測試特色：**

- NextAuth 和 Zustand store 整合測試
- 狀態同步邏輯驗證
- 邊界情況處理
- 依賴變化響應測試

#### `use-mobile-auth.test.ts` - 移動端認證 Hook 測試

**測試內容：**

**設備檢測**

- ✅ 通過 user agent 檢測移動設備
- ✅ 通過視窗寬度檢測移動設備
- ✅ 檢測桌面設備
- ✅ 監聽視窗大小變化事件
- ✅ 卸載時清理事件監聽器

**認證處理**

- ✅ requireAuth 為 true 且未認證時重定向到登入
- ✅ requireAuth 為 false 時不重定向
- ✅ 狀態為載入時不重定向
- ✅ 處理移動端認證後重定向

**handleMobileRedirect**

- ✅ 移動設備使用 window.location.href
- ✅ 桌面設備使用 router.push

**retryAuthentication**

- ✅ 移動設備重新載入頁面
- ✅ 桌面設備導航到登入頁

**返回值**

- ✅ 返回正確的認證狀態
- ✅ 返回載入狀態

**選項處理**

- ✅ 使用自訂 redirectTo 選項

**測試特色：**

- 設備檢測邏輯測試
- 移動端特殊處理邏輯
- 事件監聽器管理
- 重定向策略測試

#### `use-preferences.test.ts` - 偏好設定 Hook 測試

**測試內容：**

**語言切換功能 (applyLanguageChange)**

- ✅ 切換到不同語言時正確導航
- ✅ 相同語言時不導航
- ✅ 處理根路徑
- ✅ 處理嵌套路徑

**主題切換功能 (applyThemeChange)**

- ✅ 應用淺色主題
- ✅ 應用深色主題
- ✅ 系統主題（淺色偏好）
- ✅ 系統主題（深色偏好）
- ✅ localStorage 存儲

**時區設定 (applyTimezoneChange)**

- ✅ 正確存儲時區到 localStorage

**完整偏好設定 (applyPreferences)**

- ✅ 應用所有偏好設定
- ✅ 處理部分偏好設定
- ✅ 布林值正確轉換為字串存儲

**初始化邏輯**

- ✅ 從 localStorage 載入已保存的主題
- ✅ 無保存主題時使用系統主題

**Hook 結構**

- ✅ 返回所有預期的函數
- ✅ 函數類型正確

**測試特色：**

- 完整的 Mock 設置 - Next.js router、localStorage、matchMedia、DOM APIs
- 邊界情況測試 - 部分設定、空值處理
- 副作用驗證 - DOM 操作、localStorage 操作、路由導航
- 類型安全 - 使用 TypeScript 類型確保測試正確性

#### `use-toast.test.ts` - Toast Hook 測試

**測試內容：**

**useToast hook**

- ✅ 初始化時為空 toasts
- ✅ 添加 toast
- ✅ 限制 toasts 到 TOAST_LIMIT
- ✅ 關閉特定 toast
- ✅ 無 id 時關閉所有 toasts

**toast 函數**

- ✅ 返回 toast 控制方法
- ✅ 生成唯一 ids
- ✅ 允許更新 toast
- ✅ 使用返回的 dismiss 方法關閉 toast

**reducer**

- ✅ 添加 toast
- ✅ 更新現有 toast
- ✅ 關閉特定 toast
- ✅ 無 toastId 時關閉所有 toasts
- ✅ 移除特定 toast
- ✅ 無 toastId 時移除所有 toasts

**測試特色：**

- Hook 基本功能測試
- Toast 限制邏輯驗證
- 更新和關閉功能測試
- Reducer 狀態管理測試
- 異步行為測試

### 🛠️ Lib Tests

#### `utils.test.ts` - 工具函數測試

**測試內容：**

**cn (className 工具)**

- ✅ 正確合併類名
- ✅ 處理條件類別
- ✅ 處理 false 條件類別
- ✅ 正確合併衝突的 Tailwind 類別
- ✅ 處理類別陣列
- ✅ 處理帶條件類別的物件
- ✅ 處理 undefined 和 null 值

**formatDate**

- ✅ 正確格式化日期
- ✅ 處理不同日期
- ✅ 處理閏年日期
- ✅ 處理年初日期
- ✅ 處理年末日期

**sleep**

- ✅ 在指定時間後解析
- ✅ 在指定時間前不解析
- ✅ 處理零毫秒

**debounce**

- ✅ 延遲函數執行
- ✅ 多次調用時取消之前的調用
- ✅ 保留函數參數
- ✅ 處理零延遲

**throttle**

- ✅ 首次調用立即執行函數
- ✅ 在節流期間忽略後續調用
- ✅ 節流期過後允許執行
- ✅ 保留函數參數
- ✅ 處理零限制

**測試特色：**

- 測試所有工具函數的各種情況
- 使用 fake timers 測試異步函數
- 驗證函數參數保留
- 測試邊界情況和錯誤處理

## 🚀 運行測試

### 運行所有測試

```bash
npm run test
```

### 運行特定測試文件

```bash
npm run test src/__tests__/hooks/use-auth.test.ts
```

### 運行測試並生成覆蓋率報告

```bash
npm run test:coverage
```

### 運行測試 UI

```bash
npm run test:ui
```

## 📊 測試統計

- **總測試文件**: 10 個
- **總測試案例**: 160+ 個
- **測試覆蓋範圍**:
  - Components: 4 個文件 (50+ 測試)
  - Hooks: 5 個文件 (90+ 測試)
  - Utils: 1 個文件 (24 測試)

### 詳細測試分佈

- **Button 元件**: 20+ 個測試 (完整 variant 和 size 覆蓋)
- **Card 元件**: 15 個測試 (完整元件系統)
- **Header 元件**: 8 個測試 (認證和導航)
- **Footer 元件**: 12 個測試 (國際化和連結)
- **Custom Hooks**: 90+ 個測試 (複雜邏輯和整合)
- **Utility Functions**: 24 個測試 (工具函數)

## 🎯 測試最佳實踐

### Mock 策略

- **外部依賴**: 使用 `vi.mock()` 模擬 Next.js hooks、NextAuth、next-intl
- **瀏覽器 APIs**: 模擬 localStorage、matchMedia、navigator、DOM APIs
- **第三方庫**: 模擬 analytics、stores 等

### 測試類型

- **單元測試**: 測試個別函數和元件
- **整合測試**: 測試 Hook 與依賴的互動
- **邊界測試**: 測試錯誤情況、空值、邊界條件
- **環境測試**: 測試 SSR、瀏覽器環境兼容性

### 驗證內容

- **函數調用和參數**: 確保正確的函數調用
- **狀態變化和副作用**: 驗證狀態更新和副作用
- **錯誤處理和恢復**: 測試錯誤情況的處理
- **性能和穩定性**: 確保 Hook 引用穩定性

## 🔧 配置

測試配置位於 `vitest.config.ts`，包含：

- **測試環境**: jsdom
- **設置文件**: `./src/test-utils/setup.ts`
- **全局變數**: 啟用
- **CSS 支持**: 啟用
- **路徑別名**: `@` 指向 `./src`

## 📝 注意事項

1. **ESM 支持**: 專案已完全轉換為 ESM 模塊系統
2. **TypeScript**: 所有測試都使用 TypeScript 確保類型安全
3. **Mock 清理**: 每個測試前後都會清理 mock 狀態
4. **異步測試**: 使用 `act()` 和 `waitFor()` 處理異步操作
5. **可訪問性**: 測試包含可訪問性驗證
