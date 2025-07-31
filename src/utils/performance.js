// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Start timing an operation
  startTimer(operationName) {
    if (!this.isEnabled) return;
    
    this.metrics[operationName] = {
      startTime: performance.now(),
      endTime: null,
      duration: null
    };
  }

  // End timing an operation
  endTimer(operationName) {
    if (!this.isEnabled || !this.metrics[operationName]) return;
    
    const metric = this.metrics[operationName];
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    // Log performance data
    this.logPerformance(operationName, metric.duration);
  }

  // Log performance data
  logPerformance(operationName, duration) {
    console.log(`Performance: ${operationName} took ${duration.toFixed(2)}ms`);
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'timing',
        event_label: operationName,
        value: Math.round(duration)
      });
    }
  }

  // Measure page load performance
  measurePageLoad() {
    if (!this.isEnabled) return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };

      console.log('Page Load Performance:', metrics);
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'page_load', {
          event_category: 'performance',
          value: Math.round(metrics.loadComplete)
        });
      }
    });
  }

  // Measure API call performance
  measureApiCall(url, method) {
    const operationName = `API_${method}_${url}`;
    this.startTimer(operationName);
    
    return () => {
      this.endTimer(operationName);
    };
  }

  // Measure component render performance
  measureComponentRender(componentName) {
    const operationName = `RENDER_${componentName}`;
    this.startTimer(operationName);
    
    return () => {
      this.endTimer(operationName);
    };
  }

  // Get all metrics
  getMetrics() {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {};
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Initialize page load monitoring
performanceMonitor.measurePageLoad();

export default performanceMonitor; 