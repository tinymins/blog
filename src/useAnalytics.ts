import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageview } from './analytics'

// React Router v7 hook: fire a pageview whenever the SPA route changes.
// Must be called from a component rendered inside <BrowserRouter>.
export function useAnalytics(): void {
  const location = useLocation()
  useEffect(() => {
    trackPageview(location.pathname + location.search)
  }, [location.pathname, location.search])
}
