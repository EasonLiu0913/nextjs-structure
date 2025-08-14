'use client'

// Debug utility for analytics issues
export function debugAnalytics() {
  if (typeof window === 'undefined') return

  console.log('Analytics Debug Info:')
  console.log('- window.va exists:', !!window.va)
  console.log('- window.va type:', typeof window.va)
  console.log('- NODE_ENV:', process.env.NODE_ENV)
  console.log('- VERCEL_ENV:', process.env.NEXT_PUBLIC_VERCEL_ENV)
  
  // Check for common analytics properties
  const analyticsProps = ['va', '_vercel_analytics', 'gtag', 'ga']
  analyticsProps.forEach(prop => {
    if ((window as any)[prop]) {
      console.log(`- ${prop} found:`, typeof (window as any)[prop])
    }
  })

  // Listen for analytics script loading
  const scripts = document.querySelectorAll('script')
  scripts.forEach((script, index) => {
    if (script.src.includes('vercel') || script.src.includes('analytics')) {
      console.log(`- Analytics script ${index}:`, script.src)
    }
  })
}

// Call this in development to debug analytics issues
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(debugAnalytics, 1000)
    })
  }
}