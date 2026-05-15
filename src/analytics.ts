// Centralised analytics integration: Google Analytics 4 + Microsoft Clarity.
// IDs come from build-time env vars injected via Vite. Either may be absent,
// in which case the corresponding provider is silently skipped. Disabled
// outside production so local dev never inflates real-world numbers.

const GA_ID = import.meta.env.VITE_GA_ID
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID

type ClarityQueue = unknown[][]
interface ClarityFunction {
  (...args: unknown[]): void
  q?: ClarityQueue
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: ClarityFunction
  }
}

let initialized = false

export function initAnalytics(): void {
  if (initialized) return
  if (!import.meta.env.PROD) return
  if (GA_ID) loadGA(GA_ID)
  if (CLARITY_ID) loadClarity(CLARITY_ID)
  initialized = true
}

export function trackPageview(path: string): void {
  if (!import.meta.env.PROD) return
  if (GA_ID && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path })
  }
  if (CLARITY_ID && window.clarity) {
    window.clarity('set', 'page', path)
  }
}

function loadGA(id: string): void {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  const gtag: (...args: unknown[]) => void = (...args) => {
    window.dataLayer!.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  // We send page_view manually on every route change in useAnalytics().
  gtag('config', id, { send_page_view: false })
}

function loadClarity(id: string): void {
  const fn: ClarityFunction = (...args: unknown[]) => {
    fn.q = fn.q || []
    fn.q.push(args)
  }
  window.clarity = fn

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`
  document.head.appendChild(script)
}
