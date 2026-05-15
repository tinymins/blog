import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchIssues, getLabels, RateLimitError, type ParsedIssue, type Label } from '../api'
import Post from '../components/Post'
import './Search.css'

const RATE_LIMIT_COOLDOWN_MS = 60_000

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const labels = searchParams.getAll('label')

  const [inputValue, setInputValue] = useState(q)
  const [items, setItems] = useState<ParsedIssue[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)

  const [allLabels, setAllLabels] = useState<Label[]>([])
  const [labelsLoading, setLabelsLoading] = useState(false)

  const [cooldownLeft, setCooldownLeft] = useState(0)

  const abortRef = useRef<AbortController | null>(null)
  const cooldownUntilRef = useRef(0)

  // Sync input value when URL q changes (e.g. nav from Header)
  useEffect(() => { setInputValue(q) }, [q])

  // Live countdown while rate-limited
  useEffect(() => {
    if (!rateLimited) return
    const tick = () => {
      const left = Math.max(0, Math.ceil((cooldownUntilRef.current - Date.now()) / 1000))
      setCooldownLeft(left)
      if (left === 0) setRateLimited(false)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [rateLimited])

  // Load labels once
  useEffect(() => {
    setLabelsLoading(true)
    getLabels()
      .then(setAllLabels)
      .catch(() => { /* silent */ })
      .finally(() => setLabelsLoading(false))
  }, [])

  // Run search whenever URL params change
  useEffect(() => {
    if (!q.trim() && labels.length === 0) {
      setItems([])
      setTotal(0)
      setErrMsg(null)
      return
    }
    if (Date.now() < cooldownUntilRef.current) {
      setErrMsg('搜索请求过于频繁，请稍后再试')
      setRateLimited(true)
      return
    }
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setErrMsg(null)
    setRateLimited(false)
    searchIssues(q, labels, ctrl.signal)
      .then(result => {
        if (ctrl.signal.aborted) return
        setItems(result.items)
        setTotal(result.total)
      })
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return
        if (e instanceof RateLimitError) {
          cooldownUntilRef.current = Date.now() + RATE_LIMIT_COOLDOWN_MS
          setErrMsg('搜索请求过于频繁，请稍后再试（约 60 秒后恢复）')
          setRateLimited(true)
        } else if (e instanceof DOMException && e.name === 'AbortError') {
          // ignore
        } else {
          setErrMsg('搜索失败')
        }
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, labels.join('|')])

  const updateParams = useCallback((nextQ: string, nextLabels: string[]) => {
    const params = new URLSearchParams()
    if (nextQ.trim()) params.set('q', nextQ.trim())
    nextLabels.forEach(l => params.append('label', l))
    setSearchParams(params, { replace: false })
  }, [setSearchParams])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParams(inputValue, labels)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape' && inputValue) {
      e.preventDefault()
      setInputValue('')
    }
  }

  function toggleLabel(name: string) {
    const next = labels.includes(name)
      ? labels.filter(l => l !== name)
      : [...labels, name]
    updateParams(inputValue, next)
  }

  function clearAll() {
    setInputValue('')
    setSearchParams(new URLSearchParams())
  }

  const hasQuery = q.trim().length > 0 || labels.length > 0

  return (
    <div className="search-page">
      <h2 className="search-title">搜索</h2>

      <form className="search-form" onSubmit={handleSubmit} role="search">
        <input
          type="search"
          className="search-input"
          placeholder="按标题搜索…"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          aria-label="搜索关键词"
        />
        <button type="submit" className="search-submit">搜索</button>
        {hasQuery && (
          <button type="button" className="search-clear" onClick={clearAll}>清空</button>
        )}
      </form>

      <div className="search-labels">
        <div className="search-labels-head">
          标签过滤 {labels.length > 0 && <span className="search-labels-hint">（多选 AND）</span>}
        </div>
        {labelsLoading && <div className="search-labels-loading">加载标签中…</div>}
        <div className="search-labels-list">
          {allLabels.map(l => {
            const active = labels.includes(l.name)
            return (
              <button
                type="button"
                key={l.name}
                className={`search-label-chip${active ? ' is-active' : ''}`}
                onClick={() => toggleLabel(l.name)}
                style={active
                  ? { background: `#${l.color}`, color: '#fff', borderColor: `#${l.color}` }
                  : { color: `#${l.color}`, borderColor: `#${l.color}66` }}
              >
                {l.name}
              </button>
            )
          })}
        </div>
      </div>

      {!hasQuery && (
        <div className="search-empty">输入关键词或选择标签开始搜索</div>
      )}

      {hasQuery && (
        <div className="search-results">
          {loading && <div className="search-status">搜索中…</div>}
          {errMsg && <div className="search-status search-status-error">{errMsg}</div>}
          {!loading && !errMsg && items.length === 0 && (
            <div className="search-status">无匹配结果</div>
          )}
          {!errMsg && items.length > 0 && (
            <>
              <div className="search-meta">
                共 {total} 条结果{total > 50 && '，显示前 50 条（请细化关键词或增加标签）'}
              </div>
              <div className="post-list">
                {items.map(it => <Post key={it.id} issue={it} />)}
              </div>
            </>
          )}
          {rateLimited && !loading && (
            <div className="search-status">
              提示：GitHub 未登录搜索 API 限制为 10 次/分钟。
              {cooldownLeft > 0 && <>（约 {cooldownLeft} 秒后可重试）</>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
