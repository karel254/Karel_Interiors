"use client"

import { useEffect, useState } from "react"

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Measure page load time
    const loadTime = performance.now()
    
    // DOM Content Loaded
    const domContentLoaded = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const domContentLoadedTime = domContentLoaded?.domContentLoadedEventEnd - domContentLoaded?.domContentLoadedEventStart || 0

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcp) {
        setMetrics(prev => ({ ...prev, firstContentfulPaint: fcp.startTime }))
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcp = entries[entries.length - 1]
      if (lcp) {
        setMetrics(prev => ({ ...prev, largestContentfulPaint: lcp.startTime }))
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Update metrics
    setMetrics({
      loadTime,
      domContentLoaded: domContentLoadedTime,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0
    })

    // Cleanup
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">Performance Metrics</div>
      <div>Load Time: {metrics.loadTime.toFixed(2)}ms</div>
      <div>DOM Ready: {metrics.domContentLoaded.toFixed(2)}ms</div>
      <div>FCP: {metrics.firstContentfulPaint.toFixed(2)}ms</div>
      <div>LCP: {metrics.largestContentfulPaint.toFixed(2)}ms</div>
    </div>
  )
} 