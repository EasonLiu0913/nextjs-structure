// 自訂事件追蹤
export function trackEvent(
  name: string, 
  properties?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', name, properties)
  }
}

// 頁面瀏覽追蹤
export function trackPageView(page: string, properties?: Record<string, any>) {
  trackEvent('page_view', {
    page,
    ...properties
  })
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