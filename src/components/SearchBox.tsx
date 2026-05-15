import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { searchIssues, RateLimitError, type ParsedIssue } from '../api'
import './SearchBox.css'

const THROTTLE_MS = 1500
const MIN_LEN = 2
const RATE_LIMIT_COOLDOWN_MS = 60_000

export default function SearchBox() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const onSearchPage = location.pathname === '/search'
  const initialQ = onSearchPage ? (searchParams.get('q') || '') : ''

  const [value, setValue] = useState(initialQ)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<ParsedIssue[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastFetchAtRef = useRef(0)
  const throttleTimerRef = useRef<number | null>(null)
  const cooldownUntilRef = useRef(0)
  const lastQueryRef = useRef('')

  // Sync from URL when on /search
  useEffect(() => {
    if (onSearchPage) {
      setValue(searchParams.get('q') || '')
    }
  }, [onSearchPage, searchParams])

  const runSearch = useCallback(async (q: string) => {
    if (Date.now() < cooldownUntilRef.current) {
      setErrMsg('搜索请求过于频繁，请稍后再试')
      return
    }
    if (lastQueryRef.current === q && (items.length > 0 || total > 0)) return
    lastQueryRef.current = q
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setErrMsg(null)
    try {
      const result = await searchIssues(q, [], ctrl.signal)
      if (ctrl.signal.aborted) return
      setItems(result.items)
      setTotal(result.total)
    } catch (e: unknown) {
      if (ctrl.signal.aborted) return
      if (e instanceof RateLimitError) {
        cooldownUntilRef.current = Date.now() + RATE_LIMIT_COOLDOWN_MS
        setErrMsg('搜索请求过于频繁，请稍后再试')
      } else if (e instanceof DOMException && e.name === 'AbortError') {
        // ignore
      } else {
        setErrMsg('搜索失败')
      }
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }, [items.length, total])

  const scheduleSearch = useCallback((q: string) => {
    if (throttleTimerRef.current !== null) {
      window.clearTimeout(throttleTimerRef.current)
      throttleTimerRef.current = null
    }
    if (q.trim().length < MIN_LEN) {
      setItems([])
      setTotal(0)
      setErrMsg(null)
      lastQueryRef.current = ''
      return
    }
    const elapsed = Date.now() - lastFetchAtRef.current
    const wait = Math.max(0, THROTTLE_MS - elapsed)
    throttleTimerRef.current = window.setTimeout(() => {
      lastFetchAtRef.current = Date.now()
      throttleTimerRef.current = null
      void runSearch(q.trim())
    }, wait)
  }, [runSearch])

  // Click outside closes dropdown
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)
    setOpen(true)
    scheduleSearch(v)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      if (open) {
        setOpen(false)
      } else if (value) {
        setValue('')
        scheduleSearch('')
      } else {
        inputRef.current?.blur()
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    setOpen(false)
    inputRef.current?.blur()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  function handleIconClick() {
    const q = value.trim()
    setOpen(false)
    inputRef.current?.blur()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  function pickItem(number: number) {
    setOpen(false)
    inputRef.current?.blur()
    navigate(`/post/${number}`)
  }

  return (
    <div className="searchbox" ref={containerRef}>
      {/* Mobile icon-only trigger */}
      <button
        type="button"
        className="searchbox-icon-btn"
        onClick={handleIconClick}
        aria-label="搜索"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <form className="searchbox-form" onSubmit={handleSubmit} role="search">
        <button
          type="button"
          className="searchbox-icon-inline"
          onClick={handleIconClick}
          aria-label="打开搜索页"
          tabIndex={-1}
        >
          <svg className="searchbox-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="search"
          className="searchbox-input"
          placeholder="搜索文章标题"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          aria-label="搜索文章"
        />
      </form>

      {open && value.trim().length >= MIN_LEN && (
        <div className="searchbox-dropdown" role="listbox">
          {loading && <div className="searchbox-status">搜索中…</div>}
          {errMsg && <div className="searchbox-status searchbox-error">{errMsg}</div>}
          {!loading && !errMsg && items.length === 0 && (
            <div className="searchbox-status">无匹配结果</div>
          )}
          {!errMsg && items.length > 0 && (
            <>
              {items.slice(0, 8).map(it => (
                <button
                  type="button"
                  key={it.id}
                  className="searchbox-item"
                  onClick={() => pickItem(it.number)}
                  role="option"
                >
                  <span className="searchbox-item-title">{it.title}</span>
                </button>
              ))}
              <button
                type="button"
                className="searchbox-more"
                onClick={() => {
                  setOpen(false)
                  navigate(`/search?q=${encodeURIComponent(value.trim())}`)
                }}
              >
                查看全部 {total} 条结果 →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
