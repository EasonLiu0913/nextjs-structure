// 檢查 analytics 是否可用
function isAnalyticsAvailable(): boolean {
  return typeof window !== 'undefined' && 
         !!(window as any).va && 
         typeof (window as any).va === 'function'
}

// 等待 analytics 初始化
function waitForAnalytics(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isAnalyticsAvailable()) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (isAnalyticsAvailable()) {
        clearInterval(checkInterval)
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        resolve(false)
      }
    }, 100)
  })
}

// 自訂事件追蹤
export function trackEvent(
  name: string, 
  properties?: Record<string, string | number | boolean>
) {
  if (!isAnalyticsAvailable()) {
    // 在開發模式下記錄事件（可選）
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event (dev):', name, properties)
    }
    return
  }

  try {
    // 確保 properties 是有效的對象
    const safeProperties = properties && typeof properties === 'object' ? properties : {}
    ;(window as any).va('event', name, safeProperties)
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}

// 頁面瀏覽追蹤
export async function trackPageView(page: string, properties?: Record<string, any>) {
  // 等待 analytics 準備就緒
  const isReady = await waitForAnalytics()
  if (isReady) {
    trackEvent('page_view', {
      page,
      ...properties
    })
  }
}

// 使用者行為追蹤
export const userEvents = {
  // 認證事件
  login: (method: string) => trackEvent('user_login', { method }),
  logout: () => trackEvent('user_logout'),
  register: (method: string) => trackEvent('user_register', { method }),
  
  // 功能使用
  featureUsed: (feature: string) => trackEvent('feature_used', { feature }),
  buttonClicked: (button: string, location: string) => 
    trackEvent('button_clicked', { button, location }),
  
  // 表單互動
  formStarted: (formName: string) => trackEvent('form_started', { form: formName }),
  formCompleted: (formName: string) => trackEvent('form_completed', { form: formName }),
  formAbandoned: (formName: string) => trackEvent('form_abandoned', { form: formName }),
  
  // 錯誤事件
  errorOccurred: (error: string, context: string) => 
    trackEvent('error_occurred', { error, context })
}