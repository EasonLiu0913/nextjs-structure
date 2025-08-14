'use client'

// Global error handler for client-side errors
export function initializeErrorHandler() {
  if (typeof window === 'undefined') return

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason)
    
    // Check if it's an analytics-related error
    if (event.reason?.stack?.includes('script.debug.js') || 
        event.reason?.message?.includes('Cannot read properties of undefined')) {
      console.warn('Analytics error caught and handled:', event.reason)
      event.preventDefault() // Prevent the error from being logged to console
    }
  })

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    // Check if it's from analytics script
    if (event.filename?.includes('script.debug.js') || 
        event.message?.includes('Cannot read properties of undefined')) {
      console.warn('Analytics script error caught and handled:', event.message)
      event.preventDefault()
    }
  })

  // Override console.error to filter analytics errors
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('script.debug.js') || 
        message.includes('Cannot read properties of undefined')) {
      console.warn('Analytics error (filtered):', ...args)
      return
    }
    originalConsoleError.apply(console, args)
  }
}